import { goto } from "$app/navigation";
import * as htl from "htl";
import { base } from "$app/paths";

export async function addMoreLikeButton(notebook) {
  const tableFormat = await notebook.value("tableFormat");

  // Add the button to the table
  tableFormat.options = (CorpusId) => {
    const btn = htl.html`<button class="btn btn-outline-primary" title=${CorpusId}>More like this</button>`;
    btn.addEventListener("click", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      console.log("More like this", CorpusId);
      goto(`${base}/recPapers?corpusId=${CorpusId}`);
    });
    return btn;
  };
  notebook.redefine("tableFormat", tableFormat);
}

export function setNotebookWidth(notebook) {
  window.addEventListener("resize", () => {
    console.log("resize", document.getElementById("mainSection").offsetWidth);
    notebook.redefine(
      "width",
      document.getElementById("mainSection").offsetWidth
    );
  });

  notebook.redefine(
    "width",
    document.getElementById("mainSection").offsetWidth
  );
}
