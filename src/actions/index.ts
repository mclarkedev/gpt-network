import { graphHistoryState } from "./../state/index";
import { GraphData, LinkObject, NodeObject } from "react-force-graph-3d";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  graphDataState,
  graphStatusState,
  activeNodeIdState,
  graphStreamState,
  graphPromptState,
} from "@/state";
import { fetchCompletionData } from "@/network";
import { uniqueObjectsById } from "@/utils";

function useUserActions() {
  const activeNodeId = useRecoilValue(activeNodeIdState);
  const [graphData, setGraphData] = useRecoilState(graphDataState);
  const setGraphHistoryState = useSetRecoilState(graphHistoryState);
  const setGraphStatus = useSetRecoilState(graphStatusState);
  const setGraphStream = useSetRecoilState(graphStreamState);
  const setGraphPrompt = useSetRecoilState(graphPromptState);

  function addGraphHistory(id: string) {
    setGraphHistoryState((currentState) => {
      return [...currentState, id];
    });
  }

  async function searchNode(node: NodeObject | any) {
    // Set active state scale
    const scale = 1.07;
    node?.["__threeObj"]?.scale?.set(scale, scale, scale);
    // Stateful input
    const sourceId = node.id;
    setGraphStatus("loading");

    const prompt = `Who, or what, influenced ${sourceId}?`;
    setGraphPrompt(prompt);

    addGraphHistory(sourceId);

    // Get data
    let rawRes = "";
    await fetchCompletionData({
      prompt: `Who are ${sourceId}'s influences?`,
      onUpdate: (res: string) => {
        setGraphStatus("streaming");
        setGraphStream(res);
        node?.["__threeObj"]?.scale?.set(scale, scale, scale);
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
      setGraphStatus("error: is not csv");
      console.log(`${type} is not csv`);
      // Can only display csv
      return;
    }
    const { nodes } = response;

    if (nodes) {
      // Make graph data from csv
      const _newData = makeGraphDataFromList(sourceId, nodes);
      // Merge graph into active state
      const mergedGraph = mergeGraphs(graphData, _newData);
      setGraphData(mergedGraph);
      setGraphStatus("complete");
    } else {
      console.error("No nodes found");
      setGraphStatus("error: no nodes found");
    }

    return activeNodeId;
  }

  return {
    searchNode,
  };
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

export { useUserActions };
