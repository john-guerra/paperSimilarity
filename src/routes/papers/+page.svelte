<script>
  import { onMount } from "svelte";
  import { Runtime, Inspector } from "@observablehq/runtime";
  import definePaperSearch from "@john-guerra/paper-similarity-search";
  import { goto, replaceState } from "$app/navigation";

  import { addMoreLikeButton, setNotebookWidth } from "$lib/utils.js";


  import { page } from "$app/stores";

  // Papers is a reactive variable
  $: papers = [];
  $: query = "Personalizing Search via Association";

  
  let notebookPaperSearch, queryEle, queryForm, viewof_method;
  
  function setQueryUrl(q) {
    $page.url.searchParams.set("q", q);
    // shallow routing
    // replaceState($page.url.href);
    goto($page.url.href);
  }
  

  function loadNotebook() {
    notebookPaperSearch = new Runtime().module(definePaperSearch, (name) => {
      // if (name === "viewof query")
      //   return new Inspector(
      //     document.querySelector("#observablehq-viewof-query-ee0d7845")
      //   );
      if (name === "viewof paperSearchTable")
        return new Inspector(
          document.querySelector(
            "#observablehq-viewof-paperSearchTable-ee0d7845"
          )
        );
      // if (name === "viewof method")
      //   return new Inspector(
      //     document.querySelector("#observablehq-viewof-method-ee0d7845")
      //   );
      return ["papersUrl", "url", "papers", "tableFormat", "papers"].includes(
        name
      );
    });
  }

  async function getData() {
    const query = queryEle.value;
    console.log("get Data", query);

    setQueryUrl(query);

    // Clean up first for better experience
    notebookPaperSearch.redefine("papers", []);

    papers = (
      await fetch(
        `https://johnguerra.co/kenBack/cgi-bin/paper_search?query=${query}&limit=25`
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
    viewof_method = await notebookPaperSearch.value("viewof method");

    addMoreLikeButton(notebookPaperSearch);

    queryForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      getData();
    });
    viewof_method.addEventListener("input", redraw);

    setNotebookWidth(notebookPaperSearch);
  }

  onMount(() => {
    queryEle = document.getElementById("query");
    queryForm = document.getElementById("queryForm");
    loadNotebook();

    init();
    getData();
  });
</script>

<div class="row">
  <div class="col-12">
    <h1>Search Papers</h1>

    <form id="queryForm" action="">
      <label class="form-label w-100"
        >Query
        <input
          id="query"
          type="text"
          class="form-control w-100"
          bind:value={query}
        />
      </label>
      <div><button class="btn btn-primary" type="submit">Search</button></div>
    </form>

    <!-- <div id="observablehq-viewof-query-ee0d7845"></div> -->

    <!-- <div id="observablehq-viewof-method-ee0d7845"></div> -->

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
