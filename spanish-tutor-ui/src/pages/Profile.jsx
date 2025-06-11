import { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import React from "react";                 // 👈 satırı ekle

export default function Profile() {
  const userId   = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const [stats, setStats] = useState(null);

  useEffect(()=> {
    fetch(`http://127.0.0.1:8000/api/session/stats?user_id=${userId}`)
      .then(r=>r.json()).then(setStats);
  }, [userId]);

  if (!stats) return <CircularProgress sx={{ m:4 }} />;

  return (
    <Box p={5}>
      <Typography variant="h4" fontWeight="bold" mb={3}>Profil</Typography>
      <Paper sx={{ p:4, maxWidth:400 }}>
        <Typography variant="h6">Ad: {userName}</Typography>
        <Typography mt={1}>Giriş Sayısı: <b>{stats.login_count}</b></Typography>
        <Typography mt={1}>Toplam Süre: <b>{stats.total_hours} saat</b></Typography>
        <Typography mt={1}>Seviye: <b>{stats.current_level}</b></Typography>
      </Paper>
    </Box>
  );
}
