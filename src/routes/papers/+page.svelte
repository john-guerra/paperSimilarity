<script>
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { goto, replaceState } from "$app/navigation";
  import { page } from "$app/stores";
  import { setQueryUrl, tdMaxHeight } from "$lib/utils.js";
  import { browser } from "$app/environment";
  import * as htl from "htl";

  import { base } from "$app/paths";

  import { SERVER_URL } from "../../lib/constants.js";
  import Slider from "$lib/components/Slider.svelte";
  import Select from "../../lib/components/Select.svelte";

  import Table from "$lib/components/Table.svelte";

  // Papers is a reactive variable
  let papers = null;
  let query = "Personalizing Search via Association";
  let limit = 10;
  // let method = METHODS[0];

  $: papers;

  if (browser) {
    console.log("trying to get query from url", $page.url.searchParams.get("q"));
    query = $page.url.searchParams.get("q") || query;
  }

  // let notebookPaperSearch;

  async function getData() {
    if (query === "") {
      papers = null;
      return;
    }

    papers = [];
    setQueryUrl($page, { q: query });

    // Clean up first for better experience
    // notebookPaperSearch.redefine("papers", []);

    papers = (
      await fetch(
        `${SERVER_URL}api/paper_search?query=${query}&limit=${limit}`
        // `https://34.204.188.58/api/paper_search?query=${query}&limit=25`
      ).then((res) => res.json())
    ).search_results.map((d) => ({
      ...d,
      url: `/papers/?q=${d.title}`,
      options: d?.externalIds?.CorpusId,
      CorpusId: d?.externalIds?.CorpusId
    }));

    console.log("Got papers: ", papers);
    // redraw();
  }

  onMount(() => {
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
      <!-- <Select label={"Method"} options={METHODS} bind:value={method}></Select> -->
      <Slider bind:value={limit} label="Max number of results to show" on:input={getData}></Slider>
      <div><button class="btn btn-primary" type="submit">Search</button></div>
    </form>
    <hr class="m-2" />

    {#if !papers}
      <div>Please query for something</div>
    {:else if papers.length === 0}
      <div>Loading...</div>
    {:else}
      <h2>Papers found ({papers.length})</h2>
      <Table
        data={papers}
        tableFormat={{
          title: (t, i, d) => tdMaxHeight(`<a href="${base}/papers/?q=${d.title}" >${t}</a>`),
          authors: (authors) =>
            `${tdMaxHeight(authors.map((a) => `<a href="${base}/author/?authorId=${a.authorId}">${a.name}</a>`).join(", "))}`,
          options: (CorpusId) => {
            console.log("options", CorpusId);
            const btnPapers = `<a href="${base}/recPapers?CorpusId=${CorpusId}" class="btn btn-outline-primary btn-sm p-0" title=${CorpusId}>Similar papers</a>`;
            const btnAuthors = `<a href="${base}/recAuthors?CorpusId=${CorpusId}" class="btn btn-outline-primary btn-sm p-0" title=${CorpusId}>Authors related</a>`;

            return `${btnPapers} ${btnAuthors}`;
          }
        }}
        columns={["title", "year", "citationCount", "authors", "options"]}
      ></Table>
    {/if}
  </div>
</div>
<!-- /row -->
