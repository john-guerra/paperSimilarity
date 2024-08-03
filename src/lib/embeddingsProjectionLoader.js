

import {Runtime, Inspector} from "@observablehq/runtime";
import notebookUrl from "@john-guerra/embeddings-projection";
import { browser } from "$app/environment";


export let embeddingsProjectionLoader = new Promise(() => {});

if (browser) {
  const runtime = new Runtime();
  const notebook = runtime.module(notebookUrl, (name) => {
    return ["EmbeddingsProjection"].includes(name);
  });

  embeddingsProjectionLoader = notebook.value("EmbeddingsProjection");
}

export default embeddingsProjectionLoader;


// import React, {useRef, useEffect} from "react";
// import {Runtime, Inspector} from "@observablehq/runtime";
// import notebook from "@john-guerra/embeddings-projection";

// function EmbeddingsProjection() {
//   const embeddingsProjectionRef = useRef();

//   useEffect(() => {
//     const runtime = new Runtime();
//     runtime.module(notebook, name => {
//       if (name === "EmbeddingsProjection") return new Inspector(embeddingsProjectionRef.current);
//       return ["viewof drSelection","paperClicked","papersHighlighted"].includes(name);
//     });
//     return () => runtime.dispose();
//   }, []);

//   return (
//     <>
//       <div ref={embeddingsProjectionRef} />
//       <p>Credit: <a href="https://observablehq.com/@john-guerra/embeddings-projection">Embeddings Projection by John Alexis Guerra Gómez</a></p>
//     </>
//   );
// }

// export default EmbeddingsProjection;