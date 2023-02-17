import { fetchCompletionData } from "@/network";
import { separator } from "@/utils";
import { GraphData } from "react-force-graph-3d";
import { atom, selector } from "recoil";

/**
 * Search Input State
 * - User types into SearchInput
 */
export const searchInputState = atom({
  key: "searchInput",
  default: "",
});

/**
 * Search Query
 * - User edits a search query using the SearchQueryList
 */
export const searchQueryListState = atom({
  key: "searchQueryList",
  default: [
    {
      label: "Similar",
      content: ["Who is similar to ", separator, "?"],
    },
  ],
});

/**
 * Current Active Entity
 * - User submits an entity string to be researched
 */
export const currentActiveEntityState = atom<string | null>({
  key: "currentActiveEntity",
  default: null,
  effects: [
    () => {
      activeGraphDataState;
    },
  ],
});

/**
 * Search Query Prompts
 * - User and OpenAI use human-friendly prompts
 * - Replace instances of separator with currentActiveEntity
 */
export const searchQueryPromptsState = selector({
  key: "searchQueryPrompts",
  get: ({ get }) => {
    const currentActiveEntity = get(currentActiveEntityState);
    const searchQueryList = get(searchQueryListState);
    return currentActiveEntity
      ? searchQueryList.map((item) => {
          return item.content
            ?.map((value) => {
              if (value === separator) {
                return currentActiveEntity;
              } else {
                return value;
              }
            })
            .join("");
        })
      : null;
  },
});

/**
 * Current OpenAI Completion Response
 * - API streams token data
 */
export const currentCompletionStreamState = selector({
  key: "currentCompletionStream",
  get: async ({ get }) => {
    const activeEntity = get(currentActiveEntityState);
    const prompts = get(searchQueryPromptsState);
    let state = "";
    const prompt = prompts?.[0];
    console.log("get", prompt, "for", activeEntity);
    await fetchCompletionData({
      prompt,
      onUpdate: (res: string) => {
        state = res;
      },
      onFinish: console.log,
    });
    return {
      request: {
        prompt,
      },
      response: state,
      status: "Complete",
    };
  },
});

export const activeGraphDataState = atom<GraphData>({
  key: "activeGraphData",
  default: {
    nodes: [],
    links: [],
  },
  // React force graph adds ThreeJS data
  dangerouslyAllowMutability: true,
});
