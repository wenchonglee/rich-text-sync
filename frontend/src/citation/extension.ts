import { Attributes, mergeAttributes, Node } from "@tiptap/core";

type CitationStore = {
  "data-summary": string | null;
  "data-id": string | null;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customExtension: {
      /**
       * Comments will be added to the autocomplete.
       */
      setCitation: (citation: CitationStore) => ReturnType;
      setRootCitation: (citation: CitationStore) => ReturnType;
    };
  }
}

export const citationAddAttributes: Attributes = {
  "data-type": {
    default: null,
    // return how to extract the attribute
    parseHTML: (el) => (el as HTMLSpanElement).getAttribute("data-type"),
    // decide attributes to add to rendered HTML
    renderHTML: (attrs) => {
      return { "data-type": "citation" };
    },
    keepOnSplit: false,
  },
  "data-id": {
    default: null,
    parseHTML: (el) => el.getAttribute("data-id"),
    keepOnSplit: false,
  },
  "data-summary": {
    default: null,
    parseHTML: (el) => el.getAttribute("data-summary"),
    keepOnSplit: false,
  },
};

export const CitationNode = Node.create<
  any,
  {
    getCitations(): CitationStore[];
  }
>({
  name: "citation",

  // content: "inline*",
  // group: "block",

  // group: "inline",
  // inline: true,
  // selectable: false,
  // atom: true,

  group: "inline",
  inline: true,
  content: "text*",

  addAttributes() {
    return citationAddAttributes;
  },

  parseHTML() {
    return [{ tag: `span[data-type="citation"]` }];
  },

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("span");
      for (const key of Object.keys(node.attrs)) {
        dom.setAttribute(key, node.attrs[key]);
      }
      const container = document.createElement("span");
      const citationMark = document.createElement("sup");

      const id = node.attrs["data-id"];
      const index = this.storage.getCitations().findIndex((item: { "data-id": any }) => item["data-id"] === id);

      // citationMark.innerHTML = `[${index + 1}]`;
      citationMark.innerHTML = `${index + 1}`;
      citationMark.contentEditable = "false";
      citationMark.setAttribute("title", node.attrs["data-summary"]);

      dom.append(container, citationMark);

      return {
        dom,
        contentDOM: container,
      };
    };
  },

  onBeforeCreate() {
    // we have to do this because editor is not in scope for `addStorage()`
    this.storage.getCitations = () => {
      const doc = this.editor.state.doc;
      const citations: CitationStore[] = [];

      doc.descendants((node) => {
        if (node.type === this.type) {
          citations.push(node.attrs as CitationStore);
        }

        if (node.type.name == "root") {
          if (node.attrs["data-type"] === "citation") {
            citations.push(node.attrs as CitationStore);
          }
        }
      });

      return citations;
    };
  },

  addStorage() {
    return {
      getCitations: () => [],
    };
  },

  addCommands() {
    return {
      setCitation:
        (citation) =>
        ({ commands, editor, state, tr, view }) => {
          const { from, to } = view.state.selection;
          const text = state.doc.textBetween(from, to, "");
          const textNode = editor.schema.text(text);
          const citationNode = editor.schema.nodes.citation
            .create(
              {
                ...citation,
                "data-type": "citation",
              },
              textNode
            )
            .toJSON();

          return commands.insertContent(citationNode);

          // this.storage.citations.push({ ...citation });
          // return commands.setNode(this.name, { ...citation });
        },
      //   toggleCitation:
      //     () =>
      //     ({ commands }) => {
      //       return commands.toggleMark(this.name);
      //     },
      //   unsetCitation:
      //     () =>
      //     ({ commands }) => {
      //       return commands.unsetMark(this.name);
      //     },
    };
  },
});
