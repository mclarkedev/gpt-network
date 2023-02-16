import { separator } from "@/utils";
import { atom } from "recoil";

/**
 * Search Input State
 * - User types into SearchInput
 */
export const searchInputState = atom({
  key: "searchInput",
  default: "",
});

/**
 * Search Submitted State
 * - User submits SearchInput
 */
export const searchSubmittedState = atom({
  key: "searchSubmitted",
  default: false,
});

/**
 * Search Query
 * - User edits a search query using the SearchQueryEditor
 */
export const searchQueryListState = atom({
  key: "searchQueryList",
  default: [
    {
      label: "Is similar to",
      prompt: ["Who is similar to ", separator, "?"],
    },
  ],
});
