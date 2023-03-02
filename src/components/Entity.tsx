import useSearchNode from "@/actions/useSearchNode";
import { graphDataState } from "@/state";
import { useRecoilValue } from "recoil";

export default function Entity() {
  const graphData = useRecoilValue(graphDataState);
  const { searchNode } = useSearchNode();
  return (
    <div>
      {graphData.nodes
        ?.slice()
        .reverse()
        .map((node) => {
          return (
            <div
              key={node.id}
              className="cursor-pointer"
              onClick={() => {
                console.log(node);
                searchNode(node);
              }}
            >
              {node.id}
            </div>
          );
        })}
    </div>
  );
}
