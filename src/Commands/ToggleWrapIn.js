import { lift, wrapIn } from "prosemirror-commands";
import { liftListItem, wrapInList } from "prosemirror-schema-list";
import { generalActiveCheck } from "./GeneralActiveCheck";

// Utility in place of native chainCommands, to prevent it from stopping on first truthy value
function chainTransactions(...commands) {
  return (state, dispatch) => {
    const dispatcher = (tr) => {
      state = state.apply(tr);
      dispatch(tr);
    };
    const last = commands.pop();
    const reduced = commands.reduce((result, command) => {
      return result || command(state, dispatcher);
    }, false);
    return reduced && last !== undefined && last(state, dispatch);
  };
}
// Abstraction to toggle wrappers on and off
export const toggleWrapIn = (type, attrs) => (state, dispatch) => {
  const schema = state.schema;
  const hasSpecificWrapper =
		generalActiveCheck(type, attrs)(state,dispatch);

  // handle list toggling
  if (type.name.includes("list")) {
    const oppositeListType =
      type.name === "bullet_list" ? "ordered_list" : "bullet_list";
    const isOpposite =
			generalActiveCheck(schema.nodes[oppositeListType])(state,dispatch);
    const switchListType = () =>
      chainTransactions(
        liftListItem(schema.nodes.list_item),
        wrapInList(type)
      )(state, dispatch);

    return isOpposite
      ? switchListType()
      : hasSpecificWrapper
      ? liftListItem(schema.nodes.list_item)(state, dispatch)
      : wrapInList(type)(state, dispatch);
  }

  return hasSpecificWrapper
    ? lift(state, dispatch)
    : wrapIn(type)(state, dispatch);
};
