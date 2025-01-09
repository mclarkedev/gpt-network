import type { NextRequest } from "next/server";

if (!process.env.OPENAI_API_KEY) {
  console.log(process.env);
  throw new Error("Missing Environment Variable OPENAI_API_KEY");
}

export const config = {
  runtime: "edge",
};

/**
 * Completion Handler
 */
const handler = async (req: NextRequest): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { messages } = (await req.json()) as {
    messages?: { role: string; content: string }[];
  };

  if (!messages) {
    return new Response("Bad Request", { status: 400 });
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 2048,
      stream: true,
      n: 1,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    console.log(data);
    return new Response("API error", { status: 400 });
  } else {
    const data = res.body;

    return new Response(data, {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
};

export default handler;
