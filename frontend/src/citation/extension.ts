import { Mark, mergeAttributes, Node } from "@tiptap/core";

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
    };
  }
}

export const CitationMark = Node.create<
  any,
  {
    getCitations(): CitationStore[];
    // citations: CitationStore[]
  }
>({
  name: "citation",
  content: "inline*",
  group: "block",

  // addOptions() {
  //   return {
  //     HTMLAttributes: {},
  //   };
  // },

  addAttributes() {
    return {
      "data-type": {
        default: null,
        // return how to extract the attribute
        parseHTML: (el) => (el as HTMLSpanElement).getAttribute("data-type"),
        // decide attributes to add to rendered HTML
        renderHTML: (attrs) => {
          return { "data-type": "citation" };
        },
      },
      "data-id": {
        default: null,
        parseHTML: (el) => el.getAttribute("data-id"),
      },
      "data-summary": {
        default: null,
        parseHTML: (el) => el.getAttribute("data-summary"),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `div[data-type="citation"]`,
        // getAttrs: (node) => {
        //   if (typeof node !== "string") {
        //     const type = node.getAttribute("data-type");
        //     const summary = node.getAttribute("data-summary");
        //     const id = node.getAttribute("data-id");

        //     this.storage.citations.push({
        //       "data-summary": summary,
        //       "data-id": id,
        //     });
        //     // console.log(node.getAttribute("data-type"));
        //   }

        //   return null;
        // },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    // const id = node.attrs["data-id"];
    // const index = this.storage.citations.findIndex(
    //   (item: { id: any }) => item.id === id
    // );

    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
      // mergeAttributes(
      //   { "data-type": "citation" },
      //   this.options.HTMLAttributes,
      //   HTMLAttributes
      // ),
      // ["span", 0],
      // [
      //   "sup",
      //   {
      //     style: "padding-left: 2px",
      //   },
      //   `[${index + 1}]`,
      // ],
    ];
  },

  // onTransaction(props) {
  //   console.log(props.transaction.doc.content);
  // },

  addNodeView() {
    return ({
      editor,
      node,
      getPos,
      HTMLAttributes,
      decorations,
      extension,
    }) => {
      const dom = document.createElement("div");
      const container = document.createElement("span");
      // container.innerHTML = "-";

      const citationMark = document.createElement("sup");
      const id = node.attrs["data-id"];
      const index = this.storage
        .getCitations()
        .findIndex((item: { "data-id": any }) => item["data-id"] === id);
      citationMark.innerHTML = `[${index + 1}]`;
      citationMark.contentEditable = "false";

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
      doc.forEach((node) => {
        if (node.type === this.type) {
          citations.push(node.attrs as CitationStore);
        }
      });

      return citations;
    };
  },

  addStorage() {
    return {
      // citations: [],
      getCitations: () => [],
    };
  },

  addCommands() {
    return {
      setCitation:
        (citation) =>
        ({ commands }) => {
          // this.storage.citations.push({ ...citation });
          return commands.setNode(this.name, { ...citation });
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
