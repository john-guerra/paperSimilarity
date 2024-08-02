<script>
  import vl from "$lib/vegaLiteApiLoader";
  import vegaSelectedLoader from "$lib/vegaSelected";

  import * as d3 from "d3";

  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // Reference
  export let targetSpan;

  export let selectionType = "brush";
  export let selectionTarget = ["x", "y"];
  export let limit = 10;
  export let selectedScores = null;
  export let columnOrder = "None";
  export let rowOrder = "None";
  export let width = 600;
  export let method = "ProNE";
  export let embedding = "ProNE";
  export let papers = [];
  // An object with the scores for each paper by method
  export let scores = {};
  export let selected = [];

  console.log(
    "🕸️🕸️ EmbeddingsMatrix",
    "\nScores",
    scores,
    "\nPapers",
    papers,
    "\nEmbedding ",
    embedding,
    "\nMethod ",
    method,
    selectedScores,
    columnOrder,
    rowOrder
  );

  let score2Names = Object.keys(scores);
  selectedScores = selectedScores || score2Names;

  let recommendedPapers = papers?.length
    ? papers
        .map((d, i) => {
          if (!d) {
            console.log(`Recommendation ${i} is null. Trying to ignore`);
            return;
          }
          const newD = { ...d };
          newD.__i = i;
          newD.firstRowSimilarity = scores[method][0][i];
          newD.firstColSimilarity = scores[method][0][i];

          // TODO first paper results
          score2Names.map((s) => (newD[s] = scores[s][i - 1])); // The first paper is the query result

          newD.options = d.externalIds.CorpusId;
          return newD;
        })
        .filter((d) => d)
    : // .slice(1) // the api returns the scores to the other papers, ignoring the selected one
      [];

  // Get tidy like data (table) for the similarity matrix
  function tidySimilarity(similarity, papers) {
    return similarity
      .map((row, i) =>
        row.map((similarity, j) => ({
          title: `(${j} -> ${i});\n
${papers[j]?.title} -> ${papers[i]?.title}`,
          i,
          j,
          // similarity: similarity === 0 ? null : similarity, // similarity 0 should be ignored

          ...Object.fromEntries(
            score2Names.map((emb) => [emb, scores[emb][i][j] === 0 ? null : scores[emb][i][j]])
          )
        }))
      )
      .flat();
  }

  function getOrderForAttrib(papers, attrib) {
    return attrib === "None"
      ? papers.map((_, i) => i)
      : papers.sort((a, b) => d3.descending(a[attrib], b[attrib])).map((d) => d.__i);
  }

  // Returns vega lite spec
  function getVegaView() {
    let similarity = scores[embedding] || [];
    const tidyData = tidySimilarity(similarity, recommendedPapers, columnOrder, rowOrder);

    console.log(
      "TidyData",
      recommendedPapers,
      tidyData,
      selectedScores,
      limit > 10 ? width / (3 + selectedScores.length * 0.5) : limit * 10
    );

    const selectionFn = selectionType === "brush" ? vl.selectInterval : vl.selectMulti;
    const brush = selectionFn("selected").encodings(selectionTarget);

    return vl
      .markRect({ tooltip: true })
      .params(brush)
      .encode(
        vl
          .x()
          .fieldO("i")
          .title(null)
          .axis(tidyData.length > 100 ? null : { orient: "top" })
          .sort(getOrderForAttrib(recommendedPapers, columnOrder)),
        vl
          .y()
          .fieldO("j")
          .title(null)
          .sort(getOrderForAttrib(recommendedPapers, rowOrder))
          .axis(tidyData.length > 100 ? null : {}),
        vl.color().fieldQ(vl.repeat("repeat")),
        vl.opacity().if(brush, 1).value(0.3),
        vl.tooltip(["title"])
      )

      .data(tidyData)
      .width(limit > 10 ? width / (1 + selectedScores.length * 0.5) : limit * 20)
      .height(limit > 10 ? width / (1 + selectedScores.length * 0.5) : limit * 20)
      .repeat(selectedScores)
      .resolve({ scale: { color: "independent" } });
  }

  onMount(async () => {
    const vegaView = getVegaView();

    const vegaSelected = await vegaSelectedLoader;

    // const elementViz = await vegaView.render();
    // Wrap the vegachart with vegaSelected to capture the selection events
    const elementViz = await vegaSelected(vegaView.toObject(), { signal: "selected" });

    function setValue() {
      let papersSortedSelected = recommendedPapers.map(({ ...d }) => d);

      if (rowOrder !== "None") {
        papersSortedSelected = papersSortedSelected.sort((a, b) =>
          d3.ascending(a[rowOrder], b[rowOrder])
        );
      }

      // There is a selection in the matrix
      if (elementViz.value.j !== undefined || elementViz.value.i !== undefined) {
        papersSortedSelected = papersSortedSelected.filter((d, i) => {
          // Add an attribute for which type of selection it is col "➡️" or row "⬆️"
          d.selected = `${elementViz.value.j && elementViz.value.j.includes(i) ? "↔️" : ""}${
            elementViz.value.i && elementViz.value.i.includes(i) ? "↕️" : ""
          }`;
          return (
            (elementViz.value.j && elementViz.value.j.includes(i)) ||
            (elementViz.value.i && elementViz.value.i.includes(i))
          );
        });
      } else {
        // Clear selected field
        for (let p of papersSortedSelected) {
          p.selected = "";
        }
      }

      selected = papersSortedSelected;
      dispatch("input", { value: papersSortedSelected });
    }

    // When there is a selection in the chart, dispatch the input event
    elementViz.addEventListener("input", setValue);

    setValue();
    targetSpan.innerHTML = "";
    targetSpan.appendChild(elementViz);
  });
</script>

<form bind:this={targetSpan}>Loading viz...</form>
