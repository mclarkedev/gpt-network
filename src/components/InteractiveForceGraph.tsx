import React, { ForwardedRef, forwardRef, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import {
  ForceGraphMethods,
  ForceGraphProps,
  GraphData,
} from "react-force-graph-3d";
import * as THREE from "three";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";

import StyledSpriteText from "@/components/Three/StyledSpriteText";
import { genRandomTree } from "@/utils";

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
  current.scene().fog = new THREE.FogExp2(0xffffff, 0.0015);

  // Post
  const dotPass = new DotScreenPass(new THREE.Vector2(1, 1), 3, 2);
  // const lutPass = new LUTPass({
  //   intensity: 3,
  //   lut: ''
  // });
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

  const hasDoneInitialDrawRef = useRef<any>(null);

  // Pass ref into lazy loaded component
  const graphRefCallback = useCallback(
    (current: ForceGraphMethods | null) => {
      if (current === null) {
      } else {
        onLoad(current);
        current.zoomToFit(400);
        hasDoneInitialDrawRef.current = current;
      }
    },
    [hasDoneInitialDrawRef]
  );

  console.log(_data);

  return (
    <ForceGraph3DForwardRef
      ref={graphRefCallback}
      // graphData={genRandomTree(20)}
      graphData={_data.nodes.length ? _data : genRandomTree(3)}
      nodeThreeObject={(node) => {
        const sprite = new StyledSpriteText(`${node.id}`); // Forked from "three-spritetext"
        sprite.color = "black";
        sprite.backgroundColor = false;
        sprite.textHeight = 8;
        sprite.fontSize = 200; // default is 90
        sprite.fontFace = "IBM Plex Sans";

        const group = new THREE.Group();
        group.add(sprite);
        group.renderOrder = 2; // Fix link z-index artifact

        return group;
      }}
      enableNodeDrag={false}
      backgroundColor="white"
      onNodeClick={onNodeClick}
      linkColor={"black"}
      linkWidth={0.25}
      linkOpacity={1}
      cooldownTicks={5}
      onEngineStop={() => {
        console.log("hasDoneInitialDrawRef", hasDoneInitialDrawRef);
        hasDoneInitialDrawRef.current.zoomToFit(400);
      }}
    />
  );
}
