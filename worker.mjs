// Static Assets handles ordinary requests. MP4 requests run here so the Cache
// API can return byte ranges, preserving video seeking after the hosting move.
export default {
  async fetch(request, env) {
    const asset = await env.ASSETS.fetch(request);
    const etag = asset.headers.get("ETag");
    const ifRange = request.headers.get("If-Range");
    if (
      request.method !== "GET" ||
      !request.headers.has("Range") ||
      asset.status !== 200 ||
      !etag ||
      request.headers.has("Authorization") ||
      (ifRange && ifRange !== etag)
    ) {
      return asset;
    }

    // The asset ETag changes on upload, so a deployment never reuses old video.
    const key = new URL(request.url);
    key.searchParams.set("__asset_etag", etag);
    const rangeRequest = new Request(key, request);
    const cache = caches.default;
    let ranged = await cache.match(rangeRequest);
    if (ranged) {
      await asset.body?.cancel();
    } else {
      const stored = new Response(asset.body, asset);
      stored.headers.set("Cache-Control", "public, max-age=86400");
      stored.headers.set("Accept-Ranges", "bytes");
      await cache.put(new Request(key), stored);
      ranged = await cache.match(rangeRequest);
    }
    if (!ranged) return env.ASSETS.fetch(request);
    const response = new Response(ranged.body, ranged);
    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    return response;
  },
};
