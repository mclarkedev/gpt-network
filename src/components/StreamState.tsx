import {
  // graphHistoryState,
  graphPromptState,
  //   graphSelectedNodeState,
  // graphStatusState,
  // graphStreamState,
} from "@/state";
// import Link from "next/link";
import { useRecoilValue } from "recoil";
// import { Chip, Row } from "./StyledComponents";

export default function StreamState() {
  // const graphStatus = useRecoilValue(graphStatusState);
  // const graphStream = useRecoilValue(graphStreamState);
  const graphPrompt = useRecoilValue(graphPromptState);
  //   const graphHistory = useRecoilValue(graphHistoryState);
  //   console.log(graphSelectedNode);
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 p-5">
      <div className="flex justify-between">
        <div> </div>
        <div className="flex">
          {graphPrompt}
          {/* <div className={styles.card}>{graphPrompt}</div> */}
          {/* {graphHistory?.map((i) => {
            return (
              <div key={i} className={`${styles.card} mr-2`}>
                {i}
              </div>
            );
          })} */}
        </div>
        <div></div>
      </div>
    </div>
  );
}

// const styles = {
//   card: "rounded-full px-5 py-2 text-sm w-fit",
// };
