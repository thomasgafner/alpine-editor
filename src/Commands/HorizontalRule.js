
export function insertHorizontalRule(state, dispatch) {
	if (dispatch) {
		dispatch(state.tr.replaceSelectionWith(
			state.doc.type.schema.nodes.horizontal_rule.create()
		).scrollIntoView());
	}
	return true
}
