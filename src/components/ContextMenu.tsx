import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  contextMenuState,
  focusedNodeIdState,
  graphDataState,
  summaryViewState,
} from "@/state";
import { NodeObject } from "react-force-graph-3d";

import fetchSummaryData from "@/network/fetchSummaryData";
import ContextMenuItem from "@/components/ContextMenuItem";
import PopUp from "@/components/PopUp";
import { useKeyRoving } from "@/hooks/useKeyRoving";

/**
 * Context Menu
 */
export default function ContextMenu({
  handleGraphNodeClick,
  blurNode,
}: {
  handleGraphNodeClick: (nodeId?: string | number) => void;
  blurNode: (nodeId: NodeObject["id"]) => void;
}) {
  // Action state
  const focusedNodeId = useRecoilValue(focusedNodeIdState);
  const [graphData, setGraphData] = useRecoilState(graphDataState);
  const setSummaryViewState = useSetRecoilState(summaryViewState);

  /**
   * Context Menu actions
   */
  const items = [
    {
      name: `Look up ${`${focusedNodeId}`.slice(0, 20)}${
        `${focusedNodeId}`.length > 20 ? "..." : ""
      }`,
      onClick: () => {
        fetchSummaryData({
          subject: `${focusedNodeId}`,
          onUpdate: (text) => {
            setSummaryViewState((summaryView) => ({
              ...summaryView,
              text: text,
            }));
          },
          onError: console.log,
          onFinish: console.log,
        });
        setSummaryViewState((summaryView) => ({
          ...summaryView,
          position: { x: contextMenuPosition.x, y: contextMenuPosition.y },
          show: true,
        }));
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

  const maxItems = items.length;

  const {
    activeItem,
    contextMenuPosition,
    setActiveItem,
    showContextMenu,
    escapeContextMenu,
  } = useKeyRoving({
    maxItems,
    blurNode,
  });

  /**
   * Reset to 0 when shown again
   */
  useEffect(() => {
    setActiveItem(0);
  }, [showContextMenu, setActiveItem]);

  /**
   * Show
   */
  return showContextMenu ? (
    <PopUp
      position={contextMenuPosition}
      onClickOutside={() => escapeContextMenu()}
      onMouseOverOutside={() => setActiveItem(0)}
    >
      <div className="px-1 py-1 ">
        {/* <div className="text-sm p-2 text-neutral-500">Save to list</div> */}
        {items.map((item, index) => (
          <ContextMenuItem
            key={item.name}
            activeItem={activeItem}
            item={item}
            index={index}
            setActiveItem={setActiveItem}
            closeContextMenu={() => escapeContextMenu(item.blurFocusedNode)}
          />
        ))}
      </div>
    </PopUp>
  ) : null;
}
