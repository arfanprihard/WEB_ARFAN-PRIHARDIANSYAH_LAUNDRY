import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

dotenv.config();

// Initialize Prisma client with MariaDB driver adapter
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "db_laundry",
  connectionLimit: 10,
});
const prisma = new PrismaClient({ adapter });

export { prisma };


