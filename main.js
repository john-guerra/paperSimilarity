// This code looks into the similarity and papers variables and render the proper table and widget

import {
  Runtime,
  Inspector,
} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";
import definePaperSearch from "https://api.observablehq.com/d/c9283caca5d12539@latest.js?v=4";
import defineRecommendations from "https://api.observablehq.com/@john-guerra/semantic-scholar-recommended-papers@latest.js?v=4";

// import define from "https://api.observablehq.com/d/c9283caca5d12539@560.js?v=4";
const notebookPaperSearch = new Runtime().module(definePaperSearch, (name) => {
  // if (name === "viewof query")
  //   return new Inspector(
  //     document.querySelector("#observablehq-viewof-query-ee0d7845")
  //   );
  if (name === "viewof paperSearchTable")
    return new Inspector(
      document.querySelector("#observablehq-viewof-paperSearchTable-ee0d7845")
    );
  if (name === "viewof method")
    return new Inspector(
      document.querySelector("#observablehq-viewof-method-ee0d7845")
    );
  if (name === "viewof embedding")
    return new Inspector(
      document.querySelector("#observablehq-viewof-embedding-ee0d7845")
    );
  if (name === "viewof selected")
    return new Inspector(
      document.querySelector("#observablehq-viewof-selected-ee0d7845")
    );

  if (name === "viewof selectionType")
    return new Inspector(
      document.querySelector("#observablehq-viewof-selectionType-ee0d7845")
    );
  return ["papersUrl", "url", "papers", "tableFormat", "papers"].includes(name);
});

const notebookRecommendations = new Runtime().module(
  defineRecommendations,
  (name) => {
    if (name === "viewof columnsToShow")
      return new Inspector(
        document.querySelector("#observablehq-viewof-columnsToShow-ee0d7845")
      );
    if (name === "viewof paperSearchTable")
      return new Inspector(
        document.querySelector("#observablehq-viewof-paperSearchTable-ee0d7845")
      );
    if (name === "viewof corpusId")
      return new Inspector(
        document.querySelector("#observablehq-viewof-corpusId-ee0d7845")
      );
    if (name === "viewof limit")
      return new Inspector(
        document.querySelector("#observablehq-viewof-limit-ee0d7845")
      );
    if (name === "viewof method")
      return new Inspector(
        document.querySelector("#observablehq-viewof-method-ee0d7845")
      );
    if (name === "viewof embedding")
      return new Inspector(
        document.querySelector("#observablehq-viewof-embedding-ee0d7845")
      );
    if (name === "viewof rowOrder")
      return new Inspector(
        document.querySelector("#observablehq-viewof-rowOrder-ee0d7845")
      );
    if (name === "viewof columnOrder")
      return new Inspector(
        document.querySelector("#observablehq-viewof-columnOrder-ee0d7845")
      );
    if (name === "viewof selected")
      return new Inspector(
        document.querySelector("#observablehq-viewof-selected-ee0d7845")
      );
    if (name === "recommendationsTable")
      return new Inspector(
        document.querySelector("#observablehq-table-ee0d7845")
      );
    if (name === "viewof selectionType")
      return new Inspector(
        document.querySelector("#observablehq-viewof-selectionType-ee0d7845")
      );
    return [
      "url",
      "papers",
      "similarityMatrixChart",
      "corpusId",
      "recommendedURL",
      "recommendations",
      "tidySimilarity",
      "similarity",
      "tableFormat",
      "similarity",
    ].includes(name);
  }
);

// http://34.204.188.58//cgi-bin/paper_search?query=Personalizing%20Search%20via%20Association

// http://34.204.188.58/cgi-bin/recommendations?id=CorpusId:316030&method=s2_api&score1=prone,specter,scincl,gnn&score2=prone,specter&fields=title,citationCount,year

// http://34.204.188.58/cgi-bin/recommendations?id=CorpusId:316030&method=prone&score1=prone,specter,scincl,gnn&score2=prone,specter&fields=title,citationCount,year

// const papers = [
//   { name: "Exmaple Paper 1", id: "1", author: "Author 1" },
//   { name: "Exmaple Paper 2", id: "2", author: "Author 2" },
//   { name: "Exmaple Paper 3", id: "3", author: "Author 3" },
//   { name: "Exmaple Paper 4", id: "4", author: "Author 4" },
//   { name: "Exmaple Paper 5", id: "5", author: "Author 5" },
// ];

// If you load your data into these variables, the widgets will adapt to them. It matches the two structures by the index
// const similarity = [
//   [0.9, 0.9, 0.6, 0.1, 0.4],
//   [0.8, 0.9, 0.6, 0.2, 0.4],
//   [0.7, 0.9, 0.6, 0.1, 0.4],
//   [0.1, 0.2, 0.3, 0.8, 0.7],
//   [0.15, 0.3, 0.2, 0.8, 0.9],
// ];

let papers = [],
  recommendations = [],
  viewof_method = await notebookPaperSearch.value("viewof method");

const queryEle = document.getElementById("query");
const queryForm = document.getElementById("queryForm");

async function getData() {
  const query = queryEle.value;
  console.log("get Data", query);

  papers = (
    await fetch(
      `https://34.204.188.58/cgi-bin/paper_search?query=${query}&limit=25`
    ).then((res) => res.json())
  ).search_results;
  console.log("Got papers", papers);

  // const corpusId = papers[0].externalIds.CorpusId;
  // recommendations = await fetch(
  //   `http://34.204.188.58/cgi-bin/recommend_papers?id=CorpusId:${corpusId}&limit=25&method=${viewof_method.value}&score2=prone,specter,scincl,gnn&fields=title,citationCount,year`
  // ).then((res) => res.json());
  // console.log("Got similarity", recommendations);

  redraw();
}

async function redraw() {
  // notebookPaperSearch.redefine("similarity", recommendations.score2[viewof_method.value]);
  notebookPaperSearch.redefine("papers", papers);

  const viewof_paperSearchTable = await notebookPaperSearch.value("viewof paperSearchTable");
  
  viewof_paperSearchTable.removeEventListener(
    "input",
    onPaperChange
  );
  viewof_paperSearchTable.addEventListener(
    "input",
    onPaperChange
  );
}

queryForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  getData();
});
viewof_method.addEventListener("input", redraw);

window.addEventListener("resize", () => {
  console.log("resize", document.getElementById("mainSection").offsetWidth);
  notebookPaperSearch.redefine(
    "width",
    document.getElementById("mainSection").offsetWidth
  );
  notebookRecommendations.redefine(
    "width",
    document.getElementById("mainSection").offsetWidth
  );
});
notebookPaperSearch.redefine(
  "width",
  document.getElementById("mainSection").offsetWidth
);
notebookRecommendations.redefine(
  "width",
  document.getElementById("mainSection").offsetWidth
);

async function onPaperChange() {
  const viewof_paperSearchTable = await notebookPaperSearch.value(
    "viewof paperSearchTable"
  );
  const viewof_corpusId =
    await notebookRecommendations.value("viewof corpusId");

  console.log(
    "🥹 Selected paper input",
    viewof_paperSearchTable,
    viewof_paperSearchTable.value,
    viewof_paperSearchTable.value.externalIds.CorpusId
  );

  viewof_corpusId.value = viewof_paperSearchTable.value.externalIds.CorpusId;
  viewof_corpusId.dispatchEvent(new Event("input", { bubbles: true }));
}

getData();
