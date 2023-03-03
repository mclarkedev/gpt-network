import { GraphData } from "react-force-graph-3d";
import { atom } from "recoil";
// import redis from "lib/redis";

const VERSION = "v0-html";

const setRedisEffect =
  (userId: string) =>
  ({ setSelf, onSet, trigger }: any) => {
    const key = `user:${userId}`;
    // Initialize atom value to the remote storage state
    if (trigger === "get") {
      // Avoid expensive initialization
      // const user = redis.hgetall(key);
      // console.log(user);
      // setSelf(); // Call synchronously to initialize
    }

    // Subscribe to local changes and update the server value
    onSet((userInfo: string) => {
      // redis.set(userId, userInfo);
    });
  };

/**
 * https://recoiljs.org/docs/guides/atom-effects/#local-storage-persistence
 */
const localStorageEffect =
  (key: any) =>
  ({ setSelf, onSet }: any) => {
    if (typeof window !== "undefined") {
      const savedValue = localStorage?.getItem(key);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }

      onSet((newValue: any, _: any, isReset: any) => {
        isReset
          ? window.localStorage?.removeItem(key)
          : window.localStorage?.setItem(key, JSON.stringify(newValue));
      });
    }
  };

export type __meta = {
  __meta?: {
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
        position: {
          x: 47.57015497543777,
          y: -69.88663392827746,
          z: 5.280961341662786,
        },
      },
    },
  },
  // effects: [localStorageEffect(`${VERSION}:graphData`)],
});

export const entityDataState = atom<any>({
  key: "entityDataState",
  default: { name: "name", similar: [] },
  effects: [
    localStorageEffect(`${VERSION}:entityDataState`),
    setRedisEffect("matt"),
  ],
});

export const homeDataState = atom<any>({
  key: "homeDataState",
  default: { feed: [] },
  effects: [localStorageEffect(`${VERSION}:homeDataState`)],
});

export const graphStatusState = atom<
  "pending" | "loading" | "complete" | "error"
>({
  key: "graphStatus",
  default: undefined,
  // effects: [localStorageEffect(`${VERSION}:graphStatus`)],
});

export const commandModalState = atom<any>({
  key: "commandModal",
  default: false,
  // effects: [localStorageEffect(`${VERSION}:commandModal`)],
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
