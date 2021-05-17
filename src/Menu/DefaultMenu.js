import {createActionGroup, createAction} from "./DefaultElements";

export function createDefaultMenuNode(config) {

	let elt = document.createElement("div");
	elt.dataset.type = 'menu';
	let grp;

	grp = elt.appendChild(createActionGroup('markers'));
	grp.appendChild(createAction('strong','Strong'));
	grp.appendChild(createAction('em','Emphasis'));
	// grp.appendChild(createAction('code','Code'));
	grp.appendChild(createAction('link','Link'));

	grp = elt.appendChild(createActionGroup('blocks'));
	if (!config.defaultToggleBlock) {
		grp.appendChild(createAction('paragraph','Paragraph'));
	}
	grp.appendChild(createAction('heading','Big heading', 2));
	grp.appendChild(createAction('heading','Small heading', 3));

	grp = elt.appendChild(createActionGroup('lists'));
	grp.appendChild(createAction('bullet_list','Bullet list'));
	grp.appendChild(createAction('ordered_list','Ordered list'));
	if (config.defaultToggleBlock) {
		grp.appendChild(createAction('blockquote','Blockquote'));
	}
	if (!config.defaultToggleBlock) {
		grp.appendChild(createAction('lift','Lift'));
	}

	grp = elt.appendChild(createActionGroup('specials'));
	// grp.appendChild(createAction('code_block','Code block'));
	if (!config.defaultToggleBlock) {
		grp.appendChild(createAction('blockquote','Blockquote'));
	}
	grp.appendChild(createAction('horizontal_rule','Horizontal rule'));

	return elt;
}
