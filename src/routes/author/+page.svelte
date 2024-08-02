<script>
  import { page } from "$app/stores";
  import { afterNavigate } from "$app/navigation";
  import { browser } from "$app/environment";
  import { getDataAuthorLookup, tdMaxHeight } from "$lib/utils";
  import { onMount } from "svelte";
  import { base } from "$app/paths";

  import Table from "$lib/components/Table.svelte";
  import Slider from "$lib/components/Slider.svelte";
  import MultiAutoSelect from "$lib/components/MultiAutoSelect.svelte";
  import EmbeddingsMatrix from "$lib/components/EmbeddingsMatrix.svelte";
  import { EMBEDDINGS } from "$lib/constants.js";

  let authorId = "";
  if (browser) {
    authorId = $page.url.searchParams.get("authorId") || "";
  }

  let limit = 10;
  let results = null;
  $: results = null;
  let embeddings = EMBEDDINGS;
  let score2Selected = ["ProNE", "Specter", "GNN"];
  $: scoresMatrices = null;
  let selectedPapers = [];
  let promise = Promise.resolve([]);

  // $: score2Selected && getData();

  async function getData() {
    const res = await getDataAuthorLookup(authorId, {
      $page,
      limit,
      score2Selected
    });
    results = res.results;
    scoresMatrices = res.scoresMatrices;
    selectedPapers = res.selectedPapers;
    scoresMatrices = scoresMatrices;
    console.log("got data", scoresMatrices, results);

    return results;
  }

  onMount(async () => {
    if (authorId) {
      results = [];
      promise = getData();
    }
  });

  afterNavigate(() => {
    if ($page.url.searchParams.get("authorId") !== authorId) {
      authorId = $page.url.searchParams.get("authorId") || authorId;
      promise = getData();
    }
  });
</script>

<h1>Author Details</h1>
{#await promise}
  <div>Loading data...</div>
{:then results}
  for authorId: {authorId}

  <Slider bind:value={limit} min={1} max={100} step={1} on:input={() => (promise = getData())} />
  <MultiAutoSelect
    options={embeddings}
    params={{ label: "Embeddings to request:" }}
    bind:value={score2Selected}
  />

  {#if results}
    <div class="row">
      <div class="col-12">
        <h2>{results.name}</h2>
        <p>h-index: {results.hIndex}</p>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <h3>Papers</h3>

        {#key scoresMatrices}
          {#if results && scoresMatrices}
            <EmbeddingsMatrix
              scores={scoresMatrices}
              papers={results.papers}
              method="ProNE"
              embedding="ProNE"
              {limit}
              width={600}
              bind:selected={selectedPapers}
              on:input={(evt) =>
                console.log("✂️ Selected papers changed", selectedPapers, evt?.detail?.value)}
            ></EmbeddingsMatrix>
          {/if}
        {/key}
        <div style="height: 600px; overflow: scroll">
          <Table
            data={selectedPapers}
            tableFormat={{
              authors: (authors) =>
                authors
                  .map((a) => `<a href="${base}/author/?authorId=${a.authorId}">${a.name}</a>`)
                  .join(", "),

              title: (t, i, d) => tdMaxHeight(`<a href="${base}/papers/?q=${d.title}" >${t}</a>`)
            }}
            columns={["i", "selected", "title", "citationCount", "authors"]}
          ></Table>
        </div>
      </div>
    </div>
  {:else}
    <p>Getting data...</p>
  {/if}
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
