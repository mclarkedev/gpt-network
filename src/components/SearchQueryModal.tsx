import StartInput from "./StartInput";
import {
  Card,
  Chip,
  Label,
  PlusIcon,
  Row,
  SearchIcon,
} from "./StyledComponents";
import { useState } from "react";
import Editor from "./Editor";

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
    blocks: [{ label: null, value: "" }],
    startNode: null,
  });

  function handleStartNodeChange(value: string) {
    setState({ ...state, startNode: value.trim() });
  }
  return (
    <div className="inset-center center z-50" style={{ width: 600 }}>
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
      <Card>
        <LabelChip />
        <div className="bg-neutral-800 rounded-lg px-5 py-2 text-md w-full min-h-[40px]">
          <Editor
            activeMention={
              state.startNode ? state.startNode : "artists or designers"
            }
          />
        </div>
      </Card>
      <AddPromptButton />
    </div>
  );
}
