import { Box, Button, Code, Input, Text, TextInput } from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { IconBlockquote } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-location";
import { BubbleMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Post as PostType, useCreatePost } from "../api/posts";
import { CitationNode } from "../citation/extension";
import { DocumentWithCitation, Root } from "../citation/root";
import { Mention } from "./extension";
import { suggestion } from "./suggestion";

export const PostForm = ({ post }: { post?: PostType }) => {
  const { mutate } = useCreatePost();
  const navigate = useNavigate();
  const isCreate = !post;

  const editor = useEditor({
    extensions: [
      StarterKit,
      // Root,
      // DocumentWithCitation,
      // StarterKit.configure({
      //   document: false,
      // }),
      Link,
      Mention.configure({
        suggestion,
      }),
      CitationNode,
    ],
    content:
      post?.content ?? // `<div[data-type="root"]><p>test</p></div>`, //`<div data-type="root"></div>`,
      // `<span data-type="citation"
      //  data-id="1"
      //  data-summary="Cushing, P.E. (2008). "Spiders (Arachnida: Araneae)". In Capinera, J.L. (ed.). Encyclopedia of Entomology. Springer. p. 3496">
      //  test asda assad s
      //  </span> testabcdefg`,
      `<p><b>Spiders</b> (order <b>Araneae</b>) are air-breathing arthropods that have eight legs, chelicerae <span data-type="citation"
    data-id="1"
    data-summary="Cushing, P.E. (2008). "Spiders (Arachnida: Araneae)". In Capinera, J.L. (ed.). Encyclopedia of Entomology. Springer. p. 3496">
    with fangs generally able to inject venom,
    </span> and <span data-type="citation"
    data-id="2"
    data-summary="Selden, P.A. & Shear, W.A. (December 2008). "Fossil evidence for the origin of spider spinnerets">
    spinnerets that extrude silk.
    </span> </p>

    <span data-type="citation"
    data-id="3"
    data-summary="Sebastin, P.A.; Peter, K.V., eds. (2009). Spiders of India. Universities Press/Orient Blackswan">
    They are the largest order of arachnids and rank seventh in total species diversity among all orders of organisms.
    </span>

    Spiders are found worldwide on every continent except for Antarctica, and have become established in nearly every land habitat.

    <span data-type="citation"
    data-id="4"
    data-summary="World Spider Catalog">
    As of August 2022, 50,356 spider species in 132 families have been recorded by taxonomists.
    </span>
     However, there has been debate among scientists about how families should be classified, with over 20 different classifications proposed since 1900.`,
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
      {editor && (
        <IconBlockquote
          onClick={() =>
            editor
              .chain()
              .focus()
              .setRootCitation({
                "data-summary": "test",
                "data-id": "123213",
              })
              .run()
          }
        />
      )}

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
                    ?.getCitations()
                    .map((value: any, index: number) => {
                      return (
                        <div key={index} className="ProseMirror">
                          <sup>{index + 1}</sup> {value["data-summary"]}
                        </div>
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
