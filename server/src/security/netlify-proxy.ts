import type { Request } from "express";
import { jwtVerify } from "jose";

async function isSignedByNetlify(req: Request, secret: string) {
  const signature = req.get("x-nf-sign");
  if (!signature) return false;

  try {
    await jwtVerify(signature, new TextEncoder().encode(secret), {
      issuer: "netlify",
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}

export async function getClientIp(req: Request) {
  const secret = process.env.NETLIFY_SIGNATURE_SECRET;

  if (secret && (await isSignedByNetlify(req, secret))) {
    console.log("[netlify-proxy] signed request", {
      nfClientIp: req.get("x-nf-client-connection-ip"),
      forwardedFor: req.get("x-forwarded-for"),
      reqIp: req.ip,
    });

    return req.get("x-nf-client-connection-ip") ?? req.ip ?? "unknown";
  }

  return req.ip ?? "unknown";
}
