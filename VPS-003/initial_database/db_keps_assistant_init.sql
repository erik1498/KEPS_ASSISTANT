-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 28, 2024 at 03:21 PM
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
-- Database: `db_keps_assistant_initial`
--

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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `kode_akun_perkiraan_tab`
--

INSERT INTO `kode_akun_perkiraan_tab` (`id`, `uuid`, `type`, `name`, `code`, `enabled`, `createdAt`, `updatedAt`) VALUES
(129, 'ab31ad4f-3b87-47d3-8da0-d9a468c41c69', 'Harta', 'Kas Besar', '101', 1, '2024-05-27 12:42:13', '2024-05-27 12:42:13'),
(130, '16bc9314-7b6a-49fd-a012-fd0c01c7f435', 'Harta', 'Kas Kecil', '102', 1, '2024-05-27 12:42:23', '2024-05-27 12:42:23'),
(131, '7c07a36a-8618-4ce1-a5af-95a0f992d163', 'Modal', 'Modal', '301', 1, '2024-05-27 12:45:13', '2024-05-27 12:45:13'),
(132, '7a3eed8b-1145-4b14-978d-2bdc396a9b2d', 'Modal', 'Prive', '302', 1, '2024-05-27 12:45:38', '2024-05-27 12:45:38'),
(133, '17ee2154-d69e-4e5f-9c0c-9ba2a6691d3d', 'Modal', 'Dividen', '303', 1, '2024-05-27 12:46:11', '2024-05-27 12:46:11'),
(134, '273b0295-75d9-4a73-bc7d-cc1b5e1ced55', 'Modal', 'Laba/Rugi Periode Sebelumnya', '398', 1, '2024-05-27 12:47:30', '2024-05-27 12:47:30'),
(135, 'e18a08d8-ba15-433e-89cc-ca2acc4b7ebe', 'Modal', 'Laba/Rugi Periode Berjalan', '399', 1, '2024-05-27 12:48:43', '2024-05-27 12:48:43'),
(136, 'd38fc8a1-723b-4e4e-889c-98c4d9a9e62a', 'Pendapatan', 'Penjualan Barang', '401', 1, '2024-05-27 12:49:06', '2024-05-27 12:49:06'),
(137, '1d78c9c1-277c-4fbf-abc5-307ddf8c937e', 'Pendapatan', 'Penjualan Jasa', '405', 1, '2024-05-27 12:49:41', '2024-05-27 12:49:41'),
(138, 'ab90cf91-022f-4708-81f5-13910c29415b', 'Harga Pokok Penjualan', 'Persediaan Barang Dagang Awal', '701', 1, '2024-05-27 12:51:02', '2024-05-27 12:51:02'),
(139, '8a950e8e-8d45-47c1-9088-40d643496783', 'Harga Pokok Penjualan', 'Pembelian', '702', 1, '2024-05-27 12:51:34', '2024-05-27 12:51:34'),
(140, 'afb32afd-9e8f-496f-b800-1d85f3ea5a85', 'Harta', 'Persediaan Barang Dagang Akhir', '799', 1, '2024-05-27 12:51:54', '2024-05-27 12:51:54');

-- --------------------------------------------------------

--
-- Table structure for table `logger_tab`
--

