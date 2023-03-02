import useSearchEntity from "@/actions/useSearchEntity";
import { entityDataState } from "@/state";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const classes = {
  cardText: "px-3 py-2 my-2 text-lg font-medium",
  cardContainer:
    "rounded-md border-2 border-neutral-200 cursor-pointer hover:bg-neutral-100",
  active: (active = false) => `${active ? "text-neutral-500" : "text-black"}`,
};

export default function Entity() {
  const entityData = useRecoilValue(entityDataState);
  const [historyData, setHistoryData] = useState<any[]>([]);

  useEffect(() => {
    console.log(entityData);
  }, [entityData]);

  const { searchEntity } = useSearchEntity();

  function handleEntityClick(e: any, entity: string) {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;

    console.log(entity);
    // console.log(historyData[node.id]);
    setHistoryData([...historyData, entity]);
    searchEntity(entity);
    return false;
  }

  return (
    <div className="w-96 m-auto">
      <div className="text-3xl font-bold">{entityData.name}</div>
      {entityData.array.map((entity) => {
        // if (typeof entity !== "string") {
        //   return null;
        // }
        const wasPressed = historyData.includes(entity);
        // const entityName = node?.id?.split(" | ")[0];
        // const userCopy = node?.id?.split(" | ")[1];
        return (
          <div
            key={entity}
            // className="text-neutral-800 hover:text-neutral-400 cursor-pointer py-1"
            className={clsx([
              classes.cardText,
              classes.cardContainer,
              classes.active(wasPressed),
            ])}
            onClick={(e) => handleEntityClick(e, entity)}
          >
            <span>{entity}</span>
            {/* {node?.id?.split(" | ").map((i: string, idx) => {
              return (
                <div
                  key={i}
                  className={
                    idx === 1 ? "text-sm font-normal text-neutral-500" : ""
                  }
                >
                  {i}
                </div>
              );
            })} */}
          </div>
        );
      })}
      {/* <div
        onClick={() => handleEntityClick({ id: "no subject" })}
        className={clsx([
          classes.cardText,
          classes.cardContainer,
          "text-center",
        ])}
      >
        Load more...
      </div> */}
    </div>
  );
}
