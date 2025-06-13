// src/pages/Notifications.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, CircularProgress } from "@mui/material";

export default function Notifications() {
  const userId = localStorage.getItem("userId");
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`http://127.0.0.1:8000/api/notifications?user_id=${userId}`);
      setNotes(await res.json());
    }
    load();
  }, [userId]);

  if (!notes) return <CircularProgress sx={{ m: 4 }} />;

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>
        Notifications
      </Typography>
      <List>
        {notes.map((n, i) => (
          <ListItem key={i}>
            <ListItemText
              primary={n.message}
              secondary={new Date(n.created_at).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