CREATE TABLE `logger_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `service` text NOT NULL,
  `status` varchar(255) NOT NULL,
  `method` text NOT NULL,
  `data` text NOT NULL,
  `req_time` text NOT NULL,
  `req_id` varchar(255) NOT NULL,
  `req_user_id` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `logger_tab`
--

INSERT INTO `logger_tab` (`id`, `uuid`, `service`, `status`, `method`, `data`, `req_time`, `req_id`, `req_user_id`, `createdAt`, `updatedAt`) VALUES
(1, '1c83e243-e204-4d9f-8142-f09d154ee973', '/user/refresh', 'ERROR', 'POST', '\"Error\\n    at Query.run (/home/erickhene/Documents/NODEJS/keps_api/node_modules/.pnpm/sequelize@6.33.0_mysql2@3.6.2/node_modules/sequelize/lib/dialects/mysql/query.js:52:25)\\n    at /home/erickhene/Documents/NODEJS/keps_api/node_modules/.pnpm/sequelize@6.33.0_mysql2@3.6.2/node_modules/sequelize/lib/sequelize.js:315:28\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\\n    at async MySQLQueryInterface.select (/home/erickhene/Documents/NODEJS/keps_api/node_modules/.pnpm/sequelize@6.33.0_mysql2@3.6.2/node_modules/sequelize/lib/dialects/abstract/query-interface.js:407:12)\\n    at async user_tab.findAll (/home/erickhene/Documents/NODEJS/keps_api/node_modules/.pnpm/sequelize@6.33.0_mysql2@3.6.2/node_modules/sequelize/lib/model.js:1140:21)\\n    at async user_tab.findOne (/home/erickhene/Documents/NODEJS/keps_api/node_modules/.pnpm/sequelize@6.33.0_mysql2@3.6.2/node_modules/sequelize/lib/model.js:1240:12)\\n    at async getUserByUuidRepo (file:///home/erickhene/Documents/NODEJS/keps_api/src/app/user/user.repository.js:13:18)\\n    at async getUserByUuid (file:///home/erickhene/Documents/NODEJS/keps_api/src/app/user/user.services.js:19:18)\\n    at async refreshToken (file:///home/erickhene/Documents/NODEJS/keps_api/src/app/user/user.handler.js:158:20)\"', '27/5/2024 21:28:50:722', '1e4e8f36-3f58-4dc2-89ed-468fd0d2c4e5', 'NULL', '2024-05-27 13:28:50', '2024-05-27 13:28:50'),
(2, 'dd62aa25-c5ce-4c23-ac82-7966b0b2a6e2', '/user/login', 'SUCCESS', 'POST', '{\"id\":2,\"uuid\":\"4d768fb0-f97f-48d7-86a7-4840a7bdebc0\",\"username\":\"erick\",\"password\":\"$2b$10$dYta1q5QgHYAuSp24foFVeuFVNP6Q09BhIgy6WHXLotwvI4Ea4Wwi\",\"name\":\"USER\",\"role\":\"Admin\",\"serial_key\":\"Z6A7G-RS78E-VI2DZ-4HNF1-YYX1Q\",\"mac_address\":\"14:5a:fc:5d:44:23\",\"os_info\":\"{\\\"hostname\\\":\\\"erickhene-Aspire-A515-45\\\",\\\"user_info\\\":{\\\"uid\\\":1000,\\\"gid\\\":1000,\\\"username\\\":\\\"erickhene\\\",\\\"homedir\\\":\\\"/home/erickhene\\\",\\\"shell\\\":\\\"/bin/bash\\\"},\\\"arch\\\":\\\"x64\\\",\\\"platform\\\":\\\"linux\\\",\\\"type\\\":\\\"Linux\\\",\\\"memory\\\":\\\"16\\\",\\\"cpu\\\":\\\"AMD Ryzen 5 5500U with Radeon Graphics\\\"}\",\"createdAt\":\"2024-04-26T15:49:50.000Z\",\"updatedAt\":\"2024-04-26T15:49:50.000Z\"}', '27/5/2024 21:29:57:724', '8641ad11-b775-4c60-a175-9789598cfdef', 'NULL', '2024-05-27 13:29:57', '2024-05-27 13:29:57'),
(3, '3b0e1004-36b6-4a42-873f-08138cea8560', '/user/login', 'SUCCESS', 'POST', '{\"id\":2,\"uuid\":\"4d768fb0-f97f-48d7-86a7-4840a7bdebc0\",\"username\":\"erick\",\"password\":\"$2b$10$dYta1q5QgHYAuSp24foFVeuFVNP6Q09BhIgy6WHXLotwvI4Ea4Wwi\",\"name\":\"USER\",\"role\":\"Admin\",\"serial_key\":\"Z6A7G-RS78E-VI2DZ-4HNF1-YYX1Q\",\"mac_address\":\"14:5a:fc:5d:44:23\",\"os_info\":\"{\\\"hostname\\\":\\\"erickhene-Aspire-A515-45\\\",\\\"user_info\\\":{\\\"uid\\\":1000,\\\"gid\\\":1000,\\\"username\\\":\\\"erickhene\\\",\\\"homedir\\\":\\\"/home/erickhene\\\",\\\"shell\\\":\\\"/bin/bash\\\"},\\\"arch\\\":\\\"x64\\\",\\\"platform\\\":\\\"linux\\\",\\\"type\\\":\\\"Linux\\\",\\\"memory\\\":\\\"16\\\",\\\"cpu\\\":\\\"AMD Ryzen 5 5500U with Radeon Graphics\\\"}\",\"createdAt\":\"2024-04-26T15:49:50.000Z\",\"updatedAt\":\"2024-04-26T15:49:50.000Z\"}', '27/5/2024 21:31:34:829', '2617bc55-649b-4e07-b504-45ffde2dbc54', 'NULL', '2024-05-27 13:31:34', '2024-05-27 13:31:34'),
(4, 'cfa9ec26-11b1-42bb-90b3-f8d684df3bec', '/jurnal_umum/bulan/5/2024/bukti_transaksi', 'ERROR', 'GET', '\"Error\\n    at Query.run (/home/erickhene/Documents/NODEJS/keps_api/node_modules/.pnpm/sequelize@6.33.0_mysql2@3.6.2/node_modules/sequelize/lib/dialects/mysql/query.js:52:25)\\n    at /home/erickhene/Documents/NODEJS/keps_api/node_modules/.pnpm/sequelize@6.33.0_mysql2@3.6.2/node_modules/sequelize/lib/sequelize.js:315:28\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\\n    at async getJurnalUmumByBulanRepo (file:///home/erickhene/Documents/NODEJS/keps_api/src/app/jurnal_umum/jurnalUmum.repository.js:53:25)\\n    at async getJurnalUmumByBulanService (file:///home/erickhene/Documents/NODEJS/keps_api/src/app/jurnal_umum/jurnalUmum.services.js:55:24)\\n    at async getAllJurnalUmumByBulanAndTypeSorting (file:///home/erickhene/Documents/NODEJS/keps_api/src/app/jurnal_umum/jurnalUmum.handler.js:48:19)\"', '27/5/2024 21:31:35:489', 'b91a6c35-0e97-4f9b-9a3c-0154321cd5ba', '4d768fb0-f97f-48d7-86a7-4840a7bdebc0', '2024-05-27 13:31:35', '2024-05-27 13:31:35'),
(5, '6f60b505-39bf-4e21-a2df-6d3c23143c0a', '/neraca/5/2024', 'ERROR', 'GET', '\"Error\\n    at Query.run (/home/erickhene/Documents/NODEJS/keps_api/node_modules/.pnpm/sequelize@6.33.0_mysql2@3.6.2/node_modules/sequelize/lib/dialects/mysql/query.js:52:25)\\n    at /home/erickhene/Documents/NODEJS/keps_api/node_modules/.pnpm/sequelize@6.33.0_mysql2@3.6.2/node_modules/sequelize/lib/sequelize.js:315:28\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\\n    at async getNeracaByBulanAndTahun (file:///home/erickhene/Documents/NODEJS/keps_api/src/app/neraca/neraca.repository.js:16:20)\\n    at async getNeracaSaldoBulanSebelumnya (file:///home/erickhene/Documents/NODEJS/keps_api/src/app/neraca/neraca.services.js:48:12)\\n    at async getJurnalUmumByBulanSebelumService (file:///home/erickhene/Documents/NODEJS/keps_api/src/app/jurnal_umum/jurnalUmum.services.js:18:30)\\n    at async getAllNeracaSaldoByBulanService (file:///home/erickhene/Documents/NODEJS/keps_api/src/app/neraca_saldo/neracaSaldo.services.js:11:71)\\n    at async getNeracaReportService (file:///home/erickhene/Documents/NODEJS/keps_api/src/app/neraca/neraca.services.js:8:18)\\n    at async getAllNeracaByBulanController (file:///home/erickhene/Documents/NODEJS/keps_api/src/app/neraca/neraca.handler.js:12:25)\"', '27/5/2024 21:31:35:510', 'efb6908d-5a60-4ce8-9b46-b88b1894f8a3', '4d768fb0-f97f-48d7-86a7-4840a7bdebc0', '2024-05-27 13:31:35', '2024-05-27 13:31:35'),
(6, 'b5e6339a-d2a7-4856-8f1b-943eb58b8df3', '/user/login', 'SUCCESS', 'POST', '{\"id\":2,\"uuid\":\"4d768fb0-f97f-48d7-86a7-4840a7bdebc0\",\"username\":\"erick\",\"password\":\"$2b$10$dYta1q5QgHYAuSp24foFVeuFVNP6Q09BhIgy6WHXLotwvI4Ea4Wwi\",\"name\":\"USER\",\"role\":\"Admin\",\"serial_key\":\"Z6A7G-RS78E-VI2DZ-4HNF1-YYX1Q\",\"mac_address\":\"14:5a:fc:5d:44:23\",\"os_info\":\"{\\\"hostname\\\":\\\"erickhene-Aspire-A515-45\\\",\\\"user_info\\\":{\\\"uid\\\":1000,\\\"gid\\\":1000,\\\"username\\\":\\\"erickhene\\\",\\\"homedir\\\":\\\"/home/erickhene\\\",\\\"shell\\\":\\\"/bin/bash\\\"},\\\"arch\\\":\\\"x64\\\",\\\"platform\\\":\\\"linux\\\",\\\"type\\\":\\\"Linux\\\",\\\"memory\\\":\\\"16\\\",\\\"cpu\\\":\\\"AMD Ryzen 5 5500U with Radeon Graphics\\\"}\",\"createdAt\":\"2024-04-26T15:49:50.000Z\",\"updatedAt\":\"2024-04-26T15:49:50.000Z\"}', '27/5/2024 21:34:57:490', 'd7b78ec1-c91d-46a7-b671-d2be2f1694fb', 'NULL', '2024-05-27 13:34:57', '2024-05-27 13:34:57'),
(7, '1b80309e-dd9f-452d-b4b0-cfeb9e7f5d5d', '/user/login', 'SUCCESS', 'POST', '{\"id\":2,\"uuid\":\"4d768fb0-f97f-48d7-86a7-4840a7bdebc0\",\"username\":\"erick\",\"password\":\"$2b$10$dYta1q5QgHYAuSp24foFVeuFVNP6Q09BhIgy6WHXLotwvI4Ea4Wwi\",\"name\":\"USER\",\"role\":\"Admin\",\"serial_key\":\"Z6A7G-RS78E-VI2DZ-4HNF1-YYX1Q\",\"mac_address\":\"14:5a:fc:5d:44:23\",\"os_info\":\"{\\\"hostname\\\":\\\"erickhene-Aspire-A515-45\\\",\\\"user_info\\\":{\\\"uid\\\":1000,\\\"gid\\\":1000,\\\"username\\\":\\\"erickhene\\\",\\\"homedir\\\":\\\"/home/erickhene\\\",\\\"shell\\\":\\\"/bin/bash\\\"},\\\"arch\\\":\\\"x64\\\",\\\"platform\\\":\\\"linux\\\",\\\"type\\\":\\\"Linux\\\",\\\"memory\\\":\\\"16\\\",\\\"cpu\\\":\\\"AMD Ryzen 5 5500U with Radeon Graphics\\\"}\",\"createdAt\":\"2024-04-26T15:49:50.000Z\",\"updatedAt\":\"2024-04-26T15:49:50.000Z\"}', '27/5/2024 22:17:40:271', '19006b9b-2a85-4d4f-b384-cac98ac7cf7b', 'NULL', '2024-05-27 14:17:40', '2024-05-27 14:17:40');

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
-- Dumping data for table `user_tab`
--

INSERT INTO `user_tab` (`id`, `uuid`, `username`, `password`, `name`, `role`, `serial_key`, `mac_address`, `os_info`, `createdAt`, `updatedAt`) VALUES
(2, '4d768fb0-f97f-48d7-86a7-4840a7bdebc0', 'erick', '$2b$10$dYta1q5QgHYAuSp24foFVeuFVNP6Q09BhIgy6WHXLotwvI4Ea4Wwi', 'USER', 'Admin', 'Z6A7G-RS78E-VI2DZ-4HNF1-YYX1Q', '14:5a:fc:5d:44:23', '{\"hostname\":\"erickhene-Aspire-A515-45\",\"user_info\":{\"uid\":1000,\"gid\":1000,\"username\":\"erickhene\",\"homedir\":\"/home/erickhene\",\"shell\":\"/bin/bash\"},\"arch\":\"x64\",\"platform\":\"linux\",\"type\":\"Linux\",\"memory\":\"16\",\"cpu\":\"AMD Ryzen 5 5500U with Radeon Graphics\"}', '2024-04-26 15:49:50', '2024-04-26 15:49:50');

--
-- Indexes for dumped tables
--

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
-- Indexes for table `logger_tab`
--
ALTER TABLE `logger_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `neraca_tab`
--
ALTER TABLE `neraca_tab`
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
-- AUTO_INCREMENT for table `logger_tab`
--
ALTER TABLE `logger_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `neraca_tab`
--
ALTER TABLE `neraca_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_tab`
--
ALTER TABLE `user_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
