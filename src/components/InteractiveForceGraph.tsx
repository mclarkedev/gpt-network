import React, { ForwardedRef, forwardRef, useCallback } from "react";
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

/**
 * onLoad inits our ThreeJS scene
 */
function onLoad(current: ForceGraphMethods) {
  current.scene().fog = new THREE.FogExp2(0x000000, 0.001);
}

type InteractiveForceGraphProps = {
  // The first node to render to the screen
  // startId: string;
  data: GraphData;
  onNodeClick: ForceGraphProps["onNodeClick"];
};

/**
 * ForceGraph renders graph networks from a startID
 */
export default function InteractiveForceGraph({
  data,
  onNodeClick,
}: InteractiveForceGraphProps) {
  var _data = JSON.parse(JSON.stringify(data));

  const graphRefCallback = useCallback((current: ForceGraphMethods | null) => {
    if (current === null) {
    } else {
      onLoad(current);
    }
  }, []);

  return (
    <ForceGraph3DForwardRef
      ref={graphRefCallback}
      graphData={_data}
      nodeThreeObject={(node) => {
        const sprite = new SpriteText(`${node.id}`);
        sprite.color = "white";
        sprite.textHeight = 8;
        return sprite;
      }}
      enableNodeDrag={false}
      backgroundColor="black"
      onNodeClick={onNodeClick}
    />
  );
}
