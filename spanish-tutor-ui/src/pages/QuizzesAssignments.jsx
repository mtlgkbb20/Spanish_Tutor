import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useParams } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

export default function QuizzesAssignments() {
  const { level, idx } = useParams(); // /quizzes-assignments/:level/:idx
  const curriculumId = `${level}-${idx}`;
  const userId = parseInt(localStorage.getItem("userId"), 10);

  const [tasks, setTasks] = useState({ quizzes: [], assignments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/tasks?user_id=${userId}&curriculum_id=${curriculumId}`
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId, curriculumId]);

  if (loading) return <CircularProgress sx={{ m: 4 }} />;

  const renderList = (items, type) =>
    items.map((item) => (
      <Box
        key={item.index}
        sx={{
          mb: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        {item.locked ? (
          <LockIcon color="disabled" sx={{ mr: 1 }} />
        ) : (
          <Button
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
            onClick={() => {
              // TODO: quiz/assignment açma işlemi
              alert(`Opening ${type} ${item.index}`);
            }}
          >
            {type === "quiz" ? "Quiz" : "HW"} {item.index}
          </Button>
        )}
        <Typography color={item.locked ? "text.disabled" : "text.primary"}>
          {item.title}
        </Typography>
      </Box>
    ));

  return (
    <>
      <NavigationBar />
      <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
        <Typography variant="h4" mb={3}>
          Quizzes &amp; Assignments
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" mb={2}>
                Assignments
              </Typography>
              {renderList(tasks.assignments, "hw")}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" mb={2}>
                Quizzes
              </Typography>
              {renderList(tasks.quizzes, "quiz")}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
