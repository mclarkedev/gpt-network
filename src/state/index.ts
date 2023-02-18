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
 * Search Query List
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
 * Active Node Id
 * - User submits a string to be researched
 */
export const activeNodeIdState = atom<string>({
  key: "activeNodeId",
  default: "",
});
