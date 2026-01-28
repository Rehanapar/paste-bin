// app/p/[id]/page.js
import redis from "../../../lib/redis";
import { notFound } from "next/navigation";

// fetch paste and enforce TTL / max views
async function getPaste(id) {
  const raw = await redis.get(`paste:${id}`);
  if (!raw) return null;

  const paste = JSON.parse(raw);

  const now = Date.now();

  // Check TTL
  if (paste.ttl_seconds && now > paste.created_at + paste.ttl_seconds * 1000) {
    await redis.del(`paste:${id}`);
    return null; // expired
  }

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
  // ✅ In Next 16, params is already unwrapped
  const { id } = await params;

  const paste = await getPaste(id);

  if (!paste) {
    notFound(); // proper 404
  }

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
