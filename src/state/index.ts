import { separator } from "@/utils";
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
 * Search Query Prompts
 * - User sees human-friendly prompts
 */
export const searchQueryPromptsState = selector({
  key: "searchQueryPrompts",
  get: ({ get }) => {
    const input = get(searchInputState);
    const searchQueryList = get(searchQueryListState);
    return input
      ? searchQueryList.map((item) => {
          return item.content
            ?.map((value) => {
              if (value === separator) {
                return input;
              } else {
                return value;
              }
            })
            .join("");
        })
      : null;
  },
});
