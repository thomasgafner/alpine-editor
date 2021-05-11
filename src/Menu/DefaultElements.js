
export function createActionGroup(name) {
	let elt = document.createElement("span");
	elt.classList.add('action-group');
	elt.classList.add(`${name}-actions`);
	return elt;
}

export function createAction(name, label, level = false) {
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
