import { eq, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, services, bookings, serviceAreas, notifications, therapists, bookingAssignments } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'owner';
      updateSet.role = 'owner';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Services queries
export async function getAllServices() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(services).where(eq(services.isActive, 1));
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Service areas queries
export async function getServiceAreas() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(serviceAreas).where(eq(serviceAreas.isActive, 1));
}

// Bookings queries
export async function createBooking(booking: typeof bookings.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(bookings).values(booking);
  return result;
}

export async function getBookingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getBookingsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(bookings).where(eq(bookings.userId, userId));
}

export async function getAllBookings() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(bookings);
}

export async function updateBookingStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(bookings).set({ status: status as any }).where(eq(bookings.id, id));
}

// Notifications queries
export async function createNotification(notification: typeof notifications.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(notifications).values(notification);
}

export async function getNotificationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(notifications).where(eq(notifications.userId, userId));
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(notifications).set({ isRead: 1 }).where(eq(notifications.id, id));
}

// Therapists queries
export async function getAllTherapists() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(therapists).where(eq(therapists.isActive, 1));
}

export async function getTherapistById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(therapists).where(eq(therapists.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Booking assignments queries
export async function createBookingAssignment(assignment: typeof bookingAssignments.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(bookingAssignments).values(assignment);
}

export async function getBookingAssignmentByBookingId(bookingId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(bookingAssignments).where(eq(bookingAssignments.bookingId, bookingId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
