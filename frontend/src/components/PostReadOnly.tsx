import { Box, Button, Code, Collapse, CSSObject, Input, Text } from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { Link as LocationLink } from "@tanstack/react-location";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { Post } from "../api/posts";
import { CitationNode } from "../citation/extension";
import { Mention } from "./extension";
import { suggestion } from "./suggestion";

const buttonStyles: CSSObject = {
  transition: "opacity 250ms ease",
  "&:hover": { opacity: 1 },
};

export const PostReadOnly = ({ post }: { post: Post }) => {
  const [opened, setOpened] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Mention.configure({
        suggestion,
      }),
      // we have to use "configure()" so that the extension doesn't share instances and share storage
      // https://github.com/ueberdosis/tiptap/issues/2694
      CitationNode.configure(),
    ],
    content: post.content,
    editable: false,
  });

  return (
    <div>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Content />

        {editor && editor.storage.citation?.getCitations().length > 0 && (
          <Box px="md" py="xs">
            <Text fw="bold"> Citations </Text>
            <Text>
              {editor.storage.citation?.getCitations().map((value: any, index: number) => {
                return (
                  <div key={index} className="ProseMirror">
                    <sup>{index + 1}</sup> {value["data-summary"]}
                  </div>
                );
              })}
            </Text>
          </Box>
        )}

        <Button.Group>
          <Button size="xs" onClick={() => setOpened((prev) => !prev)} variant="subtle" opacity={0.5} sx={buttonStyles}>
            Show HTML/JSON
          </Button>
          <Button
            size="xs"
            variant="subtle"
            opacity={0.5}
            sx={buttonStyles}
            component={LocationLink}
            to={`/posts/${post._id}`}
          >
            Edit
          </Button>
          <Button size="xs" variant="subtle" opacity={0.5} color="red" sx={buttonStyles}>
            Delete
          </Button>
        </Button.Group>

        <Collapse in={opened}>
          <Input.Wrapper label="Persisted object" m="md">
            <Code block>{JSON.stringify(post, null, 2)}</Code>
          </Input.Wrapper>

          <Input.Wrapper label="JSON representation (not persisted)" m="md">
            <Code block mah="300px">
              {JSON.stringify(editor?.getJSON(), null, 2)}
            </Code>
          </Input.Wrapper>
        </Collapse>
      </RichTextEditor>
    </div>
  );
};
