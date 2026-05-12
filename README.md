# 🧖 Kaewta Massage App

แอปจองนวดออนไลน์ สร้างด้วย React + Express + MySQL

## Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS, shadcn/ui
- **Backend**: Express.js, tRPC
- **Database**: MySQL (Drizzle ORM)
- **Package Manager**: pnpm

---

## 🚀 Deploy บน Railway (แนะนำ)

### ขั้นตอน

1. **สร้าง account ที่** [railway.app](https://railway.app)

2. **สร้าง MySQL database**
   - กด `+ New` → `Database` → `MySQL`
   - Copy `DATABASE_URL` จาก Variables tab

3. **Deploy แอป**
   - กด `+ New` → `GitHub Repo` → เลือก repo นี้
   - ไปที่ Variables tab แล้วใส่ค่าจาก `.env.example`

4. **Run migrations**
   ```bash
   pnpm run db:push
   ```

---

## 💻 Run ในเครื่อง (Local)

```bash
# 1. ติดตั้ง dependencies
pnpm install

# 2. Copy และแก้ไข environment variables
cp .env.example .env

# 3. Run database migration
pnpm run db:push

# 4. Start dev server
pnpm run dev
```

---

## Environment Variables

| Variable | คำอธิบาย | จำเป็น |
|---|---|---|
| `DATABASE_URL` | MySQL connection string | ✅ |
| `JWT_SECRET` | Secret key สำหรับ auth | ✅ |
| `VITE_APP_ID` | App identifier | ✅ |
| `NODE_ENV` | `production` หรือ `development` | ✅ |
| `OWNER_OPEN_ID` | OpenID ของเจ้าของร้าน | ⚠️ |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API Key | ⚠️ |
| `BUILT_IN_FORGE_API_KEY` | API Key สำหรับ AI Chat | ⚠️ |

---

## Scripts

```bash
pnpm dev        # Development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm db:push    # Run database migrations
pnpm test       # Run tests
```
