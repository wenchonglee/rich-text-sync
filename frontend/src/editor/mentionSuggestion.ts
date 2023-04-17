import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import { Axios } from "../api/axios";
import { MentionListComponent } from "./MentionListComponent";

export const suggestion: Omit<SuggestionOptions, "editor"> = {
  char: "@",
  items: async ({ query }) => {
    const response = await Axios.get<{ username: string }[]>(
      `/users?username=${query}`
    );
    return response.data;
  },

  render: () => {
    let reactRenderer: ReactRenderer | undefined;
    let popup: any;

    return {
      onStart: (props) => {
        reactRenderer = new ReactRenderer(MentionListComponent, {
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
