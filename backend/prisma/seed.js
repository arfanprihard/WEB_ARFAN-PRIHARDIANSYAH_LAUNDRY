import { prisma } from "../src/config/db.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Bersihkan database terlebih dahulu agar tidak duplikat jika seeder di-run berkali-kali
  console.log("🧹 Cleaning existing users, levels, and services...");
  await prisma.user.deleteMany({});
  await prisma.level.deleteMany({});
  await prisma.typeOfService.deleteMany({});

  // 2. Hash password "123" menggunakan bcryptjs (salt rounds = 10)
  const hashedPassword = await bcrypt.hash("123", 10);

  // 3. Insert data Level (Admin, Operator, Pimpinan)
  console.log("📁 Creating Level records...");
  const adminLevel = await prisma.level.create({
    data: { level_name: "Admin" },
  });

  const operatorLevel = await prisma.level.create({
    data: { level_name: "Operator" },
  });

  const pimpinanLevel = await prisma.level.create({
    data: { level_name: "Pimpinan" },
  });

  console.log("✅ Levels created!");

  // 4. Insert data User untuk masing-masing Level dengan email @email.com dan password "123"
  console.log("👤 Creating User records...");
  await prisma.user.createMany({
    data: [
      {
        id_level: adminLevel.id,
        name: "User Admin",
        email: "admin@email.com",
        password: hashedPassword,
      },
      {
        id_level: operatorLevel.id,
        name: "User Operator",
        email: "operator@email.com",
        password: hashedPassword,
      },
      {
        id_level: pimpinanLevel.id,
        name: "User Pimpinan",
        email: "pimpinan@email.com",
        password: hashedPassword,
      },
    ],
  });

  console.log("✅ Users created!");

  // 5. Insert data TypeOfService (Layanan Laundry)
  console.log("🧺 Creating TypeOfService records...");
  await prisma.typeOfService.createMany({
    data: [
      {
        id: 1,
        service_name: "Cuci dan Gosok",
        price: 9000.00,
        description: "Cuci dan Gosok per kg",
        created_at: new Date("2026-07-06T14:08:03Z"),
        updated_at: new Date("2026-07-09T06:34:46Z"),
      },
      {
        id: 2,
        service_name: "Hanya Cuci",
        price: 4500.00,
        description: "Hanya Cuci per kg",
        created_at: new Date("2026-07-06T14:19:13Z"),
        updated_at: new Date("2026-07-06T16:09:26Z"),
      },
      {
        id: 3,
        service_name: "Hanya Gosok",
        price: 5000.00,
        description: "Hanya Gosok per kg",
        created_at: new Date("2026-07-06T16:09:26Z"),
        updated_at: new Date("2026-07-06T16:09:26Z"),
      },
      {
        id: 4,
        service_name: "Laundry Besar (selimut, karpet, mantel, sprei)",
        price: 7000.00,
        description: "Laundry besar seperti selimut, karpet, mantel, sprei per kg",
        created_at: new Date("2026-07-06T16:09:26Z"),
        updated_at: new Date("2026-07-06T16:09:26Z"),
      },
    ],
  });

  console.log("✅ TypeOfServices created!");
  console.log("🌱 Seed finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Menutup koneksi database setelah selesai
    await prisma.$disconnect();
  });
