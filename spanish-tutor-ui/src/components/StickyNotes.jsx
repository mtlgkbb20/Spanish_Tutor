import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";

export default function StickyNotes() {
  const userId = localStorage.getItem("userId");
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  // 1) DB’den var olan notları çek
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/user_notes?user_id=${userId}`
        );
        if (!res.ok) throw new Error("Notes fetch error");
        const data = await res.json();
        setNotes(data.map((n) => n.content));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  // 2) Yeni not ekle
  const handleAdd = async () => {
    if (!input.trim()) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/api/user_notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: parseInt(userId, 10), content: input }),
      });
      if (!res.ok) throw new Error("Add note failed");
      // eklenen notu state’e de yansıt
      setNotes((prev) => [input.trim(), ...prev]);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <CircularProgress size={24} sx={{ m: 2 }} />;

  return (
    <Box>
      <Box display="flex" gap={1} mb={2}>
        <TextField
          fullWidth
          size="small"
          placeholder="Yeni not ekle..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button variant="contained" onClick={handleAdd}>
          Ekle
        </Button>
      </Box>
      <Box sx={{ maxHeight: 240, overflowY: "auto" }}>
        <Grid container spacing={1} columns={2}>
          {notes.map((note, idx) => (
            <Grid item xs={1} key={idx}>
              <Paper
                elevation={2}
                sx={{ p: 1, minHeight: 80, wordBreak: "break-word" }}
              >
                <Typography variant="body2">{note}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
