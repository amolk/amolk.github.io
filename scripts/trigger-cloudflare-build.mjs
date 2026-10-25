const hook = process.env.CLOUDFLARE_DEPLOY_HOOK;
if (
  !hook?.startsWith(
    "https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/",
  )
) {
  throw new Error(
    "Set the CLOUDFLARE_DEPLOY_HOOK repository secret to the main-branch deploy hook URL.",
  );
}
const response = await fetch(hook, {
  method: "POST",
  signal: AbortSignal.timeout(30000),
});
if (!response.ok)
  throw new Error(
    `Cloudflare rejected the rebuild request (HTTP ${response.status}).`,
  );
const result = await response.json();
if (!result.success || !result.result?.build_uuid)
  throw new Error("Cloudflare did not return a queued build.");
console.log(`Cloudflare build queued: ${result.result.build_uuid}`);
