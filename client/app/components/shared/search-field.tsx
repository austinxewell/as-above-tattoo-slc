import { useEffect, useId, useRef } from "react";
import { useNavigation, useSearchParams, useSubmit } from "react-router";
import { LoaderCircle, Search } from "lucide-react";

type SearchFieldProps = {
  label: string;
  placeholder?: string;
  className?: string;
};

const DEBOUNCE_MS = 300;

export function SearchField({ label, placeholder, className }: SearchFieldProps) {
  const id = useId();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const navigation = useNavigation();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastSubmittedRef = useRef(searchParams.get("q") ?? "");

  const query = searchParams.get("q") ?? "";
  const pendingQuery = navigation.location
    ? (new URLSearchParams(navigation.location.search).get("q") ?? "")
    : null;
  const isSearching = pendingQuery !== null && pendingQuery !== query;

  useEffect(() => {
    const input = inputRef.current;
    if (input && query !== lastSubmittedRef.current) {
      input.value = query;
      lastSubmittedRef.current = query;
    }
  }, [query]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function search(value: string) {
    const next = new URLSearchParams(searchParams);
    next.delete("page");

    const term = value.trim();
    lastSubmittedRef.current = term;

    if (term) next.set("q", term);
    else next.delete("q");

    submit(next, { replace: query !== "", preventScrollReset: true });
  }

  return (
    <form
      role="search"
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        clearTimeout(timerRef.current);
        search(inputRef.current?.value ?? "");
      }}
    >
      <label htmlFor={id} className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">
        {label}
      </label>

      <div className="relative mt-3">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id={id}
          type="search"
          name="q"
          defaultValue={query}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(event) => {
            const value = event.currentTarget.value;
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => search(value), DEBOUNCE_MS);
          }}
          className="w-full rounded-none border border-border bg-background py-3 pr-11 pl-11 text-base outline-none transition-colors focus-visible:border-accent"
        />
        {isSearching && (
          <LoaderCircle
            className="absolute top-1/2 right-4 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        )}
      </div>
    </form>
  );
}
