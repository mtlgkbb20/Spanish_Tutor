import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";                 // 👈 satırı ekle

export default function Welcome() {
  const [name, setName]   = useState("");
  const [error, setError] = useState("");
  const navigate          = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("İsim zorunlu!");

    try {
      const resp = await fetch("http://127.0.0.1:8000/api/auth", {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ name }),
      });
      if (!resp.ok) throw new Error(`Sunucu hatası (${resp.status})`);

      const data = await resp.json();   // { id, name, session_id, new }
      localStorage.setItem("userId",    data.id);
      localStorage.setItem("userName",  data.name);
      localStorage.setItem("sessionId", data.session_id);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Beklenmeyen hata");
    }
  };

  return (
    <div
      style={{
        display:"flex", alignItems:"center", justifyContent:"center",
        minHeight:"100vh", background:"#f5f7fb"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          padding:32, borderRadius:16, background:"#fff",
          boxShadow:"0 4px 24px #0002", minWidth:300
        }}
      >
        <h2 style={{ marginBottom:24 }}>Spanish Tutor’a Hoş geldin!</h2>

        <label>İsmin:</label><br />
        <input
          value={name}
          onChange={(e)=>setName(e.target.value)}
          style={{ margin:"12px 0 24px", padding:8, width:"100%" }}
          placeholder="Adını yaz"
          autoFocus
        />

        <button
          type="submit"
          style={{
            width:"100%", padding:10, background:"#1976d2",
            color:"#fff", border:"none", borderRadius:8, cursor:"pointer"
          }}
        >
          Devam Et
        </button>

        {error && (
          <div style={{ color:"red", marginTop:16, textAlign:"center" }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
