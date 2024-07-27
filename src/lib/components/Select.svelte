<script>
  export let options = [];
  export let value = options[0];
  export let format = (d) => d;
  export let formatValue = (d) => d;
  export let label = "";
</script>

<label class="form-label">
  <span>{label}</span>
  <select class="form-select" aria-label={label} bind:value on:change={() => console.log(value)}>
    {#each options as option}
      <option value={formatValue(option)}>{format(option)}</option>
    {/each}
  </select>
</label>
