import type { CSSProperties, ReactNode } from "react";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export const emailColors = {
  page: "#f1e9dc",
  card: "#ffffff",
  ink: "#201c1a",
  muted: "#6b625a",
  header: "#151515",
  gold: "#956c31",
  border: "#e4dccf",
};

export const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "11px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: emailColors.gold,
};

export const buttonStyle: CSSProperties = {
  marginTop: "28px",
  backgroundColor: emailColors.gold,
  color: "#fffaf2",
  padding: "12px 22px",
  fontSize: "12px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  textDecoration: "none",
};

type EmailLayoutProps = {
  preview: string;
  footer: string;
  children: ReactNode;
};

export function EmailLayout({ preview, footer, children }: EmailLayoutProps) {
  const assetUrl = process.env.EMAIL_ASSET_URL ?? process.env.CLIENT_URL;

  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: emailColors.page,
          margin: 0,
          padding: "24px 12px",
          fontFamily: "Helvetica, Arial, sans-serif",
          color: emailColors.ink,
        }}
      >
        <Container
          style={{
            maxWidth: "560px",
            backgroundColor: emailColors.card,
            border: `1px solid ${emailColors.border}`,
          }}
        >
          <Section
            style={{
              backgroundColor: emailColors.header,
              padding: "28px 32px",
              textAlign: "center",
            }}
          >
            <Img
              src={`${assetUrl}/images/logos/shop-name-transparent.png`}
              width="280"
              alt="As Above Tattoo"
              style={{ margin: "0 auto", maxWidth: "100%", height: "auto" }}
            />
          </Section>

          <Section style={{ padding: "32px" }}>{children}</Section>

          <Hr style={{ borderColor: emailColors.border, margin: 0 }} />

          <Section style={{ padding: "20px 32px" }}>
            <Text
              style={{ margin: 0, fontSize: "12px", lineHeight: "18px", color: emailColors.muted }}
            >
              {footer}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
