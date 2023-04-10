import { mergeAttributes, Node } from "@tiptap/core";
import { citationAddAttributes } from "./extension";

// https://discuss.prosemirror.net/t/root-custom-node-as-wrapper-around-blocks/3418
export const DocumentWithCitation = Node.create({
  name: "doc",
  topNode: true,
  content: "root+",
});

export const Root = Node.create({
  name: "root",
  content: "block*",
  defining: true,
  group: "block",

  addAttributes() {
    return citationAddAttributes;
  },

  parseHTML() {
    return [
      {
        tag: `div[data-node-type="root"]`,
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        { "data-node-type": "root" },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },

  addCommands() {
    return {
      setRootCitation:
        (citation) =>
        ({ commands }) => {
          // this.storage.citations.push({ ...citation });
          return commands.setNode(this.name, { ...citation });
        },
    };
  },
});

// export const CustomExtension = Extension.create({
//   name: "test",

//   addProseMirrorPlugins() {
//     return [
//       new Plugin({
//         key: new PluginKey("some test"),
//         props: {
//           attributes: (a) => {
//             console.log(a);
//             return {
//               ahhh: "test",
//             };
//           },
//         },
//       }),
//     ];
//   },
// });
