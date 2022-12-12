import { Box, Button, Loader, Stack, Title } from "@mantine/core";
import { Link, useMatch } from "@tanstack/react-location";
import { useReadPost, useReadPosts } from "../api/posts";
import { PostForm } from "../components/PostForm";
import { PostReadOnly } from "../components/PostReadOnly";

export const PostsPage = () => {
  const { data, isLoading } = useReadPosts();

  if (isLoading || !data) {
    return <Loader />;
  }

  return (
    <Box>
      <Title>Posts</Title>

      <Button component={Link} to="/posts/create" my="lg">
        Create new post
      </Button>

      <Stack>
        {data.map((post) => (
          <PostReadOnly key={post._id} post={post} />
        ))}
      </Stack>
    </Box>
  );
};

export const PostPage = () => {
  const { params } = useMatch();
  const { data, isLoading } = useReadPost(params.postId);

  if (isLoading || !data) {
    return <Loader />;
  }

  return <PostForm post={data} />;
};

export const CreatePostPage = () => {
  return <PostForm />;
};
