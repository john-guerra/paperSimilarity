import {
	Runtime,
	Inspector
} from 'https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js';

import defineRecommendations from 'https://api.observablehq.com/@john-guerra/semantic-scholar-recommended-papers@latest.js?v=4';

console.log('Loading notebook paper recommendations');
const notebookRecommendations = new Runtime().module(defineRecommendations, (name) => {
	if (name === 'viewof columnsToShow')
		return new Inspector(document.querySelector('#observablehq-viewof-columnsToShow-ee0d7845'));
	if (name === 'viewof paperSearchTable')
		return new Inspector(document.querySelector('#observablehq-viewof-paperSearchTable-ee0d7845'));
	if (name === 'viewof CorpusId')
		return new Inspector(document.querySelector('#observablehq-viewof-CorpusId-ee0d7845'));
	if (name === 'viewof limit')
		return new Inspector(document.querySelector('#observablehq-viewof-limit-ee0d7845'));
	if (name === 'viewof method')
		return new Inspector(document.querySelector('#observablehq-viewof-method-ee0d7845'));
	if (name === 'viewof embedding')
		return new Inspector(document.querySelector('#observablehq-viewof-embedding-ee0d7845'));
	if (name === 'viewof rowOrder')
		return new Inspector(document.querySelector('#observablehq-viewof-rowOrder-ee0d7845'));
	if (name === 'viewof columnOrder')
		return new Inspector(document.querySelector('#observablehq-viewof-columnOrder-ee0d7845'));
	if (name === 'viewof selected')
		return new Inspector(document.querySelector('#observablehq-viewof-selected-ee0d7845'));
	if (name === 'recommendationsTable')
		return new Inspector(document.querySelector('#observablehq-table-ee0d7845'));
	if (name === 'viewof selectionType')
		return new Inspector(document.querySelector('#observablehq-viewof-selectionType-ee0d7845'));
	if (name === 'viewof selectionTarget')
		return new Inspector(document.querySelector('#observablehq-viewof-selectionTarget-ee0d7845'));

	return [
		'url',
		'papers',
		'similarityMatrixChart',
		'CorpusId',
		'recommendedURL',
		'recommendations',
		'tidySimilarity',
		'similarity',
		'tableFormat',
		'similarity'
	].includes(name);
});

window.addEventListener('resize', () => {
	console.log('resize', document.getElementById('mainSection')?.offsetWidth);
	notebookRecommendations.redefine('width', document.getElementById('mainSection')?.offsetWidth);
});

notebookRecommendations.redefine('width', document.getElementById('mainSection')?.offsetWidth);

export default notebookRecommendations;
