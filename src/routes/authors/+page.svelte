<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  import * as Inputs from "@observablehq/inputs";
  import { page } from "$app/stores";
  import { SERVER_URL } from "$lib/constants.js";
  import { browser } from "$app/environment";
  import { base } from "$app/paths";

  import Table from "$lib/components/Table.svelte";
  // import Slider from "$lib/components/Slider.svelte";

  // Papers is a reactive variable
  let authors = [];
  let query = "";
  let limit = 25;

  if (browser) {
    query = $page.url.searchParams.get("q") || "";
  }

  function setQueryUrl(q) {
    $page.url.searchParams.set("q", q);
    // shallow routing
    // replaceState(page.url.href);
    goto($page.url.href);
  }

  async function getData() {
    console.log("Get data", query);
    setQueryUrl(query);
    authors = [];

    let url = `${SERVER_URL}/cgi-bin/author_search?query=${query}&limit=${limit}&fields=hIndex,citationCount,paperCount,name,affiliations,externalIds,papers.externalIds,papers.title&sort_by=hIndex`;
    console.log("fetching authors", url);
    let res = await fetch(url);

    if (res.ok) {
      let data = await res.json();
      console.log("Got authors: ", data);
      authors = data.search_results;
      return authors;
    } else {
      console.log(res);
      throw new Error("Failed to fetch authors");
    }
  }

  onMount(async () => {
    if (query) {
      promise = await getData();
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
      <h2>Authors found</h2>

      {authors?.length} authors found
      <br />
      <Table
        data={authors}
        tableFormat={{
          name: (name) =>
            `<a href="${base}/authors/?q=${name}" title="Search for this author">${name}</a>`,
          authorId: (authorId, i, author) =>
            `<a href="https://www.semanticscholar.org/author/${author.name}/${authorId}" title="See in semantic scholar">${authorId}</a>`,
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
    {/if}
  </div>
  <!-- /col-12 -->
</div>
<!-- /row -->
