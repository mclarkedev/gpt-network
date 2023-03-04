import clsx from "clsx";
import { useState } from "react";
import { useRecoilValue } from "recoil";

import useSearchEntity from "@/actions/useSearchEntity";
import { entityDataState, homeHistoryState } from "@/state";

const classes = {
  cardText: "px-3 py-2 my-2 text-lg font-medium",
  cardContainer:
    "rounded-md border-2 border-neutral-200 cursor-pointer hover:bg-neutral-100",
  active: (active = false) => `${active ? "text-neutral-500" : "text-black"}`,
};

export default function Entity() {
  const entityData = useRecoilValue(entityDataState);
  const homeHistory = useRecoilValue(homeHistoryState);
  const [historyData, setHistoryData] = useState<any[]>([]);

  // useEffect(() => {
  //   console.log(entityData);
  // }, [entityData]);

  const { searchEntity } = useSearchEntity();

  function handleEntityClick(e: any, entity: string) {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;

    // console.log(entity);
    // console.log(historyData[node.id]);
    setHistoryData([...historyData, entity]);
    searchEntity(entity);
    return false;
  }

  return (
    <div className="w-96 m-auto">
      <div className="text-3xl font-bold">{entityData.name}</div>
      <div className="py-2 font-normal">{entityData.bio}</div>
      {entityData.similar.map((entity: any) => {
        const wasPressed = homeHistory.includes(entity);

        return (
          <div
            key={entity}
            className={clsx([
              classes.cardText,
              classes.cardContainer,
              classes.active(wasPressed),
            ])}
            onClick={(e) => handleEntityClick(e, entity)}
          >
            <span>{entity}</span>
          </div>
        );
      })}
      {/* <hr /> */}
      {/* {homeData.feed.map((entity: any) => {
        const wasPressed = historyData.includes(entity);

        return (
          <div
            key={entity}
            className={clsx([
              classes.cardText,
              classes.cardContainer,
              classes.active(wasPressed),
            ])}
            onClick={(e) => handleEntityClick(e, entity)}
          >
            <span>{entity}</span>
          </div>
        );
      })} */}
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
