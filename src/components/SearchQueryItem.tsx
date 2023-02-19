import { searchInputState } from "@/state";
import { replaceItemAtIndex } from "@/utils";
import { useRef } from "react";
import { useRecoilState } from "recoil";
import Editor from "./Editor";
import { searchQueryListState } from "./SearchQueryList";
import { Card, LabelText } from "./StyledComponents";

export default function SearchQueryItem({ item }: { item: any }) {
  const [searchInput] = useRecoilState(searchInputState);
  const [searchQueryList, setSearchQueryList] = useRecoilState(searchQueryListState); // prettier-ignore
  const index = searchQueryList.findIndex((listItem) => listItem === item);
  const labelRef = useRef(null);

  const editSearchQueryContent = (content: string[]) => {
    const newList = replaceItemAtIndex(searchQueryList, index, {
      ...item,
      content: content,
    });

    setSearchQueryList(newList);
  };

  const editSearchQueryLabel = (label: string) => {
    const newList = replaceItemAtIndex(searchQueryList, index, {
      ...item,
      label: label,
    });

    setSearchQueryList(newList);
  };

  return (
    <Card>
      <Label>
        <input
          ref={labelRef}
          type={"text"}
          placeholder="Add label +"
          className="outline-none bg-transparent w-full"
          value={item.label}
          onChange={(e: any) => {
            editSearchQueryLabel(e.nativeEvent.target.value);
          }}
        />
      </Label>
      <div className="bg-neutral-800 rounded-lg px-5 py-2 text-md w-full min-h-[40px]">
        <Editor
          activeMention={
            searchInput ? searchInput.trim() : "artists or designers"
          }
          onChange={editSearchQueryContent}
        />
      </div>
    </Card>
  );
}

const Label = (props: any) => (
  <div {...props} className="mb-3 pr-4 w-fit rounded-full">
    <LabelText>{props.children}</LabelText>
  </div>
);
