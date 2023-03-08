import { useCallback, useEffect } from "react";
import { NodeObject } from "react-force-graph-3d";

import ContextMenuItem from "@/components/ContextMenuItem";
import PopUp from "@/components/PopUp";
import { useKeyRoving } from "@/hooks/useKeyRoving";
import { useContextMenuActions } from "@/hooks/useContextMenuActions";

/**
 * Context Menu
 */
export default function ContextMenu({
  handleGraphNodeClick,
  blurNode,
}: {
  handleGraphNodeClick: (nodeId?: NodeObject["id"]) => void;
  blurNode: (nodeId: NodeObject["id"]) => void;
}) {
  const { maxItems, actions } = useContextMenuActions({ handleGraphNodeClick });

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

  const blurContextMenuItem = useCallback(
    () => setActiveItem(0),
    [setActiveItem]
  );

  /**
   * Reset to 0 when shown again
   */
  useEffect(() => {
    blurContextMenuItem();
  }, [showContextMenu, blurContextMenuItem]);

  /**
   * Show
   */
  return showContextMenu ? (
    <PopUp
      position={contextMenuPosition}
      onClickOutside={() => escapeContextMenu()}
      onMouseOverOutside={blurContextMenuItem}
    >
      <div className="px-1 py-1 ">
        {/* <div className="text-sm p-2 text-neutral-500">Save to list</div> */}
        {actions.map((action, index) => (
          <ContextMenuItem
            key={action.name}
            activeItem={activeItem}
            item={action}
            index={index}
            setActiveItem={setActiveItem}
            closeContextMenu={() => escapeContextMenu(action.blurFocusedNode)}
          />
        ))}
      </div>
    </PopUp>
  ) : null;
}
