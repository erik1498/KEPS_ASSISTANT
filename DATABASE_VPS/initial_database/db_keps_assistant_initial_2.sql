-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 12, 2024 at 08:17 PM
-- Server version: 10.3.16-MariaDB
-- PHP Version: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_keps_assistant_2`
--

-- --------------------------------------------------------

--
-- Table structure for table `aktivitas_dokumen_tab`
--

CREATE TABLE `aktivitas_dokumen_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `no_surat` varchar(255) NOT NULL,
  `tipe_dokumen` varchar(255) NOT NULL,
  `kategori_dokumen` varchar(255) NOT NULL,
  `jenis_dokumen` varchar(255) NOT NULL,
  `klien` varchar(255) NOT NULL,
  `penanggung_jawab` varchar(255) NOT NULL,
  `biaya` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `tahun` int(11) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `dokumen_klien_tab`
--

CREATE TABLE `dokumen_klien_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `aktivitas_dokumen` varchar(255) NOT NULL,
  `nomor_dokumen` varchar(255) NOT NULL,
  `keterangan_dokumen` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jurnal_umum_tab`
--

CREATE TABLE `jurnal_umum_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `bulan` varchar(255) NOT NULL,
  `tahun` varchar(255) NOT NULL,
  `waktu` varchar(255) NOT NULL,
  `uraian` varchar(255) NOT NULL,
  `debet` varchar(255) NOT NULL,
  `kredit` varchar(255) NOT NULL,
  `kode_akun_uuid` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `transaksi` int(11) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kode_akun_perkiraan_tab`
--

CREATE TABLE `kode_akun_perkiraan_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `kode_akun_perkiraan_tab`
--

INSERT INTO `kode_akun_perkiraan_tab` (`id`, `uuid`, `type`, `name`, `code`, `enabled`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
(129, 'ab31ad4f-3b87-47d3-8da0-d9a468c41c69', 'Harta', 'Kas Besar', '101', 1, 'SYSTEM', 'SYSTEM', '2024-05-27 12:42:13', '2024-05-27 12:42:13'),
(130, '16bc9314-7b6a-49fd-a012-fd0c01c7f435', 'Harta', 'Kas Kecil', '102', 1, 'SYSTEM', 'SYSTEM', '2024-05-27 12:42:23', '2024-05-27 12:42:23'),
(131, '7c07a36a-8618-4ce1-a5af-95a0f992d163', 'Modal', 'Modal', '301', 1, 'SYSTEM', 'SYSTEM', '2024-05-27 12:45:13', '2024-05-27 12:45:13'),
(132, '7a3eed8b-1145-4b14-978d-2bdc396a9b2d', 'Modal', 'Prive', '302', 1, 'SYSTEM', 'SYSTEM', '2024-05-27 12:45:38', '2024-05-27 12:45:38'),
(133, '17ee2154-d69e-4e5f-9c0c-9ba2a6691d3d', 'Modal', 'Dividen', '303', 1, 'SYSTEM', 'SYSTEM', '2024-05-27 12:46:11', '2024-05-27 12:46:11'),
(134, '273b0295-75d9-4a73-bc7d-cc1b5e1ced55', 'Modal', 'Laba/Rugi Periode Sebelumnya', '398', 1, 'SYSTEM', 'SYSTEM', '2024-05-27 12:47:30', '2024-05-27 12:47:30'),
(135, 'e18a08d8-ba15-433e-89cc-ca2acc4b7ebe', 'Modal', 'Laba/Rugi Periode Berjalan', '399', 1, 'SYSTEM', 'SYSTEM', '2024-05-27 12:48:43', '2024-05-27 12:48:43'),
(136, 'd38fc8a1-723b-4e4e-889c-98c4d9a9e62a', 'Pendapatan', 'Penjualan Barang', '401', 1, 'SYSTEM', 'SYSTEM', '2024-05-27 12:49:06', '2024-05-27 12:49:06'),
(137, '1d78c9c1-277c-4fbf-abc5-307ddf8c937e', 'Pendapatan', 'Penjualan Jasa', '405', 1, 'SYSTEM', 'SYSTEM', '2024-05-27 12:49:41', '2024-05-27 12:49:41'),
(138, 'ab90cf91-022f-4708-81f5-13910c29415b', 'Harga Pokok Penjualan', 'Persediaan Barang Dagang Awal', '701', 1, 'SYSTEM', 'SYSTEM', '2024-05-27 12:51:02', '2024-05-27 12:51:02'),
(139, '8a950e8e-8d45-47c1-9088-40d643496783', 'Harga Pokok Penjualan', 'Pembelian', '702', 1, 'SYSTEM', 'SYSTEM', '2024-05-27 12:51:34', '2024-05-27 12:51:34'),
(140, 'afb32afd-9e8f-496f-b800-1d85f3ea5a85', 'Harta', 'Persediaan Barang Dagang Akhir', '799', 1, 'SYSTEM', 'SYSTEM', '2024-05-27 12:51:54', '2024-05-27 12:51:54');

-- --------------------------------------------------------

--
-- Table structure for table `neraca_tab`
--

CREATE TABLE `neraca_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `json` text NOT NULL,
  `bulan` varchar(255) NOT NULL,
  `tahun` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `riwayat_aktivitas_dokumen_tab`
