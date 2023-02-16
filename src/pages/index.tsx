import React from "react";
import { useRecoilState } from "recoil";
import InteractiveForceGraph from "@/components/InteractiveForceGraph";
import SearchQueryList from "@/components/SearchQueryList";
import { searchInputState, searchSubmittedState } from "@/state";

export default function Home() {
  const [searchInput] = useRecoilState(searchInputState);
  const [searchSubmitted] = useRecoilState(searchSubmittedState); // prettier-ignore

  return searchSubmitted ? (
    <InteractiveForceGraph startId={searchInput} />
  ) : (
    <SearchQueryList />
  );
}
