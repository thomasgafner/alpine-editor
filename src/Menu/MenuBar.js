import MenuItemMark from "./MenuItemMark";
import MenuItemHyperlink from "./MenuItemHyperlink";
import MenuItemNode from "./MenuItemNode";
import MenuItemAction from "./MenuItemAction";

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
				const { anchor, head, from, to } = this.editorView.state.selection;
	      const headCoord = this.editorView.coordsAtPos(head);
				// console.log('coords', headCoord)
        // let box = menu.offsetParent.getBoundingClientRect();
				let box = menu.getBoundingClientRect();
				// console.log('menu box', box, box.height)
				let cy = Math.round(headCoord.top);
				cy -= Math.round(0.5 * box.height);
				let cx = Math.round(headCoord.left - 0.5 * box.width);
				// TODO handle border situations
				// console.log('x, y', cx, cy)
				menu.style.left = `${cx}px`;
				menu.style.top = `${cy}px`;
      }
		}

    update() {
        this.menuItems.forEach(menuItem => menuItem.update());
				this.updateMenuPosition();
    }

    destroy() {
        this.menuItems.forEach(menuItem => menuItem.destroy());
    }
}
