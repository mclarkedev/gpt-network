import { parseJsonSSE } from "@/utils";

const basePromptOLD = `I am an encyclopedia API.
I will be given a request about a subject in the following format:

– {request}

I will respond in the following typed format:

{type}: My response to request #1

I can only return the following types:
type error = A error message why I couldn't respond in a csv list
type csv = A list of comma separated strings, when the question is asking for a list of stuff, never returning more than 3

– `;

// https://platform.openai.com/playground/p/cmlu65BgvtmbxknKfg0nXmAU
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

// Before I respond, I look at the "exclude" list, which is a list of previously researched entities, and repond with similar, but never the same, entities in my "csv" response. I NEVER SAY ANYTHING if it is in the exclude list. If exclude: thisName, and thisName, my CSV RESPONSE WILL NEVER BE csv: thisName.
// exclude: ${exclude || "film"}

/**
 * Fetch OpenAI Completion Data from "/api/openai/completion"
 */
export async function fetchCompletionData({
  exclude,
  subject,
  onUpdate,
  onFinish,
}: any) {
  let state = "";
  if (!subject) {
    console.log("No subject, handle error");
    return;
  }
  const prompt = `${basePrompt(exclude, subject)}`;
  console.log(prompt);
  const response = await fetch("/api/openai/completion", {
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
