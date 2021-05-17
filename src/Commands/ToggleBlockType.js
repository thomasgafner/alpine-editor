import { setBlockType } from "prosemirror-commands";
import { generalActiveCheck } from "./GeneralActiveCheck";

// Abstraction to toggle supported block types on and off
export const toggleBlockType = (type, attrs = {}) => (state, dispatch) => {
	const schema = state.schema;
  // const schema = state.doc.type.schema;
  return generalActiveCheck(type, attrs)(state, dispatch)
    ? setBlockType(schema.nodes.paragraph)(state, dispatch)
    : setBlockType(type, attrs)(state, dispatch);
};
