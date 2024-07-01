<script>
  import { onMount } from "svelte";
  import { Runtime, Inspector } from "@observablehq/runtime";
  import definePaperSearch from "@john-guerra/paper-similarity-search";
  import { goto, replaceState } from "$app/navigation";
  import { page } from "$app/stores";
  import { addMoreLikeButton, setNotebookWidth } from "$lib/utils.js";
  import { browser } from "$app/environment";

  import { SERVER_URL } from "$lib/constants.js";
  import Slider from "$lib/Slider.svelte";

  // Papers is a reactive variable
  let papers = [];
  let query = "Personalizing Search via Association";
  let limit = 25;

  if (browser) {
   
    query = $page.url.searchParams.get("q") || query;
  }

  let notebookPaperSearch;

  function setQueryUrl(q) {
    $page.url.searchParams.set("q", q);
    // shallow routing
    // replaceState(page.url.href);
    goto($page.url.href);
  }

  function loadNotebook() {
    notebookPaperSearch = new Runtime().module(definePaperSearch, (name) => {
      if (name === "viewof paperSearchTable")
        return new Inspector(
          document.querySelector(
            "#observablehq-viewof-paperSearchTable-ee0d7845"
          )
        );
      return ["papersUrl", "url", "papers", "tableFormat", "papers"].includes(
        name
      );
    });
  }

  async function getData() {
    console.log("get Data", query, limit);

    setQueryUrl(query);

    // Clean up first for better experience
    notebookPaperSearch.redefine("papers", []);

    papers = (
      await fetch(
        `${SERVER_URL}cgi-bin/paper_search?query=${query}&limit=${limit}`
        // `https://34.204.188.58/cgi-bin/paper_search?query=${query}&limit=25`
      ).then((res) => res.json())
    ).search_results;

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
</script>

<div class="row">
  <div class="col-12">
    <h1>Search Papers</h1>

    <form id="queryForm" action="" on:submit|preventDefault={getData}>
      <label class="form-label w-100"
        >Query
        <input
          id="query"
          type="text"
          class="form-control w-100"
          bind:value={query}
        />
      </label>
      <Slider bind:value={limit} label="Max number of results to show"></Slider>
      <div><button class="btn btn-primary" type="submit">Search</button></div>
    </form>

    <h2>Papers found</h2>
    <div>Please select one to find recommendations</div>
    <div
      class="papers-table"
      id="observablehq-viewof-paperSearchTable-ee0d7845"
    ></div>
    <hr />
  </div>
  <!-- /col-12 -->
</div>
<!-- /row -->
