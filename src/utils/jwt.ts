import { Buffer } from "buffer";

/**
 * Minimal, verification-free JWT payload decoder for reading claims
 * (sub/email/name) out of a Cognito ID token client-side. This does NOT
 * verify the token signature — it's only used to populate UI (display name,
 * email), never for authorization decisions (the backend verifies the access
 * token itself via the API Gateway JWT authorizer).
 */
export function decodeJwtPayload<T = Record<string, unknown>>(token: string): T | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
