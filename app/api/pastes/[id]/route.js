// app/api/pastes/[id]/route.js
import redis from "../../../../lib/redis";

export async function GET(req, { params }) {
  const { id } = params; // get the paste ID from URL
  const key = `paste:${id}`;

  // Fetch paste from Redis
  const raw = await redis.get(key);
  if (!raw) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  // Ensure we parse only if it's a string
  const paste = typeof raw === "string" ? JSON.parse(raw) : raw;

  // TTL check
  if (paste.ttl_seconds && Date.now() > paste.created_at + paste.ttl_seconds * 1000) {
    await redis.del(key);
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  // Max views check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  // Increment view count
  if (paste.max_views !== null) {
    paste.views += 1;
    await redis.set(key, JSON.stringify(paste));
  }

  return Response.json({ content: paste.content, views: paste.views });
}


