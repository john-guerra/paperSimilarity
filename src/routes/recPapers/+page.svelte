<script>
  import { onMount } from "svelte";
  import { Runtime, Inspector } from "@observablehq/runtime";
  import defineRecommendations from "@john-guerra/semantic-scholar-recommended-papers";
  import { addMoreLikeButton, setNotebookWidth } from "$lib/utils.js";

  import { page } from "$app/stores";
  import { browser } from "$app/environment";

  let CorpusId = "";

  let notebookRecommendations;

  // $: CorpusId = $page.url.searchParams.get("CorpusId");
  // call setCorpusId when CorpusId changes
  $: CorpusId && notebookRecommendations && setCorpusId();

  $: CorpusId = browser ? $page.url.searchParams.get("CorpusId"): "";

  console.log("recPapers page", CorpusId, browser);

  function loadNotebook() {
    console.log("Loading notebook paper recommendations");
    notebookRecommendations = new Runtime().module(
      defineRecommendations,
      (name) => {
        if (name === "viewof columnsToShow")
          return new Inspector(
            document.querySelector(
              "#observablehq-viewof-columnsToShow-ee0d7845"
            )
          );
        if (name === "viewof paperSearchTable")
          return new Inspector(
            document.querySelector(
              "#observablehq-viewof-paperSearchTable-ee0d7845"
            )
          );
        if (name === "viewof CorpusId")
          return new Inspector(
            document.querySelector("#observablehq-viewof-CorpusId-ee0d7845")
          );
        if (name === "viewof limit")
          return new Inspector(
            document.querySelector("#observablehq-viewof-limit-ee0d7845")
          );
        if (name === "viewof method")
          return new Inspector(
            document.querySelector("#observablehq-viewof-method-ee0d7845")
          );
        if (name === "viewof embedding")
          return new Inspector(
            document.querySelector("#observablehq-viewof-embedding-ee0d7845")
          );
        if (name === "viewof rowOrder")
          return new Inspector(
            document.querySelector("#observablehq-viewof-rowOrder-ee0d7845")
          );
        if (name === "viewof columnOrder")
          return new Inspector(
            document.querySelector("#observablehq-viewof-columnOrder-ee0d7845")
          );
        if (name === "viewof selected")
          return new Inspector(
            document.querySelector("#observablehq-viewof-selected-ee0d7845")
          );
        if (name === "recommendationsTable")
          return new Inspector(
            document.querySelector("#observablehq-table-ee0d7845")
          );
        if (name === "viewof selectionType")
          return new Inspector(
            document.querySelector(
              "#observablehq-viewof-selectionType-ee0d7845"
            )
          );
        if (name === "viewof selectionTarget")
          return new Inspector(
            document.querySelector(
              "#observablehq-viewof-selectionTarget-ee0d7845"
            )
          );

        return [
          "url",
          "papers",
          "similarityMatrixChart",
          "CorpusId",
          "recommendedURL",
          "recommendations",
          "tidySimilarity",
          "similarity",
          "tableFormat",
          "similarity",
        ].includes(name);
      }
    );
  }

  

  onMount(() => {
    loadNotebook();

    async function init() {
      addMoreLikeButton(notebookRecommendations);
      setNotebookWidth(notebookRecommendations);
      setCorpusId();
    }

    init();
  }); // /onMount

  async function setCorpusId() {
    if (!notebookRecommendations) {
      console.log("Set corpus id Notebook not loaded yet");
      return;
    }

    const viewof_CorpusId =
      await notebookRecommendations.value("viewof CorpusId");

    viewof_CorpusId.value = CorpusId;
    viewof_CorpusId.dispatchEvent(new Event("input", { bubbles: true }));
  }
</script>

<h1>Recommend Papers</h1>

<div class="row">
  <div class="col-md-12 col-sm-12">
    <div id="observablehq-viewof-CorpusId-ee0d7845"></div>
    <details>
      <summary><strong>Options</strong></summary>
      <div id="observablehq-viewof-method-ee0d7845"></div>
      <div id="observablehq-viewof-embedding-ee0d7845"></div>
      <div id="observablehq-viewof-limit-ee0d7845"></div>
      <div id="observablehq-viewof-rowOrder-ee0d7845"></div>
      <div id="observablehq-viewof-columnOrder-ee0d7845"></div>
    </details>

    <strong>Click any row to filter the table</strong>
    <div id="observablehq-viewof-selectionType-ee0d7845"></div>
    <div id="observablehq-viewof-selectionTarget-ee0d7845"></div>
    <div id="observablehq-viewof-selected-ee0d7845"></div>
  </div>
  <!-- /col-5 -->

  <div class="col-md-12 col-sm-12">
    <div id="observablehq-viewof-columnsToShow-ee0d7845"></div>
    <div class="papers-table" id="observablehq-table-ee0d7845"></div>
  </div>
</div>
<!-- /row -->
