import { setBlockType, wrapIn, joinDown, joinUp, lift } from "prosemirror-commands";
import { wrapInList } from "prosemirror-schema-list";
import {insertHorizontalRule} from "../Commands/HorizontalRule";
import {toggleBlockType} from "../Commands/ToggleBlockType";
import {toggleWrapIn} from "../Commands/ToggleWrapIn";

export default function initNodes(editor) {
    editor.commandsManager.addCommand('heading', {action: toggleBlockType, activatable: true});
    editor.commandsManager.addCommand('paragraph', {action: setBlockType, activatable: true});
    editor.commandsManager.addCommand('blockquote', {action: toggleWrapIn, activatable: true});
    editor.commandsManager.addCommand('code_block', {action: setBlockType, activatable: true});

    editor.commandsManager.addCommand('bullet_list', { action: toggleWrapIn, activatable: true });
    editor.commandsManager.addCommand('ordered_list', { action: toggleWrapIn, activatable: true });
    // editor.commandsManager.addCommand('list_item', { action: wrapInList, hideable: true });

		editor.actionsManager.addAction('lift', lift);
		editor.actionsManager.addAction('horizontal_rule', insertHorizontalRule);

    // editor.actionsManager.addAction('join_up', joinUp);
    // editor.actionsManager.addAction('join_down', joinDown);

    return editor.schemaNodeSpec;
}
