import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ReactLocation, Router } from "@tanstack/react-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RTE } from "./pages/RTE";
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
        <NotificationsProvider position="top-center" autoClose={8000}>
          <Router
            location={reactLocation}
            routes={[
              {
                path: "/users",
                element: <UsersPage />,
              },
              {
                path: "/posts",
                element: <RTE />,
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
