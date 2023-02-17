import React from "react";
import { useRecoilState } from "recoil";
import InteractiveForceGraph from "@/components/InteractiveForceGraph";
import SearchQueryList from "@/components/SearchQueryList";
import {
  searchInputState,
  searchQueryListState,
  searchQueryPromptsState,
  searchSubmittedState,
} from "@/state";
import NavigationHeader from "@/components/NavigationHeader";

export default function Home() {
  const [searchInput] = useRecoilState(searchInputState);
  const [searchSubmitted] = useRecoilState(searchSubmittedState); // prettier-ignore
  const [searchQueryList] = useRecoilState(searchQueryListState);
  const [searchQueryPrompts] = useRecoilState(searchQueryPromptsState);

  return searchSubmitted ? (
    <div>
      <NavigationHeader />
      <InteractiveForceGraph startId={searchInput} />
    </div>
  ) : (
    <SearchQueryList />
  );
}
