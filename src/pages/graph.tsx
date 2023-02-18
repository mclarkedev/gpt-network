import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import InteractiveForceGraph from "@/components/InteractiveForceGraph";
import {
  activeNodeIdState,
  graphDataState,
  searchQueryListState,
} from "@/state";
import { fetchCompletionData } from "@/network";
import { separator, uniqueObjectsById } from "@/utils";
import { GraphData, LinkObject, NodeObject } from "react-force-graph-3d";
import NavigationHeader from "@/components/NavigationHeader";

export default function Graph() {
  const activeNodeId = useRecoilValue(activeNodeIdState);
  const searchQueryList = useRecoilValue(searchQueryListState);
  const [graphData, setGraphData] = useRecoilState(graphDataState);

  // Init nodes on mount
  useEffect(() => {
    makeNewNodes({ id: activeNodeId });
  }, []);

  const makeNewNodes = async (node: any) => {
    // Stateful input
    const sourceId = node.id;
    const label = searchQueryList?.[0].label;
    const prompt = searchQueryList?.[0].content
      .map((value) => {
        if (value === separator) {
          return sourceId;
        } else {
          return value;
        }
      })
      .join("");

    // Get data
    let rawRes = "";
    await fetchCompletionData({
      prompt,
      onUpdate: (res: string) => {
        rawRes = res;
      },
      onFinish: console.log,
    });

    // Handle response types, parce csv
    const response = parseResponseType(rawRes);
    const { type, text } = response;
    console.log({ type, text });
    if (type !== "csv") {
      // TODO: Handle error
      // Can only display csv
      return;
    }
    const csv = text.split(", ").map((string) => string.trim()); // Sanitize name whitespace

    // Make graph data from csv
    const _newData = makeGraphDataFromList(sourceId, csv);
    // Merge graph into active state
    const mergedGraph = mergeGraphs(graphData, _newData);
    setGraphData(mergedGraph);
  };

  return (
    <div>
      <NavigationHeader />
      <InteractiveForceGraph data={graphData} onNodeClick={makeNewNodes} />
    </div>
  );
}

export const makeNode = (sourceId: string) => {
  return { id: sourceId };
};

export const makeLink = (sourceId: string, targetId: string) => {
  return { source: sourceId, target: targetId };
};

export const makeNodeLink = (sourceId: string, targetId: string) => {
  const node = makeNode(targetId);
  const link = makeLink(sourceId, targetId);
  return { node, link };
};

export const makeGraphData = (
  nodeLinks: { node: NodeObject; link: LinkObject }[]
) => {
  const links: any[] = [];
  const nodes: any[] = [];
  nodeLinks.forEach((nodeLink) => {
    nodes.push(nodeLink.node);
    links.push(nodeLink.link);
  });
  return {
    nodes,
    links,
  };
};

const makeGraphDataFromList = (sourceId: string, nodes: string[]) => {
  // Always make node, even though it may exist in state
  // It will merge into its duplicate
  const startNode = makeNode(sourceId);

  // Make node and link objects from array of node id's, previously parsed
  const nodeLinks = nodes.map((value) => {
    return makeNodeLink(sourceId, value.trim());
  });
  const newGraph = makeGraphData(nodeLinks);

  return {
    nodes: [
      startNode, // Start node from searchInput
      ...newGraph.nodes, // New nodes based on start node
    ],
    links: [
      ...newGraph.links, // New nodes based on start node
    ],
  };
};

const mergeGraphs = (graph1: GraphData, graph2: GraphData) => {
  return {
    nodes: uniqueObjectsById([...graph1?.nodes, ...graph2.nodes]),
    links: [...graph1.links, ...graph2.links],
  };
};

const parseResponseType = (response: string) => {
  const string = response.trim();
  const matcher = string.toLowerCase();
  const isNull = matcher.startsWith("null:");
  const isCSV = matcher.startsWith("csv:");

  if (isNull) {
    return {
      type: "null",
      text: string.split("null:")[1].trim(),
    };
  }
  if (isCSV) {
    return {
      type: "csv",
      text: string.split("csv:")[1].trim(),
    };
  } else {
    return {
      type: "undefined",
      text: string,
    };
  }
};
