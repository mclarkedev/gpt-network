import React, { ForwardedRef, forwardRef, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import SpriteText from "three-spritetext";
import {
  ForceGraphMethods,
  ForceGraphProps,
  GraphData,
} from "react-force-graph-3d";
import * as THREE from "three";

// Lazy load pre-wrapped component with ref
const ForceGraph3D = dynamic(() => import("@/components/WrappedForceGraph3D"), {
  ssr: false,
});

// Name our ref handler function
const ForceGraph3DHandleRef = (
  props: ForceGraphProps,
  ref: ForwardedRef<ForceGraphMethods>
) => <ForceGraph3D {...props} forwardRef={ref} />;
// Forward our ref into lazy loaded component
const ForceGraph3DForwardRef = forwardRef(ForceGraph3DHandleRef);

type InteractiveForceGraphProps = {
  // The first node to render to the screen
  startId: string;
};

/**
 * onLoad inits our ThreeJS scene
 */
function onLoad(current: ForceGraphMethods) {
  current.scene().fog = new THREE.FogExp2(0x000000, 0.001);
}

/**
 * ForceGraph renders graph networks from a startID
 */
export default function InteractiveForceGraph({
  startId,
}: InteractiveForceGraphProps) {
  const [data, setData] = useState<GraphData>({
    nodes: [{ id: startId }],
    links: [],
  });

  const graphRefCallback = useCallback((current: ForceGraphMethods | null) => {
    if (current === null) {
    } else {
      onLoad(current);
    }
  }, []);

  const handleClick = useCallback(
    (node: any) => {
      if (data.nodes && data.links) {
        const newId = `${data.nodes.length + 1}`;
        setData({
          nodes: [...data.nodes, { id: newId }],
          links: [...data.links, { target: newId, source: node.id }],
        });
      }
    },
    [data]
  );

  return (
    <ForceGraph3DForwardRef
      ref={graphRefCallback}
      graphData={data}
      nodeThreeObject={(node) => {
        const sprite = new SpriteText(`${node.id}`);
        sprite.color = "white";
        sprite.textHeight = 8;
        return sprite;
      }}
      enableNodeDrag={false}
      onNodeClick={handleClick}
    />
  );
}
