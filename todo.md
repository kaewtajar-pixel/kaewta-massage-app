# แก้วตานวดแผนไทย - Project TODO

## Database & Backend
- [x] สร้างตาราง bookings (การจอง)
- [x] สร้างตาราง services (บริการนวด)
- [x] สร้างตาราง service_areas (พื้นที่บริการ)
- [x] สร้างตาราง notifications (แจ้งเตือน)
- [x] สร้าง tRPC procedures สำหรับจองบริการ
- [x] สร้าง tRPC procedures สำหรับดึงข้อมูลบริการ
- [x] สร้าง tRPC procedures สำหรับตรวจสอบพื้นที่บริการ
- [x] สร้าง tRPC procedures สำหรับแดชบอร์ดเจ้าของ

## Frontend - Landing Page & Services
- [x] ออกแบบและสร้าง Landing Page (Hero, Features, Services, CTA)
- [x] สร้างหน้าแสดงรายการบริการนวด (3 ประเภท)
- [x] สร้างหน้าข้อมูลความปลอดภัย (KYC, ตรวจสอบหมอ, SOS)
- [x] สร้างหน้าแผนที่บริการ (Google Maps integration)

## Frontend - Booking System
- [x] สร้างฟอร์มจองบริการ (ชื่อ, เบอร์โทร, ที่อยู่, วัน, เวลา, บริการ)
- [x] สร้างระบบตรวจสอบพื้นที่บริการ
- [x] สร้างหน้าประวัติการจอง
- [x] สร้างหน้ายืนยันการจอง (ตัวเลือก)

## Frontend - Owner Dashboard
- [x] สร้างแดชบอร์ดเจ้าของ (หน้าหลัก)
- [x] สร้างหน้าจัดการการจอง (รายการจอง, สถานะ)
- [x] สร้างหน้าสถิติและรายงาน (จำนวนการจอง, รายได้)
- [x] สร้างหน้าจัดการบริการ

## Design & Assets
- [x] ออกแบบสีและ typography (สวยงาม, หรูหรา)
- [x] สร้างหรือหา logo และ branding assets
- [x] สร้างรูปภาพสำหรับบริการนวด

## Notifications & Integration
- [x] สร้างระบบแจ้งเตือนเมื่อมีการจองใหม่
- [x] สร้างการเชื่อมต่อกับ LINE OA (ลิงก์ไปยัง LINE)
- [x] สร้างการเชื่อมต่อกับ Google Maps API (ใช้ Map component แทน)

## Testing & Deployment
- [x] เขียน unit tests สำหรับ backend procedures
- [x] ทดสอบระบบจองบริการ
- [x] ทดสอบแดชบอร์ดเจ้าของ
- [x] ปรับแต่งประสิทธิภาพและ responsive design
- [x] สร้าง checkpoint สำหรับการเผยแพร่

## LINE OA Integration
- [x] สร้างหน้าเชื่อมต่อ LINE OA (LineSettings.tsx)
- [x] สร้าง LINE Integration backend (line-integration.ts)
- [x] เพิ่ม Webhook endpoint สำหรับ LINE (lineWebhook.ts)
- [x] เชื่อมต่อ LINE OA กับระบบจองบริการ
- [x] เพิ่มการส่งแจ้งเตือนผ่าน LINE
- [x] ทดสอบ LINE Integration (vitest passed 18/18)
