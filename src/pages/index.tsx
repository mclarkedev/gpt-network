import React, { useEffect, useState } from "react";
import NavigationHeader from "@/components/NavigationHeader";
import { homeDataState } from "@/state";
import { useRecoilValue } from "recoil";
import clsx from "clsx";
import useSearchEntity from "@/actions/useSearchEntity";
import Login from "@/components/Login";
import CommandModal from "@/components/CommandModal";

const classes = {
  cardText: "px-3 py-2 my-2 text-lg font-medium",
  cardContainer:
    "rounded-md border-2 border-neutral-200 cursor-pointer hover:bg-neutral-100",
  active: (active = false) => `${active ? "text-neutral-500" : "text-black"}`,
};

export default function Home() {
  const { searchEntity } = useSearchEntity();
  const homeData = useRecoilValue(homeDataState);
  const [historyData, setHistoryData] = useState<any[]>([]);

  function handleEntityClick(e: any, entity: string) {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;

    console.log(entity);
    setHistoryData([...historyData, entity]);
    searchEntity(entity);
    return false;
  }

  return (
    <>
      <CommandModal />
      <Login />
      <NavigationHeader />
      <div className="w-96 m-auto">
        {homeData?.feed?.map((entity) => {
          // const wasPressed = historyData.includes(entity);

          return (
            <div
              key={entity}
              className={clsx([
                classes.cardText,
                classes.cardContainer,
                classes.active(false),
              ])}
              onClick={(e) => handleEntityClick(e, entity)}
            >
              <span>{entity}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
