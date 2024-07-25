<script>
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { Runtime, Inspector } from "@observablehq/runtime";
  import definePaperSearch from "@john-guerra/paper-similarity-search";
  import { goto, replaceState } from "$app/navigation";
  import { page } from "$app/stores";
  import { addMoreLikeButton, setNotebookWidth, setQueryUrl } from "$lib/utils.js";
  import { browser } from "$app/environment";
  import * as htl from "htl";

  import { base } from "$app/paths";

  import { SERVER_URL } from "$lib/constants.js";
  import Slider from "$lib/components/Slider.svelte";

  import Table from "$lib/components/Table.svelte";

  // Papers is a reactive variable
  let papers = [];
  let query = "Personalizing Search via Association";
  let limit = 25;

  $: papers;

  if (browser) {
    console.log("trying to get query from url", $page.url.searchParams.get("q"));
    query = $page.url.searchParams.get("q") || query;
  }

  let notebookPaperSearch;

  function loadNotebook() {
    notebookPaperSearch = new Runtime().module(definePaperSearch, (name) => {
      if (name === "viewof paperSearchTable")
        return new Inspector(
          document.querySelector("#observablehq-viewof-paperSearchTable-ee0d7845")
        );
      return ["papersUrl", "url", "papers", "tableFormat", "papers"].includes(name);
    });
  }

  async function getData() {
    papers = [];
    console.log("get Data", query, limit);

    setQueryUrl($page, { q: query });

    // Clean up first for better experience
    notebookPaperSearch.redefine("papers", []);

    papers = (
      await fetch(
        `${SERVER_URL}api/paper_search?query=${query}&limit=${limit}`
        // `https://34.204.188.58/api/paper_search?query=${query}&limit=25`
      ).then((res) => res.json())
    ).search_results.map((d) => ({ ...d, url: `/papers/?q=${d.title}` }));

    console.log("Got papers: ", papers);
    redraw();
  }

  async function redraw() {
    for (const p of papers) {
      p.options = p.externalIds.CorpusId;
    }
    console.log("redraw papers", papers);

    notebookPaperSearch.redefine("papers", papers);
  }

  async function init() {
    addMoreLikeButton(notebookPaperSearch);
    setNotebookWidth(notebookPaperSearch);
  }

  onMount(() => {
    loadNotebook();

    init();
    getData();
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
    <h1>Search Papers</h1>

    <form id="queryForm" action="" on:submit|preventDefault={getData}>
      <label class="form-label w-100"
        >Query
        <input id="query" type="text" class="form-control w-100" bind:value={query} />
      </label>
      <!-- <Slider bind:value={limit} label="Max number of results to show"></Slider> -->
      <div><button class="btn btn-primary" type="submit">Search</button></div>
    </form>

    <h2>Papers found</h2>
    {#if papers.length === 0}
      <div>No papers found...</div>
    {:else}
      <Table
        data={papers}
        tableFormat={{
          title: (t, i, d) => `<a href="${base}/papers/?q=${d.title}" >${t}</a>`,
          authors: (authors) =>
            authors.map((a) => `<a href="${base}/author/?authorId=${a.authorId}">${a.name}</a>`),
          options: (CorpusId) => {
            const btnPapers = `<a href="${base}/recPapers?CorpusId=${CorpusId}" class="btn btn-outline-primary" title=${CorpusId}>More papers like this</a>`;
            const btnAuthors = `<a href="${base}/recAuthors?CorpusId=${CorpusId}" class="btn btn-outline-primary" title=${CorpusId}>Authors related</a>`;

            return `${btnPapers} ${btnAuthors}`;
          }
        }}
        columns={["title", "year", "citationCount", "authors", "options"]}
      ></Table>
    {/if}
    {papers?.length}

    <div class="papers-table" id="observablehq-viewof-paperSearchTable-ee0d7845"></div>
    <hr />
  </div>

  <!-- tableFormat={{
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
        columns={"authorId,name,affiliations,paperCount,citationCount,hIndex,papers".split(",")} -->
  <!-- /col-12 -->
</div>
<!-- /row -->
