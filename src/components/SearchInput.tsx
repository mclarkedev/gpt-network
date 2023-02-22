import { useRecoilState } from "recoil";
import { searchInputState } from "@/state";
import { useUserActions } from "@/actions";

/**
 * SearchInput
 */
export default function SearchInput({}: {}) {
  const [searchInput, setSearchInput] = useRecoilState(searchInputState);
  const { searchNode } = useUserActions();

  const onSubmit = (e: any) => {
    e.preventDefault();
    searchNode({ id: searchInput });
    setSearchInput("");
  };

  const onChange = (e: any) => {
    setSearchInput(e.nativeEvent.target.value);
  };

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="w-full">
        <input
          type={"text"}
          placeholder="Search topics ..."
          className="outline-none bg-transparent w-full"
          value={searchInput}
          onChange={onChange}
        />
      </form>
    </div>
  );
}
