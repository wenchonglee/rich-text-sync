import { Global, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Navigate, ReactLocation, Router } from "@tanstack/react-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CreatePostPage, PostPage, PostsPage } from "./pages/PostsPage";
import { UsersPage } from "./pages/UsersPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const reactLocation = new ReactLocation();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <MantineProvider
      withNormalizeCSS
      withGlobalStyles
      theme={{ colorScheme: "dark" }}
    >
      <Global
        styles={(theme) => ({
          "span[data-type='mention']": {
            fontWeight: 500,
            color: theme.colors.blue[3],
          },
          ".ProseMirror span[data-type='citation']": {
            textDecoration: `underline dotted 1px`,
            textDecorationColor: theme.colors.gray[6],
          },
          ".ProseMirror sup": {
            fontWeight: 600,
            height: 14,
            width: 14,
            color: theme.fn.variant({ variant: "filled", color: "cyan" }).color,
            background: theme.fn.variant({ variant: "filled", color: "cyan" })
              .background,
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "4px",
            margin: "0px 2px",
            fontSize: "10px",
            cursor: "default",
          },
        })}
      />
      <Notifications position="top-center" autoClose={8000} />
      <Router
        location={reactLocation}
        routes={[
          {
            path: "/",
            element: <Navigate to="/posts" />,
          },
          {
            path: "/users/:userId",
            element: <UsersPage />,
          },
          {
            path: "/users",
            element: <UsersPage />,
          },
          {
            path: "/posts/new",
            element: <CreatePostPage />,
          },
          {
            path: "/posts/:postId",
            element: <PostPage />,
          },
          {
            path: "/posts",
            element: <PostsPage />,
          },
        ]}
      >
        <App />
      </Router>
    </MantineProvider>
  </QueryClientProvider>
);
