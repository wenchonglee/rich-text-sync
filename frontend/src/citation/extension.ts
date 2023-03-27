import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customExtension: {
      /**
       * Comments will be added to the autocomplete.
       */
      setCitation: (citation: string) => ReturnType;
    };
  }
}

export const CitationMark = Mark.create<any>({
  name: "citation",
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      //   citation: {
      //     default: null,
      //     parseHTML: (el) => (el as HTMLSpanElement).getAttribute("data-type"),
      //     renderHTML: (attrs) => ({ "data-type": attrs.citation }),
      //   },
    };
  },

  parseHTML() {
    return [
      {
        tag: `span[data-type="citation"]`,
      },
    ];
  },

  renderHTML({ mark, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes({ "data-type": "citation" }, this.options.HTMLAttributes, HTMLAttributes),
      ["span", 0],
      [
        "sup",
        {
          class: "test",
          style: "padding-left: 2px",
        },
        `[${this.storage.citations.length}]`,
      ],
    ];
  },

  addStorage() {
    return {
      citations: [],
    };
  },

  addCommands() {
    return {
      setCitation:
        (citation: string) =>
        ({ commands }) => {
          this.storage.citations.push(citation);
          return commands.setMark(this.name, { citation });
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
