import prompts from "@/prompts";
import { ChatCompletionRes, fetchWithTimeout, parseJsonSSE } from "@/utils";

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
  const prompt = prompts.summarize(subject);
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
        onUpdate && onUpdate(state);
      },
      onFinish,
    });
  } catch (error) {
    onError && onError();
    console.log(error);
  }
}
