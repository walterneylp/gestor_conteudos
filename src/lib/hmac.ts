import { createHmac, timingSafeEqual } from "crypto";

export const signPayload = (payload: string, secret: string) =>
  createHmac("sha256", secret).update(payload).digest("hex");

export const verifySignature = (payload: string, secret: string, signature?: string) => {
  if (!signature) {
    return false;
  }

  const expected = signPayload(payload, secret);

  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};
