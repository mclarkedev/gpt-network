import { parseJsonSSE } from "@/utils";

const basePrompt = `I am an encyclopedia API.
I will be given a list of requests about a subject.

The requests for the subject will be provided in the following format:

- Your first request in plain text
- Your second request in plain text
...and so on.

I will respond in the following format:

{type}: My response to request #1
{type}: My response to request #2

I can only return the following types:
type null = I cannot answer the question about the subject
type csv = A list of comma separated strings, when the question is asking for a list of stuff, never returning more than 3

`;

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
      prompt: `${basePrompt}${prompt}`, // Add base prompt into all prompt
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
