import { describe, it, expect, beforeAll } from "vitest";
import crypto from "crypto";
import { verifyLineSignature } from "./_core/lineWebhook";

describe("LINE Integration", () => {
  let channelSecret: string;

  beforeAll(() => {
    channelSecret = process.env.LINE_CHANNEL_SECRET || "";
  });

  it("should have LINE_CHANNEL_SECRET configured", () => {
    expect(channelSecret).toBeTruthy();
    expect(channelSecret.length).toBeGreaterThan(0);
  });

  it("should have LINE_CHANNEL_ACCESS_TOKEN configured", () => {
    const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";
    expect(accessToken).toBeTruthy();
    expect(accessToken.length).toBeGreaterThan(0);
  });

  it("should have LINE_CHANNEL_ID configured", () => {
    const channelId = process.env.LINE_CHANNEL_ID || "";
    expect(channelId).toBeTruthy();
    expect(channelId.length).toBeGreaterThan(0);
  });

  it("should have OWNER_LINE_USER_ID configured", () => {
    const ownerLineUserId = process.env.OWNER_LINE_USER_ID || "";
    expect(ownerLineUserId).toBeTruthy();
    expect(ownerLineUserId.length).toBeGreaterThan(0);
  });

  it("should verify LINE webhook signature correctly", () => {
    const testBody = JSON.stringify({
      events: [
        {
          type: "message",
          message: {
            type: "text",
            id: "100001",
            text: "Hello, world",
          },
          timestamp: 1462629479859,
          source: {
            type: "user",
            userId: "U4af4980482....",
          },
          replyToken: "nHuyWiB7yP5Zw52FIkcQT",
        },
      ],
    });

    // Create a valid signature
    const validSignature = crypto
      .createHmac("sha256", channelSecret)
      .update(testBody)
      .digest("base64");

    // Verify the signature
    const isValid = verifyLineSignature(testBody, validSignature, channelSecret);
    expect(isValid).toBe(true);
  });

  it("should reject invalid LINE webhook signature", () => {
    const testBody = JSON.stringify({
      events: [
        {
          type: "message",
          message: {
            type: "text",
            id: "100001",
            text: "Hello, world",
          },
          timestamp: 1462629479859,
        },
      ],
    });

    const invalidSignature = "invalid_signature_here";

    // Verify the signature
    const isValid = verifyLineSignature(testBody, invalidSignature, channelSecret);
    expect(isValid).toBe(false);
  });

  it("should have LINE Channel Access Token format valid", () => {
    const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";

    if (!accessToken) {
      console.warn("LINE_CHANNEL_ACCESS_TOKEN not configured, skipping format test");
      expect(true).toBe(true);
      return;
    }

    // LINE Channel Access Token should be a long string
    expect(accessToken.length).toBeGreaterThan(50);
    console.log("✓ LINE Channel Access Token format is valid");
    console.log("  Token length:", accessToken.length);
  });
});
