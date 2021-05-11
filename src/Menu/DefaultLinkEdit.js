import {createActionGroup, createAction} from "./DefaultElements";

export function createDefaultLinkEditNode() {

	let elt = document.createElement("div");
	elt.dataset.type = 'link-edit';

	let ipt = document.createElement("input");
	ipt.type = 'text';
	ipt.name = 'link';
	ipt.placeholder = '   Enter a link ..';
	elt.appendChild(ipt);

	let grp;
	grp = elt.appendChild(createActionGroup('operations'));
	grp.appendChild(createAction('clear','Clear'));

	return elt;
}
