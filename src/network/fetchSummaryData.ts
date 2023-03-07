import { fetchWithTimeout, parseJsonSSE } from "@/utils";

/**
 * fetchSummaryData
 */
export default async function fetchSummaryData({
  subject,
  onUpdate,
  onFinish,
  onError,
}: {
  subject: string;
  onUpdate: (text: string) => void;
  onFinish: () => void;
  onError: () => void;
}) {
  let state = "";
  if (!subject) {
    console.log("No subject, handle error");
    return;
  }
  const prompt = `What is ${subject}, in 1 sentence.`;
  try {
    const response = await fetchWithTimeout("/api/openai/completion", {
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
        onUpdate && onUpdate(state);
      },
      onFinish,
    });
  } catch (error) {
    onError && onError();
    console.log(error);
  }
}
