import { toggleMark } from "prosemirror-commands"
import MenuItemMark from "./MenuItemMark";
import {createDefaultLinkEditNode} from "./DefaultLinkEdit";
import {positionToHead} from "./ToSelectionPositioning";

// Append "https" if doesnt exist
const appendUrlPrefix = function(url) {
	return url.startsWith("https")
		? url
		: url.startsWith("mailto:")
		? url
		: `https://${url}`;
}

const selfClosingListener = (element, eventType, callback) => {
	function handler(ev) {
		callback(ev);
		element.removeEventListener(eventType, handler);
	}
	element.addEventListener(eventType, handler);
};


export default class MenuItemHyperlink extends MenuItemMark {
	constructor(itemNode, editorView, menuNode, options = {}) {
		super(itemNode, editorView, options);

		this.menuNode = menuNode;
		this.originalMenuDisplayValue =
			window.getComputedStyle(menuNode).getPropertyValue?.('display');

		// itemNode.parent.querySelector
		let linkEdit = itemNode.querySelector('[data-type="link-edit"]');
		if (!linkEdit) {
			linkEdit = createDefaultLinkEditNode();
			linkEdit.style.position = 'absolute';
			// insert at the end of the editor (for it overlaps all by default)
			menuNode.parentNode.appendChild(linkEdit);
		}
		this.linkEditNode = linkEdit
		this.originalLinkEditDisplayValue =
			window.getComputedStyle(linkEdit).getPropertyValue?.('display');
		this.linkEditNode.style.display = 'none';

		this.run = this.menuItemAction();
	}

	resetInput(input) {
		this.linkEditNode.style.display = 'none';
		this.menuNode.style.display = this.originalMenuDisplayValue;
		input.value = "";
		this.editorView.focus();
	}

	// Build <a /> element and append it to editor
	createAnchor(linkProps, schema) {
		const node = schema.text(linkProps.title, [
			schema.marks.link.create({
				...linkProps,
				href: appendUrlPrefix(linkProps.href),
			}),
		]);
		return this.editorView.dispatch(
			this.editorView.state.tr.replaceSelectionWith(node, false)
		);
	}

	handleLinkInputSubmit(schema, selectedText, input) {
		return (ev) => {
			if (ev.key === "Enter") {
				const { value } = ev.target;
				const url = appendUrlPrefix(value);
				this.createAnchor({ href: url, title: selectedText }, schema);
				this.resetInput(input);
			} else if (ev.key === "Escape") {
				this.resetInput(input);
			}
		}
	}

	menuItemAction() {
		return (state, dispatch) => {
			const schema = state.schema;
			const {from, to} = state.selection;

			// remove link if it already exists
			if (this.isActive()) {
				return toggleMark(this.type)(state, dispatch);
			}

			const input = this.linkEditNode.querySelector('input');

			const selectionFragment = state.doc.cut(from, to);
			const selectedText = selectionFragment.textContent;

			// automatically replace with href if plain text has a link format
			const urlRegex = new RegExp(
				'(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})','g'
			);
			if (
				selectedText?.match(urlRegex)?.length === 1 &&
				selectedText?.split(' ').length === 1
			) {
				return this.createAnchor({ href: selectedText, title: selectedText },schema);
			}

			// set center of link edit to head
			positionToHead(this.linkEditNode, this.editorView);

			// hide menu and show link edit
			this.menuNode.style.display = 'none';
			this.linkEditNode.style.display = this.originalLinkEditDisplayValue;

			const submit = this.handleLinkInputSubmit(schema, selectedText, input);
			input.addEventListener('keyup', submit);

			const closeElementCallback = () => {
				this.resetInput(input);
				input.removeEventListener('keyup', submit);
			};

			selfClosingListener(input, 'blur', closeElementCallback);

			input.focus();
		};
	}

	exec() {
		this.run(this.state, this.editorView.dispatch);
	}
}
