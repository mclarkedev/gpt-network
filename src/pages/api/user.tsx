import redis from "lib/redis";
import type { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const handler = async (req: NextRequest): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  console.log(req);

  const { prompt } = (await req.json()) as {
    prompt?: string;
  };

  if (!prompt) {
    return new Response("Bad Request", { status: 400 });
  }

  const data = "userid123";

  return new Response(data, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};

export default handler;
