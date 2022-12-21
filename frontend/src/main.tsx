import { Global, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { Navigate, ReactLocation, Router } from "@tanstack/react-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
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
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider withNormalizeCSS withGlobalStyles theme={{ colorScheme: "dark" }}>
        <Global
          styles={(theme) => ({
            "span[data-type='mention']": {
              fontWeight: 500,
              color: theme.colors.blue[3],
            },
          })}
        />
        <NotificationsProvider position="top-center" autoClose={8000}>
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
                path: "/posts/create",
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
        </NotificationsProvider>
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
