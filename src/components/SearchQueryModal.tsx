import StartInput from "./StartInput";
import { Card, Chip, Label, Row, SearchIcon } from "./StyledComponents";

export default function SearchQueryModal({ onSubmit }: any) {
  return (
    <div className="inset-center center z-50" style={{ width: 600 }}>
      <Card>
        <Chip>
          <Row>
            <SearchIcon className="mr-2" />
            <StartInput onSubmit={onSubmit} />
          </Row>
        </Chip>
      </Card>
      <Card>
        <div className="mb-2 pr-4 py-1  w-fit rounded-full">
          <Label>Add Label +</Label>
        </div>
        <Chip>
          <StartInput
            onSubmit={onSubmit}
            value={"Who are, or were, @Wade Guyton's contemporaries?"}
          />
        </Chip>
      </Card>
    </div>
  );
}
