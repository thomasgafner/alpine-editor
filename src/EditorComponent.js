import { DOMParser, Schema } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { baseKeymap, chainCommands, exitCode } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { undo, redo, history } from "prosemirror-history";
import {wrapInList, splitListItem} from "prosemirror-schema-list"
import initMenuPlugin from "./Menu/MenuPlugin";
import {createDefaultMenuNode} from "./Menu/DefaultMenu";
import {createDefaultContentNode} from "./Menu/DefaultContent";
import ActionsManager from "./Managers/ActionsManager";
import CommandsManager from "./Managers/CommandsManager";
import initNodes from "./Nodes/Nodes";
import debounce from "lodash-es/debounce";
import EditorConfig from "./EditorConfig";
import generateBaseSchema from "./Schema/Default";
import {insertHorizontalRule} from "./Commands/HorizontalRule";

export default class EditorComponent extends HTMLElement {
		constructor() {
				super();

				this.state = null;
				this.view = null;
				this.editorNode = null;
				this.menuNode = null;
				this.actionsManager = new ActionsManager();
				this.commandsManager = new CommandsManager();

				this.debouncedEventHandler = debounce(this.dispatchCustomInputEvent.bind(this), 250);
		}

		connectedCallback() {
				setTimeout(() => {
						this.init();
				}, 10);
		}

		init() {
			this.initConfig();
			this.initRootNode();
			this.initMenuNode();
			this.initSchema();
			this.initTools();
			this.generateEditorState();
			this.createEditorView();
		}

		initRootNode() {
				let el = this.querySelector('div[data-type="editor"]');
				if (!el) {
					el = createDefaultContentNode(this.config);
					this.appendChild(el);
				}
				this.editorNode = el;
				if (this.value) {
					// Take value from this component if used with alpinejs.
					this.editorNode.innerHTML = this.value;
				}
		}

		initMenuNode() {
			let menu = this.querySelector('div[data-type="menu"]');
			if (!menu) {
				menu = createDefaultMenuNode(this.config);
				// insert before editor (by default)
				const en = this.editorNode;
				en.parentNode.insertBefore(menu, en);
			}
			this.menuNode = menu
		}

		initConfig() {
				this.config = new EditorConfig(this);
				this.config.init();
		}

		initSchema() {
				this.schema = generateBaseSchema(this);
		}

		generateEditorState() {

				this.state = EditorState.create({
						doc: DOMParser.fromSchema(this.schema).parse(this.editorNode),
						plugins: this.getPluginsList(this.menuNode),
				});

				this.editorNode.innerText = "";
		}

		createEditorView() {
				let attributes = {};

				if (this.dataset.editorClasses) {
						attributes.class = this.dataset.editorClasses;
				}

				let view = this.view = new EditorView(this.editorNode, {
						state: this.state,
						// dispatchTransaction(transaction) {
						//   // Update editor state
						//   const previousState = view.state.doc;
						//   const newState = view.state.apply(transaction);
						//   view.updateState(newState);
						//
						//   // Save content
						//   if (!previousState.eq(view.state.doc)) {
						// 		console.log('save')
						//   }
						// },
						// handleDOMEvents: {},
						attributes
				});

				this.view.dom.addEventListener('input', this.handleInputEvent.bind(this));
		}

		handleInputEvent(event) {
				event.preventDefault();
				event.stopPropagation();

				this.debouncedEventHandler();
		}

		dispatchCustomInputEvent() {
				let inputEvent = new CustomEvent('input', {
						detail: this.editorNode.firstChild.innerHTML,
						bubbles: true
				});

				this.editorNode.dispatchEvent(inputEvent);
		}

		initTools() {
				initNodes(this);
		}

		getPluginsList() {
				return [
						history(),
						keymap({
							"Enter": splitListItem(this.schema.nodes.list_item),
							"Shift-Enter": chainCommands(exitCode, (state, dispatch) => {
							  dispatch(state.tr.replaceSelectionWith(
									this.schema.nodes.hard_break.create()
								).scrollIntoView());
							  return true
							}),
							"Mod--": insertHorizontalRule,
							"Mod-z": undo,
							"Mod-Shift-z": redo,
							"Mod-y": redo
						}),
						keymap(baseKeymap),
						initMenuPlugin(this),
				];
		}
}
