<script>
  export let data = [];
  export let columns = data.length === 0 ? [] : Object.keys(data[0]);
  export let tableFormat = {};
</script>

{data.length} rows
<br />
Columns {columns} columns TableFormat {JSON.stringify(tableFormat)}

<table>
  <thead>
    <tr>
      {#each columns as c}
        <th>{c}</th>
      {/each}
    </tr>
  </thead>

  {#each data as row}
    <tr>
      {#each columns as c}
        <td>
          {Object.keys(tableFormat).includes(c)}: {Object.keys(tableFormat).includes(c) &&
          typeof tableFormat[c] === "function"
            ? tableFormat[c](row[c])
            : row[c]}</td
        >
      {/each}
    </tr>
  {/each}
</table>