--

CREATE TABLE `riwayat_aktivitas_dokumen_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `aktivitas_dokumen` varchar(255) NOT NULL,
  `judul_aktivitas` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `enabled` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `riwayat_pembayaran_aktivitas_dokumen_tab`
--

CREATE TABLE `riwayat_pembayaran_aktivitas_dokumen_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `aktivitas_dokumen` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `nilai_pembayaran` varchar(255) NOT NULL,
  `pegawai_penerima` varchar(255) NOT NULL,
  `nomor_kwitansi_tanda_terima` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `status_riwayat_aktivitas_dokumen_keterangan_tab`
--

CREATE TABLE `status_riwayat_aktivitas_dokumen_keterangan_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `status_riwayat_aktivitas_dokumen` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `status_riwayat_aktivitas_dokumen_pegawai_pelaksana_tab`
--

CREATE TABLE `status_riwayat_aktivitas_dokumen_pegawai_pelaksana_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `status_riwayat_aktivitas_dokumen` varchar(255) NOT NULL,
  `pegawai_pelaksana` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `status_riwayat_aktivitas_dokumen_tab`
--

CREATE TABLE `status_riwayat_aktivitas_dokumen_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `riwayat_aktivitas_dokumen` varchar(255) NOT NULL,
  `judul_status` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user_tab`
--

CREATE TABLE `user_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `serial_key` varchar(255) NOT NULL,
  `mac_address` varchar(255) NOT NULL,
  `os_info` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aktivitas_dokumen_tab`
--
ALTER TABLE `aktivitas_dokumen_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dokumen_klien_tab`
--
ALTER TABLE `dokumen_klien_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jurnal_umum_tab`
--
ALTER TABLE `jurnal_umum_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kode_akun_perkiraan_tab`
--
ALTER TABLE `kode_akun_perkiraan_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `neraca_tab`
--
ALTER TABLE `neraca_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `riwayat_aktivitas_dokumen_tab`
--
ALTER TABLE `riwayat_aktivitas_dokumen_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `riwayat_pembayaran_aktivitas_dokumen_tab`
--
ALTER TABLE `riwayat_pembayaran_aktivitas_dokumen_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `status_riwayat_aktivitas_dokumen_keterangan_tab`
--
ALTER TABLE `status_riwayat_aktivitas_dokumen_keterangan_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `status_riwayat_aktivitas_dokumen_pegawai_pelaksana_tab`
--
ALTER TABLE `status_riwayat_aktivitas_dokumen_pegawai_pelaksana_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `status_riwayat_aktivitas_dokumen_tab`
--
ALTER TABLE `status_riwayat_aktivitas_dokumen_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_tab`
--
ALTER TABLE `user_tab`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aktivitas_dokumen_tab`
--
ALTER TABLE `aktivitas_dokumen_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dokumen_klien_tab`
--
ALTER TABLE `dokumen_klien_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jurnal_umum_tab`
--
ALTER TABLE `jurnal_umum_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kode_akun_perkiraan_tab`
--
ALTER TABLE `kode_akun_perkiraan_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- AUTO_INCREMENT for table `neraca_tab`
--
ALTER TABLE `neraca_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `riwayat_aktivitas_dokumen_tab`
--
ALTER TABLE `riwayat_aktivitas_dokumen_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `riwayat_pembayaran_aktivitas_dokumen_tab`
--
ALTER TABLE `riwayat_pembayaran_aktivitas_dokumen_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `status_riwayat_aktivitas_dokumen_keterangan_tab`
--
ALTER TABLE `status_riwayat_aktivitas_dokumen_keterangan_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `status_riwayat_aktivitas_dokumen_pegawai_pelaksana_tab`
--
ALTER TABLE `status_riwayat_aktivitas_dokumen_pegawai_pelaksana_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `status_riwayat_aktivitas_dokumen_tab`
--
ALTER TABLE `status_riwayat_aktivitas_dokumen_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_tab`
--
ALTER TABLE `user_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
