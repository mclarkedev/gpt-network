import { homeHistoryState } from "./../state/index";
import { removeItemAtIndex, uniqueStrings } from "@/utils";
import { entityDataState, commandModalState, homeFrontierState } from "@/state";
import { useRecoilState, useSetRecoilState } from "recoil";
import { fetchCompletionData, prompts } from "@/network/completion";
import { useRouter } from "next/router";

function useSearchEntity() {
  const setShowCommandModal = useSetRecoilState(commandModalState);
  const [homeHistory, setHomeHistory] = useRecoilState(homeHistoryState);
  const [homeFrontier, setHomeFrontier] = useRecoilState(homeFrontierState);
  const setEntityData = useSetRecoilState(entityDataState);
  const router = useRouter();

  async function searchSimilar(entityName: string) {
    let out: any;
    await fetchCompletionData({
      prompt: prompts.base01(entityName),
      onUpdate: (res: string) => {
        const parsed = parseResponseType(res);
        if (parsed.type === "csv" && parsed.array) {
          const data = {
            name: entityName,
            similar: parsed.array,
          };
          setEntityData(data);
          out = data;
        }
      },
      onFinish: console.log,
      onError: console.log,
    });
    return out;
  }

  async function searchBio(entityName: string, data: any) {
    await fetchCompletionData({
      prompt: `In one sentence, who is ${entityName}?`,
      onUpdate: (res: string) => {
        setEntityData({
          ...data,
          bio: res,
        });
      },
      onFinish: console.log,
      onError: console.log,
    });
  }

  async function searchEntity(entityName: string) {
    /**
     * Transition UI and route
     */
    setShowCommandModal(false);
    if (router.pathname !== "/entity") {
      router.push("/entity");
    }

    /**
     * Fetch data, and wait for all data to resolve before setting home data
     */
    const data = await searchSimilar(entityName);
    await searchBio(entityName, data);

    /**
     * If viewed entity exists in frontier, remove it, since the user has just viewed it
     */
    if (homeFrontier.includes(entityName)) {
      const index = homeFrontier.indexOf(entityName);
      setHomeFrontier((frontier) => removeItemAtIndex(frontier, index));
    }

    /**
     * Persist visited entity into history
     */
    setHomeHistory((history) => uniqueStrings([entityName, ...history]));

    /**
     * If any new entities were already viewed, then don't add them to the frontier
     */
    const newEntities = data.similar
      .map((i: string) => {
        const wasViewed = homeHistory.includes(entityName);
        console.log(wasViewed);
        return wasViewed ? null : i;
      })
      .filter((i) => i);

    console.log(newEntities);

    /**
     * Persist all new entities into frontier
     */
    setHomeFrontier((frontier) => uniqueStrings([...newEntities, ...frontier]));
  }

  return {
    searchEntity,
  };
}

const parseResponseType = (response: string) => {
  const string = response.trim();
  const isNull = string.startsWith("null:");
  const isCSV = string.startsWith("csv:");

  if (isNull) {
    return {
      type: "null",
      text: string.split("null:")[1].trim(),
    };
  }
  if (isCSV) {
    const data = string.split("csv:")[1].trim();
    return {
      type: "csv",
      text: data,
      array: data.split(",").map((s: string) => s.trim()), // Sanitize name whitespace
    };
  } else {
    return {
      type: "undefined",
      text: string,
    };
  }
};

export default useSearchEntity;
