import crypto from "crypto";

export const generateDownloadToken = (orderId, assetId, userId) => {
  const secret = process.env.JWT_SECRET || "download_secret";
  const payload = `${orderId}:${assetId}:${userId}:${Date.now() + 15 * 60 * 1000}`;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64url");
};

export const verifyDownloadToken = (token) => {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const [orderId, assetId, userId, expiresAt, hmac] = decoded.split(":");
    if (Date.now() > Number(expiresAt)) return null;
    const secret = process.env.JWT_SECRET || "download_secret";
    const expected = crypto.createHmac("sha256", secret).update(`${orderId}:${assetId}:${userId}:${expiresAt}`).digest("hex");
    return hmac === expected ? { orderId, assetId, userId } : null;
  } catch {
    return null;
  }
};
