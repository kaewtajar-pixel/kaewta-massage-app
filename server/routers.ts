import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";
import {
  notifyNewBooking,
  notifyBookingConfirmed,
  notifyBookingStatusChanged,
} from "./line-integration";

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
    
    checkServiceArea: publicProcedure
      .input(z.object({
        latitude: z.number(),
        longitude: z.number(),
      }))
      .query(async ({ input }) => {
        const areas = await db.getServiceAreas();
        
        // Calculate distance from each service area center
        const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371; // Earth's radius in km
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          return R * c;
        };
        
        // Check if customer location is within any service area
        const inServiceArea = areas.some(area => {
          const distance = haversineDistance(
            input.latitude,
            input.longitude,
            Number(area.latitude),
            Number(area.longitude)
          );
          return distance <= Number(area.radiusKm);
        });
        
        return {
          inServiceArea,
          message: inServiceArea 
            ? "ที่อยู่ของคุณอยู่ในพื้นที่บริการ ✓"
            : "ขออภัย ที่อยู่ของคุณอยู่นอกพื้นที่บริการ",
        };
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
        latitude: z.number().optional(),
        longitude: z.number().optional(),
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

            // Send LINE notification to owner if configured
            try {
              const ownerLineUserId = process.env.OWNER_LINE_USER_ID;
              if (ownerLineUserId) {
                await notifyNewBooking(ownerLineUserId, {
                  customerName: input.customerName,
                  serviceName: service?.name || "บริการนวด",
                  bookingDate: input.bookingDate.toLocaleDateString('th-TH'),
                  bookingTime: input.bookingDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
                  phone: input.customerPhone,
                  address: input.customerAddress,
                });
              }
            } catch (lineError) {
              console.warn("Warning: Failed to send LINE notification to owner:", lineError);
              // Don't throw - booking was created successfully, LINE notification is secondary
            }
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

    list: protectedProcedure.query(async ({ ctx }) => {
      // Only owner can view all bookings
      if (ctx.user.role !== "owner") {
        throw new Error("Only owner can view all bookings");
      }
      return await db.getAllBookings();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const booking = await db.getBookingById(input.id);
        // Allow owner to view any booking, or user to view their own booking
        if (ctx.user.role !== "owner" && booking?.userId !== ctx.user.id) {
          throw new Error("Unauthorized to view this booking");
        }
        return booking;
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

        const result = await db.updateBookingStatus(input.id, input.status);

        // Send LINE notification to customer if status changed
        try {
          const booking = await db.getBookingById(input.id);
          if (booking) {
            const service = await db.getServiceById(booking.serviceId);
            const customerLineUserId = process.env.CUSTOMER_LINE_USER_ID;

            if (customerLineUserId && input.status === "confirmed") {
              await notifyBookingConfirmed(customerLineUserId, {
                serviceName: service?.name || "บริการนวด",
                bookingDate: new Date(booking.bookingDate).toLocaleDateString('th-TH'),
                bookingTime: new Date(booking.bookingDate).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
              });
            } else if (customerLineUserId && (input.status === "completed" || input.status === "cancelled")) {
              await notifyBookingStatusChanged(customerLineUserId, {
                serviceName: service?.name || "บริการนวด",
                status: input.status,
              });
            }
          }
        } catch (lineError) {
          console.warn("Warning: Failed to send LINE notification to customer:", lineError);
          // Don't throw - booking status was updated successfully
        }

        return result;
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

  // LINE OA Integration routers
  line: router({
    saveSettings: protectedProcedure
      .input(z.object({
        channelId: z.string(),
        channelSecret: z.string(),
        channelAccessToken: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Only owner can save LINE settings
        if (ctx.user.role !== "owner") {
          throw new Error("Only owner can save LINE settings");
        }

        // Validate the token by testing connection
        try {
          const response = await fetch('https://api.line.biz/v2/bot/profile/me', {
            headers: {
              'Authorization': `Bearer ${input.channelAccessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error('Invalid LINE Channel Access Token');
          }

          return {
            success: true,
            message: 'LINE OA settings saved successfully',
          };
        } catch (error) {
          console.error('Error validating LINE token:', error);
          throw new Error('Failed to validate LINE Channel Access Token');
        }
      }),

    testConnection: protectedProcedure
      .input(z.object({
        channelAccessToken: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Only owner can test LINE connection
        if (ctx.user.role !== "owner") {
          throw new Error("Only owner can test LINE connection");
        }

        try {
          const response = await fetch('https://api.line.biz/v2/bot/profile/me', {
            headers: {
              'Authorization': `Bearer ${input.channelAccessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error('Invalid LINE Channel Access Token');
          }

          const data = await response.json() as any;

          return {
            success: true,
            message: 'LINE connection successful',
            botName: data.displayName,
          };
        } catch (error) {
          console.error('Error testing LINE connection:', error);
          throw new Error('Failed to connect to LINE');
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
