import { Box, Button, Input, Text, TextInput } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { RichTextEditor } from "@mantine/tiptap";
import { IconBlockquote } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-location";
import { BubbleMenu, useEditor } from "@tiptap/react";
import parser from "prettier/parser-html";
import { format } from "prettier/standalone";
import { Post as PostType, useCreatePost } from "../api/posts";
import { extensions } from "../editor/extensions";

export const PostForm = ({ post }: { post?: PostType }) => {
  const { mutate } = useCreatePost();
  const navigate = useNavigate();
  const isCreate = !post;

  const editor = useEditor({
    extensions,
    content:
      post?.content ?? // `<div[data-type="root"]><p>test</p></div>`, //`<div data-type="root"></div>`,
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
      <div>
        <RichTextEditor editor={editor}>
          {editor && (
            <BubbleMenu editor={editor}>
              <TextInput
                icon={<IconBlockquote />}
                placeholder="Enter a citation"
                onKeyDown={(e) => {
                  if (e.code === "Enter")
                    editor
                      .chain()
                      .focus()
                      .setCitation({
                        "data-summary": e.currentTarget.value,
                        "data-id": "123213",
                      })
                      .run();
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
            {editor && (
              <>
                <Text fw="bold"> Citations </Text>
                <Text>
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
      </div>

      <Input.Wrapper label="HTML" m="md">
        <Prism language="markup">
          {format(editor?.getHTML() ?? "", {
            parser: "html",
            plugins: [parser],
            printWidth: 120,
          })}
        </Prism>
      </Input.Wrapper>

      <Input.Wrapper label="JSON" m="md">
        <Prism language="json">
          {JSON.stringify(editor?.getJSON() ?? {}, null, 2)}
        </Prism>
      </Input.Wrapper>
    </>
  );
};
