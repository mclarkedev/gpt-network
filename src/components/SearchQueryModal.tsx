import StartInput from "./StartInput";

const Card = (props: any) => (
  <div {...props} className="rounded-2xl bg-neutral-900 p-5 mb-6" />
);

const Chip = (props: any) => (
  <div
    {...props}
    className="bg-neutral-800 rounded-full px-5 py-2 text-md w-full"
  />
);

const Label = (props: any) => (
  <div {...props} className="text-sm font-mono text-gray-400" />
);

const Row = (props: any) => <div {...props} className="flex" />;

const Space = (props: any) => <div {...props} className="w-full h-5" />;

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M19.5 19.3789L16 15.8789"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11.5 17.3789C14.8137 17.3789 17.5 14.6926 17.5 11.3789C17.5 8.0652 14.8137 5.37891 11.5 5.37891C8.18629 5.37891 5.5 8.0652 5.5 11.3789C5.5 14.6926 8.18629 17.3789 11.5 17.3789Z"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

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
