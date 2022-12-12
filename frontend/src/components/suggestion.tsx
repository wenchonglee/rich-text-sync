import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
// import {type Tippy} from "tippy.js";

import { Card, Stack, UnstyledButton } from "@mantine/core";
import { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Axios } from "../api/axios";

export const MentionList = forwardRef((props: SuggestionProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item._id, label: item.username });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <Card withBorder>
      <Stack spacing="xs">
        {props.items.length ? (
          props.items.map((item, index) => (
            <UnstyledButton
              key={index}
              p="xs"
              onClick={() => selectItem(index)}
              bg={index === selectedIndex ? "dark.4" : undefined}
            >
              {item.username}
            </UnstyledButton>
          ))
        ) : (
          <div className="item">No result</div>
        )}
      </Stack>
    </Card>
  );
});

export const suggestion: Omit<SuggestionOptions, "editor"> = {
  char: "@",
  items: async ({ query }) => {
    const response = await Axios.get<{ username: string }[]>(`/users?username=${query}`);
    return response.data;
  },

  render: () => {
    let reactRenderer: ReactRenderer | undefined;
    let popup: any;

    return {
      onStart: (props) => {
        reactRenderer = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        //@ts-ignore
        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props) {
        reactRenderer?.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        //@ts-ignore
        return reactRenderer?.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        reactRenderer?.destroy();
      },
    };
  },
};
