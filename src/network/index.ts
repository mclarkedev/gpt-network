import { fetchWithTimeout, parseJsonSSE } from "@/utils";

/**
 * Fetch OpenAI Completion Data from "/api/openai/completion"
 */
export async function fetchCompletionData({
  prompt,
  onUpdate,
  onFinish,
  onError,
}: any) {
  let state = "";
  if (!prompt) {
    console.log("No prompt, handle error");
    return;
  }
  try {
    const response = await fetchWithTimeout("/api/openai/completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
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
  } catch (error) {
    onError();
    console.log(error);
  }
}

export const prompts = {
  base01: (
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
  `,
};
