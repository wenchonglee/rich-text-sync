import { Button, Code, Collapse, CSSObject, Input } from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { Link as LocationLink } from "@tanstack/react-location";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { Post } from "../api/posts";
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
        // renderLabel: ({ node, options }) => (
        //   <HoverCard>
        //     <HoverCard.Target>
        //       <span>
        //         {options.suggestion.char}
        //         {node.attrs.label ?? node.attrs.id}
        //       </span>
        //     </HoverCard.Target>
        //     <HoverCard.Dropdown>xd</HoverCard.Dropdown>
        //   </HoverCard>
        // ),
      }),
    ],
    content: post.content,
    editable: false,
  });

  return (
    <div>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Content />

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
