import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
// import {type Tippy} from "tippy.js";

import { Card, Stack, UnstyledButton } from "@mantine/core";
import { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Axios } from "../api/axios";

export const MentionListComponent = forwardRef(
  (props: SuggestionProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];

      if (item) {
        props.command({ id: item.id, label: item.username });
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length
      );
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
  }
);
