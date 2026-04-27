interface YesNoButtonsProps {
  onYes: () => void;
  onNo: () => void;
  yesLabel?: string;
  noLabel?: string;
  disabled?: boolean;
  withThumbs?: boolean;
}

function ThumbsUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-9 w-9"
      aria-hidden="true"
    >
      <path d="M7 11v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3z" />
      <path d="M7 11l4-7a2 2 0 0 1 3.6 1.7L13 10h5.5a2 2 0 0 1 2 2.3l-1.2 7a2 2 0 0 1-2 1.7H7" />
    </svg>
  );
}

function ThumbsDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-9 w-9"
      aria-hidden="true"
    >
      <path d="M17 13V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3z" />
      <path d="M17 13l-4 7a2 2 0 0 1-3.6-1.7L11 14H5.5a2 2 0 0 1-2-2.3l1.2-7a2 2 0 0 1 2-1.7H17" />
    </svg>
  );
}

export function YesNoButtons({
  onYes,
  onNo,
  yesLabel = "Yes",
  noLabel = "No",
  disabled = false,
  withThumbs = false,
}: YesNoButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        disabled={disabled}
        onClick={onNo}
        className="flex h-32 items-center justify-center gap-3 rounded-3xl bg-no text-3xl font-bold text-white shadow-lg shadow-no/30 transition-transform active:scale-[0.98] active:bg-no-hi disabled:opacity-50"
      >
        {withThumbs && <ThumbsDownIcon />}
        <span>{noLabel}</span>
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onYes}
        className="flex h-32 items-center justify-center gap-3 rounded-3xl bg-yes text-3xl font-bold text-white shadow-lg shadow-yes/30 transition-transform active:scale-[0.98] active:bg-yes-hi disabled:opacity-50"
      >
        {withThumbs && <ThumbsUpIcon />}
        <span>{yesLabel}</span>
      </button>
    </div>
  );
}
