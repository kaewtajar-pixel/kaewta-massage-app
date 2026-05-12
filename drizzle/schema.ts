import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "owner"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Services table - แสดงรายการบริการนวดที่มีให้
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // เช่น "นวดแก้ออฟฟิศซินโดรม"
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // 350.00 บาท
  duration: int("duration").notNull(), // ระยะเวลาเป็นนาที (60 นาที = 1 ชั่วโมง)
  imageUrl: text("imageUrl"),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Bookings table - บันทึกการจองบริการ
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  serviceId: int("serviceId").notNull(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
  customerAddress: text("customerAddress").notNull(),
  bookingDate: timestamp("bookingDate").notNull(), // วันและเวลาที่ต้องการจอง
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

/**
 * Service areas table - พื้นที่บริการ (ตำแหน่ง)
 */
export const serviceAreas = mysqlTable("serviceAreas", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // เช่น "อำเภอเมืองนครปฐม"
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  radiusKm: decimal("radiusKm", { precision: 5, scale: 2 }).notNull(), // รัศมีบริการ (5-10 กม.)
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ServiceArea = typeof serviceAreas.$inferSelect;
export type InsertServiceArea = typeof serviceAreas.$inferInsert;

/**
 * Notifications table - บันทึกการแจ้งเตือน
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull(),
  userId: int("userId").notNull(), // เจ้าของธุรกิจ
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: int("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Therapists table - บันทึกข้อมูลหมอนวด (สำหรับเจ้าของ)
 */
export const therapists = mysqlTable("therapists", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  idNumber: varchar("idNumber", { length: 20 }).notNull(), // เลขประจำตัวประชาชน
  certifications: text("certifications"), // JSON array ของใบประกาศนียบัตร
  kycStatus: mysqlEnum("kycStatus", ["pending", "verified", "rejected"]).default("pending").notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Therapist = typeof therapists.$inferSelect;
export type InsertTherapist = typeof therapists.$inferInsert;

/**
 * Booking assignments table - การจับคู่หมอนวดกับการจอง
 */
export const bookingAssignments = mysqlTable("bookingAssignments", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull(),
  therapistId: int("therapistId").notNull(),
  startTime: timestamp("startTime"),
  endTime: timestamp("endTime"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BookingAssignment = typeof bookingAssignments.$inferSelect;
export type InsertBookingAssignment = typeof bookingAssignments.$inferInsert;
