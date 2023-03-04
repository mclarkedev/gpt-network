import React, from "react";
import { useRecoilValue } from "recoil";

import CommandModal from "@/components/CommandModal";
import NavigationHeader from "@/components/NavigationHeader";
import { homeHistoryState } from "@/state";
import EntityCard from "@/components/EntityCard";

export default function Home() {
  const homeHistory = useRecoilValue(homeHistoryState);

  return (
    <>
      <CommandModal />
      <NavigationHeader />
      <div className="w-96 m-auto">
        <div className="font-bold my-2 mt-10">Recently Viewed</div>
        {homeHistory.map((entity) => {
          return <EntityCard key={entity} entity={entity} />;
        })}
      </div>
    </>
  );
}
