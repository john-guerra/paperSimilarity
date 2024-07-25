<script>
  import { onMount } from "svelte";

  import { afterNavigate } from "$app/navigation";


  import { page } from "$app/stores";
  import { SERVER_URL } from "$lib/constants.js";
  import { browser } from "$app/environment";
  import { base } from "$app/paths";

  import Table from "$lib/components/Table.svelte";
  // import Slider from "$lib/components/Slider.svelte";
  import { setQueryUrl, getDataAuthorLookup } from "$lib/utils";

  // Papers is a reactive variable
  let authors = [];
  let query = "";
  let limit = 25;
  let scores = [];

  if (browser) {
    query = $page.url.searchParams.get("q") || "";
  }

  // function setQueryUrl(q) {
  //   $page.url.searchParams.set("q", q);
  //   // shallow routing
  //   // replaceState(page.url.href);
  //   goto($page.url.href);
  // }

  async function getScoresForAllAuthors() {
    if (!authors?.length) {
      console.log("getScoresForAllAuthors no authors", authors)
      return;
    }
    for (let author of authors) {
      getDataAuthorLookup(author.authorId).then((res) => {
        scores.push(res.scoresMatrices);
        console.log("Got lookupAuthor for", author);
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
      <h2>Authors found</h2>

      {authors?.length} authors found
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
    {/if}
  </div>
  <!-- /col-12 -->
</div>
<!-- /row -->
