import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Axios } from "./axios";

export type User = {
  _id: string;
  username: string;
};

const getUsers = async () => {
  const response = await Axios.get<User[]>("/users");
  return response.data;
};

export const useReadUsers = () => useQuery(["USERS"], getUsers);

const createUser = async ({ username }: { username: string }) => {
  const response = await Axios.post(`/users`, {
    username,
  });
  return response.data;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["USERS"]);
    },
  });
};

const updateUser = async ({ userId, username }: { userId: string; username: string }) => {
  const response = await Axios.put(`/users/${userId}`, {
    username,
  });
  return response.data;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["USERS"]);
    },
  });
};

const deleteUser = async ({ userId }: { userId: string }) => {
  const response = await Axios.delete(`/users/${userId}`);
  return response.data;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["USERS"]);
    },
  });
};
