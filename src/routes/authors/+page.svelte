<script>
  import { onMount } from "svelte";

  import { afterNavigate } from "$app/navigation";

  import { page } from "$app/stores";
  import { SERVER_URL, EMBEDDINGS } from "$lib/constants.js";
  import { browser } from "$app/environment";
  import { base } from "$app/paths";

  import Table from "$lib/components/Table.svelte";
  import EmbeddingsMatrix from "$lib/components/EmbeddingsMatrix.svelte";
  import MultiAutoSelect from "$lib/components/MultiAutoSelect.svelte";
  import PromiseStatus from "$lib/components/PromiseStatus.svelte";
  import EmbeddingsProjection from "$lib/components/EmbeddingsProjection.svelte";

  import Slider from "$lib/components/Slider.svelte";
  import { setQueryUrl, getDataAuthorLookup, tdMaxHeight } from "$lib/utils";

  import { cosineMatrix } from "$lib/cosineSimilarity.js";

  import { error } from "@sveltejs/kit";

  let promise = Promise.resolve([]);
  let promisesAuthors = [];
  let authors = [];
  let query = "";
  let limit = 10;
  let scores = null;
  let embeddingsSelected = ["ProNE", "Specter", "GNN"];
  let embeddingsOptions = EMBEDDINGS;

  let selectedPapers = [];
  let papers = [];
  let embeddings = null;

  // we trigger getDataForAllAuthors for limit when the drag is over
  // $: embeddingsSelected && getScoresForAllAuthors();

  if (browser) {
    query = $page.url.searchParams.get("q") || "";
  }

  function concatenateEmbeddings(newEmbedding) {
    if (!embeddings) {
      embeddings = { ...newEmbedding };
    } else {
      for (let key in newEmbedding) {
        if (key === "embeddings_requested") {
          continue;
        }
        if (embeddings[key]) {
          embeddings[key] = embeddings[key].concat(newEmbedding[key]);
        } else {
          embeddings[key] = newEmbedding[key];
        }
      }
      console.log("concatenateEmbeddings ", embeddings);
    }
  }

  function recomputeScores() {
    const before = performance.now();

    scores = {};
    for (let key in embeddings) {
      if (key === "embeddings_requested") {
        continue;
      }
      scores[key] = cosineMatrix(embeddings[key]);
    }
    console.log("Concatenate scores matrix ", performance.now() - before, scores);
    // trigger reactivity
    scores = scores;
    return scores;
  }

  async function getScoresForAllAuthors() {
    if (!authors?.length) {
      console.log("getScoresForAllAuthors no authors", authors);
      return;
    }
    console.log("🧵🧵 getScoresForAllAuthors embeddings", embeddings);
    papers = [];
    embeddings = {};
    scores = {};
    promisesAuthors = [];
    for (let author of authors) {
      promisesAuthors.push(
        getDataAuthorLookup(author.authorId, {
          limit,
          embeddingsSelected
        }).then((res) => {
          // scores.set(author.authorId, res.scoresMatrices);
          papers = papers.concat(
            res.results.papers.map((p) => ({ ...p, authorId: author.authorId }))
          );
          // trigger reactivity
          papers = papers;
          concatenateEmbeddings(res.results.embeddings);
          recomputeScores();
          console.log("Got lookupAuthor for", author, scores, papers, embeddings);
        })
      );
    }

    promisesAuthors = promisesAuthors;
    console.log("promisesAuthors", promisesAuthors);
  }

  async function getData() {
    if (query === "") {
      authors = null;
      return;
    }
    console.log("Get data", query);
    setQueryUrl($page, { q: query });
    authors = [];

    console.log("fetch", self, self.fetch, fetch);
    let url = `${SERVER_URL}/api/author_search?query=${query}&limit=${limit}&fields=hIndex,citationCount,paperCount,name,affiliations,externalIds,papers.externalIds,papers.title&sort_by=hIndex`;
    console.log("fetching authors", url);
    let res;

    res = await self.fetch(url);

    if (res.ok) {
      let data = await res.json();
      console.log("Got authors: ", data);
      authors = data.search_results;

      getScoresForAllAuthors();
      return authors;
    } else {
      console.log("🚫 Error", res);
      throw error(500, { message: "john" });
    }
  }

  onMount(async () => {
    if (query) {
      promise = getData();
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

    <form id="queryForm" action="" on:submit|preventDefault={() => (promise = getData())}>
      <label class="form-label w-100"
        >Query
        <input id="query" type="text" class="form-control w-100" bind:value={query} />
      </label>

      <div><button class="btn btn-primary" type="submit">Search</button></div>
    </form>

    {#await promise}
      Loading data...
    {:then authors}
      {#if authors?.length === 0}
        <div>No authors found</div>
      {:else}
        <h2>Authors found ({authors?.length})</h2>
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

        <h3>Paper comparison for these authors</h3>
        <div>Here is a comparison of the papers returned for these authors</div>
        <MultiAutoSelect
          options={embeddingsOptions}
          params={{ label: "Embeddings to request:" }}
          bind:value={embeddingsSelected}
        />
        <Slider value={limit} label="Max number of results to show"></Slider>
        <button class="btn btn-primary" on:click={getScoresForAllAuthors}>Update Comparison</button>

        <!-- Fetch status -->
        <div>
          {#key promisesAuthors}
            Data requests status:
            {#each promisesAuthors as p}
              <PromiseStatus promise={p}></PromiseStatus>
            {/each}
          {/key}
        </div>

        {#key scores}
          {#if papers && scores}
            <EmbeddingsMatrix
              {scores}
              {papers}
              method="ProNE"
              embedding="ProNE"
              {limit}
              width={600}
              bind:selected={selectedPapers}
            ></EmbeddingsMatrix>
          {/if}
        {/key}

        {#key selectedPapers}
          <div style="height: 600px; overflow: scroll">
            <Table
              data={selectedPapers}
              tableFormat={{
                title: (t, i, d) => tdMaxHeight(`<a href="${base}/papers/?q=${d.title}" >${t}</a>`),
                authors: (authors) =>
                  `${tdMaxHeight(authors.map((a) => `<a href="${base}/author/?authorId=${a.authorId}">${a.name}</a>`).join(", "))}`
              }}
              columns={["__i", "selected", "title", "year", "citationCount", "authors", "authorId"]}
            ></Table>
          </div>
        {/key}

        {#key papers}
          {#if embeddings && embeddingsSelected[0] in embeddings && papers}
            <EmbeddingsProjection embeddings={embeddings[embeddingsSelected[0]]} data={papers}
            ></EmbeddingsProjection>
          {/if}
        {/key}
      {/if}
      <!-- /if authors.length -->
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
  <!-- /col-12 -->
</div>
<!-- /row -->
