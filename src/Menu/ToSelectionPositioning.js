
export function positionToHead(elt, editorView) {
	const { anchor, head, from, to } = editorView.state.selection;
	const headCoord = editorView.coordsAtPos(head);
	// console.log('coords', headCoord)
	// let box = elt.offsetParent.getBoundingClientRect();
	let box = elt.getBoundingClientRect();
	// console.log('elt box', box, box.height)
	let cy = Math.round(headCoord.top);
	cy -= Math.round(0.5 * box.height);
	let cx = Math.round(headCoord.left - 0.5 * box.width);
	// TODO handle border situations
	// console.log('x, y', cx, cy)
	elt.style.left = `${cx}px`;
	elt.style.top = `${cy}px`;
}
