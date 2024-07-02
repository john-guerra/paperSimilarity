<script>
  export let value = 25;
  export let name = "limit";
  export let label = "Num. Results to show";
</script>

<div class="row g-3 align-items-center">
  <label class="col-auto col-form-label" for="value">{label}</label>
  <div class="col-auto">
    <input id={name} type="range" class="form-control" bind:value />
  </div>
  <div class="col-auto">
    <input type="number" class="form-control" bind:value />
  </div>
</div>
