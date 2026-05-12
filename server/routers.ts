import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Services routers
  services: router({
    list: publicProcedure.query(async () => {
      return await db.getAllServices();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getServiceById(input.id);
      }),
  }),

  // Service areas routers
  serviceAreas: router({
    list: publicProcedure.query(async () => {
      return await db.getServiceAreas();
    }),
  }),

  // Bookings routers
  bookings: router({
    create: publicProcedure
      .input(z.object({
        serviceId: z.number(),
        customerName: z.string().min(1),
        customerPhone: z.string().min(9),
        customerAddress: z.string().min(1),
        bookingDate: z.date(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          // Create booking
          const result = await db.createBooking({
            serviceId: input.serviceId,
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            customerAddress: input.customerAddress,
            bookingDate: input.bookingDate,
            notes: input.notes,
            status: "pending",
            userId: ctx.user?.id,
          });

          // Get the service details
          const service = await db.getServiceById(input.serviceId);

          // Create notification for owner
          try {
            const bookingId = (result as any).insertId;
            const ownerUser = await db.getUserByOpenId(process.env.OWNER_OPEN_ID || "");
            if (ownerUser && bookingId) {
              await db.createNotification({
                bookingId: bookingId,
                userId: ownerUser.id,
                title: "การจองบริการใหม่",
                message: `มีการจองบริการ "${service?.name}" จาก ${input.customerName} (${input.customerPhone})`,
                isRead: 0,
              });
            }

            // Send notification to owner
            await notifyOwner({
              title: "การจองบริการใหม่ 🎉",
              content: `ลูกค้า: ${input.customerName}\nเบอร์โทร: ${input.customerPhone}\nบริการ: ${service?.name}\nวันเวลา: ${input.bookingDate.toLocaleString('th-TH')}\nที่อยู่: ${input.customerAddress}`,
            });
          } catch (notificationError) {
            console.error("Error creating notification:", notificationError);
            // Don't throw - booking was created successfully, notification is secondary
          }

          return {
            success: true,
            bookingId: (result as any).insertId,
          };
        } catch (error) {
          console.error("Error creating booking:", error);
          throw error;
        }
      }),

    list: publicProcedure.query(async () => {
      return await db.getAllBookings();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getBookingById(input.id);
      }),

    getByUserId: protectedProcedure.query(async ({ ctx }) => {
      return await db.getBookingsByUserId(ctx.user.id);
    }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
      }))
      .mutation(async ({ input, ctx }) => {
        // Check if user is owner
        if (ctx.user.role !== "owner") {
          throw new Error("Only owner can update booking status");
        }

        return await db.updateBookingStatus(input.id, input.status);
      }),
  }),

  // Notifications routers
  notifications: router({
    getByUserId: protectedProcedure.query(async ({ ctx }) => {
      return await db.getNotificationsByUserId(ctx.user.id);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.markNotificationAsRead(input.id);
      }),
  }),

  // Therapists routers
  therapists: router({
    list: publicProcedure.query(async () => {
      return await db.getAllTherapists();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getTherapistById(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
