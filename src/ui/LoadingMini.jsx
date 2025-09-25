import clsx from "clsx";

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-6 w-6 border-2",
};

export default function LoadingMini({ size = "md", label, className }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx("inline-flex items-center gap-2", className)}
    >
      <span className={clsx("mini-spinner", sizes[size])} />
      {label ? (
        <span className="text-sm font-medium text-zinc-100">{label}</span>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );
}
