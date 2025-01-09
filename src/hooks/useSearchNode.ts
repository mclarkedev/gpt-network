import { GraphData, LinkObject, NodeObject } from "react-force-graph-3d";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  graphDataState,
  graphStatusState,
  graphStreamState,
  graphPromptState,
  searchCacheState,
  graphHistoryState,
} from "@/state";
import fetchCompletionData from "@/network/fetchCompletionData";
import { uniqueObjectsById } from "@/utils";

function useSearchNode() {
  const [graphData, setGraphData] = useRecoilState(graphDataState);
  const [searchCache, setSearchCache] = useRecoilState(searchCacheState);
  const setGraphHistoryState = useSetRecoilState(graphHistoryState);
  const setGraphStatus = useSetRecoilState(graphStatusState);
  const setGraphStream = useSetRecoilState(graphStreamState);
  const setGraphPrompt = useSetRecoilState(graphPromptState);

  function addGraphHistory(id: string) {
    setGraphHistoryState((currentState) => {
      return [...currentState, id];
    });
  }

  return async function searchNode(
    nodeId: string | number,
    __meta?: any,
    isReset?: Boolean
  ) {
    if (!nodeId) {
      return;
    }

    setGraphStatus("loading");

    const subject = `${nodeId}`;
    subject && setGraphPrompt(subject);
    subject && addGraphHistory(subject);

    const exclude = graphData.nodes
      .map((node) => {
        return node.id;
      })
      .join(", ");

    // Get data
    let rawRes = "";
    await fetchCompletionData({
      exclude,
      subject,
      searchCache: searchCache,
      onUpdate: (res: string) => {
        setGraphStatus("loading");
        setGraphStream(res);
        rawRes = res;
      },
      onFinish: console.log,
      onError: () => {
        setGraphStatus("error");
      },
    });

    // Handle response types, parse csv
    const response = parseResponseType(rawRes);
    const { type, text } = response;

    // Check that your agent is returning csv: prefix
    // console.log({ type, text });

    if (type !== "csv") {
      setGraphStatus("error");
      return;
    }
    // If we have nodes, merge and stich graph based on reset
    const { nodes } = response;
    if (nodes) {
      /**
       * Store raw res string in search cache state
       */
      setSearchCache((searchCache) => [...searchCache, rawRes]);

      // Make graph data from csv
      const _newData = makeGraphDataFromList(`${subject}`, nodes);
      // Merge graph into active state
      const mergedGraph = mergeGraphs(graphData, _newData);
      const mergedGraphWithMeta = { ...mergedGraph, __meta };
      const newGraphState = {
        ..._newData,
        __meta: undefined,
      };

      setGraphData(isReset ? newGraphState : mergedGraphWithMeta);
      setGraphStatus("complete");
      return mergedGraph;
    } else {
      console.error("No nodes found");
      setGraphStatus("error");
    }
  };
}

/**
 * makeNode
 */
export const makeNode = (sourceId: string) => {
  return { id: sourceId };
};

/**
 * makeLink
 */
export const makeLink = (sourceId: string, targetId: string) => {
  return { source: sourceId, target: targetId };
};

/**
 * makeNodeLink
 */
export const makeNodeLink = (sourceId: string, targetId: string) => {
  const node = makeNode(targetId);
  const link = makeLink(sourceId, targetId);
  return { node, link };
};

/**
 * makeGraphData
 */
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

/**
 * makeGraphDataFromList
 */
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

/**
 * mergeGraphs
 */
const mergeGraphs = (graph1: GraphData, graph2: GraphData) => {
  return {
    nodes: uniqueObjectsById([...graph1?.nodes, ...graph2.nodes]),
    links: [...graph1.links, ...graph2.links],
  };
};

/**
 * parseResponseType
 */
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

export default useSearchNode;
