// app/api/pastes/route.js
import { nanoid } from "nanoid";
import redis from "../../../lib/redis";

export async function POST(req) {
  const { content, ttl_seconds = null, max_views = null } = await req.json();

  if (!content || typeof content !== "string" || !content.trim()) {
    return new Response(JSON.stringify({ error: "Content is required" }), { status: 400 });
  }

  if (ttl_seconds !== null && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return new Response(JSON.stringify({ error: "ttl_seconds must be ≥ 1" }), { status: 400 });
  }

  if (max_views !== null && (!Number.isInteger(max_views) || max_views < 1)) {
    return new Response(JSON.stringify({ error: "max_views must be ≥ 1" }), { status: 400 });
  }

  const id = nanoid(6);

  const paste = {
    content,
    created_at: Date.now(),
    ttl_seconds,
    max_views,
    views: 0,
  };

  await redis.set(`paste:${id}`, JSON.stringify(paste));

  return Response.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
  });
}






