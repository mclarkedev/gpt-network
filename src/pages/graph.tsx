import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import InteractiveForceGraph from "@/components/InteractiveForceGraph";
import {
  activeGraphDataState,
  currentActiveEntityState,
  currentCompletionStreamState,
} from "@/state";
import NavigationHeader from "@/components/NavigationHeader";

export default function Graph() {
  const [currentActiveEntity] = useRecoilState(currentActiveEntityState);
  const [activeGraphData, setActiveGraphData] = useRecoilState(activeGraphDataState); // prettier-ignore
  const [currentCompletionStream] = useRecoilState(currentCompletionStreamState); // prettier-ignore

  // Init graph data to currentActiveEntity & currentCompletionStream
  useEffect(() => {
    setActiveGraphData({
      ...activeGraphData,
      nodes: [
        { id: currentActiveEntity },
        { id: currentCompletionStream.response },
      ],
      links: [
        ...activeGraphData.links,
        {
          target: currentCompletionStream.response,
          source: currentActiveEntity,
        },
      ],
    });
  }, []);

  return (
    <div>
      <NavigationHeader />
      {/* {JSON.stringify(activeGraphData)} */}
      {activeGraphData && <InteractiveForceGraph data={activeGraphData} />}
    </div>
  );
}
