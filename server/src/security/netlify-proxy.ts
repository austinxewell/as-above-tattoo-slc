import type { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";

export async function isSignedByNetlify(req: Request, secret: string) {
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
    return req.get("x-nf-client-connection-ip") ?? req.ip ?? "unknown";
  }

  return req.ip ?? "unknown";
}

export async function requireNetlifyProxy(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.NETLIFY_SIGNATURE_SECRET;

  if (!secret || (await isSignedByNetlify(req, secret))) {
    next();
    return;
  }

  res.status(403).json({ errors: [{ message: "Requests must go through the website." }] });
}
