// import { browser } from "$app/environment";
// import { SERVER_URL } from "$lib/constants.js";

// export async function load({ fetch, url }) {
//   let CorpusId = "6496359";
//   if (browser) {
//     CorpusId = url.searchParams.get("CorpusId");
//   }

//   const authors = (
//     await fetch(
//       `${SERVER_URL}/cgi-bin/recommend_authors?id=${CorpusId}&method=ProNE&fields=citationCount,externalIds&score1=prone,specter,scincl,gnn&score2=prone,specter,scincl,gnn`
//     ).then((res) => res.json())
//   ).experts.map((author) => {
//     author.options = author.authorId;
//     return author;
//   });
//   console.log("Got authors: ", authors.length);

//   return { authors, CorpusId };
// }
