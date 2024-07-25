// Computes the cosine similarity between two embeddings
export function pairCosineSimilarity(embeddingA, embeddingB) {
  const EMBED_DIM = embeddingA.length;
  let dotProduct = 0;
  let normEmbeds = 0;
  let normDB = 0;

  for (let j = 0; j < EMBED_DIM; ++j) {
    const embedValue = embeddingA[j];
    const dbValue = embeddingB[j];

    dotProduct += embedValue * dbValue;
    normEmbeds += embedValue * embedValue;
    normDB += dbValue * dbValue;
  }

  if (normEmbeds === 0 || normDB === 0) {
    return 0;
  }

  const score = dotProduct / (Math.sqrt(normEmbeds) * Math.sqrt(normDB));
  return score;
}

export function cosineMatrix(embeddings) {
  const cosineMatrix = Array.from({ length: embeddings.length }, () =>
    Array(embeddings.length).fill(0)
  );
  for (let i = 0; i < embeddings.length; ++i) {
    for (let j = i + 1; j < embeddings.length; ++j) {
      cosineMatrix[i][j] = pairCosineSimilarity(embeddings[i], embeddings[j]);
      cosineMatrix[j][i] = cosineMatrix[i][j];
    }
  }

  return cosineMatrix;
}
