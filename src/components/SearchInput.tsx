import { searchInputState, searchSubmittedState } from "@/state";
import { useRecoilState } from "recoil";

/**
 * SearchInput
 */
export default function SearchInput({}: {}) {
  const [searchInput, setSearchInput] = useRecoilState(searchInputState);
  const [_, setSearchSubmitted] = useRecoilState(searchSubmittedState); // prettier-ignore

  return (
    <div className="w-full">
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          setSearchSubmitted(true);
        }}
        className="w-full"
      >
        <input
          type={"text"}
          placeholder="Search artists or designers..."
          className="outline-none bg-transparent w-full"
          value={searchInput}
          onChange={(e: any) => {
            setSearchInput(e.nativeEvent.target.value);
          }}
        />
      </form>
    </div>
  );
}
