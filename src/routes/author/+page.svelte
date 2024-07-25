<script>
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { getDataAuthorLookup } from "$lib/utils";
  import { onMount } from "svelte";
  import { base } from "$app/paths";

  import Table from "$lib/components/Table.svelte";
  import Slider from "$lib/components/Slider.svelte";
  import MultiAutoSelect from "$lib/components/MultiAutoSelect.svelte";
  import EmbeddingsMatrix from "$lib/components/EmbeddingsMatrix.svelte";

  let authorId = "";
  if (browser) {
    authorId = $page.url.searchParams.get("authorId") || "";
  }

  let limit = 10;
  let results = null;
  $: results = null;
  let embeddings = "prone,specter,SciNCL,gnn,s2_api".split(",");
  let embeddingsSelected = ["prone", "specter", "gnn"];
  let scoresMatrices = null;
  let selectedPapers = [];

  // $: embeddingsSelected && getData();

  async function getData() {
    const res = await getDataAuthorLookup(authorId, { $page, limit, embeddingsSelected });
    results = res.results;
    scoresMatrices = res.scoresMatrices;
    selectedPapers = res.selectedPapers;
  }

  onMount(async () => {
    if (authorId) {
      console.log("onMount get Data");
      getData();
    }
  });
</script>

<h1>Author Details</h1>
for authorId: {authorId}

<Slider bind:value={limit} min={1} max={100} step={1} on:input={getData} />
<MultiAutoSelect
  options={embeddings}
  params={{ label: "Embeddings to request:" }}
  bind:value={embeddingsSelected}
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
      {#if results && scoresMatrices}
        <EmbeddingsMatrix
          scores={scoresMatrices}
          papers={results.papers}
          method="prone"
          embedding="prone"
          {limit}
          width={600}
          bind:selected={selectedPapers}
          on:input={(evt) =>
            console.log("✂️ Selected papers changed", selectedPapers, evt?.detail?.value)}
        ></EmbeddingsMatrix>
      {/if}
      <Table
        data={selectedPapers}
        tableFormat={{
          authors: (authors) =>
            authors
              .map((a) => `<a href="${base}/author/?authorId=${a.authorId}">${a.name}</a>`)
              .join(", "),
          title: (title, _, paper) => `<a target="_blank" href="${paper.url}">${title}</a>`
        }}
        columns={["i", "selected", "title", "citationCount", "authors"]}
      ></Table>
    </div>
  </div>
{:else}
  <p>Getting data...</p>
{/if}
