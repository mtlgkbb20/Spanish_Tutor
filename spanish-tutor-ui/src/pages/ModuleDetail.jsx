import {
  Box, Typography, Grid, Paper, TextField, Button, Divider,
  CircularProgress, Alert
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { curriculum } from "../data/curriculum";
import QuizComponent from "../components/QuizComponent";
import React from "react";                 // 👈 satırı ekle
import NavigationBar from "../components/NavigationBar";


export default function ModuleDetail() {
  const { level, idx } = useParams();              // /module/:level/:idx

  /* Curriculum verisi */
  const levelObj  = useMemo(() => curriculum.find(l => l.level === level), [level]);
  const moduleObj = useMemo(() => levelObj?.modules?.[Number(idx)], [levelObj, idx]);
  const moduleName   = moduleObj?.title;
  const curriculumId = level ? `${level}-${idx}` : null;

  /* State'ler */
  const [lesson, setLesson]   = useState(null);
  const [lesLoad, setLesLoad] = useState(false);
  const [lesError,setLesError]= useState(null);

  /* Chat */
  const [messages, setMessages] = useState([
    { sender:"ai", text:"¡Hola! Ben Spanish Tutor, ne öğrenmek istersin?" }
  ]);
  const [input, setInput]       = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBoxRef = useRef(null);

  const userId = localStorage.getItem("userId");

  /* Lesson içerik */
  useEffect(() => {
    if (!moduleName || !curriculumId) return;
    setLesLoad(true); setLesError(null);

    fetch("http://127.0.0.1:8000/api/lesson", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({
        user_id      : parseInt(userId,10),
        curriculum_id: curriculumId,
        module_title : moduleName,
        level        : levelObj.level
      })
    })
      .then(r => (r.ok ? r.json() : Promise.reject("API error")))
      .then(setLesson)
      .catch(err => setLesError(err.toString()))
      .finally(() => setLesLoad(false));
  }, [moduleName, curriculumId]);

  /* Modül tamamla (quiz başarılıysa çağrılır) */
  const handleCompleteModule = async () => {
    await fetch("http://127.0.0.1:8000/api/progress/update", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({
        user_id      : userId,
        curriculum_id: curriculumId,
        status       : "complete"
      })
    });
  };

  /* Chat scroll */
  useEffect(() => {
    chatBoxRef.current && (chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight);
  }, [messages]);

  /* Chat gönder */
  const handleChatSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((m)=>[...m, {sender:"user", text:input}]);
    setInput(""); setChatLoading(true);
    try {
      const r = await fetch("http://127.0.0.1:8000/api/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          message: input,
          context: { level: levelObj?.level, module: moduleName }
        })
      });
      const d = await r.json();
      setMessages((m)=>[...m,{sender:"ai", text:d.reply ?? "..."}]);
    } catch {
      setMessages((m)=>[...m,{sender:"ai", text:"AI yanıtı alınamadı."}]);
    }
    setChatLoading(false);
  };

  return (
    <>
      <NavigationBar />
        <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb" }}>
        <Box sx={{ p: 4, pb: 0 }}>
          <Typography variant="h4" color="primary" fontWeight="bold">{levelObj?.level} – {levelObj?.title}</Typography>
          <Typography variant="h5">{moduleObj?.title}</Typography>
          <Typography color="text.secondary" mb={3}>{moduleObj?.desc}</Typography>
        </Box>

        <Grid container spacing={4} sx={{ p: 4, pt: 0 }}>
          {/* Chat */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, minHeight: 480, display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" color="primary" fontWeight="bold" mb={2}>Spanish Tutor Chat</Typography>
              <Box
                ref={chatBoxRef}
                sx={{
                  flexGrow: 1, bgcolor: "#f0f0f0", borderRadius: 2, p: 2,
                  overflowY: "auto", mb: 2, minHeight: 250, maxHeight: 300
                }}
              >
                {messages.map((m, i) => (
                  <Box key={i} align={m.sender === "user" ? "right" : "left"} mb={1}>
                    <Typography
                      sx={{
                        display: "inline-block",
                        bgcolor: m.sender === "user" ? "#2196f3" : "#e0e0e0",
                        color: m.sender === "user" ? "#fff" : "#000",
                        borderRadius: 2, px: 2, py: 1, fontSize: 15,
                        maxWidth: "90%", wordBreak: "break-word"
                      }}
                    >
                      {m.text}
                    </Typography>
                  </Box>
                ))}
                {chatLoading && (
                  <Typography sx={{ display: "inline-block", bgcolor: "#e0e0e0", color: "#888", borderRadius: 2, px: 2, py: 1 }}>…</Typography>
                )}
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box component="form" display="flex" gap={1} onSubmit={handleChatSend}>
                <TextField
                  placeholder="Mesaj yazın..."
                  variant="outlined"
                  size="small"
                  sx={{ flexGrow: 1 }}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={chatLoading} />
                <Button variant="contained" type="submit" disabled={chatLoading}>Gönder</Button>
              </Box>
            </Paper>
          </Grid>

          {/* Orta: Sticky + Quiz */}
          <Grid item xs={12} md={4}>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Paper elevation={2} sx={{ p: 3, bgcolor: "#fffde7", borderRadius: 3 }}>
                  <Typography variant="h6" color="warning.main" fontWeight="bold">Sticky Notes</Typography>
                  <Typography variant="body1" color="text.secondary" mt={2}>
                    Buraya konuya özel önemli notları ekleyebilirsin!
                  </Typography>
                </Paper>
              </Grid>
              <Grid item>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="info.main">Subject Notes</Typography>
                  <Typography variant="body1" color="text.secondary" mt={2}>
                    Şu an seçili olan modül için öğretmen ya da AI notları burada gösterilecek.
                  </Typography>

                  {/* Mini Quiz */}
                  <QuizComponent curriculumId={curriculumId} onSuccess={handleCompleteModule} />
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Sağ: Lesson Content */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: { md: "sticky" }, top: { md: 40 }, maxHeight: { md: "80vh" }, overflowY: "auto" }}>
              <Paper elevation={2} sx={{ p: 3, bgcolor: "#e8f5e9", borderRadius: 3, minHeight: 420 }}>
                <Typography variant="h6" fontWeight="bold" color="success.dark" mb={2}>Lesson Content</Typography>

                {lesLoad && <CircularProgress />}
                {lesError && <Alert severity="error">{lesError}</Alert>}

                {lesson && (
                  <>
                    <Typography variant="subtitle2"><b>Grammar:</b></Typography>
                    <Typography>{lesson.grammar}</Typography>

                    <Typography variant="subtitle2" mt={2}><b>Related Words:</b></Typography>
                    <Typography>{lesson.words}</Typography>

                    <Typography variant="subtitle2" mt={2}><b>Sample Sentences:</b></Typography>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{lesson.sentences}</pre>

                    <Typography variant="subtitle2" mt={2}><b>Short Dialogue:</b></Typography>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{lesson.dialogue}</pre>
                  </>
                )}

                {!lesLoad && !lesError && !lesson && (
                  <Typography color="text.secondary">
                    İçerik hazırlanıyor...
                  </Typography>
                )}
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box></>
  );
}
