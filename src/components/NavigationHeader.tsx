import Link from "next/link";
import { Chip, Row } from "./StyledComponents";

export default function NavigationHeader() {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 p-5">
      <div className="flex justify-between">
        <Link href="/">
          <div className={styles.card}>{"<-"}</div>
        </Link>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

const styles = {
  card: "bg-neutral-800 rounded-full px-5 py-2 text-sm w-fit",
};
