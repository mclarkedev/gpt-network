import { searchInputState } from "@/state";
import { useRecoilState } from "recoil";
import Editor from "./Editor";
import { Card, Label } from "./StyledComponents";

export default function SearchQueryCard({
  item,
  index,
}: {
  item: any;
  index: number;
}) {
  const [searchInput] = useRecoilState(searchInputState);
  return (
    <Card key={item.label + index}>
      <LabelChip>Add label +</LabelChip>
      <div className="bg-neutral-800 rounded-lg px-5 py-2 text-md w-full min-h-[40px]">
        <Editor
          activeMention={
            searchInput ? searchInput.trim() : "artists or designers"
          }
        />
      </div>
    </Card>
  );
}

const LabelChip = ({ children }: { children: string }) => (
  <div className="mb-3 pr-4 w-fit rounded-full">
    <Label>{children}</Label>
  </div>
);
