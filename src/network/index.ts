import { ChatCompletionRes, fetchWithTimeout, parseJsonSSE } from "@/utils";

const basePrompt = (
  exclude: string,
  subject: string
) => `I am an encyclopedia API that accepts a "subject" and returns a machine readable "csv".

Let's try it.

subject: Wade Guyton
csv: Donald Judd, Whitney Museum of American Art, Postminimalism

subject: Tauba Auerbach
csv: John Baldessari, Ellsworth Kelly, Neo-Dada

subject: Neo-Dada
csv: Joseph Beuys, Fluxus, Happenings

subject: Joseph Beuys
csv: Yves Klein, Nam June Paik, Arte Povera

subject: Arte Povera
csv: Jannis Kounellis, Guiseppe Penone, Mario Merz

subject: ${subject}
`;

/**
 * Fetch OpenAI Completion Data from "/api/openai/completion"
 */
export async function fetchCompletionData({
  exclude,
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
  const prompt = `${basePrompt(exclude, subject)}`;
  try {
    const response = await fetchWithTimeout("/api/openai/completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt, // Add base prompt into all prompt
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
