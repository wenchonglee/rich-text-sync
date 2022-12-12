import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Axios } from "./axios";

export type Post = {
  _id: string;
  content: string;
  references: {
    id: string;
    type: string;
  }[];
};

const getPosts = async () => {
  const response = await Axios.get<Post[]>("/posts");
  return response.data;
};

export const useReadPosts = () => useQuery(["POSTS"], getPosts);

const getPost = async (postId: string) => {
  const response = await Axios.get<Post>(`/posts/${postId}`);
  return response.data;
};

export const useReadPost = (postId: string) => useQuery(["POSTS", postId], () => getPost(postId));

const createPost = async ({ content }: { content: string }) => {
  const response = await Axios.post(`/posts`, {
    content,
  });
  return response.data;
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation(createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries(["POSTS"]);
    },
  });
};
