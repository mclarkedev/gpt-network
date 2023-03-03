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

export const commandModalState = atom<any>({
  key: "commandModal",
  default: false,
});
