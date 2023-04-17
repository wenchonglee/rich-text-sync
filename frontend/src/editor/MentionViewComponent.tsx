import { Anchor, Avatar, Group, HoverCard, Text } from "@mantine/core";
import { NodeViewWrapper } from "@tiptap/react";

export const MentionViewComponent = (props: any) => {
  return (
    <NodeViewWrapper as="span">
      <HoverCard
        position="top"
        onOpen={() => {
          // enable the query
        }}
        shadow="xl"
      >
        <HoverCard.Target>
          <Anchor href={`/users/${props.node.attrs.id}`} fw={500}>
            @{props.node.attrs.label}
          </Anchor>
        </HoverCard.Target>

        <HoverCard.Dropdown>
          <Group>
            <Avatar
              src={"https://avatars.githubusercontent.com/u/18256786?v=4"}
              radius="xl"
            />

            <div style={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                {props.node.attrs.label}
              </Text>

              <Text color="dimmed" size="xs">
                {props.node.attrs.id}
              </Text>
            </div>
          </Group>
        </HoverCard.Dropdown>
      </HoverCard>
    </NodeViewWrapper>
  );
};
