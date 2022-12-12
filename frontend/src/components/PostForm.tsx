import { Button, Code, Input } from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { useNavigate } from "@tanstack/react-location";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Post as PostType, useCreatePost } from "../api/posts";
import { Mention } from "./extension";
import { suggestion } from "./suggestion";

export const PostForm = ({ post }: { post?: PostType }) => {
  const { mutate } = useCreatePost();
  const navigate = useNavigate();
  const isCreate = !post;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Mention.configure({
        suggestion,
      }),
    ],
    content: post?.content,
  });

  const handleSubmit = () => {
    if (!editor) return;

    if (isCreate) {
      mutate(
        {
          content: editor.getHTML(),
        },
        {
          onSuccess: () => {
            navigate({ to: "/posts" });
          },
        }
      );
    }
  };

  return (
    <>
      <div>
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content />

          <Button size="xs" onClick={handleSubmit} m="md">
            {isCreate ? "Create post" : "Edit post"}
          </Button>
        </RichTextEditor>
      </div>

      <Input.Wrapper label="HTML" m="md">
        <Code block>{editor?.getHTML()}</Code>
      </Input.Wrapper>
      <Input.Wrapper label="JSON" m="md">
        <Code block>{JSON.stringify(editor?.getJSON(), null, 2)}</Code>
      </Input.Wrapper>
    </>
  );
};
