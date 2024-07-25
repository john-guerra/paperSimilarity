<script>
  import { Runtime, Inspector } from "@observablehq/runtime";
  import notebookUrl from "@john-guerra/multi-auto-select";

  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  //props
  export let options = [];
  export let params = {};
  export let value = [];

  params.value = params.value || value;

  // binds
  let div;

  const dispatch = createEventDispatcher();

  // Input constructor will be loaded from the notebook
  let multiAutoSelect;

  async function loadNotebook() {
    const runtime = new Runtime();
    const notebook = await runtime.module(notebookUrl, (name) => {
      return ["multiAutoSelect"].includes(name);
    });
    multiAutoSelect = await notebook.value("multiAutoSelect");
  }

  onMount(async () => {
    await loadNotebook();

    // console.log("Creating multiAutoSelect", options, params, value);
    const ele = multiAutoSelect(options, params);
    ele.addEventListener("input", (event) => {
      dispatch("input", { target: ele, value: ele.value, event });
      value = ele.value;
    });
    div.appendChild(ele);
  });
</script>

<span class="multiAutoSelect" bind:this={div} />
