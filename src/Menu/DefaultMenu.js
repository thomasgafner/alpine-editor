
function createActionGroup(name) {
	let elt = document.createElement("span");
	elt.classList.add('action-group');
	elt.classList.add(`${name}-actions`);
	return elt;
}

function createAction(name, label, level = false) {
	let elt = document.createElement("a");
	elt.classList.add('operation-action');
	elt.classList.add(`${name.replace('_', '-')}${(level)?`-${level}`:''}-action`);
	elt.dataset.activeClass = 'active-state';
	elt.dataset.command = name;
	if (level) elt.dataset.level = level;
	elt.href = '#';
	elt.innerHTML = label;
	// TODO prevent follow or alike
	return elt;
}

export function createDefaultMenuNode() {

	let elt = document.createElement("div");
	elt.dataset.type = 'menu';
	let grp;

	grp = elt.appendChild(createActionGroup('markers'));
	grp.appendChild(createAction('strong','Strong'));
	grp.appendChild(createAction('em','Emphasis'));
	// grp.appendChild(createAction('code','Code'));
	// TODO add anchor here

	grp = elt.appendChild(createActionGroup('lists'));
	grp.appendChild(createAction('ordered_list','Ordered list'));
	grp.appendChild(createAction('bullet_list','Bullet list'));
	// grp.appendChild(createAction('lift','Lift'));

	grp = elt.appendChild(createActionGroup('blocks'));
	grp.appendChild(createAction('paragraph','Paragraph'));
	grp.appendChild(createAction('heading','Big heading', 2));
	grp.appendChild(createAction('heading','Small heading', 3));

	grp = elt.appendChild(createActionGroup('specials'));
	// grp.appendChild(createAction('blockquote','Blockquote'));
	grp.appendChild(createAction('code_block','Code block'));
	// TODO grp.appendChild(createAction('horizontal_rule','Horizontal rule'));

	return elt;
}
