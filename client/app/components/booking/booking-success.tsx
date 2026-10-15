import { useEffect, useRef } from "react";

export function BookingSuccess({ name }: { name: string }) {
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ block: "center" });
    messageRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <p
      ref={messageRef}
      tabIndex={-1}
      className="font-display text-2xl leading-snug outline-none md:text-3xl"
    >
      Thanks, {name}. Your request is on its way, and your artist will reach out soon.
    </p>
  );
}
