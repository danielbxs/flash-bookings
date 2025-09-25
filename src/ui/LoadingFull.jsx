import LoadingMini from "./LoadingMini";

export default function LoadingFull({ label = "Loading..." }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <LoadingMini size="lg" label={label} />
    </div>
  );
}
