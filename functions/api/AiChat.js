export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.text();

    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch (e) {
      throw new Error("Invalid JSON body");
    }

    if (!parsed || !Array.isArray(parsed.message) || parsed.message.length === 0) {
      return new Response(JSON.stringify({ error: "Empty or invalid message" }), { status: 400 });
    }

    const lastMessage = parsed.message[parsed.message.length - 1];
    const message = lastMessage?.content?.trim();

    if (!message) {
      return new Response(JSON.stringify({ error: "Empty or invalid message content" }), { status: 400 });
    }

    const hfApiUrl = "https://api-inference.huggingface.co/models/gpt2";

    const hfResponse = await fetch(hfApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.HF_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: message,
        parameters: { max_new_tokens: 50 }
      })
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      return new Response(JSON.stringify({ error: errorText }), { status: hfResponse.status });
    }

    const hfData = await hfResponse.json();

    if (!Array.isArray(hfData) || hfData.length === 0 || !hfData[0].generated_text) {
      return new Response(JSON.stringify({ error: "Invalid response from Hugging Face" }), { status: 500 });
    }

    const reply = hfData[0].generated_text;

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("AIChat error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
