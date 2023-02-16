import StartInput from "./StartInput";
import {
  Card,
  Chip,
  Label,
  PlusIcon,
  Row,
  SearchIcon,
} from "./StyledComponents";
import reactStringReplace from "react-string-replace";
import { ReactNode, ReactNodeArray, useState } from "react";

const RenderNodeArray = ({ data }: { data: ReactNodeArray }) => {
  console.log(data);
  data.map((node: any) => {
    const isMatch = typeof node === "object";
    const rawText = isMatch && node.props.children;
    console.log(isMatch && node.props.children);
  });

  return <>{data}</>;
};

const AddPromptButton = () => (
  <div
    className={
      "ease-in duration-75 opacity-50 hover:opacity-100 animate cursor-pointer"
    }
  >
    <Card>
      <PlusIcon className="m-auto" />
    </Card>
  </div>
);

export default function SearchQueryModal({ onSubmit }: any) {
  const [state, setState] = useState({
    blocks: [{ label: undefined, value: "" }],
    searchInput: "",
  });

  return (
    <div className="inset-center center z-50" style={{ width: 600 }}>
      <Card>
        <Chip>
          <Row>
            <SearchIcon className="mr-2" />
            <StartInput onSubmit={onSubmit} value={state.searchInput} />
          </Row>
        </Chip>
      </Card>
      <Card>
        <div className="mb-3 pr-4 w-fit rounded-full">
          <Label>Add Label +</Label>
        </div>
        <Chip>
          <StartInput
            onSubmit={onSubmit}
            value={"Who are, or were, @Wade Guyton's contemporaries?"}
          />
        </Chip>
      </Card>
      <AddPromptButton />
    </div>
  );
}
