import StarterKit from "@tiptap/starter-kit";
import { Link } from "@mantine/tiptap";
import { MentionNode } from "./mentionNode";
import { suggestion } from "./mentionSuggestion";
import { CitationNode } from "./citationNode";

export const extensions = [
  // Root,
  // DocumentWithCitation,
  // StarterKit.configure({
  //   document: false,
  // }),
  StarterKit,
  Link,
  MentionNode.configure({
    suggestion,
  }),
  // we have to use "configure()" so that the extension doesn't share instances and share storage
  // https://github.com/ueberdosis/tiptap/issues/2694
  CitationNode.configure(),
];
