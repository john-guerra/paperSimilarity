<script>
  import { onMount } from "svelte";
  import Table from "$lib/components/Table.svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { SERVER_URL } from "$lib/constants.js";

  export let data;
  // let CorpusId = "6496359";
  // let authors = {};

  // async function getAuthors(CorpusId) {
  //   const res = await fetch(
  //     `${SERVER_URL}/cgi-bin/recommend_authors?id=${CorpusId}&sort_by=hIndex&method=ProNE&fields=citationCount,externalIds&score1=prone,specter,scincl,gnn&score2=prone,specter,scincl,gnn`
  //   );
  //   if (res.ok) {
  //     return (await res.json()).experts;
  //   } else {
  //     console.log(res);
  //     throw new Error("Failed to fetch recommendations");
  //   }
  // }

  // onMount(async () => {
  //   if (browser) {
  //     CorpusId = $page.url.searchParams.get("CorpusId");
  //     console.log("CorpusId: ", CorpusId);
  //   }

  //   authors = getAuthors(CorpusId);
  // });
</script>

<h1>Rec Authors</h1>
<label>Recommendations for <output>{data.CorpusId}</output></label>

{#await data.authors}
  <div>Loading...</div>
{:then authors}
  <div>Received {authors.length} authors</div>
  <Table
    data={authors}
    columns={["name", "score", "hIndex", "url"]}
    tableFormat={{ url: (url) => `<a href="${url}">${url}</Table>` }}
  />
{/await}
