import { entityDataState } from "./../state/index";
import { graphHistoryState } from "../state/index";
import { GraphData, LinkObject, NodeObject } from "react-force-graph-3d";
import { useRecoilState, useSetRecoilState } from "recoil";
import { graphStatusState, graphStreamState, graphPromptState } from "@/state";
import { fetchCompletionData } from "@/network";

function useSearchEntity() {
  const [entityData, setEntityData] = useRecoilState(entityDataState);

  async function searchEntity(entityName: string) {
    await fetchCompletionData({
      // undefined,
      subject: entityName,
      onUpdate: (res: string) => {
        const parsed = parseResponseType(res);
        if (parsed.type === "csv" && parsed.array) {
          setEntityData({
            name: entityName,
            array: parsed.array,
          });
        }
      },
      onFinish: console.log,
      onError: console.log,
    });
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
