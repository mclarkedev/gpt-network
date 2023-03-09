import prompts from "@/prompts";
import { ChatCompletionRes, fetchWithTimeout, parseJsonSSE } from "@/utils";

/**
 * Fetch OpenAI Completion Data from "/api/openai/completion"
 */
export default async function fetchCompletionData({
  exclude,
  searchCache,
  subject,
  onUpdate,
  onFinish,
  onError,
}: any) {
  let state = "";
  if (!subject) {
    console.log("No subject, handle error");
    return;
  }
  const messages = [
    { role: "system", content: prompts.system },
    // Spreading messages back into the request doesn't work as intended
    // ...searchCache.map((i) => ({ role: "user", content: i.split("csv: ")[1] })),
    { role: "user", content: prompts.search(subject) },
  ];
  try {
    const response = await fetchWithTimeout("/api/openai/completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;

    if (!data) {
      return;
    }

    await parseJsonSSE<ChatCompletionRes>({
      data,
      onParse: (json) => {
        if (!json.choices?.length) {
          throw new Error("Something went wrong.");
        }

        const {
          delta: { content },
        } = json.choices[0];
        if (!content) {
          // Handle {role: "assistant"} if needed here
          return;
        }

        state = state + content;
        onUpdate(state);
      },
      onFinish,
    });
  } catch (error) {
    onError();
    console.log(error);
  }
}
