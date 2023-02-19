import { atom, useRecoilState } from "recoil";

import {
  Card,
  Chip,
  PlusIcon,
  Row,
  SearchIcon,
  Space,
} from "./StyledComponents";
import SearchInput from "./SearchInput";
import { separator } from "@/utils";
import SearchQueryItem from "./SearchQueryItem";

/**
 * Search Query List
 * - User edits a search query using the SearchQueryList
 */
export const searchQueryListState = atom({
  key: "searchQueryList",
  default: [
    {
      label: "Similar",
      content: ["Who is similar to ", separator, "?"],
    },
  ],
});

export default function SearchQueryListEditor() {
  const [searchQueryList, setSearchQueryList] = useRecoilState(searchQueryListState); // prettier-ignore
  const addSearchQuery = () => {
    setSearchQueryList((prevState) => [
      ...prevState,
      { label: "", prompt: ["Who is similar to ", separator, "?"] },
    ]);
  };

  return (
    <div
      className="inset-center center z-50"
      style={{
        width: 600,
        paddingTop: "20%",
        maxHeight: "100vh",
      }}
    >
      <SearchInputCard />
      {searchQueryList.map((item, index) => (
        <SearchQueryItem key={index} item={item} />
      ))}
      <AddButton onClick={addSearchQuery} />
      <Space />
    </div>
  );
}

const SearchInputCard = () => {
  return (
    <Card>
      <Chip>
        <Row>
          <SearchIcon className="mr-2" />
          <SearchInput />
        </Row>
      </Chip>
    </Card>
  );
};

const AddButton = ({ onClick }: { onClick: () => void }) => (
  <div
    className={"ease-in duration-75 opacity-50 hover:opacity-100 animate cursor-pointer"} //prettier-ignore
    onClick={onClick}
  >
    <Card>
      <PlusIcon className="m-auto" />
    </Card>
  </div>
);
