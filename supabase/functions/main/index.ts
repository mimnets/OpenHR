// Minimal main service for Edge Runtime.
// Serves as the required entry point for the edge-runtime Docker container.
// Individual edge functions are deployed via the management API.

Deno.serve(async (_req: Request) => {
  return new Response(
    JSON.stringify({ status: "ok", service: "openhr-edge-runtime" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
});
