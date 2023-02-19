import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import InteractiveForceGraph from "@/components/InteractiveForceGraph";
import { activeNodeIdState, graphDataState } from "@/state";
import { fetchCompletionData } from "@/network";
import { uniqueObjectsById } from "@/utils";
import { GraphData, LinkObject, NodeObject } from "react-force-graph-3d";
import NavigationHeader from "@/components/NavigationHeader";

export default function Graph() {
  const activeNodeId = useRecoilValue(activeNodeIdState);
  const [graphData, setGraphData] = useRecoilState(graphDataState);

  // Init nodes on mount
  useEffect(() => {
    search({ id: activeNodeId });
  }, []);

  const search = async (node: any) => {
    // Stateful input
    const sourceId = node.id;

    // Get data
    let rawRes = "";
    await fetchCompletionData({
      prompt: `Who are ${sourceId}'s influences?`,
      onUpdate: (res: string) => {
        rawRes = res;
      },
      onFinish: console.log,
    });

    // Handle response types, parse csv
    const response = parseResponseType(rawRes);
    const { type, text } = response;
    console.log({ type, text });
    if (type !== "csv") {
      // TODO: Handle error
      console.log(`${type} is not csv`);
      // Can only display csv
      return;
    }
    const { nodes } = response;

    // Make graph data from csv
    const _newData = makeGraphDataFromList(sourceId, nodes);
    // Merge graph into active state
    const mergedGraph = mergeGraphs(graphData, _newData);
    setGraphData(mergedGraph);
  };

  return (
    <div>
      <NavigationH eader />
      <InteractiveForceGraph data={graphData} onNodeClick={search} />
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
  const isNull = string.startsWith("null:");
  const isCSV = string.startsWith("csv:");

  if (isNull) {
    return {
      type: "null",
      text: string.split("null:")[1].trim(),
    };
  }
  if (isCSV) {
    const data = string.split("csv:")[1].trim();
    return {
      type: "csv",
      text: data,
      nodes: data.split(",").map((s: string) => s.trim()), // Sanitize name whitespace
    };
  } else {
    return {
      type: "undefined",
      text: string,
    };
  }
};
