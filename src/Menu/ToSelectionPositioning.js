
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

	// check and adjust position to be within viewport
	box = elt.getBoundingClientRect();
	const ih = window.innerHeight || document.documentElement.clientHeight;
	if (box.bottom > ih) {
		// Bottom is out of viewport
		elt.style.top = `${cy - (box.bottom - ih)}px`;
	}
	const iw = window.innerWidth || document.documentElement.clientWidth;
	if (box.right > iw) {
		// Right side is out of viewport
		elt.style.left = `${cx - (box.right - iw)}px`;
	}
	if (box.top < 0) {
		// Top is out of viewport
		elt.style.top = '0px';
	}
	if (box.left < 0) {
		// Left side is out of viewoprt
		elt.style.left = '0px';
	}

}
