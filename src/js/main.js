// This code looks into the similarity and papers variables and render the proper table and widget

import {
  Runtime,
  Inspector
} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";
import definePaperSearch from "https://api.observablehq.com/d/c9283caca5d12539@latest.js?v=4";

import notebookRecommendations from "./recommendPapers.js";

// import define from "https://api.observablehq.com/d/c9283caca5d12539@560.js?v=4";
const notebookPaperSearch = new Runtime().module(definePaperSearch, (name) => {
  // if (name === "viewof query")
  //   return new Inspector(
  //     document.querySelector("#observablehq-viewof-query-ee0d7845")
  //   );
  if (name === "viewof paperSearchTable")
    return new Inspector(document.querySelector("#observablehq-viewof-paperSearchTable-ee0d7845"));
  if (name === "viewof method")
    return new Inspector(document.querySelector("#observablehq-viewof-method-ee0d7845"));
  if (name === "viewof embedding")
    return new Inspector(document.querySelector("#observablehq-viewof-embedding-ee0d7845"));
  if (name === "viewof selected")
    return new Inspector(document.querySelector("#observablehq-viewof-selected-ee0d7845"));

  if (name === "viewof selectionType")
    return new Inspector(document.querySelector("#observablehq-viewof-selectionType-ee0d7845"));
  return ["papersUrl", "url", "papers", "tableFormat", "papers"].includes(name);
});

let papers = [],
  // recommendations = [],
  viewof_method = await notebookPaperSearch.value("viewof method");

const queryEle = document.getElementById("query");
const queryForm = document.getElementById("queryForm");

async function getData() {
  const query = queryEle?.value;
  console.log("get Data", query);

  // Clean up first for better experience
  notebookPaperSearch.redefine("papers", []);

  papers = (
    await fetch(
      `https://johnguerra.co/kenBack/cgi-bin/paper_search?query=${query}&limit=25`
      // `https://34.204.188.58/cgi-bin/paper_search?query=${query}&limit=25`
    ).then((res) => res.json())
  ).search_results;
  console.log("Got papers", papers);

  // const CorpusId = papers[0].externalIds.CorpusId;
  // recommendations = await fetch(
  //   `http://34.204.188.58/cgi-bin/recommend_papers?id=CorpusId:${CorpusId}&limit=25&method=${viewof_method.value}&score2=prone,specter,scincl,gnn&fields=title,citationCount,year`
  // ).then((res) => res.json());
  // console.log("Got similarity", recommendations);

  redraw();
}

async function redraw() {
  // notebookPaperSearch.redefine("similarity", recommendations.score2[viewof_method.value]);
  notebookPaperSearch.redefine("papers", papers);

  const viewof_paperSearchTable = await notebookPaperSearch.value("viewof paperSearchTable");

  viewof_paperSearchTable.removeEventListener("input", onPaperChange);
  viewof_paperSearchTable.addEventListener("input", onPaperChange);
}

queryForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  getData();
});
viewof_method.addEventListener("input", redraw);

window.addEventListener("resize", () => {
  console.log("resize", document.getElementById("mainSection").offsetWidth);
  notebookPaperSearch.redefine("width", document.getElementById("mainSection").offsetWidth);
});
notebookPaperSearch.redefine("width", document.getElementById("mainSection").offsetWidth);

async function onPaperChange() {
  const viewof_paperSearchTable = await notebookPaperSearch.value("viewof paperSearchTable");
  const viewof_CorpusId = await notebookRecommendations.value("viewof CorpusId");

  console.log(
    "🥹 Selected paper input",
    viewof_paperSearchTable,
    viewof_paperSearchTable.value,
    viewof_paperSearchTable.value.externalIds.CorpusId
  );

  viewof_CorpusId.value = viewof_paperSearchTable.value.externalIds.CorpusId;
  viewof_CorpusId.dispatchEvent(new Event("input", { bubbles: true }));
}

getData();
