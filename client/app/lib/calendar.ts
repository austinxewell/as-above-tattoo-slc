import { sizeLabels, type BookingSession, type BookingWithActivity } from "~/lib/bookings";

export type CalendarEvent = {
  uid: string;
  title: string;
  description: string;
  location: string;
  url: string;
  start: Date;
  end: Date;
};

function shortName(name: string) {
  const [first, ...rest] = name.trim().split(/\s+/);
  const last = rest.at(-1);
  return last ? `${first} ${last[0]}.` : first;
}

export function sessionEvent(
  booking: BookingWithActivity,
  session: BookingSession,
  portalUrl: string,
  location = "",
): CalendarEvent {
  const start = new Date(session.startsAt);
  const end = new Date(start.getTime() + session.durationMinutes * 60_000);
  const number = booking.sessions.findIndex((item) => item.id === session.id) + 1;
  const sessionLabel =
    booking.sessions.length > 1 ? ` (session ${number} of ${booking.sessions.length})` : "";

  const description = [
    `Client: ${booking.name}`,
    booking.phone && `Phone: ${booking.phone}`,
    booking.email && `Email: ${booking.email}`,
    booking.instagram && `Instagram: @${booking.instagram}`,
    "",
    `Placement: ${booking.placement} · ${sizeLabels[booking.size]}`,
    `Idea: ${booking.idea}`,
    "",
    `Booking: ${portalUrl}`,
  ]
    .filter((line) => line !== null && line !== undefined)
    .join("\n");

  return {
    uid: `${session.id}@asabovetattoo`,
    title: `Tattoo: ${shortName(booking.name)}${sessionLabel}`,
    description,
    location,
    url: portalUrl,
    start,
    end,
  };
}

function toUtcStamp(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

export function googleCalendarUrl(event: CalendarEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toUtcStamp(event.start)}/${toUtcStamp(event.end)}`,
    details: event.description,
  });

  if (event.location) params.set("location", event.location);

  return `https://calendar.google.com/calendar/render?${params}`;
}

function escapeText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function fold(line: string) {
  const parts = [];
  for (let index = 0; index < line.length; index += 74) {
    parts.push(line.slice(index, index + 74));
  }
  return parts.join("\r\n ");
}

export function icsFile(event: CalendarEvent) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//As Above Tattoo//Portal//EN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART:${toUtcStamp(event.start)}`,
    `DTEND:${toUtcStamp(event.end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    ...(event.location ? [`LOCATION:${escapeText(event.location)}`] : []),
    `URL:${event.url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .map(fold)
    .join("\r\n");
}

export function downloadIcs(event: CalendarEvent, filename: string) {
  const blob = new Blob([icsFile(event)], { type: "text/calendar;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = href;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(href);
}
