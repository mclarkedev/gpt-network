import { useRecoilState, useSetRecoilState } from "recoil";
import { graphDataState, searchInputState } from "@/state";
import { useUserActions } from "@/actions";

/**
 * SearchInput
 */
export default function SearchInput({}: {}) {
  const [searchInput, setSearchInput] = useRecoilState(searchInputState);
  const setGraphData = useSetRecoilState(graphDataState);
  const { searchNode } = useUserActions();

  const onSubmit = (e: any) => {
    e.preventDefault();
    // Reset graph to single start node
    setGraphData(() => ({
      nodes: [{ id: searchInput }],
      links: [],
    }));
    searchNode({ id: searchInput });
  };

  const onChange = (e: any) => {
    setSearchInput(e.nativeEvent.target.value);
  };

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="w-full">
        <input
          type={"text"}
          placeholder="Search artists or designers..."
          className="outline-none bg-transparent w-full"
          value={searchInput}
          onChange={onChange}
        />
      </form>
    </div>
  );
}
