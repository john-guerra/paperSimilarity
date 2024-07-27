<script>
  export let data = [];

  export let columns = data?.length ? Object.keys(data[0]) : [];
  export let tableFormat = {};
  // console.log("Table data: ", data, columns, tableFormat);

  $: data;
</script>

{#if !data?.length}
  <div>No data to show</div>
{:else}
  <table class="table">
    <thead>
      <tr>
        {#each columns as c}
          <th scope="col">{c}</th>
        {/each}
      </tr>
    </thead>

    {#each data as row}
      <tr>
        {#each columns as c, i}
          <td
            >{@html typeof tableFormat[c] === "function"
              ? tableFormat[c](row[c], i, row)
              : row[c]}</td
          >
        {/each}
      </tr>
    {/each}
  </table>
{/if}
