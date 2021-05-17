// Check if selection has an active type
export const generalActiveCheck = (type, attrs = {}) => (state) => {
  const schema = state.schema;
  const { $from, $head, to, $to, node } = state.selection;
  let hasMarkup;

  hasMarkup =
    node?.hasMarkup(type, attrs) ||
    $head.marks().some((v) => v.type.name === type.name) ||
    (to <= $from.end() && $from.parent.hasMarkup(type, attrs));

  // handle wrapins
  if (["paragraph+", "list_item+"].includes(type.spec.content)) {
    const parent = $from.node(1);
		// console.log('parent', parent);
    hasMarkup = parent?.type.name === type.name;
  }

  // check link
  // if (type.name === "link") {
  //   hasMarkup = state.doc.rangeHasMark($from.pos, $to.pos, schema.marks.link);
  // }

  return hasMarkup;
};
