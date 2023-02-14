import React from "react";
import dynamic from "next/dynamic";
import { GraphData } from "react-force-graph-3d";
import SpriteText from "three-spritetext";

/**
 * Import dynamically to avoid server calls to window, self, etc.
 * - https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
 */
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

const data: GraphData = {
  nodes: [{ id: "Me" }, { id: "You" }],
  links: [{ source: "Me", target: "You" }],
};

export default function Home() {
  return (
    <ForceGraph3D
      graphData={data}
      nodeThreeObject={(node) => {
        const sprite = new SpriteText(`${node.id}`);
        sprite.color = "white";
        sprite.textHeight = 8;
        return sprite;
      }}
    />
  );
}
