
export function insertAtHead(editorView, type) {
	return (_, dispatch) => {
		const schema = editorView.state.schema;
		const { head } = editorView.state.selection;
		const tr = editorView.state.tr;
		const node = schema.nodes[type].create();
		tr.insert(head, node);
		return dispatch(tr);
	};
}
