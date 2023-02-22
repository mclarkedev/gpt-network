export const Card = (props: any) => (
  <div
    {...props}
    className="px-4 py-4 mb-5 bg-neutral-900 rounded-3xl border border-slate-500/30"
  />
);

export const Chip = (props: any) => (
  <div {...props} className="bg-white rounded-full px-5 py-2 text-md w-full" />
);

export const LabelText = (props: any) => (
  <div {...props} className="text-xs font-mono text-gray-400" />
);

export const Row = (props: any) => <div {...props} className="flex" />;

export const Space = (props: any) => <div {...props} className="w-full h-5" />;

export const SearchIcon = ({ className }: { className?: string }) => (
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
      stroke="gray"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.5 17.3789C14.8137 17.3789 17.5 14.6926 17.5 11.3789C17.5 8.0652 14.8137 5.37891 11.5 5.37891C8.18629 5.37891 5.5 8.0652 5.5 11.3789C5.5 14.6926 8.18629 17.3789 11.5 17.3789Z"
      stroke="gray"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7.06321 15.0358V0.649414H9.00639V15.0358H7.06321ZM0.835938 8.80851V6.87669H15.2337V8.80851H0.835938Z"
      fill="white"
    />
  </svg>
);
