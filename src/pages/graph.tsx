import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import InteractiveForceGraph from "@/components/InteractiveForceGraph";
import { searchInputState } from "@/state";
import NavigationHeader from "@/components/NavigationHeader";

export default function Home() {
  const [searchInput] = useRecoilState(searchInputState);

  return (
    <div>
      <NavigationHeader />
      <InteractiveForceGraph startId={searchInput} />
    </div>
  );
}
