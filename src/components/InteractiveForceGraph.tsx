import React, { ForwardedRef, forwardRef, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  ForceGraphMethods,
  ForceGraphProps,
  GraphData,
} from "react-force-graph-3d";
import * as THREE from "three";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";

import StyledSpriteText from "@/components/Three/StyledSpriteText";

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
  // Fog
  current.scene().fog = new THREE.FogExp2(0x000000, 0.001);

  // Post
  const dotPass = new DotScreenPass(new THREE.Vector2(1, 1), 3, 2);
  current.postProcessingComposer().addPass(dotPass);
}

export default function InteractiveForceGraph({
  data = { nodes: [{ id: "text" }], links: [] },
  onNodeClick,
}: {
  data: GraphData;
  onNodeClick: ForceGraphProps["onNodeClick"];
}) {
  var _data = JSON.parse(JSON.stringify(data)); // Mutable

  // Pass ref into lazy loaded component
  const graphRefCallback = useCallback((current: ForceGraphMethods | null) => {
    if (current === null) {
    } else {
      onLoad(current);
    }
  }, []);

  return (
    <ForceGraph3DForwardRef
      ref={graphRefCallback}
      // graphData={genRandomTree(20)}
      graphData={_data}
      nodeThreeObject={(node) => {
        const sprite = new StyledSpriteText(`${node.id}`); // Forked from "three-spritetext"
        sprite.color = "white";
        sprite.backgroundColor = false;
        sprite.textHeight = 8;
        sprite.fontSize = 150; // default is 90
        sprite.fontFace = "IBM Plex Sans";

        const group = new THREE.Group();
        group.add(sprite);
        group.renderOrder = 2; // Fix link z-index artifact

        return group;
      }}
      enableNodeDrag={false}
      backgroundColor="rgb(25, 25, 26)"
      onNodeClick={onNodeClick}
      linkColor={"white"}
      linkWidth={0.25}
    />
  );
}
