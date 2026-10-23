import { Fragment, type CSSProperties } from "react";
import { Heading, Link, Section, Text } from "@react-email/components";
import { emailColors, eyebrowStyle } from "./email-layout.js";

const labelStyle: CSSProperties = { ...eyebrowStyle, letterSpacing: "0.15em" };
const valueStyle: CSSProperties = {
  margin: "2px 0 14px",
  fontSize: "15px",
  lineHeight: "22px",
  color: emailColors.ink,
};

type IssueReportEmailProps = {
  name: string;
  email: string;
  role: string;
  what: string;
  expected?: string;
  pageUrl: string;
  userAgent: string;
  reportedAt: string;
};

function IssueReportEmail(props: IssueReportEmailProps) {
  const rows = [
    ["Reported by", `${props.name} (${props.role})`],
    ["Email", props.email],
    ["When", props.reportedAt],
    ["Browser", props.userAgent || "Unknown"],
  ];

  return (
    <>
      <Text style={eyebrowStyle}>Site issue report</Text>
      <Heading
        as="h1"
        style={{
          margin: "8px 0 24px",
          fontSize: "24px",
          lineHeight: "30px",
          color: emailColors.ink,
        }}
      >
        {props.name} reported a problem
      </Heading>

      <Section style={{ borderLeft: `3px solid ${emailColors.gold}`, padding: "4px 0 4px 16px" }}>
        <Text style={labelStyle}>What happened</Text>
        <Text style={{ ...valueStyle, whiteSpace: "pre-line" }}>{props.what}</Text>

        {props.expected && (
          <>
            <Text style={labelStyle}>What they expected</Text>
            <Text style={{ ...valueStyle, margin: "2px 0 0", whiteSpace: "pre-line" }}>
              {props.expected}
            </Text>
          </>
        )}
      </Section>

      <Section style={{ marginTop: "24px" }}>
        <Text style={labelStyle}>Page</Text>
        <Text style={valueStyle}>
          <Link href={props.pageUrl} style={{ color: emailColors.gold, wordBreak: "break-all" }}>
            {props.pageUrl}
          </Link>
        </Text>

        {rows.map(([label, value]) => (
          <Fragment key={label}>
            <Text style={labelStyle}>{label}</Text>
            <Text style={valueStyle}>{value}</Text>
          </Fragment>
        ))}
      </Section>

      <Text style={{ margin: "8px 0 0", fontSize: "13px", color: emailColors.muted }}>
        Reply to this email to reach {props.name} directly.
      </Text>
    </>
  );
}

export function issueReportEmail(props: IssueReportEmailProps) {
  return {
    subject: `Site issue from ${props.name}: ${props.what.slice(0, 60)}`,
    preview: props.what,
    content: <IssueReportEmail {...props} />,
  };
}
