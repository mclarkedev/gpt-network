import parseJsonSSE from "@/utils";

/**
 * Fetch OpenAI Completion Data from "/api/openai/completion"
 */
export async function fetchCompletionData({ prompt, onUpdate, onFinish }: any) {
  let state = "";
  const response = await fetch("/api/openai/completion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = response.body;

  if (!data) {
    return;
  }

  await parseJsonSSE<{
    id: string;
    object: string;
    created: number;
    choices?: {
      text: string;
      index: number;
      logprobs: null;
      finish_reason: null | string;
    }[];
    model: string;
  }>({
    data,
    onParse: (json) => {
      if (!json.choices?.length) {
        throw new Error("Something went wrong.");
      }

      const { text: _text } = json.choices[0];
      state = state + _text;
      onUpdate(state);
    },
    onFinish,
  });
}
