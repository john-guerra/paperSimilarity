<script>
  export let promise = Promise.resolve([]);
  console.log("⏳ promise status", promise);
</script>

{#await promise}
  <span title="Promise loading">⏳</span>
{:then response}
  <span title="Got data {response?.length}">✅</span>
{:catch error}
  <span title={error}>🚫</span>
{/await}
