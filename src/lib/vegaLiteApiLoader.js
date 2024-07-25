import * as vl from "vega-lite-api";
import * as vegaLite from "vega-lite";
import * as vega from "vega";
import * as vegaTooltip from "vega-tooltip";

// setup VEGA LITE API options
const options = {
  config: {
    // Vega-Lite default configuration
  },
  init: (view) => {
    // initialize tooltip handler
    view.tooltip(new vegaTooltip.Handler().call);
  },
  view: {
    // view constructor options
    // remove the loader if you don't want to default to vega-datasets!
    loader: vega.loader({
      baseURL: "https://cdn.jsdelivr.net/npm/vega-datasets@2/"
    }),
    renderer: "canvas"
  }
};
// register vega and vega-lite with the API
vl.register(vega, vegaLite, options);

export default vl;