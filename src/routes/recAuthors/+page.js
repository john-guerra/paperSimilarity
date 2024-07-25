import { browser } from "$app/environment";
import { SERVER_URL } from "$lib/constants.js";

export async function load({ fetch, url }) {
  if (!browser) {
    return {
      authors: [],
      CorpusId: "",
    }
  }
  let CorpusId = "6496359";
  if (browser) {
    CorpusId = url.searchParams.get("CorpusId");
  }

  let res = await fetch(
    `${SERVER_URL}/api/recommend_authors?id=${CorpusId}&method=ProNE&fields=authorId,citationCount,externalIds,url,name,homepage,hIndex,affiliations,papers.title,papers.externalIds,papers.citationCount&score1=prone,specter,scincl,gnn&score2=prone,specter,scincl,gnn`
  );

  if (res.ok) {
    const data = await res.json();
    console.log("Got data: ", data);
    return {
      authors: data.experts.map((author) => {
        author.options = author.authorId;
        return author;
      }),
      // data,
      CorpusId
    };
  } else {
    console.error("Failed to fetch data: ", res);
    throw new Error("Failed to fetch author recommendations");
    // return { authors: [], CorpusId };
  }
}
