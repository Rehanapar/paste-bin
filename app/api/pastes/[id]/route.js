import redis from "../../../../lib/redis";
import { nowMs } from "../../../../lib/time";

export async function GET(req, { params }) {
  const { id } = await params;
  const key = `paste:${id}`;

  const paste = await redis.hGetAll(key);

  if (!paste || !paste.content) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = nowMs(req);

  // TTL check
  if (paste.expires_at && Number(paste.expires_at) <= now) {
    await redis.del(key);
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  // View limit check
  if (paste.remaining_views !== "") {
    const remaining = Number(paste.remaining_views);

    if (remaining <= 0) {
      return Response.json({ error: "View limit exceeded" }, { status: 404 });
    }

    await redis.hIncrBy(key, "remaining_views", -1);
  }

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.remaining_views === "" ? null : Number(paste.remaining_views) - 1,
    expires_at: paste.expires_at || null,
  });
}
