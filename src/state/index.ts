import { fetchHomeData } from "@/network/userHome";
import redis from "lib/redis";
import { atom, AtomEffect, useSetRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

// SSR persist Helper
const ssrCompletedState = atom({
  key: "SsrCompleted",
  default: false,
});

// SSR persist Helper
export const useSsrComplectedState = () => {
  const setSsrCompleted = useSetRecoilState(ssrCompletedState);
  return () => setSsrCompleted(true);
};

// SSR persist Helper
export const persistAtomEffect = <T>(param: Parameters<AtomEffect<T>>[0]) => {
  param.getPromise(ssrCompletedState).then(() => persistAtom(param));
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
});

export const homeDataState = atom<any>({
  key: "homeDataState",
  default: null,
  effects: [
    persistAtomEffect,
    // setRedisEffect()
  ],
});

export const commandModalState = atom<any>({
  key: "commandModal",
  default: false,
});
