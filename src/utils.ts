import { debounce, fromEvent, map, timer } from "rxjs";

// Graph gen helper
export function genRandomTree(N = 300, reverse = false) {
  return {
    nodes: [...Array(N).keys()].map((i) => ({ id: i })),
    links: [...Array(N).keys()]
      .filter((id) => id)
      .map((id) => ({
        [reverse ? "target" : "source"]: id,
        [reverse ? "source" : "target"]: Math.round(Math.random() * (id - 1)),
      })),
  };
}

// A constant string key a user would never type
export const separator = "__SEPARATOR:226d94d9-e58d-4eae-80de-da9c0b254a57_";

// State helper
export function replaceItemAtIndex(arr: any[], index: number, newValue: any) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

// State helper
export function removeItemAtIndex(arr: any[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

/**
 * OpenAI SSE helper
 * - https://github.com/beskar-co/parse-json-sse/
 */
export const parseJsonSSE = async <T>({
  data,
  onParse,
  onFinish,
}: {
  data: ReadableStream;
  onParse: (object: T) => void;
  onFinish: () => void;
}) => {
  const reader = data.getReader();
  const decoder = new TextDecoder();

  let done = false;
  let tempState = "";

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const newValue = decoder.decode(value).split("\n\n").filter(Boolean);

    if (tempState) {
      newValue[0] = tempState + newValue[0];
      tempState = "";
    }

    newValue.forEach((newVal) => {
      try {
        const json = JSON.parse(newVal.replace("data: ", "")) as T;

        onParse(json);
      } catch (error) {
        tempState = newVal;
      }
    });
  }

  onFinish();
};

// Network helper
export async function fetchWithTimeout(
  resource: URL | RequestInfo,
  options: any
) {
  const timeout = 8000;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

/**
 * uniqueObjects
 */
export function uniqueObjectsById(arr: any[]) {
  let uniqueArr = [];
  let ids: any[] = [];

  for (let i = 0; i < arr.length; i++) {
    if (!ids.includes(arr[i].id)) {
      uniqueArr.push(arr[i]);
      ids.push(arr[i].id);
    }
  }

  return uniqueArr;
}

// Resize handler
export const debouncedResizeSubscription = (
  onDebounce = console.log,
  time = 500
) => {
  return fromEvent(window, "resize")
    .pipe(
      debounce(() => timer(time)),
      map((event) => onDebounce(event))
    )
    .subscribe();
};

// SSR helper
export const isServer = typeof window === "undefined";

type Edge = {
  source: string;
  target: string;
};

export type NodeWithDepth = {
  id: string;
  depth: number;
};

/**
 * Depth-First Tree Traversal returns ordered nodes with depth from links
 */
export function dfsTraversal(
  nodes: { id: string }[],
  edges: Edge[],
  startingNodeId: string
): NodeWithDepth[] {
  const graph = new Map<string, string[]>();
  for (const edge of edges) {
    if (!graph.has(edge.source)) {
      graph.set(edge.source, []);
    }
    if (!graph.has(edge.target)) {
      graph.set(edge.target, []);
    }
    graph.get(edge.source)?.push(edge.target);
    graph.get(edge.target)?.push(edge.source);
  }

  const visited = new Set<string>();
  const nodesWithDepth: NodeWithDepth[] = [];

  function dfs(nodeId: string, depth: number) {
    visited.add(nodeId);
    nodesWithDepth.push({ id: nodeId, depth });
    const neighbors = graph.get(nodeId);
    if (neighbors) {
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, depth + 1);
        }
      }
    }
  }

  // Perform DFS on startingNodeId
  dfs(startingNodeId, 0);

  // Iterate over all nodes in the nodes array and perform DFS on any that haven't been visited
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id, 0);
    }
  }

  return nodesWithDepth;
}

export type ChatCompletionRes = {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    delta: {
      content: string;
    };
  }[];
};
