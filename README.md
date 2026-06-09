# Invofest Frontend - Web Management Dashboard

Aplikasi *client-side* (Frontend) resmi untuk manajemen data **Invofest** (Innovation Festival). Sistem ini dirancang untuk mengelola seluruh ekosistem acara mulai dari kategori, pembicara, hingga manajemen pengguna secara terpusat, aman, dan *real-time*.

---

## Tech Stack & Ekosistem

Aplikasi ini dibangun di atas fondasi teknologi modern yang mengutamakan performa, efisiensi kode, dan keamanan tipe data (*Type Safety*):

* **Core Framework:** React JS (Vite)
* **Bahasa Pemrograman:** TypeScript (Strict Mode)
* **Manajemen Data & Cache:** `@tanstack/react-query` (React Query v5)
* **Sistem Navigasi:** `react-router-dom` (Protected & Public URL Guard)
* **Validasi & Manajemen Form:** `react-hook-form` + `zod`
* **Desain & UI:** Tailwind CSS + Lucide Icons
* **Sistem Notifikasi:** `react-hot-toast` (Dynamic Promise Alerts)
* **HTTP Client:** Axios Instance Request Middleware

---

## Fitur-Fitur Unggulan Dashboard

* **Sistem Autentikasi JWT:** Proses login dan registrasi akun terenkripsi token JWT yang diamankan pada penyimpanan lokal browser serta dilindungi oleh rute terproteksi (`ProtectedRoute`).
* **Statistik Dashboard Reaktif:** Kartu ringkasan (*summary cards*) yang secara otomatis memuat total events, speakers, categories, dan users langsung dari database cloud Railway.
* **Sistem Notifikasi Menyeluruh:** Penggunaan `toast.promise` untuk memberikan *feedback* visual (Loading, Success, dan Error) secara dinamis saat melakukan operasi CRUD.
* **Proteksi Form Berlapis:** Validasi skema ketat menggunakan *Zod Engine* di sisi klien, lengkap dengan fitur penguncian otomatis seluruh elemen input form (`disabled`) saat proses mutasi data berlangsung demi menghindari *double-submit*.

---

Credentials & Demo Video
Berikut adalah informasi akun peninjauan sistem serta dokumentasi aplikasi:

Email: devita@gmail.com

Password: 24090026

Link Video Youtube: https://youtu.be/zT4THS-7org

---

Author & Kepenulisan
Project ini dikembangkan dan dipelihara sepenuhnya oleh:

Nama Lengkap: Devita Anggraeni 

Program Studi: Sarjana Terapan Teknik Informatika

Universitas: Harkat Negeri University

---