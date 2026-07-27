# Aplikasi Manajemen Laundry (Web App)

Aplikasi manajemen sistem informasi laundry berbasis web yang dibangun dengan arsitektur **Client-Server**. Aplikasi ini dirancang untuk mempermudah pengelolaan transaksi laundry, pelanggan, jenis layanan, serta manajemen pengguna berdasarkan hak akses (Role / Level).

---

## Teknologi yang Digunakan

### **Frontend**
* **Framework / Library**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
* **Routing**: [React Router v7](https://reactrouter.com/)
* **Icons & Notifications**: Lucide React, SweetAlert2
* **HTTP Client**: Axios

### **Backend**
* **Runtime / Framework**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
* **Database ORM**: [Prisma ORM](https://www.prisma.io/)
* **Database Driver**: MySQL / MariaDB (`@prisma/adapter-mariadb`)
* **Autentikasi**: JSON Web Token (JWT) & Bcryptjs

---

## Role & Hak Akses Pengguna

Aplikasi ini mendukung multi-role dengan hak akses yang dapat disesuaikan:

1. **Admin**: Memiliki akses penuh untuk mengelola Pengguna (User), Hak Akses (Level), Pelanggan (Customer), Jenis Layanan, Transaksi Order, dan Pengambilan.
2. **Operator**: Berfokus pada operasional harian seperti membuat transaksi order laundry baru, memperbarui status pengerjaan, dan menangani pengambilan laundry oleh pelanggan.
3. **Pimpinan**: Mengakses laporan transaksi dan pemantauan statistik bisnis laundry.

---

## Akun Bawaan (Default Seeder)

Setelah menjalankan seeder database, Anda dapat login menggunakan akun default berikut (Password untuk semua akun: `123`):

| Role / Level | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@email.com` | `123` |
| **Operator** | `operator@email.com` | `123` |
| **Pimpinan** | `pimpinan@email.com` | `123` |

---

## Panduan Instalasi & Cara Menjalankan

### **Prasyarat**
* Node.js (v18 atau lebih baru)
* MySQL / MariaDB Server (misal melalui XAMPP atau Laragon) yang sedang berjalan pada port `3306`.

---

### **1. Setup Backend**

1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```

2. Install dependensi:
   ```bash
   npm install
   ```

3. Konfigurasi file `.env` pada folder `backend`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_USER=root
   DB_PASSWORD=
   DB_DATABASE=db_laundry
   DATABASE_URL="mysql://root:@localhost:3306/db_laundry"
   NODE_ENV=development
   JWT_SECRET=secret_laundry_key_12345
   ```

4. Generate Prisma Client & Jalankan Migrasi Database:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. Seed data awal (User, Level, & Jenis Layanan):
   ```bash
   node prisma/seed.js
   ```

6. Jalankan server backend:
   ```bash
   npm run dev
   ```
   Backend akan berjalan di: `http://localhost:5000`

---

### **2. Setup Frontend**

1. Buka terminal baru dan masuk ke direktori frontend:
   ```bash
   cd frontend
   ```

2. Install dependensi:
   ```bash
   npm install
   ```

3. Konfigurasi file `.env` pada folder `frontend`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. Jalankan dev server frontend:
   ```bash
   npm run dev
   ```
   Frontend akan berjalan di: `http://localhost:5173`

---

## Struktur Direktori Projek

```text
WEB_ARFAN-PRIHARDIANSYAH_LAUNDRY/
├── backend/
│   ├── prisma/
│   │   ├── migrations/      # File migrasi Prisma database
│   │   ├── schema.prisma    # Skema model Prisma
│   │   └── seed.js          # Seeder data awal database
│   ├── src/
│   │   ├── config/          # Koneksi database & konfigurasi
│   │   ├── Controllers/     # Logic pengolah request API
│   │   ├── Middleware/      # Auth middleware JWT
│   │   ├── Routes/          # Endpoint API Express
│   │   └── index.js         # Entry point server Express
│   └── .env                 # Environment variable backend
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Komponen UI reusable (Navbar, Sidebar, Modal, dll)
│   │   ├── features/        # Modul halaman utama (Auth, Customers, Orders, Services, Users)
│   │   ├── utils/           # Helper fungsi (API instance Axios, Auth, format rupiah/tanggal)
│   │   ├── App.jsx          # Setup routing React Router
│   │   └── main.jsx         # Entry point React
│   └── .env                 # Environment variable frontend
│
└── README.md
```

---

## Lisensi

Proyek ini dibuat untuk keperluan pengembangan web manajemen laundry. Silakan disesuaikan dengan kebutuhan Anda.
