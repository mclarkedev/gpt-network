import { GraphData } from "react-force-graph-3d";
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
 * Active Node Id
 * - User submits a string to be researched
 */
export const activeNodeIdState = atom<string>({
  key: "activeNodeId",
  default: "",
});

/**
 * Graph Data
 * - User and API write to graph state
 */
export const graphDataState = atom<GraphData>({
  key: "graphData",
  default: {
    nodes: [],
    links: [],
  },
});
