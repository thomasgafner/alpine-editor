
export function createDefaultContentNode(config) {

	let elt = document.createElement("div");
	elt.dataset.type = 'editor';

	return elt;
}
