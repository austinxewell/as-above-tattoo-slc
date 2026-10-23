import { Fragment, type CSSProperties } from "react";
import { Button, Heading, Section, Text } from "@react-email/components";
import type { Booking } from "../models/booking.js";
import { buttonStyle, emailColors, eyebrowStyle } from "./email-layout.js";

const sizeLabels: Record<Booking["size"], string> = {
  small: "Small (under 2 in)",
  medium: "Medium (2–5 in)",
  large: "Large (5+ in)",
  project: "Large project",
};

const labelStyle: CSSProperties = { ...eyebrowStyle, letterSpacing: "0.15em" };
const valueStyle: CSSProperties = {
  margin: "2px 0 14px",
  fontSize: "15px",
  lineHeight: "22px",
  color: emailColors.ink,
};

type BookingRequestEmailProps = {
  artistName?: string;
  name: string;
  email: string;
  phone?: string | null;
  placement: string;
  size: Booking["size"];
  budget?: string | null;
  availability?: string | null;
  idea: string;
  portalUrl: string;
};

function BookingRequestEmail(props: BookingRequestEmailProps) {
  const rows = [
    ["Artist", props.artistName ?? "No preference"],
    ["Email", props.email],
    ["Phone", props.phone || "Not given"],
    ["Placement", props.placement],
    ["Size", sizeLabels[props.size]],
    ["Budget", props.budget || "Not given"],
    ["Availability", props.availability || "Not given"],
  ];

  return (
    <>
      <Text style={eyebrowStyle}>New tattoo request</Text>
      <Heading
        as="h1"
        style={{
          margin: "8px 0 24px",
          fontSize: "26px",
          lineHeight: "32px",
          color: emailColors.ink,
        }}
      >
        {props.name}
      </Heading>

      <Section>
        {rows.map(([label, value]) => (
          <Fragment key={label}>
            <Text style={labelStyle}>{label}</Text>
            <Text style={valueStyle}>{value}</Text>
          </Fragment>
        ))}
      </Section>

      <Section style={{ borderLeft: `3px solid ${emailColors.gold}`, padding: "4px 0 4px 16px" }}>
        <Text style={labelStyle}>Their idea</Text>
        <Text style={{ ...valueStyle, margin: "4px 0 0", whiteSpace: "pre-line" }}>
          {props.idea}
        </Text>
      </Section>

      <Button href={props.portalUrl} style={buttonStyle}>
        Open the staff portal
      </Button>

      <Text style={{ margin: "20px 0 0", fontSize: "13px", color: emailColors.muted }}>
        Reply to this email to contact {props.name} directly.
      </Text>
    </>
  );
}

export function bookingRequestEmail(props: BookingRequestEmailProps) {
  return {
    subject: `New tattoo request from ${props.name} (${props.artistName ?? "no preference"})`,
    preview: `${props.placement} · ${sizeLabels[props.size]} · ${props.idea}`,
    content: <BookingRequestEmail {...props} />,
  };
}
