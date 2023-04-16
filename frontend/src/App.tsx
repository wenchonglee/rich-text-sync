import { AppShell, Navbar, NavLink } from "@mantine/core";
import { IconMessage, IconUsers } from "@tabler/icons-react";
import { Link, Outlet } from "@tanstack/react-location";

function App() {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 240 }} height="100%" p="xs">
          <Navbar.Section mt="xs">
            <NavLink label="Users" icon={<IconUsers size={20} />} component={Link} to="/users" />
            <NavLink label="Posts" icon={<IconMessage size={20} />} component={Link} to="/posts" />
          </Navbar.Section>
        </Navbar>
      }
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      <Outlet />
    </AppShell>
  );
}

export default App;
