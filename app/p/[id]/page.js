// app/p/[id]/page.js
import redis from "../../../lib/redis";
import { notFound } from "next/navigation";

// Fetch paste and enforce max views
async function getPaste(id) {
  const raw = await redis.get(`paste:${id}`);
  if (!raw) return null;

   const paste = typeof raw === "string" ? JSON.parse(raw) : raw;

  // Check max views
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    await redis.del(`paste:${id}`);
    return null; // max views reached
  }

  // Increment views if max_views is set
  if (paste.max_views !== null) {
    paste.views += 1;
    await redis.set(`paste:${id}`, JSON.stringify(paste));
  }

  return paste;
}

export default async function PasteView({ params }) {
  const { id } = await params; // ✅ Correct: no await
  const paste = await getPaste(id);

  if (!paste) notFound(); // 404 if not found or max views reached

  return (
    <main style={{ padding: "20px" }}>
      <h1>🧾 Your Paste</h1>
      <pre
        style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "6px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {paste.content}
      </pre>
    </main>
  );
}
