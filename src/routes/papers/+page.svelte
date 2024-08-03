<script>
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { goto, replaceState } from "$app/navigation";
  import { page } from "$app/stores";
  import { setQueryUrl, tdMaxHeight } from "$lib/utils.js";
  import { browser } from "$app/environment";

  import { base } from "$app/paths";

  import { SERVER_URL, METHODS } from "../../lib/constants.js";
  import Slider from "$lib/components/Slider.svelte";
  // import Select from "../../lib/components/Select.svelte";

  import Table from "$lib/components/Table.svelte";
  import EmbeddingsProjection from "$lib/components/EmbeddingsProjection.svelte";

  // Papers is a reactive variable
  let papers = null;
  // let query = "Personalizing Search via Association";
  let query = "";
  let limit = 10;

  $: papers;

  if (browser) {
    query = $page.url.searchParams.get("q") || query;
  }

  // let notebookPaperSearch;

  async function getData() {
    if (query === "") {
      papers = null;
      return;
    }

    // Clean up first for better experience
    papers = [];
    setQueryUrl($page, { q: query });

    let url = `${SERVER_URL}api/paper_search?query=${query}&limit=${limit}&fields=authors,citationCount,externalIds,title,year,embedding.specter_v2`;

    console.log("Get papers url", url);
    papers = (await fetch(url).then((res) => res.json())).search_results.map((d) => ({
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
      <!-- <Select label={"Method for recommend papers"} options={METHODS} bind:value={method}></Select> -->
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

      {#if false && papers.length > 0 && papers[0].embedding?.vector}
        <EmbeddingsProjection embeddings={papers.map((d) => d?.embedding?.vector)} data={papers}
        ></EmbeddingsProjection>
      {/if}

      <Table
        data={papers}
        tableFormat={{
          title: (t, i, d) => tdMaxHeight(`<a href="${base}/papers/?q=${d.title}" >${t}</a>`),
          authors: (authors) =>
            `${tdMaxHeight(authors.map((a) => `<a href="${base}/author/?authorId=${a.authorId}">${a.name}</a>`).join(", "))}`,
          options: (CorpusId) => {
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
