// src/pages/Content.jsx

import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

export default function Content() {
  const { level, idx } = useParams();            // from /content/:level/:idx
  const curriculumId = `${level}-${idx}`;
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/content?curriculum_id=${curriculumId}`
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setContent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [curriculumId]);

  return (
    <>
      <NavigationBar />
      <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
        <Typography variant="h4" gutterBottom>
          {level} – Module {idx}
        </Typography>

        {loading && <CircularProgress sx={{ mt: 4 }} />}
        {error && <Alert severity="error">{error}</Alert>}

        {content && (
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h5" mb={2}>
              {content.title}
            </Typography>

            {content.sections?.map((sec, i) => (
              <Box key={i} mb={3}>
                <Typography variant="h6">{sec.heading}</Typography>
                <Typography sx={{ whiteSpace: "pre-wrap", mt: 1 }}>
                  {sec.body}
                </Typography>
              </Box>
            ))}
          </Paper>
        )}
      </Box>
    </>
  );
}
