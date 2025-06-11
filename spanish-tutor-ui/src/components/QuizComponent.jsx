import { useState } from "react";
import React from "react";                 // 👈 satırı ekle

/**
 * props:
 *   curriculumId : string (örn "A1-0")
 *   onSuccess()  : callback → ​quiz ≥ 70 puan ise çağrılır
 */
export default function QuizComponent({ curriculumId, onSuccess }) {
  const [answer, setAnswer]   = useState("");
  const [score, setScore]     = useState(null);
  const [sending, setSending] = useState(false);

  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;
    setSending(true);

    /* Basit demo puanlama */
    const calculatedScore = 100;            // ileride AI puanı
    const aiFeedback      = "Great job!";   // ileride AI feedback

    await fetch("http://127.0.0.1:8000/api/quiz/submit", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({
        user_id      : userId,
        curriculum_id: curriculumId,
        answer,
        score   : calculatedScore,
        feedback: aiFeedback,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        setScore(calculatedScore);
        if (d.progress === "complete" && onSuccess) onSuccess();
      })
      .finally(() => setSending(false));
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
      <h3>Mini Quiz</h3>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={3}
        placeholder="Cevabınızı yazın…"
        style={{ width: "100%", marginBottom: 12 }}
        required
      />
      <button type="submit" disabled={sending}>
        {sending ? "Gönderiliyor…" : "Gönder"}
      </button>

      {score !== null && (
        <p style={{ marginTop: 12 }}>
          Puanınız: <b>{score}</b>
        </p>
      )}
    </form>
  );
}
