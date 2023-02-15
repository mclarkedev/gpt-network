import React from "react";
import dynamic from "next/dynamic";
import SpriteText from "three-spritetext";
import { genRandomTree } from "@/utils";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

export default function Home() {
  return (
    <ForceGraph3D
      graphData={genRandomTree(1000)}
      nodeThreeObject={(node) => {
        const sprite = new SpriteText(`${node.id}`);
        sprite.color = "white";
        sprite.textHeight = 8;
        return sprite;
      }}
    />
  );
}
