// src/pages/Profile.jsx

import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";

export default function Profile() {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const [stats, setStats] = useState(null);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        // 1) Oturum istatistiklerini çek
        const statsRes = await fetch(
          `http://127.0.0.1:8000/api/session/stats?user_id=${userId}`
        );
        if (!statsRes.ok) throw new Error("Stats fetch error");
        const statsData = await statsRes.json();
        setStats(statsData);

        // 2) UserInterest kayıtlarını çek
        const intRes = await fetch(
          `http://127.0.0.1:8000/api/user_interests?user_id=${userId}`
        );
        if (!intRes.ok) throw new Error("Interests fetch error");
        const intData = await intRes.json();
        // Beklenen format: [{ id, user_id, user_name, interests, created_at }, ...]
        if (Array.isArray(intData) && intData.length > 0) {
          // En son kaydı al
          const latest = intData[intData.length - 1].interests;
          const list = latest
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean);
          setInterests(list);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  if (loading || !stats) {
    return <CircularProgress sx={{ m: 4 }} />;
  }

  return (
    <Box p={5}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Profil
      </Typography>
      <Paper sx={{ p: 4, maxWidth: 400 }}>
        <Typography variant="h6">Ad: {userName}</Typography>
        <Typography mt={1}>
          Giriş Sayısı: <b>{stats.login_count}</b>
        </Typography>
        <Typography mt={1}>
          Toplam Süre: <b>{stats.total_hours} saat</b>
        </Typography>
        <Typography mt={1}>
          Seviye: <b>{stats.current_level}</b>
        </Typography>

        {interests.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              İlgi Alanları:
            </Typography>
            <Typography>
              {interests.map((item, idx) => (
                <span key={idx}>
                  {item}
                  {idx < interests.length - 1 ? ", " : ""}
                </span>
              ))}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
