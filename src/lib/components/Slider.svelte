<script>
  import { createEventDispatcher } from "svelte";

  export let value = 25;
  export let name = "limit";
  export let label = "Num. Results to show";
  export let min = 1;
  export let max = 100;
  export let step = 1;

  const dispatch = createEventDispatcher();

  let form;

  function triggerValueChange() {
    console.log("Triggering value change", form, value);
    dispatch("input", { value });
  }

</script>

<form class="row g-3 align-items-center" bind:this={form}>
  <label class="col-auto col-form-label" for={name}>{label}</label>
  <div class="col-auto">
    <input
      id={name}
      type="range"
      class="form-control"
      {min}
      {max}
      {step}
      bind:value
      on:mouseup={triggerValueChange}
    />
  </div>
  <div class="col-auto">
    <input
      type="number"
      class="form-control"
      {min}
      {max}
      {step}
      bind:value
      on:input={triggerValueChange}
    />
  </div>
</form>
