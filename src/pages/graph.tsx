import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import InteractiveForceGraph from "@/components/InteractiveForceGraph";
import { activeNodeIdState, graphDataState } from "@/state";
import NavigationHeader from "@/components/NavigationHeader";
import { useUserActions } from "@/actions";
import StreamState from "@/components/StreamState";

export default function Graph() {
  const activeNodeId = useRecoilValue(activeNodeIdState);
  const graphData = useRecoilValue(graphDataState);
  const { searchNode } = useUserActions();

  // Init nodes on mount
  useEffect(() => {
    if (activeNodeId && graphData.nodes.length <= 0) {
      searchNode({ id: activeNodeId });
    }
  }, []);

  return (
    <div>
      <NavigationHeader />
      <StreamState />
      <InteractiveForceGraph data={graphData} onNodeClick={searchNode} />
    </div>
  );
}
