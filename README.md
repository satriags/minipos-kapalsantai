# 🧾 Mini Point of Sales (POS) App - KapalSantai

Sistem Point of Sales sederhana berbasis **Vue 3 (Frontend)** dan **NestJS + Prisma + MySQL (Backend)**.

> Dibangun untuk kebutuhan aplikasi kasir modern dengan manajemen produk, stok, dan penjualan sederhana.

---

## 🧰 Prasyarat

Pastikan environment development kamu memenuhi spesifikasi berikut:

* **Node.js**: `v20.15.0`
* **npm**: `v10.7.0`
* **MySQL**: Disarankan versi `8.x` (atau kompatibel)

---

## 📁 Struktur Folder

```bash
.
├── ui-pos     # Frontend dengan Vue 3 + Bootstrap
└── api-pos    # Backend dengan NestJS + Prisma + MySQL
```

---

## 🚀 Jalankan Aplikasi

### 🔹 Frontend (`ui-pos`)

UI dibangun dengan **Vue 3** + **Bootstrap 5**.

```bash
cd ui-pos

# Salin konfigurasi environment
cp env.js.example env.js

# Install dependencies
npm install

# Jalankan dalam mode development
npm run dev
```

Frontend akan berjalan di default: [http://localhost:5173](http://localhost:5173)

---

### 🔹 Backend (`api-pos`)

API dibangun dengan **NestJS**, menggunakan **Prisma ORM** dan **MySQL**.

```bash
cd api-pos

# Salin konfigurasi environment
cp .env.example .env

# Install dependencies
npm install

# Jalankan migrasi dan generate Prisma Client
npx prisma migrate dev
npx prisma generate

# Jalankan server NestJS dalam mode development
npm run start:dev
```

Backend akan berjalan di default: [http://localhost:3000](http://localhost:3000)

> ⚠️ Pastikan `.env` sudah dikonfigurasi dengan benar, terutama koneksi ke database MySQL.

---

## ⚙️ Contoh `.env` Backend

```env
DATABASE_URL="mysql://username:password@localhost:3306/nama_database"
JWT_SECRET="your_secret_key"
PORT=3000
```
## Arsitektur Table Mini POS
![Logo](
https://raw.githubusercontent.com/satriags/minipos-kapalsantai/refs/heads/main/relasi_db.png)
---
## 🧑‍💻 Developer

* 👨‍💻 Satria Giri Syawalludin
* 🏢 Full Stack Developer
* 🌐 [satriags.com](https://satriags.com)

---

terimakasih! 🚀
