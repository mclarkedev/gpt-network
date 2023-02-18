import { fetchCompletionData } from "@/network";
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
 * Current Active Entity
 * - User submits an entity string to be researched
 */
export const currentActiveEntityState = atom<string>({
  key: "currentActiveEntity",
  default: "",
});
