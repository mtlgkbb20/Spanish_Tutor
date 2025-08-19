import React from "react";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Typography,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Hidden,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Determine if we're in a module context (module detail, content, quizzes-assignments)
  const inModule = /^\/(module|content|quizzes-assignments)\//.test(location.pathname);

  // Build routes conditionally
  const baseRoutes = [
    { label: "Home", path: "/dashboard" },
    { label: "Notifications", path: "/notifications" },
    { label: "Profile", path: "/profile" },
  ];
  const moduleRoutes = [];
  if (inModule) {
    // extract level and idx
    const parts = location.pathname.split('/');
    // e.g. ['', 'module', level, idx]
    const level = parts[2];
    const idx = parts[3];
    moduleRoutes.push(
      { label: "Content", path: `/content/${level}/${idx}` },
      { label: "Quizzes & Assignments", path: `/quizzes-assignments/${level}/${idx}` }
    );
  }
  const routes = [...baseRoutes.slice(0,1), ...moduleRoutes, ...baseRoutes.slice(1)];

  // Determine current tab index
  const currentTab = routes.findIndex(r => r.path === location.pathname);

  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar sx={{ minHeight: 56, px: { xs: 1, md: 3 } }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: theme.typography.fontFamily,
            fontWeight: 700,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            px: 2,
            py: 0.5,
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            cursor: "pointer",
            mr: 2,
          }}
          onClick={() => navigate("/dashboard")}
        >
          Spanish Tutor
        </Typography>

        <Hidden mdUp>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Hidden>

        <Hidden mdDown>
          <Tabs
            value={currentTab >= 0 ? currentTab : false}
            onChange={(_, idx) => navigate(routes[idx].path)}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              flexGrow: 1,
              '.MuiTab-root': { fontWeight: 600, textTransform: "none", minHeight: 48, px: 2 },
              '.Mui-selected': { bgcolor: theme.palette.secondary.light, color: theme.palette.primary.dark },
            }}
          >
            {routes.map((r) => <Tab key={r.path} label={r.label} />)}
          </Tabs>
        </Hidden>

        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <List sx={{ width: 200 }}>
            {routes.map((r) => (
              <ListItem
                button
                key={r.path}
                selected={location.pathname === r.path}
                onClick={() => { navigate(r.path); setDrawerOpen(false); }}
              >
                <ListItemText primary={r.label} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
