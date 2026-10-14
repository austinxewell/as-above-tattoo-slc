export function BrandLoader() {
  return (
    <div className="relative isolate p-14">
      <div
        className="absolute inset-0 -z-10 rounded-full bg-black/30 blur-3xl animate-pulse motion-reduce:animate-none dark:bg-accent/20"
        aria-hidden="true"
      />
      <img
        src="/images/logos/circle-seal.webp"
        alt=""
        width={500}
        height={500}
        className="w-36 animate-pulse motion-reduce:animate-none"
      />
    </div>
  );
}
