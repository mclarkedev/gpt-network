import StartInput from "./StartInput";
import {
  Card,
  Chip,
  Label,
  PlusIcon,
  Row,
  SearchIcon,
  Space,
} from "./StyledComponents";
import { useState } from "react";
import Editor from "./Editor";

const AddPromptButton = ({ onClick }: { onClick: () => void }) => (
  <div
    className={
      "ease-in duration-75 opacity-50 hover:opacity-100 animate cursor-pointer"
    }
    onClick={onClick}
  >
    <Card>
      <PlusIcon className="m-auto" />
    </Card>
  </div>
);

const LabelChip = () => (
  <div className="mb-3 pr-4 w-fit rounded-full">
    <Label>Add Label +</Label>
  </div>
);

interface SearchQueryState {
  blocks: { label: string | null; value: string }[];
  startNode: string | null;
}

export default function SearchQueryModal({ onSubmit }: any) {
  const [state, setState] = useState<SearchQueryState>({
    blocks: [],
    startNode: null,
  });

  function handleStartNodeChange(value: string) {
    setState({ ...state, startNode: value.trim() });
  }

  function handleAddPromptClick() {
    setState({
      ...state,
      blocks: [...state.blocks, { label: null, value: "" }],
    });
  }

  return (
    <div
      className="inset-center center z-50"
      style={{
        width: 600,
        paddingTop: "20%",
        maxHeight: "100vh",
      }}
    >
      <Card>
        <Chip>
          <Row>
            <SearchIcon className="mr-2" />
            <StartInput
              onSubmit={onSubmit}
              value={state.startNode ? state.startNode : ""}
              onChange={handleStartNodeChange}
            />
          </Row>
        </Chip>
      </Card>
      {state.blocks.map((block, idx) => {
        return (
          <Card key={block.value + idx}>
            <LabelChip />
            <div className="bg-neutral-800 rounded-lg px-5 py-2 text-md w-full min-h-[40px]">
              <Editor
                activeMention={
                  state.startNode ? state.startNode : "artists or designers"
                }
              />
            </div>
          </Card>
        );
      })}
      <AddPromptButton onClick={handleAddPromptClick} />
      <Space />
    </div>
  );
}
