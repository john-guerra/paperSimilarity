export function load({ params }) {
  // expose the url params to the client
  return { corpusId: params.corpusId };
}
