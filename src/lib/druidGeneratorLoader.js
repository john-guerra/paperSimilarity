

import {Runtime, Inspector} from "@observablehq/runtime";
import notebookUrl from "@john-guerra/druidjs-generator";
import { browser } from "$app/environment";


export let druidGeneratorLoader = new Promise(() => {});

if (browser) {
  const runtime = new Runtime();
  const notebook = runtime.module(notebookUrl, (name) => {
    return ["DruidGenerator"].includes(name);
  });

  druidGeneratorLoader = notebook.value("DruidGenerator");
}

export default druidGeneratorLoader;

// function DruidjsGenerator() {
//   const viewofDruid_methodRef = useRef();
//   const viewofDruid_paramsRef = useRef();
//   const viewofInteractiveRef = useRef();
//   const viewofShow_dynamicRef = useRef();
//   const viewofChartRef = useRef();
//   const druidGeneratorRef = useRef();

//   useEffect(() => {
//     const runtime = new Runtime();
//     runtime.module(notebook, name => {
//       if (name === "viewof druid_method") return new Inspector(viewofDruid_methodRef.current);
//       if (name === "viewof druid_params") return new Inspector(viewofDruid_paramsRef.current);
//       if (name === "viewof interactive") return new Inspector(viewofInteractiveRef.current);
//       if (name === "viewof show_dynamic") return new Inspector(viewofShow_dynamicRef.current);
//       if (name === "viewof chart") return new Inspector(viewofChartRef.current);
//       if (name === "DruidGenerator") return new Inspector(druidGeneratorRef.current);
//       return ["drData","dataToPlot"].includes(name);
//     });
//     return () => runtime.dispose();
//   }, []);

//   return (
//     <>
//       <div ref={viewofDruid_methodRef} />
//       <div ref={viewofDruid_paramsRef} />
//       <div ref={viewofInteractiveRef} />
//       <div ref={viewofShow_dynamicRef} />
//       <div ref={viewofChartRef} />
//       <div ref={druidGeneratorRef} />
//       <p>Credit: <a href="https://observablehq.com/@john-guerra/druidjs-generator@latest">DruidJS Generator by John Alexis Guerra Gómez</a></p>
//     </>
//   );
// }

// export default DruidjsGenerator;