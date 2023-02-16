import { searchInputState, searchQueryListState } from "@/state";
import { replaceItemAtIndex } from "@/utils";
import { useRecoilState } from "recoil";
import Editor from "./Editor";
import { Card, Label } from "./StyledComponents";

export default function SearchQueryItem({ item }: { item: any }) {
  const [searchInput] = useRecoilState(searchInputState);
  const [searchQueryList, setSearchQueryList] = useRecoilState(searchQueryListState); // prettier-ignore
  const index = searchQueryList.findIndex((listItem) => listItem === item);

  const editSearchQueryItem = (promptContent: string[]) => {
    const newList = replaceItemAtIndex(searchQueryList, index, {
      ...item,
      prompt: promptContent,
    });

    setSearchQueryList(newList);
  };

  function handlePromptChange(promptContent: string[]) {
    editSearchQueryItem(promptContent);
  }

  return (
    <Card>
      <LabelChip>{item.label ? item.label : "Add label +"}</LabelChip>
      <div className="bg-neutral-800 rounded-lg px-5 py-2 text-md w-full min-h-[40px]">
        <Editor
          activeMention={
            searchInput ? searchInput.trim() : "artists or designers"
          }
          onChange={handlePromptChange}
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
