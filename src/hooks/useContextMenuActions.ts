import { NodeObject } from "react-force-graph-3d";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import {
  contextMenuState,
  focusedNodeIdState,
  graphDataState,
  summaryViewState,
} from "@/state";
import fetchSummaryData from "@/network/fetchSummaryData";

/**
 * useContextMenuActions
 */
export const useContextMenuActions = ({
  handleGraphNodeClick,
}: {
  handleGraphNodeClick: (nodeId?: NodeObject["id"]) => void;
}) => {
  const { position: contextMenuPosition } = useRecoilValue(contextMenuState);
  const focusedNodeId = useRecoilValue(focusedNodeIdState);
  const [graphData, setGraphData] = useRecoilState(graphDataState);
  const setSummaryViewState = useSetRecoilState(summaryViewState);

  /**
   * Context Menu actions
   */
  const actions = [
    {
      name: `Look up ${`${focusedNodeId}`.slice(0, 20)}${
        `${focusedNodeId}`.length > 20 ? "..." : ""
      }`,
      onClick: () => {
        setSummaryViewState((summaryView) => ({
          ...summaryView,
          state: "fetching",
          position: { x: contextMenuPosition.x, y: contextMenuPosition.y },
          show: true,
        }));
        fetchSummaryData({
          subject: `${focusedNodeId}`,
          onUpdate: (text) => {
            setSummaryViewState((summaryView) => ({
              ...summaryView,
              text: text,
              state: "streaming",
            }));
          },
          onError: () => {
            setSummaryViewState((summaryView) => ({
              ...summaryView,
              state: "error",
            }));
          },
          onFinish: () => {
            setSummaryViewState((summaryView) => ({
              ...summaryView,
              state: "complete",
            }));
          },
        });
      },
      blurFocusedNode: false,
    },
    {
      name: "Expand Node",
      onClick: () => {
        handleGraphNodeClick(focusedNodeId);
      },
    },
    {
      name: "Remove Node",
      onClick: () => {
        const otherNodes = graphData.nodes
          .map((i) => {
            if (i.id === focusedNodeId) {
              return false;
            } else {
              return i;
            }
          })
          .filter(Boolean) as NodeObject[] | [];
        const otherLinks = graphData.links
          .map((i) => {
            if (i.source === focusedNodeId || i.target === focusedNodeId) {
              return false;
            } else {
              return i;
            }
          })
          .filter(Boolean) as NodeObject[] | [];
        setGraphData((graphData) => {
          return {
            ...graphData,
            nodes: otherNodes,
            links: otherLinks,
          };
        });
      },
    },
  ];

  return { maxItems: actions.length, actions };
};
