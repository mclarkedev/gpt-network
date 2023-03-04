import clsx from "clsx";
import { useRecoilValue } from "recoil";

import useSearchEntity from "@/actions/useSearchEntity";
import { homeHistoryState } from "@/state";
import Dropdown from "./DropDown";

const classes = {
  cardText: "px-3 py-2 my-2 text-lg font-medium",
  cardContainer:
    "rounded-md border-2 border-neutral-200 cursor-pointer hover:bg-neutral-100",
  active: (active = false) => `${active ? "text-neutral-500" : "text-black"}`,
};

export default function EntityCard({ entity }: any) {
  const homeHistory = useRecoilValue(homeHistoryState);
  //   const wasPressed = homeHistory.includes(entity);
  const { searchEntity } = useSearchEntity();

  function handleEntityClick(e: any, entity: string) {
    // if (e.stopPropagation) e.stopPropagation();
    // if (e.preventDefault) e.preventDefault();
    // e.cancelBubble = true;
    // e.returnValue = false;

    searchEntity(entity);
    return false;
  }

  return (
    <div
      key={entity}
      className={clsx([
        classes.cardText,
        classes.cardContainer,
        "flex justify-between items-center",
        "group",
        // classes.active(wasPressed),
      ])}
      onMouseUp={(e) => handleEntityClick(e, entity)}
    >
      <span>{entity}</span>
      <Dropdown />
    </div>
  );
}
