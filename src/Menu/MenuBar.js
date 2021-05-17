import MenuItemMark from "./MenuItemMark";
import MenuItemHyperlink from "./MenuItemHyperlink";
import MenuItemNode from "./MenuItemNode";
import MenuItemAction from "./MenuItemAction";
import {positionToHead} from "./ToSelectionPositioning";

const ACCEPTED_DATA_ATTRIBUTES = [
    'level',
];

const OPTIONS_DATA_ATTRIBUTES = [
    'command',
    'activeClass',
];

export default class MenuBar
{
    constructor(editor, editorView) {
        this.editor = editor;
        this.editorView = editorView;
        this.actionsManager = editor.actionsManager;
        this.commandsManager = editor.commandsManager;
        this.menuItems = [];

        this.initMenuNode(editor.menuNode);
    }

    initMenuNode(menuNode) {
        menuNode.querySelectorAll("[data-command]").forEach(child => {
            let menuItem;
            let attrs = this.extractNodeAttributes(child);
            let options = this.extractNodeOptionsFromData(child);

            if (this.schema.marks[`${options.command}`]) {
							if (options.command != 'link') {
								menuItem = new MenuItemMark(child, this.editorView, options);
							} else {
								menuItem = new MenuItemHyperlink(child, this.editorView, menuNode, options);
							}
            } else if (this.commandsManager.hasCommand(options.command)) {
                let command = this.commandsManager.getCommand(options.command);
                options.run = command.action;
                options.hideable = command.hideable;
                options.activatable = command.activatable;

                menuItem = new MenuItemNode(child, this.editorView, options, attrs);
            } else if (this.actionsManager.hasAction(options.command)) {
                options.run = this.actionsManager.getAction(options.command);

                menuItem = new MenuItemAction(child, this.editorView, options, attrs);
            } else {
                throw new Error(`Could not find Mark, Command or Action for: ${options.command}`);
            }

            menuItem.update();

            this.menuItems.push(
                menuItem
            );
        });

				const en = this.editor;
				this.editorView.dom.addEventListener('blur', function(ev) {
					en.classList.remove('selection-expanded');
				});

    }

    extractNodeAttributes(node) {
        let attrs = {};

        ACCEPTED_DATA_ATTRIBUTES.forEach(attr => {
            if (! node.dataset.hasOwnProperty(attr)) {
                return;
            }

            attrs[attr] = node.dataset[attr];
        });

        return attrs;
    }

    extractNodeOptionsFromData(node) {
        let options = {};

        OPTIONS_DATA_ATTRIBUTES.forEach(attr => {
            if (! node.dataset.hasOwnProperty(attr)) {
                return;
            }

            options[attr] = node.dataset[attr];
        });

        return options;
    }

    get schema() {
        return this.editorView.state.schema;
    }

		updateMenuPosition() {
			const menu = this.editor.menuNode;
			const style = window.getComputedStyle(menu);
			const positionValue = style.getPropertyValue('position');
			if (positionValue == 'absolute') {
				positionToHead(menu, this.editorView);
      }
		}

    update() {
        this.menuItems.forEach(menuItem => menuItem.update());
				this.updateMenuPosition();

				const {from, to} = this.editorView.state.selection;
				if (from < to) {
					this.editor.classList.add('selection-expanded');
				} else {
					this.editor.classList.remove('selection-expanded');
				}
    }

    destroy() {
        this.menuItems.forEach(menuItem => menuItem.destroy());
    }
}
