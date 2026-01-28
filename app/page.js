"use client";

import { useState } from "react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [pasteUrl, setPasteUrl] = useState("");
  const [error, setError] = useState("");

  const createPaste = async () => {
    setError("");
    setPasteUrl("");

    if (!content.trim()) {
      setError("Paste content cannot be empty");
      return;
    }

    const body = { content };
    if (maxViews) body.max_views = Number(maxViews);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create paste");
      }

      setPasteUrl(data.url);
      setContent("");
      setMaxViews("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h1>📝 Pastebin Lite</h1>

      <textarea
        rows={10}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste your text here..."
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Max views"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
          min="1"
        />
      </div>

      <button onClick={createPaste}>Create Paste</button>

      {pasteUrl && (
        <p style={{ marginTop: "15px" }}>
          ✅ Your paste link:{" "}
          <a href={pasteUrl} target="_blank" rel="noopener noreferrer">
            {pasteUrl}
          </a>
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}

