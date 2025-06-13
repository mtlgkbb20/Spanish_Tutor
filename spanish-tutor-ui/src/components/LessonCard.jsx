// src/components/LessonCard.jsx
import React from "react";
import { Paper, Box, Typography, Grid, Chip } from "@mui/material";
import { keyframes } from "@mui/system";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export default function LessonCard({
  grammar = "",
  words = [],
  sentences = [],
  dialogue = [],
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 4,
        background: "linear-gradient(135deg, #FFFBF0 0%, #F0F4FF 100%)",
        animation: `${fadeIn} 0.5s ease-out`,
        maxHeight: "75vh",       // kart yüksekliği limiti
        overflowY: "auto",       // içeriği kaydır
      }}
    >
      {/* Grammar */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Grammar
      </Typography>
      <Box
        sx={{
          mb: 3,
          p: 2,
          background: "#ffffffcc",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography>{grammar}</Typography>
      </Box>

      {/* Words & Sentences */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Words
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {words.map(({ es, en }, i) => (
              <Chip
                key={i}
                label={`${es} — ${en}`}
                sx={{
                  background: "#FFF1F0",
                  fontWeight: 500,
                  px: 1.5,
                  py: 0.5,
                }}
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Sentences
          </Typography>
          <Box
            component="ul"
            sx={{
              pl: 2,
              m: 0,
              listStyle: "disc",
              "& li": { mb: 0.5 },
            }}
          >
            {sentences.map((s, i) => (
              <li key={i}>
                <Typography component="span">{s}</Typography>
              </li>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Dialogue */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Dialogue
      </Typography>
      <Box sx={{ mt: 1 }}>
        {dialogue.map(({ speaker, text }, i) => {
          const isLeft = speaker === "Persona 1";
          return (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: isLeft ? "flex-start" : "flex-end",
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  maxWidth: "75%",
                  p: 2,
                  borderRadius: 2,
                  background: isLeft ? "#E3F2FD" : "#FFE0B2",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: 0,
                    height: 0,
                    borderStyle: "solid",
                    borderWidth: isLeft
                      ? "0 10px 10px 0"
                      : "10px 0 0 10px",
                    borderColor: isLeft
                      ? "transparent #E3F2FD transparent transparent"
                      : "transparent transparent transparent #FFE0B2",
                    top: "10px",
                    left: isLeft ? "-10px" : "auto",
                    right: isLeft ? "auto" : "-10px",
                  },
                  boxShadow: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {speaker}
                </Typography>
                <Typography>{text}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
