import { goto } from "$app/navigation";
import * as htl from "htl";
import { base } from "$app/paths";
import { page } from "$app/stores";
import { browser } from "$app/environment";
import { SERVER_URL } from "$lib/constants.js";
import { cosineMatrix } from "$lib/cosineSimilarity.js";

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
  (tableFormat.title = (t, i, all) => {
    const d = all[i];
    return htl.html`<a href="${base}/papers/?q=${d.title}" >${t}</a>`;
  }),
    (tableFormat.authors = (authors, i, all) => {
      const d = all[i];
      return htl.html`<span>${authors.map((a) => htl.html`<a href="${base}/author/?authorId=${a.authorId}">${a.name}</a> `)}</span>`;
    }),
    notebook.redefine("tableFormat", tableFormat);
}

export function setNotebookWidth(notebook) {
  window.addEventListener("resize", () => {
    console.log("resize", document.getElementById("mainSection").offsetWidth);
    notebook.redefine("width", document.getElementById("mainSection").offsetWidth);
  });

  notebook.redefine("width", document.getElementById("mainSection").offsetWidth);
}

export function setQueryUrl(page, params) {
  // console.log("setQueryurl", page, params);
  if (!browser) {
    console.log("setQueryUrl only works in the browser", params);
    return;
  }

  for (let p in params) {
    page.url.searchParams.set(p, params[p]);
  }
  // shallow routing
  // replaceState(page.url.href);
  goto(page.url.href);
}

export async function getDataAuthorLookup(
  authorId,

  {
    $page = null,
    limit = 10,
    embeddingsSelected = [],
    score2Selected = null
  } = {}
) {
  console.log("getDataAuthorLookup ", authorId, limit, embeddingsSelected);
  $page && setQueryUrl($page, { authorId });
  let results = null,
    scoresMatrices = null,
    selectedPapers = null;

  let url = `${SERVER_URL}api/lookup_author?id=${authorId}`;
  url += `&fields=hIndex,name,affiliations,paperCount`;
  url += `,papers,papers.citationCount,papers.title,papers.externalIds,papers.authors,papers.url,papers.year`;
  url += `&limit=${limit}`;
  url += `&sort_by=citationCount`;
  url += score2Selected?.length ? `&score2=${score2Selected.join(",")}` :"";
  url += embeddingsSelected?.length ? `&embeddings=${embeddingsSelected.join(",")}`: "";

  // let url = `${SERVER_URL}/api/author_search?query=${query}&limit=${limit}&fields=hIndex,citationCount,paperCount,name,affiliations,externalIds,papers.externalIds,papers.title&sort_by=hIndex`;
  console.log("getDataAuthorLookup url", url);
  let res = await fetch(url);

  if (res.ok) {
    let data = await res.json();


    data.papers.map((d, i) => {
      d.i = i;
      return d;
    });
    results = data;
    selectedPapers = results.papers;

    if (results?.score2 !== undefined) {
      scoresMatrices = results.score2;
    } else if (results?.embeddings?.embeddigs_requested !== undefined) {
      scoresMatrices = {};
      for (let method of results?.embeddings?.embeddigs_requested || []) {
        scoresMatrices[method] = cosineMatrix(results.embeddings[method]);
      }
    }

    return { results, scoresMatrices, selectedPapers };
  } else {
    console.log(res);
    throw new Error("Failed to fetch authors");
  }
}

// Wrap the contents of a TD in a span with max height
// Make sure class tdMaxHeight is defined in the /style.css
export function tdMaxHeight(content) {
  return `<span class="tdMaxHeight">${content}</span>`;
}
