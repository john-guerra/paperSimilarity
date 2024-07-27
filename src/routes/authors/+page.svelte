<script>
  import { onMount } from "svelte";

  import { afterNavigate } from "$app/navigation";

  import { page } from "$app/stores";
  import { SERVER_URL } from "$lib/constants.js";
  import { browser } from "$app/environment";
  import { base } from "$app/paths";

  import Table from "$lib/components/Table.svelte";
  import EmbeddingsMatrix from "$lib/components/EmbeddingsMatrix.svelte";
  // import Slider from "$lib/components/Slider.svelte";
  import { setQueryUrl, getDataAuthorLookup, tdMaxHeight } from "$lib/utils";

  import { cosineMatrix } from "$lib/cosineSimilarity.js";

  let authors = [];
  let query = "";
  let limit = 25;
  let scores = null;

  let selectedPapers = [];
  let papers = [];
  let embeddings = null;

  if (browser) {
    query = $page.url.searchParams.get("q") || "";
  }

  function concatenateEmbeddings(newEmbedding) {
    if (!embeddings) {
      embeddings = { ...newEmbedding };
    } else {
      for (let key in newEmbedding) {
        if (key === "embeddings_requested") {
          continue;
        }
        if (embeddings[key]) {
          embeddings[key] = embeddings[key].concat(newEmbedding[key]);
        } else {
          embeddings[key] = newEmbedding[key];
        }
      }
    }
  }

  function recomputeScores() {
    const before = performance.now();

    scores = {};
    for (let key in embeddings) {
      if (key === "embeddings_requested") {
        continue;
      }
      scores[key] = cosineMatrix(embeddings[key]);
    }
    console.log("Concatenate scores matrix ", performance.now() - before, scores);
    // trigger reactivity
    scores = scores;
    return scores;
  }

  async function getScoresForAllAuthors() {
    if (!authors?.length) {
      console.log("getScoresForAllAuthors no authors", authors);
      return;
    }
    for (let author of authors) {
      getDataAuthorLookup(author.authorId).then((res) => {
        // scores.set(author.authorId, res.scoresMatrices);
        console.log("Got lookupAuthor for", author, res);
        papers = res.results.papers.map((p, i) => ({ ...p, authorId: author.authorId, i }));
        // trigger reactivity
        papers = papers;
        concatenateEmbeddings(res.results.embeddings);
        recomputeScores();
        console.log("Got lookupAuthor for", author, scores, papers, embeddings);
      });
    }
  }

  async function getData() {
    console.log("Get data", query);
    setQueryUrl($page, { q: query });
    authors = [];

    let url = `${SERVER_URL}/api/author_search?query=${query}&limit=${limit}&fields=hIndex,citationCount,paperCount,name,affiliations,externalIds,papers.externalIds,papers.title&sort_by=hIndex`;
    console.log("fetching authors", url);
    let res = await fetch(url);

    if (res.ok) {
      let data = await res.json();
      console.log("Got authors: ", data);
      authors = data.search_results;

      getScoresForAllAuthors();
      return authors;
    } else {
      console.log(res);
      throw new Error("Failed to fetch authors");
    }
  }

  onMount(async () => {
    if (query) {
      await getData();
    }
  });

  afterNavigate(() => {
    if ($page.url.searchParams.get("q") !== query) {
      query = $page.url.searchParams.get("q") || query;
      getData();
    }
  });
</script>

<div class="row">
  <div class="col-12">
    <h1>Search Authors</h1>

    <form id="queryForm" action="" on:submit|preventDefault={getData}>
      <label class="form-label w-100"
        >Query
        <input id="query" type="text" class="form-control w-100" bind:value={query} />
      </label>
      <!-- <Slider value={limit} label="Max number of results to show"></Slider> -->
      <div><button class="btn btn-primary" type="submit">Search</button></div>
    </form>
    {#if authors?.length}
      <h2>Authors found ({authors?.length})</h2>
      <br />
      <Table
        data={authors}
        tableFormat={{
          name: (name, _, author) =>
            `<a href="${base}/author/?authorId=${author.authorId}" title="Search for this author">${name}</a><a href="https://www.semanticscholar.org/author/${author.name}/${author.authorId}" title="See in semantic scholar">⤴️</a>`,
          authorId: (authorId, _, author) =>
            `<a href="${base}/author/?authorId=${author.authorId}" title="Search for this author">${author.authorId}</a>
          <a href="https://www.semanticscholar.org/author/${author.name}/${authorId}" title="See in semantic scholar">⤴️</a>`,
          papers: (papers) =>
            `<div style="max-height:10em; overflow:scroll">${papers
              .map(
                (paper) =>
                  `<span class="mx-1"><a href="${base}/papers/?q=${paper.title}">${paper.title}</a></span >`
              )
              .join("")}</div>`
        }}
        columns={"authorId,name,affiliations,paperCount,citationCount,hIndex,papers".split(",")}
      ></Table>
      <hr />

      <h3>Paper comparison for these authors</h3>
      <div>Here is a comparison of the papers returned for these authors</div>
      {#if papers && scores}
        {#key scores?.prone?.length}
          <EmbeddingsMatrix
            {scores}
            {papers}
            method="prone"
            embedding="prone"
            {limit}
            width={600}
            bind:selected={selectedPapers}
            on:input={(evt) =>
              console.log("✂️ Selected papers changed", selectedPapers, evt?.detail?.value)}
          ></EmbeddingsMatrix>
        {/key}
      {/if}

      {#key selectedPapers}
        <Table
          data={selectedPapers}
          tableFormat={{
            title: (t, i, d) => tdMaxHeight(`<a href="${base}/papers/?q=${d.title}" >${t}</a>`),
            authors: (authors) =>
              `${tdMaxHeight(authors.map((a) => `<a href="${base}/author/?authorId=${a.authorId}">${a.name}</a>`).join(", "))}`
          }}
          columns={["i", "selected", "title", "year", "citationCount", "authors", "authorId"]}
        ></Table>
      {/key}
    {/if}
  </div>
  <!-- /col-12 -->
</div>
<!-- /row -->
