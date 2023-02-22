import { GraphData } from "react-force-graph-3d";
import { atom } from "recoil";

/**
 * https://recoiljs.org/docs/guides/atom-effects/#local-storage-persistence
 */
const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    if (typeof window !== "undefined") {
      const savedValue = localStorage?.getItem(key);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }

      onSet((newValue, _, isReset) => {
        isReset
          ? window.localStorage?.removeItem(key)
          : window.localStorage?.setItem(key, JSON.stringify(newValue));
      });
    }
  };

// -----------------------------------------------------------------------------

/**
 * Search Input State
 * - User types into SearchInput
 */
export const searchInputState = atom({
  key: "searchInput",
  default: "",
});

type __meta = {
  __meta: {
    camera: {
      position: {
        x: number;
        y: number;
        z: number;
      };
    };
  };
};

/**
 * Graph Data
 * - User and API write to graph state
 */
export const graphDataState = atom<GraphData & __meta>({
  key: "graphData",
  default: {
    nodes: [],
    links: [],
    __meta: {
      camera: {
        position: { x: 33, y: 40, z: -6 },
      },
    },
  },
  effects: [localStorageEffect("_:graphData")],
});

export const graphStatusState = atom<"pending" | "loading" | "complete">({
  key: "graphStatus",
  default: "pending",
});

export const graphStreamState = atom<string | null>({
  key: "graphStream",
  default: null,
});

export const graphPromptState = atom<string | null>({
  key: "graphPrompt",
  default: null,
});

export const graphHistoryState = atom<string[] | []>({
  key: "graphHistory",
  default: [],
});
