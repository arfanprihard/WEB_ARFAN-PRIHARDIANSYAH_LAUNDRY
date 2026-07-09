-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 09 Jul 2026 pada 07.12
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.5.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_laundry`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `customer`
--

CREATE TABLE `customer` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `customer`
--

INSERT INTO `customer` (`id`, `customer_name`, `phone`, `address`, `created_at`, `updated_at`, `deleted_at`) VALUES
(2, 'Arfy', '90798789123', 'jlnljljkadsfndf', '2026-07-05 09:43:07', '2026-07-05 09:43:07', NULL),
(3, 'Arf', '099812', NULL, '2026-07-05 09:44:53', '2026-07-07 02:04:48', '2026-07-07 02:04:48'),
(19, 'Arf', '099812', NULL, '2026-07-05 12:12:38', '2026-07-07 01:57:57', '2026-07-07 01:57:57'),
(20, 'Andri', '0923223', NULL, '2026-07-06 16:42:17', '2026-07-06 16:42:17', NULL),
(21, 'Alfian', '08313213213', 'Jl. jalan', '2026-07-07 04:05:49', '2026-07-09 00:55:50', '2026-07-09 00:55:50'),
(22, 'Alfian', '0812121212', NULL, '2026-07-09 00:55:02', '2026-07-09 02:36:58', NULL),
(23, 'Diko', '080808080', 'jl. jalan', '2026-07-09 02:38:35', '2026-07-09 02:38:53', '2026-07-09 02:38:53'),
(24, 'Akbar', '0812121088', 'Jl. Cakung', '2026-07-09 02:48:24', '2026-07-09 02:48:38', '2026-07-09 02:48:38'),
(25, 'Ryan', '0812183174112', 'Jl.tipar', '2026-07-09 04:54:43', '2026-07-09 04:55:26', '2026-07-09 04:55:26'),
(26, 'Yasa', '0813812912', 'Jl.jalan', '2026-07-09 04:55:19', '2026-07-09 04:55:23', '2026-07-09 04:55:23'),
(27, 'Yasya', '0812121298182', 'Jl. Tipar', '2026-07-09 06:43:27', '2026-07-09 06:43:27', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `level`
--

CREATE TABLE `level` (
  `id` int(11) NOT NULL,
  `level_name` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `level`
--

INSERT INTO `level` (`id`, `level_name`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Admin', '2026-07-06 14:41:11', '2026-07-06 14:41:11', NULL),
(2, 'Operator', '2026-07-06 16:09:26', '2026-07-06 16:09:26', NULL),
(3, 'Pimpinan', '2026-07-06 16:09:26', '2026-07-06 16:09:26', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `trans_laundry_pickup`
--

CREATE TABLE `trans_laundry_pickup` (
  `id` int(11) NOT NULL,
  `id_order` int(11) NOT NULL,
  `id_customer` int(11) NOT NULL,
  `pickup_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `trans_laundry_pickup`
--

INSERT INTO `trans_laundry_pickup` (`id`, `id_order`, `id_customer`, `pickup_date`, `notes`, `created_at`, `updated_at`) VALUES
(13, 17, 20, '2026-07-07', 'Diambil oleh customer', '2026-07-07 06:33:01', '2026-07-07 06:33:01'),
(15, 18, 22, '2026-07-09', 'Diambil oleh customer', '2026-07-09 00:55:33', '2026-07-09 00:55:33'),
(16, 19, 22, '2026-07-09', 'Diambil oleh customer', '2026-07-09 02:04:54', '2026-07-09 02:04:54'),
(17, 20, 22, '2026-07-09', 'Diambil oleh customer', '2026-07-09 02:27:01', '2026-07-09 02:27:01'),
(18, 21, 22, '2026-07-09', 'Diambil oleh customer', '2026-07-09 02:27:24', '2026-07-09 02:27:24'),
(19, 22, 22, '2026-07-09', 'Diambil oleh customer', '2026-07-09 02:30:11', '2026-07-09 02:30:11'),
(20, 23, 20, '2026-07-09', 'Diambil oleh customer', '2026-07-09 02:49:06', '2026-07-09 02:49:06'),
(21, 24, 22, '2026-07-09', 'Diambil oleh customer', '2026-07-09 02:50:08', '2026-07-09 02:50:08'),
(22, 25, 20, '2026-07-09', 'Diambil oleh customer', '2026-07-09 02:51:25', '2026-07-09 02:51:25'),
(23, 26, 22, '2026-07-09', 'Diambil oleh customer', '2026-07-09 03:42:37', '2026-07-09 03:42:37'),
(24, 27, 20, '2026-07-09', 'Diambil oleh customer', '2026-07-09 04:49:53', '2026-07-09 04:49:53'),
(25, 28, 22, '2026-07-09', 'Diambil oleh customer', '2026-07-09 04:50:57', '2026-07-09 04:50:57'),
(26, 29, 22, '2026-07-09', 'Diambil oleh customer', '2026-07-09 04:52:39', '2026-07-09 04:52:39'),
(27, 30, 20, '2026-07-09', 'Diambil oleh customer', '2026-07-09 04:53:34', '2026-07-09 04:53:34'),
(28, 31, 22, '2026-07-09', 'Diambil oleh customer', '2026-07-09 05:10:49', '2026-07-09 05:10:49'),
(29, 32, 22, '2026-07-09', 'Diambil oleh customer', '2026-07-09 06:11:05', '2026-07-09 06:11:05'),
(30, 33, 22, '2026-07-09', 'Diambil oleh customer', '2026-07-09 06:32:30', '2026-07-09 06:32:30'),
(31, 34, 27, '2026-07-09', 'Diambil oleh customer', '2026-07-09 06:43:42', '2026-07-09 06:43:42');

