import { ActionIcon, Box, Divider, Loader, Stack, Text, TextInput, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useMatch } from "@tanstack/react-location";
import { FocusEventHandler, KeyboardEventHandler, useRef, useState } from "react";
import { useCreateUser, useDeleteUser, User, useReadUsers, useUpdateUser } from "../api/users";

export const UsersPage = () => {
  const { data, isLoading } = useReadUsers();
  const { params } = useMatch();

  if (isLoading || !data) {
    return <Loader />;
  }

  if (params.userId) {
    const matchedUser = data.find((user) => user._id === params.userId);
    if (!matchedUser) {
      return (
        <Box>
          <Title>Not found</Title>
        </Box>
      );
    }
    return (
      <Text>
        User ID: <b>{matchedUser._id}</b> <br />
        Username: <b>{matchedUser.username}</b>
      </Text>
    );
  }

  return (
    <Box>
      <Title>Users</Title>
      <CreateUser />

      <Divider label="Existing users" mt="xl" />

      <Stack>
        {data.map((user) => (
          <SaveTextInput key={user._id} user={user} />
        ))}
      </Stack>
    </Box>
  );
};

const CreateUser = () => {
  const { mutate } = useCreateUser();
  const ref = useRef<HTMLInputElement>(null);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      mutate(
        { username: e.currentTarget.value },
        {
          onSuccess: (response) => {
            if (ref.current) {
              ref.current.value = "";
            }

            showNotification({
              title: `Successfully created user ID: ${response._id}`,
              message: `Username: ${response.username}`,
              color: "teal",
            });
          },
        }
      );
    }
  };

  return <TextInput ref={ref} maw={400} label="Create User" placeholder="Username" onKeyDown={handleKeyDown} />;
};

type SaveTextInputProps = {
  user: User;
};

const SaveTextInput = (props: SaveTextInputProps) => {
  const { user } = props;

  const { mutate, isLoading } = useUpdateUser();
  const { mutate: deleteUser, isLoading: isDeleting } = useDeleteUser();
  const [isFocused, setIsFocused] = useState(false);

  const handleOnFocus = () => setIsFocused(true);
  const handleOnBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value !== user.username) {
      mutate(
        {
          userId: user._id,
          username: e.target.value,
        },
        {
          onSuccess: () => {
            showNotification({
              title: `Successfully updated user ID: ${user._id}`,
              message: `Username from ${user.username} -> ${e.target.value}`,
              color: "teal",
            });
          },
        }
      );
    }

    setIsFocused(false);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const rightSection =
    isLoading || isDeleting ? (
      <Loader size={16} />
    ) : (
      <ActionIcon
        sx={{
          opacity: isFocused ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
        color="red"
        size="sm"
        onClick={() => {
          deleteUser(
            { userId: user._id },
            {
              onSuccess: () => {
                showNotification({
                  title: `Successfully deleted user ID: ${user._id}`,
                  message: ``,
                  color: "teal",
                });
              },
            }
          );
        }}
      >
        <IconTrash />
      </ActionIcon>
    );

  return (
    <TextInput
      maw={400}
      label={user._id}
      defaultValue={user.username}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      rightSection={rightSection}
      onKeyDown={handleKeyDown}
      variant={isFocused ? "default" : "filled"}
    />
  );
};
