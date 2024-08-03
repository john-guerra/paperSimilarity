<script>
  // import { druidGeneratorLoader } from "$lib/druidGeneratorLoader.js";
  import embeddingsProjectionLoader from "$lib/embeddingsProjectionLoader.js";
  // import vl from "$lib/vegaLiteApiLoader";

  import { onMount } from "svelte";
  // import { createEventDispatcher } from "svelte";

  // const dispatch = createEventDispatcher();

  // The embeddings should be a n x m matrix
  export let embeddings;
  // The data elements should be and array of objects of size n
  export let data;

  console.log("EmbeddingsProjection", embeddings, data);

  // validate matrix and data
  if (embeddings.length !== data.length) {
    throw new Error("embeddings and data should have the same length");
  }

  // Where we draw the chart
  let targetSpan;

  // let DruidGenerator = null;
  let EmbeddingsProjection = null;

  async function init() {
    EmbeddingsProjection = await embeddingsProjectionLoader;
    console.log("loaded EmbeddingsProjection", EmbeddingsProjection);
  }

  async function getChart() {
    return EmbeddingsProjection(data, embeddings, {
      drMethod: "UMAP",
      drParams: {
        n_neighbors: 2,
        local_connectivity: 1,
        min_dist: 1,
        seed: 1212
      },
      chartOptions: {
        width: 400,
        height: 400,
        color: "authorId",
        colorType: "nominal",
        colorScheme: "spectral",
        size: 80

      }
    });
  }

  onMount(async () => {
    await init();
    const generator = await getChart();

    for await (let iter of generator) {
      console.log("created EmbeddingsProjection", iter, generator, iter.done);
      if (iter) {
        targetSpan.innerHTML = "";
        targetSpan.appendChild(iter);
      }
    }
  });
</script>

<h2>Embeddings Projection</h2>

<span bind:this={targetSpan}></span>
