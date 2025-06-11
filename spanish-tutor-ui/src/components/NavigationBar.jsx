import React from "react";                 // 👈 satırı ekle
import { AppBar, Toolbar, Tabs, Tab, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavigationBar() {
  const navigate   = useNavigate();
  const location   = useLocation();

  /* Ana sekmelerin path’leri - sırası önemli */
  const routes     = [
    "/dashboard",
    "/content",
    "/quizzes",
    "/notifications",
    "/profile"
  ];

  /* Hangi sekme seçili? */
  const currentTab = routes.includes(location.pathname)
    ? routes.indexOf(location.pathname)
    : 0;

  return (
    <AppBar position="static" sx={{ bgcolor: "#75a9e9" }}>
      <Toolbar sx={{ minHeight: 48, pl: 2 }}>
        {/* Logo / ana başlık */}
        <Typography
          variant="h5"
          sx={{
            fontFamily: "serif",
            fontWeight: "bold",
            bgcolor: "#fff",
            color: "#000",
            px: 2,
            py: 0.5,
            borderRadius: 3,
            mr: 2,
            boxShadow: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate("/dashboard")}
        >
          Spanish Tutor
        </Typography>

        {/* Sekmeler */}
        <Tabs
          value={currentTab}
          onChange={(_, idx) => navigate(routes[idx])}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            ".MuiTab-root": {
              fontWeight: "bold",
              textTransform: "none",
              bgcolor: "#a7cdfa",
              borderRight: "1px solid #000",
              minHeight: 40,
            },
            ".Mui-selected": { bgcolor: "#d0e4ff" },
          }}
        >
          <Tab label="home" />
          <Tab label="content" />
          <Tab label="quizzes" />
          <Tab label="notifications" />
          <Tab label="profile" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
