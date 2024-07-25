import { Runtime } from "@observablehq/runtime";
import notebookUrl from "@john-guerra/vega-selected";

import { browser } from "$app/environment";

export let vegaSelectedLoader = new Promise(() => {});

if (browser) {
  const runtime = new Runtime();
  const notebook = runtime.module(notebookUrl, (name) => {
    return ["vegaSelected", "getSignals", "vl"].includes(name);
  });

  vegaSelectedLoader = notebook.value("vegaSelected");
}

export default vegaSelectedLoader;
