<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  import * as Inputs from "@observablehq/inputs";
  import { page } from "$app/stores";
  import { SERVER_URL } from "$lib/constants.js";
  import { browser } from "$app/environment";
  import { base } from "$app/paths";

  import Table from "$lib/Table.svelte";
  import Slider from "$lib/Slider.svelte";

  // Papers is a reactive variable
  let authors = [];
  let query = "";
  let limit = 25;

  if (browser) {
    console.log($page.url);
    query = $page.url.searchParams.get("q") || "";
  }

  function setQueryUrl(q) {
    $page.url.searchParams.set("q", q);
    // shallow routing
    // replaceState(page.url.href);
    goto($page.url.href);
  }

  async function getData() {
    setQueryUrl(query);

    authors = (
      await fetch(
        `${SERVER_URL}/cgi-bin/author_search?query=${query}&limit=${limit}&fields=hIndex,citationCount,paperCount,name,affiliations,externalIds,papers.externalIds,papers.title&sort_by=hIndex`
      ).then((res) => res.json())
    ).search_results;
    console.log("Got authors: ", authors);
  }
</script>

<div class="row">
  <div class="col-12">
    <h1>Search Authors</h1>

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
      <Slider value={limit} label="Max number of results to show"></Slider>
      <div><button class="btn btn-primary" type="submit">Search</button></div>
    </form>

    <h2>Authors found</h2>

    {authors.length} authors found
    <br />
    <Table
      data={authors}
      tableFormat={{
        papers: (papers) =>
          `<div style="max-height:10em; overflow:scroll">${papers
            .map(
              (paper) =>
                `<span class="mx-1"><a href="${base}/papers/?q=${paper.title}">${paper.title}</a></span >`
            )
            .join("")}</div>`,
      }}
      columns={"authorId,name,affiliations,paperCount,citationCount,hIndex,papers".split(
        ","
      )}
    ></Table>
    <hr />
  </div>
  <!-- /col-12 -->
</div>
<!-- /row -->
