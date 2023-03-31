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
    content:
      post?.content ??
      `<div 
      data-type="citation"
      data-id="123"
      data-summary="John doe's residential address: Sesame street 123"
      data-user-id="6396f18b6a3a195c2e4d772b"
      record-type="address">
        test
      </div>
      <div 
      data-type="citation"
      data-id="432"
      data-summary="Test address"
      data-user-id="6396f18b6a3a195c2e4d772b"
      record-type="address">
        test2
      </div>
      <p>Abcdefg</p>`,
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
              <IconBlockquote
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setCitation({
                      "data-summary": "test",
                      "data-id": "123213",
                    })
                    .run()
                }
              />
              {/* <TextInput
                icon={<IconBlockquote />}
                placeholder="citation"
                onKeyDown={(e) => {
                  if (e.code === "Enter") editor.chain().focus().setCitation(e.currentTarget.value).run();
                }}
              /> */}
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
            {editor && (
              <>
                <Text fw="bold"> Citations </Text>
                <Text>
                  {/* {console.log(editor.storage.citation.citations)} */}
                  {/* {editor.storage.citation.citations.map( */}
                  {editor.storage.citation
                    .getCitations()
                    .map((value: any, index: number) => {
                      return (
                        <p key={index}>
                          {index + 1}. {value["data-summary"]}
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

        <Button
          size="xs"
          onClick={() => console.log(editor?.storage.citation.getCitations())}
          m="md"
        >
          Print citations
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
