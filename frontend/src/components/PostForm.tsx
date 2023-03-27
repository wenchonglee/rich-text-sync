import { Box, Button, Code, Input, Text, TextInput } from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { IconBlockquote } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-location";
import { BubbleMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Post as PostType, useCreatePost } from "../api/posts";
import { CitationMark } from "../citation/extension";
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
      CitationMark,
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
          {editor && (
            <BubbleMenu editor={editor}>
              <TextInput
                icon={<IconBlockquote />}
                placeholder="citation"
                onKeyDown={(e) => {
                  if (e.code === "Enter") editor.chain().focus().setCitation(e.currentTarget.value).run();
                }}
              />
            </BubbleMenu>
          )}

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

          <Box px="md" py="xs">
            {editor && editor.storage.citation.citations.length > 0 && (
              <>
                <Text fw="bold"> Citations </Text>
                <Text>
                  {editor.storage.citation.citations.map((value: string, index: number) => {
                    return (
                      <p>
                        {index + 1}. {value}
                      </p>
                    );
                  })}
                </Text>
              </>
            )}
          </Box>
        </RichTextEditor>
        <Button size="xs" onClick={handleSubmit} m="md">
          {isCreate ? "Create post" : "Edit post"}
        </Button>
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
