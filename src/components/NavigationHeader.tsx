import { useSetRecoilState } from "recoil";

import { commandModalState } from "@/state";
import { Suspense } from "react";
import { SearchIcon } from "./Icons";

export default function NavigationHeader({ LeftSlot }: any) {
  const setShowCommandModal = useSetRecoilState(commandModalState);

  return (
    <Suspense>
      <div className="p-3 flex justify-between align-middle">
        <div>{LeftSlot && <LeftSlot />}</div>
        <div></div>
        <div className="flex items-center">
          <div
            className="group bg-black text-neutral-200black rounded-full px-4 py-2 mr-2 text-md w-full border-2 border-neutral-200 cursor-pointer hover:bg-black hover:text-white transition-colors"
            onClick={() => setShowCommandModal(true)}
          >
            <div className="flex items-center text-neutral-200 pr-2 group-hover:text-white">
              <SearchIcon className="text-neutral-200 mr-2 group-hover:text-white" />
              Search
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
