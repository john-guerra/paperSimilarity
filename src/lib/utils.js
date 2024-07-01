import { goto } from "$app/navigation";
import * as htl from "htl";
import { base } from "$app/paths";
import { page } from "$app/stores";
import { browser } from "$app/environment";

export async function addMoreLikeButton(notebook) {
  const tableFormat = await notebook.value("tableFormat");

  // Add the button to the table
  tableFormat.options = (CorpusId) => {
    const btnPapers = htl.html`<button class="btn btn-outline-primary" title=${CorpusId}>More papers like this</button>`;
    btnPapers.addEventListener("click", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      console.log("More papers like this", CorpusId);
      goto(`${base}/recPapers?CorpusId=${CorpusId}`);
    });
    const btnAuthors = htl.html`<button class="btn btn-outline-primary" title=${CorpusId}>Authors related</button>`;
    btnAuthors.addEventListener("click", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      console.log("More papers like this", CorpusId);
      goto(`${base}/recAuthors?CorpusId=${CorpusId}`);
    });

    return htl.html`${btnPapers} ${btnAuthors}`;
  };
  notebook.redefine("tableFormat", tableFormat);
}

export function setNotebookWidth(notebook) {
  window.addEventListener("resize", () => {
    console.log("resize", document.getElementById("mainSection").offsetWidth);
    notebook.redefine("width", document.getElementById("mainSection").offsetWidth);
  });

  notebook.redefine("width", document.getElementById("mainSection").offsetWidth);
}
