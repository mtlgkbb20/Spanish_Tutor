import {
  Box, Typography, Grid, Card, CardContent,
  Button, Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { curriculum } from "../data/curriculum";
import NavigationBar from "../components/NavigationBar";
import React from "react";                 // 👈 satırı ekle



export default function Dashboard() {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const userId   = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  /* Progress listele */
  useEffect(() => {
    if (!userId) return;
    fetch(`http://127.0.0.1:8000/api/progress/list?user_id=${userId}`)
      .then(r=>r.json())
      .then(d=>setProgressData(d.progress || []))
      .catch(console.error);
  }, [userId]);

  /* Çıkış */
  const handleLogout = async () => {
    const sessionId = localStorage.getItem("sessionId");
    try {
      if (sessionId) {
        await fetch("http://127.0.0.1:8000/api/session/end", {
          method : "POST",
          headers: { "Content-Type": "application/json" },
          body   : JSON.stringify({ session_id: parseInt(sessionId, 10) })
        });
      }
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <>
      <NavigationBar />

      <Box p={5}>
        {/* Başlık + Çıkış */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" color="primary" fontWeight="bold">
            Spanish Tutor Curriculum
          </Typography>
          <Box>
            <Typography variant="subtitle1" mr={2}>
              Hoş geldin, <b>{userName}</b>
            </Typography>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Çıkış Yap
            </Button>
          </Box>
        </Box>

        {/* Curriculum grid */}
        <Grid container spacing={4}>
          {curriculum.map(level => (
            <Grid item xs={12} md={6} key={level.level}>
              <Card sx={{ borderRadius:4, boxShadow:4, p:3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Chip label={level.level} color="primary" sx={{ mr:2 }} />
                    <Typography variant="h6">{level.title}</Typography>
                  </Box>
                  <Typography color="text.secondary" mb={2}>
                    {level.desc}
                  </Typography>

                  <Grid container spacing={2}>
                    {level.modules.map((mod, modIdx) => {
                      const status = progressData.find(
                        p=>p.curriculum_id === `${level.level}-${modIdx}`
                      )?.status;

                      return (
                        <Grid item xs={12} sm={6} key={modIdx}>
                          <Card
                            sx={{
                              borderRadius:3, p:2, bgcolor:"grey.100",
                              cursor:"pointer",
                              "&:hover": { boxShadow:6, bgcolor:"primary.light" }
                            }}
                            onClick={()=>navigate(`/module/${level.level}/${modIdx}`)}
                          >
                            <Typography fontWeight="bold">
                              {mod.title}
                              {status === "complete" && " ✅"}
                              {status === "review"   && " ⚠️"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {mod.desc}
                            </Typography>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