-- --------------------------------------------------------

--
-- Struktur dari tabel `trans_order`
--

CREATE TABLE `trans_order` (
  `id` int(11) NOT NULL,
  `id_customer` int(11) NOT NULL,
  `order_code` varchar(50) DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `order_qty` int(11) DEFAULT NULL,
  `order_total` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `order_change` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `payment_status` varchar(20) NOT NULL DEFAULT 'Lunas'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `trans_order`
--

INSERT INTO `trans_order` (`id`, `id_customer`, `order_code`, `order_date`, `order_qty`, `order_total`, `created_at`, `updated_at`, `deleted_at`, `order_change`, `total`, `payment_status`) VALUES
(17, 20, 'LAUNDRY-20260707-3855', '2026-07-07', 4, 20000.00, '2026-07-07 05:01:22', '2026-07-07 06:33:01', NULL, 180000.00, 200000.00, 'Lunas'),
(18, 22, 'LAUNDRY-20260709-2062', '2026-07-09', 4, 18000.00, '2026-07-09 00:55:13', '2026-07-09 00:55:13', NULL, 82000.00, 100000.00, 'Lunas'),
(19, 22, 'LAUNDRY-20260709-9251', '2026-07-09', 12, 60000.00, '2026-07-09 02:04:45', '2026-07-09 02:04:54', NULL, 140000.00, 200000.00, 'Lunas'),
(20, 22, 'LAUNDRY-20260709-3316', '2026-07-09', 23, 103500.00, '2026-07-09 02:26:47', '2026-07-09 02:26:47', NULL, 1500.00, 105000.00, 'Lunas'),
(21, 22, 'LAUNDRY-20260709-9761', '2026-07-09', 6, 27000.00, '2026-07-09 02:27:14', '2026-07-09 02:27:24', NULL, 73000.00, 100000.00, 'Lunas'),
(22, 22, 'LAUNDRY-20260709-4663', '2026-07-09', 4, 20000.00, '2026-07-09 02:29:21', '2026-07-09 02:29:21', NULL, 30000.00, 50000.00, 'Lunas'),
(23, 20, 'LAUNDRY-20260709-8343', '2026-07-09', 5, 22500.00, '2026-07-09 02:48:59', '2026-07-09 02:48:59', NULL, 27500.00, 50000.00, 'Lunas'),
(24, 22, 'LAUNDRY-20260709-5775', '2026-07-09', 6, 27000.00, '2026-07-09 02:49:58', '2026-07-09 02:50:08', NULL, 23000.00, 50000.00, 'Lunas'),
(25, 20, 'LAUNDRY-20260709-4609', '2026-07-09', 4, 20000.00, '2026-07-09 02:50:48', '2026-07-09 02:50:48', NULL, 30000.00, 50000.00, 'Lunas'),
(26, 22, 'LAUNDRY-20260709-3985', '2026-07-09', 5, 25000.00, '2026-07-09 02:55:46', '2026-07-09 03:42:37', NULL, 25000.00, 50000.00, 'Lunas'),
(27, 20, 'LAUNDRY-20260709-9762', '2026-07-09', 3, 18000.00, '2026-07-09 04:49:43', '2026-07-09 04:49:43', NULL, 32000.00, 50000.00, 'Lunas'),
(28, 22, 'LAUNDRY-20260709-9763', '2026-07-09', 1, 6000.00, '2026-07-09 04:50:21', '2026-07-09 04:50:21', NULL, 4000.00, 10000.00, 'Lunas'),
(29, 22, 'LAUNDRY-20260709-9764', '2026-07-09', 12, 120000.00, '2026-07-09 04:51:24', '2026-07-09 04:51:24', NULL, 880000.00, 1000000.00, 'Lunas'),
(30, 20, 'LAUNDRY-20260709-9765', '2026-07-09', 6, 48000.00, '2026-07-09 04:53:05', '2026-07-09 04:53:05', NULL, 152000.00, 200000.00, 'Lunas'),
(31, 22, 'LAUNDRY-20260709-9766', '2026-07-09', 2, 15400.00, '2026-07-09 05:10:29', '2026-07-09 05:10:29', NULL, 4600.00, 20000.00, 'Lunas'),
(32, 22, 'LAUNDRY-20260709-9767', '2026-07-09', 15, 144500.00, '2026-07-09 06:10:49', '2026-07-09 06:10:49', NULL, 5500.00, 150000.00, 'Lunas'),
(33, 22, 'LAUNDRY-20260709-9768', '2026-07-09', 4, 20000.00, '2026-07-09 06:32:00', '2026-07-09 06:32:30', NULL, 80000.00, 100000.00, 'Lunas'),
(34, 27, 'LAUNDRY-20260709-9769', '2026-07-09', 3, 20500.00, '2026-07-09 06:43:34', '2026-07-09 06:43:42', NULL, 179500.00, 200000.00, 'Lunas');

-- --------------------------------------------------------

--
-- Struktur dari tabel `trans_order_detail`
--

CREATE TABLE `trans_order_detail` (
  `id` int(11) NOT NULL,
  `id_order` int(11) NOT NULL,
  `id_service` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `trans_order_detail`
--

INSERT INTO `trans_order_detail` (`id`, `id_order`, `id_service`, `qty`, `amount`, `notes`, `created_at`, `updated_at`) VALUES
(12, 17, 1, 4, 20000.00, NULL, '2026-07-07 05:01:22', '2026-07-07 05:01:22'),
(13, 18, 2, 4, 18000.00, NULL, '2026-07-09 00:55:13', '2026-07-09 00:55:13'),
(14, 19, 1, 12, 60000.00, NULL, '2026-07-09 02:04:45', '2026-07-09 02:04:45'),
(15, 20, 2, 23, 103500.00, NULL, '2026-07-09 02:26:47', '2026-07-09 02:26:47'),
(16, 21, 2, 6, 27000.00, NULL, '2026-07-09 02:27:14', '2026-07-09 02:27:14'),
(17, 22, 1, 4, 20000.00, NULL, '2026-07-09 02:29:21', '2026-07-09 02:29:21'),
(18, 23, 2, 5, 22500.00, NULL, '2026-07-09 02:48:59', '2026-07-09 02:48:59'),
(19, 24, 2, 6, 27000.00, NULL, '2026-07-09 02:49:58', '2026-07-09 02:49:58'),
(20, 25, 1, 4, 20000.00, NULL, '2026-07-09 02:50:48', '2026-07-09 02:50:48'),
(21, 26, 1, 5, 25000.00, NULL, '2026-07-09 02:55:46', '2026-07-09 02:55:46'),
(22, 27, 1, 3, 18000.00, NULL, '2026-07-09 04:49:43', '2026-07-09 04:49:43'),
(23, 28, 1, 1, 6000.00, NULL, '2026-07-09 04:50:21', '2026-07-09 04:50:21'),
(24, 29, 1, 12, 120000.00, NULL, '2026-07-09 04:51:24', '2026-07-09 04:51:24'),
(25, 30, 1, 2, 20000.00, NULL, '2026-07-09 04:53:05', '2026-07-09 04:53:05'),
(26, 30, 4, 4, 28000.00, NULL, '2026-07-09 04:53:05', '2026-07-09 04:53:05'),
(27, 31, 4, 2, 15400.00, NULL, '2026-07-09 05:10:29', '2026-07-09 05:10:29'),
(28, 32, 1, 14, 140000.00, NULL, '2026-07-09 06:10:49', '2026-07-09 06:10:49'),
(29, 32, 2, 1, 4500.00, NULL, '2026-07-09 06:10:49', '2026-07-09 06:10:49'),
(30, 33, 1, 4, 20000.00, NULL, '2026-07-09 06:32:00', '2026-07-09 06:32:00'),
(31, 34, 2, 1, 4500.00, NULL, '2026-07-09 06:43:34', '2026-07-09 06:43:34'),
(32, 34, 1, 1, 9000.00, NULL, '2026-07-09 06:43:34', '2026-07-09 06:43:34'),
(33, 34, 4, 1, 7000.00, NULL, '2026-07-09 06:43:34', '2026-07-09 06:43:34');

-- --------------------------------------------------------

--
-- Struktur dari tabel `type_of_service`
--

CREATE TABLE `type_of_service` (
  `id` int(11) NOT NULL,
  `service_name` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `type_of_service`
--

INSERT INTO `type_of_service` (`id`, `service_name`, `price`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Cuci dan Gosok', 9000.00, 'Cuci dan Gosok per kg', '2026-07-06 14:08:03', '2026-07-09 06:34:46', NULL),
(2, 'Hanya Cuci', 4500.00, 'Hanya Cuci per kg', '2026-07-06 14:19:13', '2026-07-06 16:09:26', NULL),
(3, 'Hanya Gosok', 5000.00, 'Hanya Gosok per kg', '2026-07-06 16:09:26', '2026-07-06 16:09:26', NULL),
(4, 'Laundry Besar (selimut, karpet, mantel, sprei)', 7000.00, 'Laundry besar seperti selimut, karpet, mantel, sprei per kg', '2026-07-06 16:09:26', '2026-07-06 16:09:26', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `id_level` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id`, `id_level`, `name`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 1, 'Arfan', 'admin1@email.com', '$2b$10$Pk2JcvMO6jB/LWcgPVbvXe2WdEFnfPczvTO14FUK7672FdUCDOosO', '2026-07-06 14:41:32', '2026-07-09 06:42:58'),
(2, 2, 'Budi', 'operator1@email.com', '$2b$10$P2mlPxsOBxWalYSeZglqi.pYRSU2r8imtJr9u3pPvrtH8expo3jJm', '2026-07-06 14:42:04', '2026-07-09 06:42:45'),
(3, 3, 'Mansyur', 'pimpinan1@email.com', '$2b$10$3WH2RAxaEkDUfm2mqANTb.FWKOgx9El43lxxtIKRYYRd3thlepM6.', '2026-07-06 16:09:26', '2026-07-09 06:42:36');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `level`
--
ALTER TABLE `level`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `trans_laundry_pickup`
--
ALTER TABLE `trans_laundry_pickup`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pickup_order` (`id_order`),
  ADD KEY `fk_pickup_customer` (`id_customer`);

--
-- Indeks untuk tabel `trans_order`
--
ALTER TABLE `trans_order`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_code` (`order_code`),
  ADD KEY `fk_order_customer` (`id_customer`);

--
-- Indeks untuk tabel `trans_order_detail`
--
ALTER TABLE `trans_order_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_detail_order` (`id_order`),
  ADD KEY `fk_detail_service` (`id_service`);

--
-- Indeks untuk tabel `type_of_service`
--
ALTER TABLE `type_of_service`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `service_name` (`service_name`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_level` (`id_level`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT untuk tabel `level`
--
ALTER TABLE `level`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `trans_laundry_pickup`
--
ALTER TABLE `trans_laundry_pickup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT untuk tabel `trans_order`
--
ALTER TABLE `trans_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT untuk tabel `trans_order_detail`
--
ALTER TABLE `trans_order_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT untuk tabel `type_of_service`
--
ALTER TABLE `type_of_service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `trans_laundry_pickup`
--
ALTER TABLE `trans_laundry_pickup`
  ADD CONSTRAINT `fk_pickup_customer` FOREIGN KEY (`id_customer`) REFERENCES `customer` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pickup_order` FOREIGN KEY (`id_order`) REFERENCES `trans_order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `trans_order`
--
ALTER TABLE `trans_order`
  ADD CONSTRAINT `fk_order_customer` FOREIGN KEY (`id_customer`) REFERENCES `customer` (`id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `trans_order_detail`
--
ALTER TABLE `trans_order_detail`
  ADD CONSTRAINT `fk_detail_order` FOREIGN KEY (`id_order`) REFERENCES `trans_order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detail_service` FOREIGN KEY (`id_service`) REFERENCES `type_of_service` (`id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`id_level`) REFERENCES `level` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
