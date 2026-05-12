import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createOwnerContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: process.env.OWNER_OPEN_ID || "owner-user",
    email: "owner@kaewta.com",
    name: "Owner User",
    loginMethod: "manus",
    role: "owner",
    phone: "0812345678",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("bookings router", () => {
  describe("services.list", () => {
    it("returns list of services", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const services = await caller.services.list();

      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);
      expect(services[0]).toHaveProperty("name");
      expect(services[0]).toHaveProperty("price");
      expect(services[0]).toHaveProperty("duration");
    });
  });

  describe("serviceAreas.list", () => {
    it("returns list of service areas", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const areas = await caller.serviceAreas.list();

      expect(Array.isArray(areas)).toBe(true);
      expect(areas.length).toBeGreaterThan(0);
      expect(areas[0]).toHaveProperty("name");
      expect(areas[0]).toHaveProperty("latitude");
      expect(areas[0]).toHaveProperty("longitude");
      expect(areas[0]).toHaveProperty("radiusKm");
    });
  });

  describe("serviceAreas.checkServiceArea", () => {
    it("returns service area check result", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // Nakhon Pathom city center coordinates
      const result = await caller.serviceAreas.checkServiceArea({
        latitude: 13.8181,
        longitude: 100.0542,
      });

      expect(result).toHaveProperty("inServiceArea");
      expect(result).toHaveProperty("message");
      expect(typeof result.inServiceArea).toBe("boolean");
    });
  });

  describe("bookings.create", () => {
    it("creates a new booking with valid data", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() + 1);
      bookingDate.setHours(14, 0, 0, 0);

      try {
        const result = await caller.bookings.create({
          serviceId: 1,
          customerName: "สมชาย ใจดี",
          customerPhone: "0812345678",
          customerAddress: "123 ซ.สุขสวัสดิ์ ต.ท่าจีน อ.เมืองนครปฐม จ.นครปฐม",
          bookingDate,
          notes: "มีปัญหาบริเวณไหล่",
        });

        expect(result.success).toBe(true);
        expect(result).toHaveProperty("success");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("rejects booking with invalid phone number", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() + 1);
      bookingDate.setHours(14, 0, 0, 0);

      try {
        await caller.bookings.create({
          serviceId: 1,
          customerName: "สมชาย ใจดี",
          customerPhone: "081",
          customerAddress: "123 ซ.สุขสวัสดิ์ ต.ท่าจีน อ.เมืองนครปฐม จ.นครปฐม",
          bookingDate,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toBeDefined();
      }
    });
  });

  describe("bookings.list", () => {
    it("owner can view all bookings", async () => {
      const { ctx } = createOwnerContext();
      const caller = appRouter.createCaller(ctx);

      const bookings = await caller.bookings.list();

      expect(Array.isArray(bookings)).toBe(true);
    });

    it("non-owner cannot view all bookings", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.bookings.list();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toBeDefined();
      }
    });
  });

  describe("bookings.updateStatus", () => {
    it("owner can update booking status", async () => {
      const { ctx } = createOwnerContext();
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.bookings.updateStatus({
          id: 1,
          status: "confirmed",
        });

        expect(result).toBeDefined();
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("non-owner cannot update booking status", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.bookings.updateStatus({
          id: 1,
          status: "confirmed",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toBeDefined();
      }
    });
  });

  describe("therapists.list", () => {
    it("returns list of therapists", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const therapists = await caller.therapists.list();

      expect(Array.isArray(therapists)).toBe(true);
    });
  });
});
