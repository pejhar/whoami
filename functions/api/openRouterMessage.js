export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(JSON.stringify({ error: "Invalid or missing 'messages' array" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const OPEN_ROUTER_API_KEY = env.OPEN_ROUTER_API_KEY || context.env?.OPEN_ROUTER_API_KEY;

    if (!OPEN_ROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: "OpenRouter API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPEN_ROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: body.messages,
        temperature: 0.7,
        stream: false,
        response_format: { type: "json_object" }
      })
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error("OpenRouter API error:", errorText);
      let errorMessage = "OpenRouter API error";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorText;
      } catch {
        errorMessage = errorText;
      }
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: openRouterResponse.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    const openRouterData = await openRouterResponse.json();
    const responseText = openRouterData.choices?.[0]?.message?.content || "No response content";

    return new Response(JSON.stringify({ reply: responseText }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("OpenRouter message error:", err);
    let errorMessage = err.message || "Internal server error";
    if (err instanceof TypeError && err.message.includes("fetch")) {
      errorMessage = "Failed to connect to OpenRouter API";
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}