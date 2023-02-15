/**
 * StartInput
 */
export default function StartInput({
  onSubmit,
}: {
  onSubmit: (value: any) => void;
}) {
  return (
    <div className="inset-center w-1/2 center">
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          onSubmit(e.nativeEvent.target?.[0].value);
        }}
      >
        <input
          type={"text"}
          placeholder="Search artists or designers..."
          className="bg-zinc-800 outline-none rounded-md p-8 text-4xl w-full"
        />
      </form>
    </div>
  );
}
