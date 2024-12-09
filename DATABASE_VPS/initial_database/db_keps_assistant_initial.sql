-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 09, 2024 at 12:51 PM
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `nomor_hp_klien` varchar(255) NOT NULL,
  `email_klien` varchar(255) NOT NULL,
  `alamat_klien` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `cabang_tab`
--

CREATE TABLE `cabang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `customer_tab`
--

CREATE TABLE `customer_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `npwp` varchar(255) NOT NULL,
  `alamat_rumah` varchar(255) NOT NULL,
  `alamat_kantor` varchar(255) NOT NULL,
  `no_telp` varchar(255) NOT NULL,
  `no_hp` varchar(255) NOT NULL,
  `kode_harga` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_tab`
--

INSERT INTO `customer_tab` (`id`, `uuid`, `name`, `code`, `npwp`, `alamat_rumah`, `alamat_kantor`, `no_telp`, `no_hp`, `kode_harga`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, 'cd6cf397-1ff4-439c-a8ae-7f4e23f2b464', 'TRI', 'CUST001', '1234566756', 'KUPANG', 'KUPANG', '8765456678', '081234323456', '1', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 21:09:58', '2024-12-04 21:09:58');

-- --------------------------------------------------------

--
-- Table structure for table `daftar_aset_tab`
--

CREATE TABLE `daftar_aset_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `tanggal_beli` varchar(255) NOT NULL,
  `supplier` varchar(255) NOT NULL,
  `nomor_invoice` varchar(255) NOT NULL,
  `kuantitas` int(11) NOT NULL,
  `satuan_barang` varchar(255) NOT NULL,
  `harga_satuan` int(11) NOT NULL,
  `dpp` int(11) NOT NULL,
  `ppn` int(11) NOT NULL,
  `metode_penyusutan` varchar(255) NOT NULL,
  `kelompok_aset` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `kategori_aset` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `daftar_bahan_baku_tab`
--

CREATE TABLE `daftar_bahan_baku_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `kategori_bahan_baku` varchar(255) NOT NULL,
  `jenis_bahan_baku` varchar(255) NOT NULL,
  `jenis_penjualan_bahan_baku` varchar(255) NOT NULL,
  `ppn` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `daftar_barang_tab`
--

CREATE TABLE `daftar_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `kategori_barang` varchar(255) NOT NULL,
  `jenis_barang` varchar(255) NOT NULL,
  `jenis_penjualan_barang` varchar(255) NOT NULL,
  `ppn` tinyint(1) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `daftar_barang_tab`
--

INSERT INTO `daftar_barang_tab` (`id`, `uuid`, `name`, `kategori_barang`, `jenis_barang`, `jenis_penjualan_barang`, `ppn`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`, `status`) VALUES
(1, 'b2afe79f-6609-4555-981a-ed83f769144c', 'AQUA', 'a7144691-f350-4617-8ca2-64e628222774', '66e4e0e8-57a5-481b-8363-f197c299c40e', 'd6b7fe5f-554a-40db-bf77-a719050eaade', 1, 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 1, '2024-12-04 21:15:30', '2024-12-04 21:18:42', 1);

-- --------------------------------------------------------

--
-- Table structure for table `daftar_gudang_tab`
--

CREATE TABLE `daftar_gudang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `kategori_gudang` varchar(255) NOT NULL,
  `jenis_gudang` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `daftar_gudang_tab`
--

INSERT INTO `daftar_gudang_tab` (`id`, `uuid`, `name`, `kategori_gudang`, `jenis_gudang`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, '309fb061-c3be-45e9-84d5-2dd719c99180', 'GUDANG OEPURA', 'b00c2fa6-80b4-4c2d-975c-7cfb003fda30', 'd93abdfe-47b6-4db5-bc47-02cf7686d8a2', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 21:17:59', '2024-12-04 21:17:59'),
(2, 'b82d8c4e-ed78-4fc8-a1e9-e5d85063443e', 'GUDANG TUAK DAUN MERAH', 'b00c2fa6-80b4-4c2d-975c-7cfb003fda30', 'a3bb3d01-0e24-47ec-89e8-c8ce0cfc1f56', 'b5e4bad6-d212-4b93-9085-3ec48302dcab', 'Empty', 1, '2024-12-09 14:53:55', '2024-12-09 14:53:55');

-- --------------------------------------------------------

--
-- Table structure for table `daftar_jasa_tab`
--

CREATE TABLE `daftar_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `kategori_jasa` varchar(255) NOT NULL,
  `jenis_jasa` varchar(255) NOT NULL,
  `jenis_penjualan_jasa` varchar(255) NOT NULL,
  `ppn` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `daftar_perlengkapan_tab`
--

CREATE TABLE `daftar_perlengkapan_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `kategori_perlengkapan` varchar(255) NOT NULL,
  `tanggal_beli` varchar(255) NOT NULL,
  `supplier` varchar(255) NOT NULL,
  `kuantitas` int(11) NOT NULL,
  `satuan_barang` varchar(255) NOT NULL,
  `harga_satuan` int(11) NOT NULL,
  `dpp` int(11) NOT NULL,
  `ppn` int(11) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `nomor_invoice` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `daftar_perlengkapan_tab`
--

INSERT INTO `daftar_perlengkapan_tab` (`id`, `uuid`, `name`, `kategori_perlengkapan`, `tanggal_beli`, `supplier`, `kuantitas`, `satuan_barang`, `harga_satuan`, `dpp`, `ppn`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`, `nomor_invoice`, `kode_akun_perkiraan`, `bukti_transaksi`) VALUES
(1, '6459675e-b6e6-493e-82bb-ce651a8aebb7', 'BUKU', 'a94c21e9-21e0-4bb7-bad5-e01e91ec4c6b', '2024-12-05T16:16:06.000', '8ef49b3e-7160-4e85-bd4c-cfc368f3d83c', 10, 'fa6f05fb-f136-4d37-b427-0583f49a3ee0', 10000, 100000, 0, 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-05 17:16:44', '2024-12-05 17:16:44', '12345', '76072236-7685-426b-8f10-6f2acf797c22', '1122334455');

-- --------------------------------------------------------

--
-- Table structure for table `divisi_tab`
--

CREATE TABLE `divisi_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `divisi_tab`
--

INSERT INTO `divisi_tab` (`id`, `uuid`, `name`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, 'a32b519d-a74f-4470-bd03-56346a2101fc', 'FAT', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 21:24:54', '2024-12-04 21:24:54');

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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `faktur_pembelian_barang_tab`
--

CREATE TABLE `faktur_pembelian_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pesanan_pembelian_barang` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `nomor_faktur_pembelian_barang` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `tipe_pembayaran` varchar(255) NOT NULL,
  `syarat_pembayaran` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `nomor_faktur_pajak_pembelian_barang` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `faktur_pembelian_barang_tab`
--

INSERT INTO `faktur_pembelian_barang_tab` (`id`, `uuid`, `pesanan_pembelian_barang`, `tanggal`, `nomor_faktur_pembelian_barang`, `bukti_transaksi`, `tipe_pembayaran`, `syarat_pembayaran`, `keterangan`, `nomor_faktur_pajak_pembelian_barang`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, '526ff1ec-b6bc-4ac2-8141-911831781f2d', '658e1a54-9394-4b98-b9cc-5e6b089a0153', '2024-12-06T22:12:55', '1', '1', 'ba506b51-5427-44b6-8674-b51de38ed253', '1', '1', '1', 'b5e4bad6-d212-4b93-9085-3ec48302dcab', 'b5e4bad6-d212-4b93-9085-3ec48302dcab', 0, '2024-12-04 22:13:23', '2024-12-04 22:13:25'),
(2, 'b2981fe0-744a-4b72-b34e-9cde84900f4e', '658e1a54-9394-4b98-b9cc-5e6b089a0153', '2024-12-05T21:11:33', 'PI-1224-0051', 'BK-1224-0010', '540f97b0-840f-439f-8566-808b7eca6a7a', '30 HARI', 'PEMBELIAN KREDIT', '1234556788', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 22:14:35', '2024-12-04 22:14:35');

-- --------------------------------------------------------

--
-- Table structure for table `faktur_penjualan_barang_tab`
--

CREATE TABLE `faktur_penjualan_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pesanan_penjualan_barang` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `nomor_faktur_penjualan_barang` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `tipe_pembayaran` varchar(255) NOT NULL,
  `syarat_pembayaran` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `nomor_faktur_pajak_penjualan_barang` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `faktur_penjualan_barang_tab`
--

INSERT INTO `faktur_penjualan_barang_tab` (`id`, `uuid`, `pesanan_penjualan_barang`, `tanggal`, `nomor_faktur_penjualan_barang`, `bukti_transaksi`, `tipe_pembayaran`, `syarat_pembayaran`, `keterangan`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`, `nomor_faktur_pajak_penjualan_barang`) VALUES
(1, '05c14556-6db9-4144-98cf-312d79ed5de0', '16050674-b42c-456d-9b06-4ef40a898d71', '2024-12-06T07:35:10', 'SI-1224-0057', 'JV-1224-0012', '540f97b0-840f-439f-8566-808b7eca6a7a', '94c3a2ba-2f35-407a-a1dd-df11e140ac2d', 'PENJUALAN KREDIT', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-05 08:36:49', '2024-12-05 08:36:49', '0100009876543456');

-- --------------------------------------------------------

--
-- Table structure for table `faktur_penjualan_jasa_tab`
--

CREATE TABLE `faktur_penjualan_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pesanan_penjualan_jasa` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `nomor_faktur_penjualan_jasa` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `tipe_pembayaran` varchar(255) NOT NULL,
  `syarat_pembayaran` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `nomor_faktur_pajak_penjualan_jasa` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `gaji_tab`
--

CREATE TABLE `gaji_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pegawai` varchar(255) NOT NULL,
  `periode` int(11) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `nilai` int(11) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `hadiah_tab`
--

CREATE TABLE `hadiah_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pegawai` varchar(255) NOT NULL,
  `periode` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `hadiah` varchar(255) NOT NULL,
  `nilai` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `hasil_stok_opname_tab`
--

CREATE TABLE `hasil_stok_opname_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `perintah_stok_opname` varchar(255) NOT NULL,
  `stok_awal_barang` varchar(255) NOT NULL,
  `kuantitas` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `hitungan_penyusutan_tab`
--

CREATE TABLE `hitungan_penyusutan_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `tahun_perolehan` varchar(255) NOT NULL,
  `masa_awal` int(11) NOT NULL,
  `masa_akhir` int(11) NOT NULL,
  `nilai_buku` double NOT NULL,
  `nilai_penyusutan` double NOT NULL,
  `persentase` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `bulan` int(11) NOT NULL,
  `tahun` int(11) NOT NULL,
  `metode_penyusutan` varchar(255) NOT NULL,
  `harga_beli` double NOT NULL,
  `transaksi` varchar(255) NOT NULL,
  `daftar_aset` varchar(255) NOT NULL,
  `akumulasi_penyusutan_awal_tahun` double NOT NULL,
  `persentase_penyusutan` double NOT NULL,
  `nilai_buku_awal_tahun` double NOT NULL,
  `nilai_buku_akhir_tahun` double NOT NULL,
  `tanggal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jabatan_tab`
--

CREATE TABLE `jabatan_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jabatan_tab`
--

INSERT INTO `jabatan_tab` (`id`, `uuid`, `name`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, 'e30c3c54-cfae-4005-8aea-a3711cb94071', 'ACCOUNTING SPECIALIST', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 21:25:12', '2024-12-04 21:25:12');

-- --------------------------------------------------------

--
-- Table structure for table `jenis_bahan_baku_tab`
--

CREATE TABLE `jenis_bahan_baku_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jenis_barang_tab`
--

CREATE TABLE `jenis_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jenis_barang_tab`
--

INSERT INTO `jenis_barang_tab` (`id`, `uuid`, `name`, `code`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, '66e4e0e8-57a5-481b-8363-f197c299c40e', 'BARANG SENDIRI', 'BS', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 21:13:32', '2024-12-04 21:13:32'),
(2, '58341745-e38a-485b-9612-2ba53c05f57d', 'BARANG TITIPAN', 'BT', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 1, '2024-12-04 21:13:32', '2024-12-04 21:13:58'),
(3, '34b67f1b-3dac-4389-b12e-bf1cb9fdcf7e', 'BARANG SENDIRI', 'BS', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 0, '2024-12-04 21:13:32', '2024-12-04 21:13:37');

-- --------------------------------------------------------

--
-- Table structure for table `jenis_gudang_tab`
--

CREATE TABLE `jenis_gudang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jenis_gudang_tab`
--

INSERT INTO `jenis_gudang_tab` (`id`, `uuid`, `name`, `code`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, 'd93abdfe-47b6-4db5-bc47-02cf7686d8a2', 'GUDANG UTAMA', 'GU', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 21:16:53', '2024-12-04 21:16:53'),
(2, 'a3bb3d01-0e24-47ec-89e8-c8ce0cfc1f56', 'GUDANG CADANGAN', 'GC', 'b5e4bad6-d212-4b93-9085-3ec48302dcab', 'b5e4bad6-d212-4b93-9085-3ec48302dcab', 1, '2024-12-09 14:52:39', '2024-12-09 14:52:50');

-- --------------------------------------------------------

--
-- Table structure for table `jenis_jasa_tab`
--

CREATE TABLE `jenis_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jenis_penjualan_bahan_baku_tab`
--

CREATE TABLE `jenis_penjualan_bahan_baku_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jenis_penjualan_barang_tab`
--

CREATE TABLE `jenis_penjualan_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jenis_penjualan_barang_tab`
--

INSERT INTO `jenis_penjualan_barang_tab` (`id`, `uuid`, `name`, `code`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, 'd6b7fe5f-554a-40db-bf77-a719050eaade', 'BARANG', 'BRG', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 21:15:16', '2024-12-04 21:15:16');

-- --------------------------------------------------------

--
-- Table structure for table `jenis_penjualan_jasa_tab`
--

CREATE TABLE `jenis_penjualan_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jurnal_umum_tab`
--

INSERT INTO `jurnal_umum_tab` (`id`, `uuid`, `tanggal`, `bulan`, `tahun`, `waktu`, `uraian`, `debet`, `kredit`, `kode_akun_uuid`, `bukti_transaksi`, `transaksi`, `enabled`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`) VALUES
(1, '901dfdf0-5621-4c59-9bb2-4f45d6879fdd', '01', '12', '2024', '15:13:22', 'PENJUALAN KOPI DARI CITRA AMALA', '149580000', '0', 'a709f4cc-5399-4d4b-810d-486d2190ea12', 'BMEMDR-1223-0001', 0, 1, '2024-12-02 15:15:13', '2024-12-02 15:16:16', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(2, '4be3851e-1b9a-4190-af20-521d6185b0ef', '01', '12', '2024', '15:14:28', 'PENJUALAN KOPI DARI CIRTA AMALA', '0', '149580000', '453764da-957f-4099-a03d-268367987dc2', 'BMEMDR-1223-0001', 0, 1, '2024-12-02 15:15:13', '2024-12-02 15:16:16', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(3, 'ffe47281-2542-4b16-9b15-6fa7cc383ccb', '01', '12', '2024', '15:16:38', 'SALARY PERIODE NOVEMBER YSIDORA IMANI', '4000000', '0', '0c0a1c04-ad98-4818-9a63-9be554b2ae55', 'BKMDR-1223-0001', 0, 1, '2024-12-02 15:19:25', '2024-12-02 15:21:21', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(4, 'ad4f5604-5035-4f16-975f-f323295bf3cd', '01', '12', '2024', '15:18:05', 'SALARY PERIODE NOVEMBER YSIDORA IMANI', '0', '4000000', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0001', 0, 1, '2024-12-02 15:19:25', '2024-12-02 15:21:21', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(5, '29851884-b004-4293-94d9-1b5dc1261e36', '01', '12', '2024', '15:21:26', 'SALARY PERIODE NOVEMBER NI KOMANG DESI', '4250000', '0', '0c0a1c04-ad98-4818-9a63-9be554b2ae55', 'BKMDR-1223-0002', 0, 1, '2024-12-02 15:22:26', '2024-12-02 15:51:57', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(6, 'a327742f-9ee8-4733-9931-edcf737652ab', '01', '12', '2024', '15:22:12', 'SALARY PERIODE NOVEMBER NI KOMANG DESI', '0', '4250000', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0002', 0, 1, '2024-12-02 15:22:26', '2024-12-02 15:51:57', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(7, 'a010b76d-21f1-4cb7-bffb-cf501d0619f2', '01', '12', '2024', '15:22:32', 'ADMINSTRASI TF', '2500', '0', 'b7814307-ad60-4dbc-b314-b202c2bb512c', 'BKMDR-1223-0002', 1, 1, '2024-12-02 15:24:08', '2024-12-02 15:51:58', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(8, 'daf44350-5537-466c-9652-3b302cdf2ef7', '01', '12', '2024', '15:23:35', 'ADMINSTRASI TF', '0', '2500', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0002', 1, 1, '2024-12-02 15:24:08', '2024-12-02 15:51:58', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(9, '9ddac0f3-316a-4093-83e7-9a8fab899769', '01', '12', '2024', '15:24:46', 'SALARY PERIODE NOVEMBER ALEXANDER', '750000', '0', '0c0a1c04-ad98-4818-9a63-9be554b2ae55', 'BKMDR-1223-0003', 0, 1, '2024-12-02 15:31:59', '2024-12-02 15:52:15', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(10, '6c4973b2-7690-4f06-aebb-fcc37da9aead', '01', '12', '2024', '15:26:13', 'SALARY PERIODE NOVEMBER ALEXANDER', '0', '750000', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0003', 0, 1, '2024-12-02 15:31:59', '2024-12-02 15:52:15', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(11, '1d14a597-b5ff-478b-b3a9-0929eb06c171', '01', '12', '2024', '15:31:25', 'ADMINISTRASI TF BANK', '2500', '0', 'b7814307-ad60-4dbc-b314-b202c2bb512c', 'BKMDR-1223-0003', 1, 1, '2024-12-02 15:31:59', '2024-12-02 15:52:15', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(12, '1c1bcab8-cbe5-407f-a7c2-cfafffb9494c', '01', '12', '2024', '15:31:46', 'ADMINISTRASI TF BANK', '0', '2500', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0003', 1, 1, '2024-12-02 15:31:59', '2024-12-02 15:52:15', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(13, 'ff9832ac-81c0-49cd-a8d5-3df1ddeff419', '01', '12', '2024', '15:34:23', 'JASA ROASTING ERIK KURNIAWAN SISWANTO', '560000', '0', 'debb84d2-d1de-4527-a7de-70024ec4c34b', 'BKMDR-1223-0004', 0, 1, '2024-12-02 15:35:41', '2024-12-02 15:37:15', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(14, '88a062b9-c3d1-43d0-9d9e-7328681e81ef', '01', '12', '2024', '15:34:54', 'JASA ROASTING ERIK KURNIAWAN SISWANTO', '0', '560000', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0004', 0, 1, '2024-12-02 15:35:41', '2024-12-02 15:37:15', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(15, '786283e5-91b7-4a25-801d-21c4882e2596', '01', '12', '2024', '15:37:29', 'SALARY PERIODE NOVEMBER VALDI PRATAMA', '10000000', '0', '0c0a1c04-ad98-4818-9a63-9be554b2ae55', 'BKMDR-1223-0005', 0, 1, '2024-12-02 15:38:26', '2024-12-02 15:38:26', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(16, 'cb8d6991-828c-4083-aa4b-d343092fdb68', '01', '12', '2024', '15:38:11', 'SALARY PERIODE NOVEMBER VALDI PRATAMA', '0', '10000000', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0005', 0, 1, '2024-12-02 15:38:26', '2024-12-02 15:38:26', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(17, 'a3615489-1e42-47ac-8973-a72af9d166b8', '02', '12', '2024', '15:40:05', 'PEMBELIAN KOPI TILES 60 KG WAHYUDI PURNOMO', '7200000', '0', 'a709f4cc-5399-4d4b-810d-486d2190ea12', 'BMEMDR-1223-0002', 0, 1, '2024-12-02 15:43:14', '2024-12-02 15:43:14', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(18, '8e903dfc-aa59-4d50-856e-a7ccc5a7ff09', '02', '12', '2024', '15:41:10', 'PEMBELIAN KOPI TILES 60 KG WAHYUDI PURNOMO', '0', '7200000', '453764da-957f-4099-a03d-268367987dc2', 'BMEMDR-1223-0002', 0, 1, '2024-12-02 15:43:14', '2024-12-02 15:43:14', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(19, '6dc54371-f2ca-42d1-9909-9e05607fc50c', '08', '12', '2024', '15:43:26', 'PENJUALAN KOPI NI MADE AYU TEGITA', '240000', '0', 'a709f4cc-5399-4d4b-810d-486d2190ea12', 'BMEMDR-1223-0003', 0, 1, '2024-12-02 15:44:26', '2024-12-02 15:44:26', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(20, '00a27af6-b43f-4487-88bc-41b6c7599b31', '08', '12', '2024', '15:44:05', 'PENJUALAN KOPI NI MADE AYU TEGITA', '0', '240000', '453764da-957f-4099-a03d-268367987dc2', 'BMEMDR-1223-0003', 0, 1, '2024-12-02 15:44:26', '2024-12-02 15:44:26', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(21, '003af963-6c0e-4aec-95da-3e3ff56a7b5b', '08', '12', '2024', '15:47:06', 'DP SEWA GUDANG TF KE VALDI PRATAMA', '3000000', '0', '0d591543-5738-4b25-a3b5-990a4bddcaa0', 'BKMDR-1223-0006', 0, 1, '2024-12-02 15:48:53', '2024-12-02 15:48:53', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(22, 'bf150209-7373-40c4-a30e-3279d31b2c1e', '08', '12', '2024', '15:47:51', 'DP SEWA GUDANG TF KE VALDI PRATAMA', '0', '3000000', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0006', 0, 1, '2024-12-02 15:48:53', '2024-12-02 15:48:53', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(23, 'e76e62d0-366f-460c-84d1-cc55d5dea682', '11', '12', '2024', '15:52:46', 'MONTHLY CARD CHARGE', '5500', '0', 'b7814307-ad60-4dbc-b314-b202c2bb512c', 'BKMDR-1223-0007', 0, 1, '2024-12-02 15:53:36', '2024-12-02 15:53:36', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(24, '48dd01ad-c0d0-4885-b25c-709f58191dca', '11', '12', '2024', '15:53:22', 'MONTHLY CARD CHARGE', '0', '5500', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0007', 0, 1, '2024-12-02 15:53:36', '2024-12-02 15:53:36', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(25, '903110f5-4e6a-4358-9fad-dc09c405f6d7', '13', '12', '2024', '15:55:09', 'PENJUALAN KOPI KE I GUSTI NGURAH A', '14160000', '0', 'a709f4cc-5399-4d4b-810d-486d2190ea12', 'BMEMDR-1223-0004', 0, 1, '2024-12-02 15:56:27', '2024-12-02 15:56:27', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(26, '6ceed77d-d696-4909-b738-79223696cdef', '13', '12', '2024', '15:55:57', 'PENJUALAN KOPI KE I GUSTI NGURAH A', '0', '14160000', '453764da-957f-4099-a03d-268367987dc2', 'BMEMDR-1223-0004', 0, 1, '2024-12-02 15:56:27', '2024-12-02 15:56:27', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(27, 'de73cb1c-e637-4f4b-be7c-e7f37fedc5ba', '13', '12', '2024', '15:57:08', 'KEPERLUAN USAHA PERDAGANGAN HASIL BUMI ', '40000000', '0', '69218ad5-43d0-4faa-8240-429596cef93a', 'BMMDR-1223-0001; BKEMDR-1223-0001', 0, 1, '2024-12-02 15:58:47', '2024-12-02 15:58:47', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(28, 'b2e29437-9bf4-42ad-805f-5a4b239748ca', '13', '12', '2024', '15:58:21', 'KEPERLUAN USAHA PERDAGANGAN HASUL BUMI', '0', '40000000', 'a709f4cc-5399-4d4b-810d-486d2190ea12', 'BMMDR-1223-0001; BKEMDR-1223-0001', 0, 1, '2024-12-02 15:58:47', '2024-12-02 15:58:47', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(29, '6e8a525c-9fc9-4a76-a5d6-e3fc211fc966', '13', '12', '2024', '15:59:37', 'TF KE VALDI PRATAMA ATM SBML TAMAN; OPERASIONAL DIREKTUR', '2000000', '0', '0d591543-5738-4b25-a3b5-990a4bddcaa0', 'BKMDR-1223-0008', 0, 1, '2024-12-02 16:00:44', '2024-12-02 16:01:55', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(30, '0cff02c1-ce2e-42ff-84c9-b45a23e96d10', '13', '12', '2024', '16:00:31', 'TF KE VALDI PRATAMA ATM SBML TAMAN; OPERASIONAL DIREKTUR', '0', '2000000', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0008', 0, 1, '2024-12-02 16:00:44', '2024-12-02 16:01:55', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(31, '8d557a74-84f6-4b40-a8fe-555249555dab', '15', '12', '2024', '16:02:50', 'AUTO DEBET HUTANG BANK', '35466666.87', '0', 'cb4da807-75ad-4202-b15c-ef6417211481', 'BKMDR-1023-0009', 0, 1, '2024-12-02 16:04:11', '2024-12-02 16:04:11', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(32, '914f96ae-f670-4c7e-b2e5-7bc46c8c0bc4', '15', '12', '2024', '16:03:52', 'AUTO DEBET HUTANG BANK', '0', '35466666.87', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1023-0009', 0, 1, '2024-12-02 16:04:12', '2024-12-02 16:04:12', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(33, '8f4bbf3b-fb1f-41fa-aa9c-0edda35f456a', '16', '12', '2024', '16:04:38', 'OPERASIONAL DIREKTUR; TF KE VALDI PRATAMA', '1000000', '0', '0d591543-5738-4b25-a3b5-990a4bddcaa0', 'BKMDR-1223-0010', 0, 1, '2024-12-02 16:06:02', '2024-12-02 16:06:02', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(34, '839f69cf-92e1-41c8-81d7-fa92b4205c49', '16', '12', '2024', '16:05:48', 'OPERASIONAL DIREKTUR; TF KE VALDI PRATAMA', '0', '1000000', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0010', 0, 1, '2024-12-02 16:06:02', '2024-12-02 16:06:02', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(35, '04b0b458-862e-4d51-9dfe-dab8d8969242', '18', '12', '2024', '16:06:43', 'PENJUALAN KOPI; NI MADE AYU REGITA', '240000', '0', 'a709f4cc-5399-4d4b-810d-486d2190ea12', 'BMEMDR-1223-0005;0006', 0, 1, '2024-12-02 16:09:07', '2024-12-02 16:09:07', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(36, 'a4469f81-889c-4f09-b3d6-06cc0e347d19', '18', '12', '2024', '16:07:31', 'PENJUALAN KOPI; NI MADE AYU REGITA', '0', '240000', '453764da-957f-4099-a03d-268367987dc2', 'BMEMDR-1223-0005;0006', 0, 1, '2024-12-02 16:09:07', '2024-12-02 16:09:07', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(37, 'f6b0894f-6e72-4e30-9fe4-537913834253', '18', '12', '2024', '16:08:00', 'PENJUALAN KOPI; ANDRIANA DWI HESTYANI', '1920000', '0', 'a709f4cc-5399-4d4b-810d-486d2190ea12', 'BMEMDR-1223-0005;0006', 1, 1, '2024-12-02 16:09:08', '2024-12-02 16:09:08', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(38, '721d176e-c48e-48bc-9a74-e9afb41d552c', '18', '12', '2024', '16:08:50', 'PENJUALAN KOPI; ANDRIANA DWI HESTYANI', '0', '1920000', '453764da-957f-4099-a03d-268367987dc2', 'BMEMDR-1223-0005;0006', 1, 1, '2024-12-02 16:09:08', '2024-12-02 16:09:08', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(39, '786a17db-0d3c-4c58-8362-e00a12f6dcee', '20', '12', '2024', '16:09:24', 'TF ATM SANUR; BIAYA LAIN-LAIN', '2000000', '0', '0d591543-5738-4b25-a3b5-990a4bddcaa0', 'BKMDR-1223-0011', 0, 1, '2024-12-02 16:10:29', '2024-12-02 16:10:29', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(40, '24fd76aa-9544-4540-bda0-3aec38d29d14', '20', '12', '2024', '16:10:10', 'TF ATM SANUR; BIAYA LAIN-LAIN', '0', '2000000', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0011', 0, 1, '2024-12-02 16:10:29', '2024-12-02 16:10:29', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(41, 'b70f3333-1b2f-427b-8885-525bf9305db9', '21', '12', '2024', '16:10:35', 'PENJUALAN KOPI', '500000', '0', 'a709f4cc-5399-4d4b-810d-486d2190ea12', 'BMEMDR-1223-0007', 0, 1, '2024-12-02 16:11:51', '2024-12-02 16:11:51', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(42, '1b40e2ec-68ca-48d7-90d5-ad3f348e713b', '21', '12', '2024', '16:11:22', 'PENJUALAN KOPI', '0', '500000', '453764da-957f-4099-a03d-268367987dc2', 'BMEMDR-1223-0007', 0, 1, '2024-12-02 16:11:51', '2024-12-02 16:11:51', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(43, '675495c9-f0e7-43e1-b707-45eb2b3cf209', '24', '12', '2024', '16:11:57', 'TF ATM KUTARAYA', '433000', '0', '0d591543-5738-4b25-a3b5-990a4bddcaa0', 'BKMDR-1223-0012;0013', 0, 1, '2024-12-02 16:15:58', '2024-12-02 16:15:58', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(44, '8f12e68b-a0d4-4b2f-94cd-74fdfbe64b55', '24', '12', '2024', '16:15:04', 'TF ATM KUTARAYA', '0', '433000', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0012;0013', 0, 1, '2024-12-02 16:15:58', '2024-12-02 16:15:58', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(45, '5e7b78ac-cc29-4df4-88bf-acfcff002a9d', '24', '12', '2024', '16:15:21', 'JASA ROASTING; ERIK KURNIAWAN SISWANTO', '800000', '0', 'debb84d2-d1de-4527-a7de-70024ec4c34b', 'BKMDR-1223-0012;0013', 1, 1, '2024-12-02 16:15:58', '2024-12-02 16:15:58', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(46, '62a4c701-5f48-4f0e-835d-e0cd80b843fa', '24', '12', '2024', '16:15:42', 'JASA ROASTING; ERIK KURNIAWAN SISWANTO', '0', '800000', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0012;0013', 1, 1, '2024-12-02 16:15:58', '2024-12-02 16:15:58', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(47, 'aa39411b-cccf-496a-b39a-5ee71157919e', '26', '12', '2024', '16:16:23', 'PENJUALAN KOPI I GUSTI NGURAH AB', '17410000', '0', 'a709f4cc-5399-4d4b-810d-486d2190ea12', 'BMEMDR-1223-0008', 0, 1, '2024-12-02 16:17:21', '2024-12-02 16:17:21', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(48, 'a2162191-e7a2-4909-90fd-ef8613cf1f5f', '26', '12', '2024', '16:17:03', 'PENJUALAN KOPI I GUSTI NGURAH AB', '0', '17410000', '453764da-957f-4099-a03d-268367987dc2', 'BMEMDR-1223-0008', 0, 1, '2024-12-02 16:17:21', '2024-12-02 16:17:21', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(49, '4073cd98-dfc1-4ae0-afde-b368b7a2937b', '28', '12', '2024', '16:17:36', 'PENJUALAN KOPI; PARAS AYU PT', '3840000', '0', 'a709f4cc-5399-4d4b-810d-486d2190ea12', 'BMEMDR-1223-0009;0010', 0, 1, '2024-12-02 16:19:16', '2024-12-02 16:19:16', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(50, '8c946026-1f60-4d24-8a94-33e0ea594b8e', '28', '12', '2024', '16:18:20', 'PENJUALAN KOPI; PARAS AYU PT', '0', '3840000', '453764da-957f-4099-a03d-268367987dc2', 'BMEMDR-1223-0009;0010', 0, 1, '2024-12-02 16:19:16', '2024-12-02 16:19:16', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(51, '3dd207d8-3969-4c5e-b6c8-bbdf48e45dff', '28', '12', '2024', '16:18:35', 'PENJUALAN KOPI; PARAS AGUNG PT', '1410000', '0', 'a709f4cc-5399-4d4b-810d-486d2190ea12', 'BMEMDR-1223-0009;0010', 1, 1, '2024-12-02 16:19:16', '2024-12-02 16:19:16', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(52, '5ad747f6-7393-447d-8ad3-b3f70859cd0e', '28', '12', '2024', '16:18:56', 'PENJUALAN KOPI; PARAS AGUNG PT', '0', '1410000', '453764da-957f-4099-a03d-268367987dc2', 'BMEMDR-1223-0009;0010', 1, 1, '2024-12-02 16:19:16', '2024-12-02 16:19:16', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(53, '8d7476ab-560b-42d3-8c39-14ae9bc0c4a8', '28', '12', '2024', '16:19:33', 'TRANSFER ATM HANGTUAH', '1500000', '0', '0d591543-5738-4b25-a3b5-990a4bddcaa0', 'BKMDR-1223-0014', 0, 1, '2024-12-02 16:21:18', '2024-12-02 16:21:18', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(54, '7be5d1c5-96f4-49e4-b43c-116dd6748924', '28', '12', '2024', '16:21:04', 'TRANSFER ATM HANGTUAH', '0', '1500000', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0014', 0, 1, '2024-12-02 16:21:18', '2024-12-02 16:21:18', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(55, 'bd577e25-7948-477b-830c-b5a5570f721e', '29', '12', '2024', '16:21:36', 'PENJUALAN KOPI; ANDRIANA DWI HESYANI', '1920000', '0', 'a709f4cc-5399-4d4b-810d-486d2190ea12', 'BMEMDR-1223-0011', 0, 1, '2024-12-02 16:23:24', '2024-12-02 16:23:24', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(56, 'bb1f6432-ccfb-40a9-b6c8-13356a493433', '29', '12', '2024', '16:23:08', 'PENJUALAN KOPI; ANDRIANA DWI HESYANI', '0', '1920000', '453764da-957f-4099-a03d-268367987dc2', 'BMEMDR-1223-0011', 0, 1, '2024-12-02 16:23:24', '2024-12-02 16:23:24', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(57, '273ea1c4-a2ff-40e5-83dd-e7314cfea6ca', '30', '12', '2024', '16:23:36', 'PENJUALAN KOPI', '500000', '0', 'a709f4cc-5399-4d4b-810d-486d2190ea12', 'BMEMDR-1223-0012', 0, 1, '2024-12-02 16:24:16', '2024-12-02 16:24:16', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(58, '979bbb45-5a7d-4f52-962e-7cfc2a84524b', '30', '12', '2024', '16:24:03', 'PENJUALAN KOPI', '0', '500000', '453764da-957f-4099-a03d-268367987dc2', 'BMEMDR-1223-0012', 0, 1, '2024-12-02 16:24:16', '2024-12-02 16:24:16', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(59, 'a6a75a2e-af46-4519-a5bd-8fd275a589aa', '31', '12', '2024', '16:24:57', 'BIAYA ADMIN 18157', '12500', '0', 'b7814307-ad60-4dbc-b314-b202c2bb512c', 'BKMDR-1223-0015;0016', 0, 1, '2024-12-02 16:26:56', '2024-12-02 16:26:56', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(60, 'b1bacfee-b530-4f8e-9db8-45a4462a078c', '31', '12', '2024', '16:25:49', 'BIAYA ADMIN 18157', '0', '12500', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0015;0016', 0, 1, '2024-12-02 16:26:56', '2024-12-02 16:26:56', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(61, '0137f973-20d5-4d5e-bffe-6f35f9c9f37f', '31', '12', '2024', '16:26:07', 'PAJAK 18157', '8467.05', '0', 'b7814307-ad60-4dbc-b314-b202c2bb512c', 'BKMDR-1223-0015;0016', 1, 1, '2024-12-02 16:26:56', '2024-12-02 16:26:56', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(62, 'f5d4f46b-9f22-4485-9d96-8d29628b9d3c', '31', '12', '2024', '16:26:37', 'PAJAK 18157', '0', '8467.05', '69218ad5-43d0-4faa-8240-429596cef93a', 'BKMDR-1223-0015;0016', 1, 1, '2024-12-02 16:26:56', '2024-12-02 16:26:56', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty'),
(63, 'e731bf6b-d04f-4f3b-91b2-70f9f9d8e10a', '31', '12', '2024', '16:28:37', 'BUNGA 18157', '42335.27', '0', '69218ad5-43d0-4faa-8240-429596cef93a', 'BMMDR-1223-0002', 0, 0, '2024-12-02 16:30:14', '2024-12-03 08:39:17', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62'),
(64, 'e6a96612-be15-4ce2-bff3-0985067c5a44', '31', '12', '2024', '16:29:55', 'BUNGA 18157', '0', '42335.27', '8fe1e2d2-c437-4d09-a12c-f1354d3809ee', 'BMMDR-1223-0002', 0, 0, '2024-12-02 16:30:14', '2024-12-03 08:39:17', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62');

-- --------------------------------------------------------

--
-- Table structure for table `kategori_aset_tab`
--

CREATE TABLE `kategori_aset_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `kode_akun_perkiraan_debet` varchar(255) NOT NULL,
  `kode_akun_perkiraan_kredit` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kategori_bahan_baku_tab`
--

CREATE TABLE `kategori_bahan_baku_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kategori_barang_tab`
--

CREATE TABLE `kategori_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `kategori_barang_tab`
--

INSERT INTO `kategori_barang_tab` (`id`, `uuid`, `name`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, 'a7144691-f350-4617-8ca2-64e628222774', 'MINUMAN', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 21:11:51', '2024-12-04 21:11:51');

-- --------------------------------------------------------

--
-- Table structure for table `kategori_gudang_tab`
--

CREATE TABLE `kategori_gudang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `kategori_gudang_tab`
--

INSERT INTO `kategori_gudang_tab` (`id`, `uuid`, `name`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, 'b00c2fa6-80b4-4c2d-975c-7cfb003fda30', 'GUDANG MAKANAN & MINUMAN', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 21:17:37', '2024-12-04 21:17:37');

-- --------------------------------------------------------

--
-- Table structure for table `kategori_harga_bahan_baku_tab`
--

CREATE TABLE `kategori_harga_bahan_baku_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `daftar_bahan_baku` varchar(255) NOT NULL,
  `kode_bahan_baku` varchar(255) NOT NULL,
  `satuan_bahan_baku` varchar(255) NOT NULL,
  `harga_beli` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kategori_harga_barang_tab`
--

CREATE TABLE `kategori_harga_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `daftar_barang` varchar(255) NOT NULL,
  `kode_barang` varchar(255) NOT NULL,
  `satuan_barang` varchar(255) NOT NULL,
  `harga_1` double NOT NULL,
  `harga_2` double NOT NULL,
  `harga_3` double NOT NULL,
  `harga_4` double NOT NULL,
  `harga_5` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `harga_beli` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `kategori_harga_barang_tab`
--

INSERT INTO `kategori_harga_barang_tab` (`id`, `uuid`, `daftar_barang`, `kode_barang`, `satuan_barang`, `harga_1`, `harga_2`, `harga_3`, `harga_4`, `harga_5`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`, `harga_beli`) VALUES
(1, '33bd566d-789e-4bd1-aeee-9477ef3d6991', 'b2afe79f-6609-4555-981a-ed83f769144c', '1234565432177', 'fa6f05fb-f136-4d37-b427-0583f49a3ee0', 5000, 6000, 6500, 0, 0, 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 21:16:07', '2024-12-04 21:16:07', 4000);

-- --------------------------------------------------------

--
-- Table structure for table `kategori_harga_jasa_tab`
--

CREATE TABLE `kategori_harga_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `daftar_jasa` varchar(255) NOT NULL,
  `kode_jasa` varchar(255) NOT NULL,
  `satuan_jasa` varchar(255) NOT NULL,
  `harga_1` double NOT NULL,
  `harga_2` double NOT NULL,
  `harga_3` double NOT NULL,
  `harga_4` double NOT NULL,
  `harga_5` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kategori_jasa_tab`
--

CREATE TABLE `kategori_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kategori_perlengkapan_tab`
--

CREATE TABLE `kategori_perlengkapan_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `kategori_perlengkapan_tab`
--

INSERT INTO `kategori_perlengkapan_tab` (`id`, `uuid`, `name`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`, `kode_akun_perkiraan`) VALUES
(1, 'a94c21e9-21e0-4bb7-bad5-e01e91ec4c6b', 'Perlengkapan Kantor', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-05 17:15:38', '2024-12-05 17:15:38', 'c85ac20d-1b1e-45c5-80e1-8db80c5dd283');

-- --------------------------------------------------------

--
-- Table structure for table `kelompok_aset_tab`
--

CREATE TABLE `kelompok_aset_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `masa_penyusutan` int(11) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kerugian_tab`
--

CREATE TABLE `kerugian_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pegawai` varchar(255) NOT NULL,
  `periode` int(11) NOT NULL,
  `nilai` int(11) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
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
  `updatedAt` datetime NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `type_transaksi_kas_bank` int(11) NOT NULL,
  `update_permission` tinyint(1) NOT NULL,
  `type_transaksi_payroll` tinyint(1) NOT NULL,
  `type_transaksi_pembelian_aset_dan_perlengkapan` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `kode_akun_perkiraan_tab`
--

INSERT INTO `kode_akun_perkiraan_tab` (`id`, `uuid`, `type`, `name`, `code`, `enabled`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `type_transaksi_kas_bank`, `update_permission`, `type_transaksi_payroll`, `type_transaksi_pembelian_aset_dan_perlengkapan`) VALUES
(1, '76072236-7685-426b-8f10-6f2acf797c22', 'Harta', 'Kas Besar', '101', 1, '2023-11-11 16:38:43', '2024-03-27 05:11:54', 'SYSTEM', '', 1, 0, 1, 1),
(2, '9d331f11-7061-4f62-b286-0a87fcc0fd03', 'Harta', 'Kas Kecil', '102', 1, '2023-11-11 16:38:54', '2023-11-11 16:38:54', 'SYSTEM', '', 1, 0, 1, 1),
(3, '33105460-6ac0-4744-a56c-6822bb4d4ba3', 'Harta', 'Piutang Usaha', '110', 1, '2023-11-11 16:42:19', '2023-11-11 16:42:19', 'SYSTEM', '', 0, 0, 0, 0),
(4, 'f15e2810-c736-42f6-9a80-6d70e03315de', 'Harta', 'Piutang Karyawan', '111', 1, '2023-11-11 16:42:33', '2023-11-11 16:42:33', 'SYSTEM', '', 0, 0, 0, 0),
(5, '0ebe1d2e-f18b-4c4e-bfdc-304f3dd83735', 'Modal', 'Modal', '301', 1, '2023-11-11 16:50:02', '2023-11-17 12:23:48', 'SYSTEM', '', 0, 0, 0, 0),
(6, 'b073c676-1e2a-4b50-8bf9-eb2c4081e05d', 'Modal', 'Prive', '302', 1, '2023-11-11 16:50:29', '2023-12-09 06:47:05', 'SYSTEM', '', 0, 0, 0, 0),
(7, '8d975877-fdb8-4388-96c7-250b40942cb5', 'Modal', 'Laba/Rugi Periode Sebelumnya', '398', 1, '2023-11-11 16:50:54', '2023-11-11 16:51:26', 'SYSTEM', '', 0, 0, 0, 0),
(8, '8e5a1bf2-7180-41a4-ab86-12b417fe9ea8', 'Modal', 'Laba/Rugi Periode Berjalan', '399', 1, '2023-11-11 16:51:18', '2023-11-11 16:51:18', 'SYSTEM', '', 0, 0, 0, 0),
(9, '453764da-957f-4099-a03d-268367987dc2', 'Pendapatan', 'Penjualan Barang', '401', 1, '2023-11-11 16:52:06', '2023-12-02 09:31:57', 'SYSTEM', '', 0, 0, 0, 0),
(10, '0c0a1c04-ad98-4818-9a63-9be554b2ae55', 'Beban Operasional', 'Beban Gaji', '505', 1, '2023-11-11 16:55:14', '2023-11-11 16:55:14', 'SYSTEM', '', 0, 0, 0, 0),
(11, 'eadfec72-7d66-4597-998d-8acf959d34b7', 'Beban Operasional', 'Beban Pajak', '525', 1, '2023-11-11 17:02:46', '2023-11-11 17:02:46', 'SYSTEM', '', 0, 0, 0, 0),
(12, 'b7687ceb-6046-4062-979d-bfed5550bd87', 'Pendapatan Lain - Lain', 'Pendapatan Lain - Lain', '699', 1, '2023-11-11 17:05:40', '2024-09-21 04:24:33', 'SYSTEM', '', 0, 0, 0, 0),
(13, 'e86d5fd7-958c-4cb3-839d-ca70f6abe123', 'Harga Pokok Penjualan', 'Pembelian', '702', 1, '2023-11-11 17:05:59', '2023-11-11 17:05:59', 'SYSTEM', '', 0, 0, 0, 0),
(14, '4710e8be-e0c2-4318-8b42-ea8c58aa2312', 'Harga Pokok Penjualan', 'Persediaan Barang Dagang Awal', '701', 1, '2023-11-11 17:07:27', '2023-11-11 17:07:27', 'SYSTEM', '', 0, 0, 0, 0),
(15, '018cdcf2-f5ce-4d1a-b320-17b89a0c5556', 'Harga Pokok Penjualan', 'Persediaan Barang Dagang Akhir', '799', 1, '2023-11-11 17:08:02', '2023-11-11 17:08:02', 'SYSTEM', '', 0, 0, 0, 0),
(16, '826a9418-4b0e-4ca4-8a83-6c392e7a4cf1', 'Pendapatan', 'Penjualan Jasa', '405', 1, '2023-12-02 09:34:10', '2023-12-02 09:34:10', 'SYSTEM', '', 0, 0, 0, 0),
(17, '96dc1c2e-1cd3-42b8-b580-3932ebe1e82d', 'Beban Operasional', 'Beban Lembur Pegawai', '531', 1, '2023-12-16 13:22:34', '2024-09-20 20:14:18', 'SYSTEM', '', 0, 0, 0, 0),
(18, 'dc632a24-dba2-4c65-9b42-968de322fe1c', 'Beban Operasional', 'Beban Tunjangan Uang / Barang', '532', 1, '2023-12-16 13:55:09', '2024-09-21 01:13:38', 'SYSTEM', '', 0, 0, 0, 0),
(19, 'f3eafc29-6a1c-4e57-b789-532b490dac33', 'Pendapatan Lain - Lain', 'Pendapatan Atas Kerugian', '604', 1, '2024-01-06 16:52:55', '2024-09-21 04:28:22', 'SYSTEM', '', 0, 0, 0, 0),
(20, 'a09a5e0c-9544-4a83-b214-c47cf5c07bdd', 'Beban Operasional', 'Beban Tunjangan Hadiah', '533', 1, '2024-01-07 16:30:29', '2024-09-21 00:50:52', 'SYSTEM', '', 0, 0, 0, 0),
(21, '4677d2cc-11cb-11ef-a0da-145afc5d4423', 'Modal', 'Dividen', '303', 1, '2023-11-11 16:51:50', '2023-11-11 16:51:50', 'SYSTEM', '', 0, 0, 0, 0),
(22, '6453a29e-d506-46e5-8f05-1ff8817b8813', 'Utang', 'Hutang Dagang', '201', 1, '2024-10-14 12:21:39', '2024-10-15 19:16:36', 'SYSTEM', '', 0, 0, 1, 0),
(23, '063b765d-1ccf-4586-9006-64907046364d', 'Utang', 'Hutang Gaji', '202', 1, '2024-10-14 12:21:56', '2024-10-15 19:16:45', 'SYSTEM', '', 0, 0, 1, 0),
(24, 'cb4da807-75ad-4202-b15c-ef6417211481', 'Utang', 'Hutang Bank', '203', 1, '2024-10-14 12:22:15', '2024-10-15 19:17:13', 'SYSTEM', '', 0, 0, 1, 0),
(25, 'faf85905-7eb1-4092-ad6f-b151a9eba828', 'Utang', 'Hutang Pajak PPh Pasal 21/26', '204', 1, '2024-10-14 12:22:41', '2024-10-14 12:22:41', 'SYSTEM', '', 0, 0, 1, 0),
(26, '46381f2e-f256-4a5b-be56-76688e7b915d', 'Utang', 'Hutang Lain-Lain', '206', 1, '2024-10-14 12:23:11', '2024-10-15 19:17:45', 'SYSTEM', '', 0, 0, 1, 0),
(27, '261984b1-4a45-4332-aaae-9687fe550262', 'Utang', 'Hutang BPJS', '215', 1, '2024-10-14 12:23:55', '2024-10-15 19:17:05', 'SYSTEM', '', 0, 0, 1, 0),
(28, 'fb8aadc0-f121-46fe-a83b-f56a1723b337', 'Pendapatan Lain - Lain', 'Pendapatan BPJS', '610', 1, '2024-10-14 12:34:46', '2024-10-15 19:16:24', 'SYSTEM', '', 0, 0, 1, 0),
(29, '5555ff3a-9de0-42b5-bdc8-f39c43947496', 'Beban Operasional', 'Beban BPJS Kesehatan', '514', 1, '2023-11-11 16:58:48', '2024-09-21 02:06:46', 'SYSTEM', '', 0, 0, 0, 0),
(30, '24af525c-4519-4f26-a339-df8ef261b42d', 'Beban Operasional', 'Beban BPJS Ketenagakerjaan', '530', 1, '2023-12-16 13:22:15', '2024-09-21 02:15:33', 'SYSTEM', '', 0, 0, 0, 0),
(32, '04eae5c2-ccf6-46b8-a0f3-2d3d1a723c79', 'Beban Operasional', 'Beban Bonus', '520', 1, '2023-11-11 17:01:03', '2023-11-11 17:01:03', 'SYSTEM', '', 0, 0, 0, 0),
(33, '885dd610-31f5-4be2-8a9b-87d7494c4942', 'Beban Operasional', 'Beban THR', '521', 1, '2023-11-11 17:01:33', '2023-11-11 17:01:33', 'SYSTEM', '', 0, 0, 0, 0),
(34, '5d93a16a-843e-42ba-9d3c-916a5998461d', 'Beban Operasional', 'Beban Insentif', '522', 1, '2023-11-11 17:01:55', '2023-11-11 17:01:55', 'SYSTEM', '', 0, 0, 0, 0),
(35, 'c457def6-7f3c-478d-9190-15ab0b70e630', 'Utang', 'PPN Keluaran', '205', 1, '2023-11-11 16:48:47', '2023-11-11 16:48:47', 'SYSTEM', '', 0, 0, 0, 0),
(36, 'f3827c1b-b8d8-4c1f-94e9-8249e9292a03', 'Pendapatan', 'Retur Penjualan Barang', '403', 1, '2023-11-11 16:52:23', '2023-12-02 09:32:13', 'SYSTEM', '', 0, 0, 0, 0),
(37, '5b04e881-b908-4400-a7f4-b78c34cc7a8c', 'Pendapatan', 'Diskon Penjualan Barang', '404', 1, '2023-11-11 16:53:13', '2023-12-02 09:32:32', 'SYSTEM', '', 0, 0, 0, 0),
(38, 'ddb0e69f-9704-4555-b427-5748365034f7', 'Pendapatan Lain - Lain', 'Pendapatan Denda Penjualan Barang', '605', 1, '2024-01-12 10:33:54', '2024-01-19 13:00:50', 'SYSTEM', '', 0, 0, 0, 0),
(39, 'eb5b6dcd-1146-4550-a9f0-1fe8439b085f', 'Harta', 'Piutang Denda Barang', '133', 1, '2024-01-19 12:59:11', '2024-01-19 12:59:11', 'SYSTEM', '', 0, 0, 0, 0),
(40, '675780c8-8ab4-401e-afe1-efc5684bb5f3', 'Pendapatan Lain - Lain', 'Pendapatan Penyesuaian Stok Opname Barang Lebih', '611', 1, '2024-11-15 15:11:28', '2024-11-15 19:14:01', 'SYSTEM', '', 0, 0, 0, 0),
(41, '06bb2055-466d-4c4b-a0f8-7805648ffd01', 'Beban Lainnya', 'Kerugian Barang Hasil Stok Opname Berkurang', '804', 1, '2024-11-15 15:08:15', '2024-11-15 19:13:42', 'SYSTEM', '', 0, 0, 0, 0),
(43, '93919470-8a98-4f67-a373-fe6726b7aae2', 'Harta', 'PPN Masukan', '117', 1, '2023-11-11 16:44:35', '2023-11-11 16:44:35', 'SYSTEM', '', 0, 0, 0, 0),
(44, '71786d7c-f0e3-4e4e-b8da-ebd79cac3c02', 'Harga Pokok Penjualan', 'Diskon Pembelian', '704', 1, '2023-11-11 17:06:34', '2023-11-11 17:06:34', 'SYSTEM', '', 0, 0, 0, 0),
(45, '915ac6e8-c528-4f10-9215-74fda0b1c99e', 'Beban Operasional', 'Beban Penyusutan', '509', 1, '2023-11-11 16:56:41', '2024-11-17 14:25:16', 'SYSTEM', '', 0, 0, 0, 0),
(46, 'a88b16d3-4071-4503-9c5b-17cdac4a411f', 'Harta', 'Akumulasi Penyusutan', '135', 1, '2024-11-17 14:51:26', '2024-11-17 14:51:26', 'SYSTEM', '', 0, 0, 0, 0),
(47, 'c85ac20d-1b1e-45c5-80e1-8db80c5dd283', 'Harta', 'Perlengkapan Kantor', '113', 1, '2023-11-11 16:43:06', '2023-11-11 16:43:06', 'SYSTEM', '', 0, 0, 0, 0),
(48, '6e376191-0454-4172-a78b-2bc5f9c8fd6e', 'Beban Operasional', 'Beban Perlengkapan', '501', 1, '2023-11-11 16:53:48', '2023-11-11 16:53:48', 'SYSTEM', '', 0, 0, 0, 0),
(49, 'ad6d4852-27dd-4b6e-8d26-eb812084d248', 'Pendapatan', 'Retur Penjualan Jasa', '406', 1, '2023-12-02 09:34:28', '2023-12-02 09:34:28', 'SYSTEM', '', 0, 0, 0, 0),
(50, 'dea2ce84-fb39-4c6d-bac2-99e37b4fd492', 'Harga Pokok Penjualan', 'Retur Pembelian', '703', 1, '2023-11-11 17:06:15', '2023-11-11 17:06:15', 'SYSTEM', '', 0, 0, 0, 0),
(51, '7eee8bbd-b5c3-4351-9ff8-cdbe814806b9', 'Pendapatan', 'Diskon Penjualan Jasa', '407', 1, '2023-12-02 09:34:46', '2023-12-02 09:34:46', 'SYSTEM', '', 0, 0, 0, 0),
(52, 'c5319b9f-41b9-4c92-bbc4-94bf07583263', 'Harta', 'Persediaan Barang Dagang', '108', 1, '2023-11-11 16:41:00', '2023-11-11 16:41:00', 'SYSTEM', '', 0, 0, 0, 0),
(53, '2e186c0a-bd7c-4266-89ab-b4fdd2957e6e', 'Beban Lainnya', 'Beban Pengembalian Denda Penjualan Jasa', '806', 1, '2024-11-23 17:00:05', '2024-11-23 17:00:05', 'SYSTEM', '', 0, 0, 0, 0),
(54, '7b7a9b89-a712-4085-bdac-617ce712561c', 'Beban Lainnya', 'Beban Pengembalian Denda Penjualan Barang', '805', 1, '2024-11-21 19:45:23', '2024-11-21 19:45:23', 'SYSTEM', '', 0, 0, 0, 0),
(55, 'c48a5704-ffa6-471b-a468-12a74aedd100', 'Pendapatan Lain - Lain', 'Pendapatan Denda Pembelian Barang', '613', 1, '2024-11-21 18:57:52', '2024-11-21 18:57:52', 'SYSTEM', '', 0, 0, 0, 0),
(56, 'c28c00b1-b274-4c33-9f47-2e0e7a01b21e', 'Beban Operasional', 'Denda Pembelian Barang', '541', 1, '2024-11-16 00:06:00', '2024-11-16 00:06:00', 'SYSTEM', '', 0, 0, 0, 0),
(57, '500f7537-125d-466a-8118-152a98bf3121', 'Harta', 'Bank BCA', '103', 1, '2024-11-28 17:02:22', '2024-11-28 17:02:37', 'SYSTEM', '', 2, 0, 1, 1),
(58, '91bf765b-6876-4c6d-9ccc-d25bfe546c57', 'Harga Pokok Penjualan', 'Beban Pokok Penjualan', '710', 1, '2024-11-28 18:57:05', '2024-11-28 18:57:05', 'SYSTEM', '', 0, 0, 0, 0),
(59, '69218ad5-43d0-4faa-8240-429596cef93a', 'Harta', 'Bank Mandiri (Giro)', '104', 1, '2024-12-02 15:12:02', '2024-12-02 15:12:02', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 2, 1, 1, 1),
(60, 'a709f4cc-5399-4d4b-810d-486d2190ea12', 'Harta', 'Bank Mandiri (Escrow)', '105', 1, '2024-12-02 15:12:40', '2024-12-02 15:12:40', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 2, 1, 0, 1),
(61, 'debb84d2-d1de-4527-a7de-70024ec4c34b', 'Pendapatan', 'Bahan Penolong', '409', 1, '2024-12-02 15:34:11', '2024-12-02 15:34:11', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 0, 1, 0, 0),
(62, '0d591543-5738-4b25-a3b5-990a4bddcaa0', 'Beban Operasional', 'Beban Rupa-Rupa', '534', 1, '2024-12-02 15:46:51', '2024-12-02 15:46:51', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 0, 1, 0, 0),
(63, 'b7814307-ad60-4dbc-b314-b202c2bb512c', 'Beban Operasional', 'Beban Administrasi Bank', '535', 1, '2024-12-02 15:51:12', '2024-12-02 15:51:12', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 0, 1, 0, 0),
(64, '8fe1e2d2-c437-4d09-a12c-f1354d3809ee', 'Pendapatan Lain - Lain', 'Pendapatan Bunga Bank', '614', 1, '2024-12-02 16:28:31', '2024-12-03 08:39:57', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 0, 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `konversi_bahan_baku_tab`
--

CREATE TABLE `konversi_bahan_baku_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `kode_konversi_bahan_baku` varchar(255) NOT NULL,
  `daftar_gudang` varchar(255) NOT NULL,
  `satuan_bahan_baku` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `konversi_barang_tab`
--

CREATE TABLE `konversi_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `kode_konversi_barang` varchar(255) NOT NULL,
  `daftar_gudang` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `satuan_barang` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `lain_lain_tab`
--

CREATE TABLE `lain_lain_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pegawai` varchar(255) NOT NULL,
  `periode` int(11) NOT NULL,
  `nilai` int(11) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `lembur_tab`
--

CREATE TABLE `lembur_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pegawai` varchar(255) NOT NULL,
  `periode` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `deskripsi_kerja` varchar(255) NOT NULL,
  `keterangan_kerja` varchar(255) NOT NULL,
  `nilai_lembur_per_menit` varchar(255) NOT NULL,
  `waktu_mulai` varchar(255) NOT NULL,
  `waktu_selesai` varchar(255) NOT NULL,
  `total_jam` varchar(255) NOT NULL,
  `total_menit` varchar(255) NOT NULL,
  `total_bayaran` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `metode_penyusutan_tab`
--

CREATE TABLE `metode_penyusutan_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `metode_penyusutan_tab`
--

INSERT INTO `metode_penyusutan_tab` (`id`, `uuid`, `name`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, 'ea1fdb87-1fc3-46fa-a363-6a5e71cc924c', 'Garis Lurus', 'SYSTEM', '', 1, '2023-11-02 17:04:34', '2024-02-21 11:29:44'),
(2, 'e16b39d9-543b-4289-92ed-dfe822aa7be6', 'Saldo Menurun', 'SYSTEM', '', 1, '2023-11-04 09:45:52', '2023-11-04 09:45:52');

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
  `updatedAt` datetime NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `neraca_tab`
--

INSERT INTO `neraca_tab` (`id`, `uuid`, `json`, `bulan`, `tahun`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `enabled`) VALUES
(1, '3425122c-bf87-4114-b7fc-d9d2ab49d19b', '{\"harta\":{\"data\":[],\"count\":0},\"utang\":{\"data\":[],\"count\":0},\"modal\":{\"data\":[{\"kode_akun_perkiraan_code\":\"399\",\"kode_akun_perkiraan_name\":\"Laba/Rugi Periode Berjalan\",\"kode_akun_perkiraan_type\":\"Modal\",\"debet\":0,\"kredit\":0,\"uraian\":\"JANUARI 2024\",\"value\":0}],\"count\":0},\"harga_pokok_penjualan\":{\"data\":[],\"count\":0},\"neraca\":{\"aktiva\":0,\"pasiva\":0,\"difference\":0}}', '01', '2024', '2024-12-08 17:19:34', '2024-12-08 17:20:13', 'b5e4bad6-d212-4b93-9085-3ec48302dcab', 'b5e4bad6-d212-4b93-9085-3ec48302dcab', 0);

-- --------------------------------------------------------

--
-- Table structure for table `pegawai_tab`
--

CREATE TABLE `pegawai_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `nip` varchar(255) NOT NULL,
  `nik` varchar(255) NOT NULL,
  `npwp` varchar(255) NOT NULL,
  `tempat_lahir` varchar(255) NOT NULL,
  `tanggal_lahir` varchar(255) NOT NULL,
  `jenis_kelamin` tinyint(1) NOT NULL,
  `agama` varchar(255) NOT NULL,
  `no_hp` varchar(255) NOT NULL,
  `alamat` varchar(255) NOT NULL,
  `status_tanggungan` varchar(255) NOT NULL,
  `divisi` varchar(255) NOT NULL,
  `status_kerja` varchar(255) NOT NULL,
  `jabatan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pegawai_tab`
--

INSERT INTO `pegawai_tab` (`id`, `uuid`, `name`, `nip`, `nik`, `npwp`, `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`, `agama`, `no_hp`, `alamat`, `status_tanggungan`, `divisi`, `status_kerja`, `jabatan`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, '5f272154-387e-4a1c-ab3b-706e886a97d1', 'TARI', '123455678', '32456784343565', '89019213882742', 'SIKKA', '1994-02-05', 0, 'Kristen Katholik', '081234251617', 'KUPANG', '9cfa7b97-72da-4e10-b02e-d377da154f3f', 'a32b519d-a74f-4470-bd03-56346a2101fc', 'Tetap', 'e30c3c54-cfae-4005-8aea-a3711cb94071', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 21:26:45', '2024-12-04 21:26:45');

-- --------------------------------------------------------

--
-- Table structure for table `pelunasan_pembelian_barang_tab`
--

CREATE TABLE `pelunasan_pembelian_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `faktur_pembelian_barang` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `nomor_pelunasan_pembelian_barang` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pelunasan_penjualan_barang_tab`
--

CREATE TABLE `pelunasan_penjualan_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `faktur_penjualan_barang` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `nomor_pelunasan_penjualan_barang` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pelunasan_penjualan_jasa_tab`
--

CREATE TABLE `pelunasan_penjualan_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `faktur_penjualan_jasa` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `nomor_pelunasan_penjualan_jasa` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pengembalian_denda_pembelian_barang_tab`
--

CREATE TABLE `pengembalian_denda_pembelian_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `faktur_pembelian_barang` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `nomor_pengembalian_denda_pembelian_barang` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pengembalian_denda_penjualan_barang_tab`
--

CREATE TABLE `pengembalian_denda_penjualan_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `faktur_penjualan_barang` varchar(255) NOT NULL,
  `nomor_pengembalian_denda_penjualan_barang` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pengembalian_denda_penjualan_jasa_tab`
--

CREATE TABLE `pengembalian_denda_penjualan_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `faktur_penjualan_jasa` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `nomor_pengembalian_denda_penjualan_jasa` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `penggunaan_perlengkapan_tab`
--

CREATE TABLE `penggunaan_perlengkapan_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `daftar_perlengkapan` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `jumlah` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `penggunaan_perlengkapan_tab`
--

INSERT INTO `penggunaan_perlengkapan_tab` (`id`, `uuid`, `tanggal`, `daftar_perlengkapan`, `keterangan`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`, `bukti_transaksi`, `jumlah`) VALUES
(1, '8557644b-a4b8-48c4-b4b2-6d46e7e427e4', '2024-12-06T16:16:49', '6459675e-b6e6-493e-82bb-ce651a8aebb7', 'UNTUK DIPAKAI DIVISI SALES', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-05 17:17:21', '2024-12-05 17:17:21', '1102983', 3);

-- --------------------------------------------------------

--
-- Table structure for table `pengiriman_barang_tab`
--

CREATE TABLE `pengiriman_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `nomor_surat_jalan` varchar(255) NOT NULL,
  `pegawai_penanggung_jawab` varchar(255) NOT NULL,
  `pegawai_pelaksana` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `faktur_penjualan_barang` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pengiriman_barang_tab`
--

INSERT INTO `pengiriman_barang_tab` (`id`, `uuid`, `tanggal`, `nomor_surat_jalan`, `pegawai_penanggung_jawab`, `pegawai_pelaksana`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`, `faktur_penjualan_barang`) VALUES
(1, 'a86f441b-96e7-401a-bb70-d101aa212838', '2024-12-05T07:36:58.000', 'DO-1224-0001', '5f272154-387e-4a1c-ab3b-706e886a97d1', '5f272154-387e-4a1c-ab3b-706e886a97d1', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 0, '2024-12-05 08:37:19', '2024-12-05 17:09:26', '05c14556-6db9-4144-98cf-312d79ed5de0'),
(2, 'd03e5724-0ea0-4250-a34b-e830d699ee36', '2024-12-05T08:25:55.000', 'DO-002', '5f272154-387e-4a1c-ab3b-706e886a97d1', '5f272154-387e-4a1c-ab3b-706e886a97d1', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 0, '2024-12-05 09:26:29', '2024-12-05 17:09:21', '05c14556-6db9-4144-98cf-312d79ed5de0'),
(3, '812f82a7-8d9d-4a50-8d6a-5b0af3692990', '2024-12-06T16:09:26', 'DO001', '5f272154-387e-4a1c-ab3b-706e886a97d1', '5f272154-387e-4a1c-ab3b-706e886a97d1', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-05 17:09:46', '2024-12-05 17:09:46', '05c14556-6db9-4144-98cf-312d79ed5de0'),
(4, '5ad3a977-6c8c-473a-a025-a61cba2f2b54', '2024-12-07T16:10', 'DO002', '5f272154-387e-4a1c-ab3b-706e886a97d1', '5f272154-387e-4a1c-ab3b-706e886a97d1', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-05 17:10:23', '2024-12-05 17:10:23', '05c14556-6db9-4144-98cf-312d79ed5de0'),
(5, '918bd207-2e44-4965-addb-16f65f872977', '2024-12-08T16:10:47', 'DO003', '5f272154-387e-4a1c-ab3b-706e886a97d1', '5f272154-387e-4a1c-ab3b-706e886a97d1', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-05 17:11:03', '2024-12-05 17:11:03', '05c14556-6db9-4144-98cf-312d79ed5de0'),
(6, 'cca521a7-83ec-40e8-9567-ed04da2de3fa', '2024-12-09T16:11:15', 'DO004', '5f272154-387e-4a1c-ab3b-706e886a97d1', '5f272154-387e-4a1c-ab3b-706e886a97d1', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-05 17:11:31', '2024-12-05 17:11:31', '05c14556-6db9-4144-98cf-312d79ed5de0');

-- --------------------------------------------------------

--
-- Table structure for table `penyesuaian_persediaan_tab`
--

CREATE TABLE `penyesuaian_persediaan_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `perintah_stok_opname` varchar(255) NOT NULL,
  `hasil_stok_opname` varchar(255) NOT NULL,
  `kuantitas` varchar(255) NOT NULL,
  `stok_tersedia_sistem` varchar(255) NOT NULL,
  `tipe_penyesuaian` varchar(255) NOT NULL,
  `jumlah` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `perintah_stok_opname_jurnal_tab`
--

CREATE TABLE `perintah_stok_opname_jurnal_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `bulan` int(11) NOT NULL,
  `detail_data` text NOT NULL,
  `sumber` varchar(255) NOT NULL,
  `tahun` int(11) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `uraian` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `perintah_stok_opname` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `transaksi` int(11) NOT NULL,
  `debet` varchar(255) NOT NULL,
  `kredit` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `perintah_stok_opname_tab`
--

CREATE TABLE `perintah_stok_opname_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `nomor_surat_perintah` varchar(255) NOT NULL,
  `pegawai_penanggung_jawab` varchar(255) NOT NULL,
  `pegawai_pelaksana` varchar(255) NOT NULL,
  `kategori_barang` varchar(255) NOT NULL,
  `gudang_asal` varchar(255) NOT NULL,
  `validasi` tinyint(1) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `bulan_transaksi` int(11) NOT NULL,
  `tahun` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `persentase_penyusutan_tab`
--

CREATE TABLE `persentase_penyusutan_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `metode_penyusutan` varchar(255) NOT NULL,
  `kelompok_aset` varchar(255) NOT NULL,
  `persentase` float NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pesanan_pembelian_barang_tab`
--

CREATE TABLE `pesanan_pembelian_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `nomor_pesanan_pembelian_barang` varchar(255) NOT NULL,
  `tanggal_pesanan_pembelian_barang` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `supplier` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pesanan_pembelian_barang_tab`
--

INSERT INTO `pesanan_pembelian_barang_tab` (`id`, `uuid`, `nomor_pesanan_pembelian_barang`, `tanggal_pesanan_pembelian_barang`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`, `supplier`) VALUES
(1, '658e1a54-9394-4b98-b9cc-5e6b089a0153', 'PO-1224-0050', '2024-12-04T20:27:22.000', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'b5e4bad6-d212-4b93-9085-3ec48302dcab', 1, '2024-12-04 21:27:38', '2024-12-04 22:12:55', '8ef49b3e-7160-4e85-bd4c-cfc368f3d83c');

-- --------------------------------------------------------

--
-- Table structure for table `pesanan_penjualan_barang_tab`
--

CREATE TABLE `pesanan_penjualan_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `nomor_pesanan_penjualan_barang` varchar(255) NOT NULL,
  `tanggal_pesanan_penjualan_barang` varchar(255) NOT NULL,
  `customer` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pesanan_penjualan_barang_tab`
--

INSERT INTO `pesanan_penjualan_barang_tab` (`id`, `uuid`, `nomor_pesanan_penjualan_barang`, `tanggal_pesanan_penjualan_barang`, `customer`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, 'b8c10171-2f9b-45b1-ae3e-c2239e1557eb', 'SO-1224-0050', '2024-12-04T20:10:05.000', 'cd6cf397-1ff4-439c-a8ae-7f4e23f2b464', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 0, '2024-12-04 21:10:29', '2024-12-04 21:19:54'),
(2, '16050674-b42c-456d-9b06-4ef40a898d71', 'SI-1224-0020', '2024-12-05T21:15:54', 'cd6cf397-1ff4-439c-a8ae-7f4e23f2b464', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 1, '2024-12-04 22:16:12', '2024-12-05 08:35:11');

-- --------------------------------------------------------

--
-- Table structure for table `pesanan_penjualan_jasa_tab`
--

CREATE TABLE `pesanan_penjualan_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `nomor_pesanan_penjualan_jasa` varchar(255) NOT NULL,
  `tanggal_pesanan_penjualan_jasa` varchar(255) NOT NULL,
  `customer` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `piutang_karyawan_tab`
--

CREATE TABLE `piutang_karyawan_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pegawai` varchar(255) NOT NULL,
  `periode` int(11) NOT NULL,
  `nilai` int(11) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `type` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pph2126_tab`
--

CREATE TABLE `pph2126_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pegawai` varchar(255) NOT NULL,
  `periode` int(11) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `nilai` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `retur_pembelian_barang_tab`
--

CREATE TABLE `retur_pembelian_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `faktur_pembelian_barang` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `nomor_retur_pembelian_barang` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `retur_penjualan_barang_tab`
--

CREATE TABLE `retur_penjualan_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `faktur_penjualan_barang` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `nomor_retur_penjualan_barang` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `retur_penjualan_jasa_tab`
--

CREATE TABLE `retur_penjualan_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `faktur_penjualan_jasa` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `nomor_retur_penjualan_jasa` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_konversi_bahan_baku_tab`
--

CREATE TABLE `rincian_konversi_bahan_baku_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `konversi_bahan_baku` varchar(255) NOT NULL,
  `stok_awal_bahan_baku` varchar(255) NOT NULL,
  `jumlah_yang_dikonversi` int(11) NOT NULL,
  `stok_awal_bahan_baku_tujuan` varchar(255) NOT NULL,
  `jumlah_hasil_konversi_kode_bahan_baku_tujuan` int(11) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_konversi_barang_tab`
--

CREATE TABLE `rincian_konversi_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `konversi_barang` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `stok_awal_barang` varchar(255) NOT NULL,
  `jumlah_yang_dikonversi` int(11) NOT NULL,
  `stok_awal_barang_tujuan` varchar(255) NOT NULL,
  `jumlah_hasil_konversi_kode_barang_tujuan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_pelunasan_pembelian_barang_tab`
--

CREATE TABLE `rincian_pelunasan_pembelian_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pelunasan_pembelian_barang` varchar(255) NOT NULL,
  `rincian_pesanan_pembelian_barang` varchar(255) NOT NULL,
  `sudah_dibayar` double NOT NULL,
  `piutang` double NOT NULL,
  `nilai_pelunasan` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `nilai_pelunasan_denda` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_pelunasan_pembelian_denda_barang_tab`
--

CREATE TABLE `rincian_pelunasan_pembelian_denda_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pelunasan_pembelian_barang` varchar(255) NOT NULL,
  `rincian_pesanan_pembelian_barang` varchar(255) NOT NULL,
  `hari_terlewat` int(11) NOT NULL,
  `total_denda` double NOT NULL,
  `denda_sudah_dibayar` double NOT NULL,
  `piutang_denda` double NOT NULL,
  `nilai_pelunasan` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_pelunasan_penjualan_barang_tab`
--

CREATE TABLE `rincian_pelunasan_penjualan_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `nilai_pelunasan` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `rincian_pesanan_penjualan_barang` varchar(255) NOT NULL,
  `pelunasan_penjualan_barang` varchar(255) NOT NULL,
  `sudah_dibayar` double NOT NULL,
  `piutang` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_pelunasan_penjualan_denda_barang_tab`
--

CREATE TABLE `rincian_pelunasan_penjualan_denda_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `nilai_pelunasan` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `total_denda` double NOT NULL,
  `pelunasan_penjualan_barang` varchar(255) NOT NULL,
  `rincian_pesanan_penjualan_barang` varchar(255) NOT NULL,
  `hari_terlewat` int(11) NOT NULL,
  `denda_sudah_dibayar` double NOT NULL,
  `piutang_denda` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_pelunasan_penjualan_denda_jasa_tab`
--

CREATE TABLE `rincian_pelunasan_penjualan_denda_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pelunasan_penjualan_jasa` varchar(255) NOT NULL,
  `rincian_pesanan_penjualan_jasa` varchar(255) NOT NULL,
  `hari_terlewat` int(11) NOT NULL,
  `total_denda` double NOT NULL,
  `denda_sudah_dibayar` double NOT NULL,
  `piutang_denda` double NOT NULL,
  `nilai_pelunasan` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_pelunasan_penjualan_jasa_tab`
--

CREATE TABLE `rincian_pelunasan_penjualan_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pelunasan_penjualan_jasa` varchar(255) NOT NULL,
  `rincian_pesanan_penjualan_jasa` varchar(255) NOT NULL,
  `sudah_dibayar` double NOT NULL,
  `piutang` double NOT NULL,
  `nilai_pelunasan` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_pengembalian_denda_pembelian_barang_tab`
--

CREATE TABLE `rincian_pengembalian_denda_pembelian_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pengembalian_denda_pembelian_barang` varchar(255) NOT NULL,
  `rincian_pesanan_pembelian_barang` varchar(255) NOT NULL,
  `denda_yang_dikembalikan` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_pengembalian_denda_penjualan_barang_tab`
--

CREATE TABLE `rincian_pengembalian_denda_penjualan_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pengembalian_denda_penjualan_barang` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `rincian_pesanan_penjualan_barang` varchar(255) NOT NULL,
  `denda_yang_dikembalikan` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_pengembalian_denda_penjualan_jasa_tab`
--

CREATE TABLE `rincian_pengembalian_denda_penjualan_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pengembalian_denda_penjualan_jasa` varchar(255) NOT NULL,
  `rincian_pesanan_penjualan_jasa` varchar(255) NOT NULL,
  `denda_yang_dikembalikan` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_pengiriman_barang_tab`
--

CREATE TABLE `rincian_pengiriman_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pengiriman_barang` varchar(255) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `pengiriman` int(11) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `rincian_pesanan_penjualan_barang` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `rincian_pengiriman_barang_tab`
--

INSERT INTO `rincian_pengiriman_barang_tab` (`id`, `uuid`, `pengiriman_barang`, `jumlah`, `pengiriman`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`, `rincian_pesanan_penjualan_barang`) VALUES
(1, '91d093ec-bfa9-4ac4-946b-914c3b8b59f8', 'a86f441b-96e7-401a-bb70-d101aa212838', 10, 5, 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-05 08:37:54', '2024-12-05 08:37:54', '233635f2-3bd9-4a1c-b710-c18187348d5d'),
(2, 'd05039fd-6f7b-4a1a-b044-34b0223851cb', 'd03e5724-0ea0-4250-a34b-e830d699ee36', 10, 0, 'b5e4bad6-d212-4b93-9085-3ec48302dcab', 'b5e4bad6-d212-4b93-9085-3ec48302dcab', 1, '2024-12-05 13:32:43', '2024-12-05 13:43:57', '233635f2-3bd9-4a1c-b710-c18187348d5d'),
(3, '4889add2-f328-4fb6-b1fc-a082b80f19ab', '812f82a7-8d9d-4a50-8d6a-5b0af3692990', 10, 3, 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-05 17:09:59', '2024-12-05 17:09:59', '233635f2-3bd9-4a1c-b710-c18187348d5d'),
(4, '237da282-fda3-47cf-868e-7f1c4a944df6', '5ad3a977-6c8c-473a-a025-a61cba2f2b54', 10, 5, 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-05 17:10:41', '2024-12-05 17:10:41', '233635f2-3bd9-4a1c-b710-c18187348d5d'),
(5, '84896cab-30bf-4296-a121-1e468e4b5654', '918bd207-2e44-4965-addb-16f65f872977', 10, 2, 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-05 17:11:15', '2024-12-05 17:11:15', '233635f2-3bd9-4a1c-b710-c18187348d5d');

-- --------------------------------------------------------

--
-- Table structure for table `rincian_pesanan_pembelian_barang_tab`
--

CREATE TABLE `rincian_pesanan_pembelian_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pesanan_pembelian_barang` varchar(255) NOT NULL,
  `kategori_harga_barang` varchar(255) NOT NULL,
  `stok_awal_barang` varchar(255) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `harga` double NOT NULL,
  `ppn` double NOT NULL,
  `total_harga` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `harga_setelah_diskon` double NOT NULL,
  `ppn_setelah_diskon` double NOT NULL,
  `diskon_angka` double NOT NULL,
  `diskon_persentase` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `rincian_pesanan_pembelian_barang_tab`
--

INSERT INTO `rincian_pesanan_pembelian_barang_tab` (`id`, `uuid`, `pesanan_pembelian_barang`, `kategori_harga_barang`, `stok_awal_barang`, `jumlah`, `harga`, `ppn`, `total_harga`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`, `harga_setelah_diskon`, `ppn_setelah_diskon`, `diskon_angka`, `diskon_persentase`) VALUES
(1, '8a2a6760-ebe0-4ccc-8c73-c920849b4a53', '658e1a54-9394-4b98-b9cc-5e6b089a0153', '33bd566d-789e-4bd1-aeee-9477ef3d6991', '3a441578-3f11-4dd5-93a6-e5b51d5feaef', 100, 4000, 440, 444000, 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 22:07:32', '2024-12-04 22:07:32', 4000, 440, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `rincian_pesanan_penjualan_barang_tab`
--

CREATE TABLE `rincian_pesanan_penjualan_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pesanan_penjualan_barang` varchar(255) NOT NULL,
  `kategori_harga_barang` varchar(255) NOT NULL,
  `stok_awal_barang` varchar(255) NOT NULL,
  `kode_harga_customer` int(11) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `harga` double NOT NULL,
  `ppn` double NOT NULL,
  `diskon_angka` double NOT NULL,
  `diskon_persentase` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `total_harga` double NOT NULL,
  `harga_setelah_diskon` double NOT NULL,
  `ppn_setelah_diskon` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `rincian_pesanan_penjualan_barang_tab`
--

INSERT INTO `rincian_pesanan_penjualan_barang_tab` (`id`, `uuid`, `pesanan_penjualan_barang`, `kategori_harga_barang`, `stok_awal_barang`, `kode_harga_customer`, `jumlah`, `harga`, `ppn`, `diskon_angka`, `diskon_persentase`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`, `total_harga`, `harga_setelah_diskon`, `ppn_setelah_diskon`) VALUES
(1, '233635f2-3bd9-4a1c-b710-c18187348d5d', '16050674-b42c-456d-9b06-4ef40a898d71', '33bd566d-789e-4bd1-aeee-9477ef3d6991', '3a441578-3f11-4dd5-93a6-e5b51d5feaef', 1, 10, 5000, 550, 0, 0, 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 22:16:46', '2024-12-04 22:16:46', 55500, 5000, 550);

-- --------------------------------------------------------

--
-- Table structure for table `rincian_pesanan_penjualan_jasa_tab`
--

CREATE TABLE `rincian_pesanan_penjualan_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pesanan_penjualan_jasa` varchar(255) NOT NULL,
  `kategori_harga_jasa` varchar(255) NOT NULL,
  `stok_awal_jasa` varchar(255) NOT NULL,
  `kode_harga_customer` int(11) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `harga` double NOT NULL,
  `harga_setelah_diskon` double NOT NULL,
  `ppn` double NOT NULL,
  `ppn_setelah_diskon` double NOT NULL,
  `diskon_angka` double NOT NULL,
  `diskon_persentase` double NOT NULL,
  `total_harga` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_retur_pembelian_barang_tab`
--

CREATE TABLE `rincian_retur_pembelian_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `retur_pembelian_barang` varchar(255) NOT NULL,
  `rincian_pesanan_pembelian_barang` varchar(255) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `denda_sudah_dibayar` double NOT NULL,
  `sudah_dibayar` double NOT NULL,
  `retur_sebelum` int(11) NOT NULL,
  `retur` int(11) NOT NULL,
  `nilai_retur_sebelum` double NOT NULL,
  `nilai_retur` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_retur_penjualan_barang_tab`
--

CREATE TABLE `rincian_retur_penjualan_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `rincian_pesanan_penjualan_barang` varchar(255) NOT NULL,
  `retur` int(11) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `retur_penjualan_barang` varchar(255) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `denda_sudah_dibayar` double NOT NULL,
  `sudah_dibayar` double NOT NULL,
  `retur_sebelum` int(11) NOT NULL,
  `nilai_retur_sebelum` double NOT NULL,
  `nilai_retur` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_retur_penjualan_jasa_tab`
--

CREATE TABLE `rincian_retur_penjualan_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `retur_penjualan_jasa` varchar(255) NOT NULL,
  `rincian_pesanan_penjualan_jasa` varchar(255) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `denda_sudah_dibayar` double NOT NULL,
  `sudah_dibayar` double NOT NULL,
  `retur_sebelum` int(11) NOT NULL,
  `retur` int(11) NOT NULL,
  `nilai_retur_sebelum` double NOT NULL,
  `nilai_retur` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_transaksi_bank_tab`
--

CREATE TABLE `rincian_transaksi_bank_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `transaksi_bank` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `nilai` double NOT NULL,
  `uraian` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `waktu` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_transaksi_kas_tab`
--

CREATE TABLE `rincian_transaksi_kas_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `transaksi_kas` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `nilai` double NOT NULL,
  `uraian` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `waktu` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_transfer_bahan_baku_tab`
--

CREATE TABLE `rincian_transfer_bahan_baku_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `transfer_bahan_baku` varchar(255) NOT NULL,
  `stok_awal_bahan_baku` varchar(255) NOT NULL,
  `jumlah` varchar(255) NOT NULL,
  `stok_awal_bahan_baku_tujuan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rincian_transfer_barang_tab`
--

CREATE TABLE `rincian_transfer_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `transfer_barang` varchar(255) NOT NULL,
  `stok_awal_barang` varchar(255) NOT NULL,
  `jumlah` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `stok_awal_barang_tujuan` varchar(255) NOT NULL
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
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `satuan_bahan_baku_tab`
--

CREATE TABLE `satuan_bahan_baku_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `satuan_barang_tab`
--

CREATE TABLE `satuan_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `satuan_barang_tab`
--

INSERT INTO `satuan_barang_tab` (`id`, `uuid`, `name`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, 'fa6f05fb-f136-4d37-b427-0583f49a3ee0', 'PCS', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 21:11:31', '2024-12-04 21:11:31');

-- --------------------------------------------------------

--
-- Table structure for table `satuan_jasa_tab`
--

CREATE TABLE `satuan_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `status_tanggungan_tab`
--

CREATE TABLE `status_tanggungan_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `status_tanggungan_tab`
--

INSERT INTO `status_tanggungan_tab` (`id`, `uuid`, `name`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, '9cfa7b97-72da-4e10-b02e-d377da154f3f', 'TK/0', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 21:25:31', '2024-12-04 21:25:31');

-- --------------------------------------------------------

--
-- Table structure for table `stok_awal_bahan_baku_tab`
--

CREATE TABLE `stok_awal_bahan_baku_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `daftar_bahan_baku` varchar(255) NOT NULL,
  `daftar_gudang` varchar(255) NOT NULL,
  `kategori_harga_bahan_baku` varchar(255) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `stok_awal_barang_tab`
--

CREATE TABLE `stok_awal_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `daftar_barang` varchar(255) NOT NULL,
  `daftar_gudang` varchar(255) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `kategori_harga_barang` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `tanggal` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `stok_awal_barang_tab`
--

INSERT INTO `stok_awal_barang_tab` (`id`, `uuid`, `daftar_barang`, `daftar_gudang`, `jumlah`, `kategori_harga_barang`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`, `tanggal`) VALUES
(1, '3a441578-3f11-4dd5-93a6-e5b51d5feaef', 'b2afe79f-6609-4555-981a-ed83f769144c', '309fb061-c3be-45e9-84d5-2dd719c99180', 0, '33bd566d-789e-4bd1-aeee-9477ef3d6991', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 21:18:56', '2024-12-04 21:18:56', '2024-12-04T20:18:42.000');

-- --------------------------------------------------------

--
-- Table structure for table `stok_awal_jasa_tab`
--

CREATE TABLE `stok_awal_jasa_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `daftar_jasa` varchar(255) NOT NULL,
  `kategori_harga_jasa` varchar(255) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `cabang` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_tab`
--

CREATE TABLE `supplier_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `npwp` varchar(255) NOT NULL,
  `alamat_rumah` varchar(255) NOT NULL,
  `alamat_kantor` varchar(255) NOT NULL,
  `no_telp` varchar(255) NOT NULL,
  `no_hp` varchar(255) NOT NULL,
  `jenis_barang` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `supplier_tab`
--

INSERT INTO `supplier_tab` (`id`, `uuid`, `name`, `code`, `npwp`, `alamat_rumah`, `alamat_kantor`, `no_telp`, `no_hp`, `jenis_barang`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, '8ef49b3e-7160-4e85-bd4c-cfc368f3d83c', 'CV NAM', 'SUP001', '6574346576879090', 'KUPANG', 'KUPANG', '76545678', '08765321R4686546', '66e4e0e8-57a5-481b-8363-f197c299c40e', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 21:21:36', '2024-12-04 21:21:36');

-- --------------------------------------------------------

--
-- Table structure for table `syarat_pembayaran_tab`
--

CREATE TABLE `syarat_pembayaran_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `tipe_pembayaran` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `hari_kadaluarsa` varchar(255) NOT NULL,
  `denda` double NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `syarat_pembayaran_tab`
--

INSERT INTO `syarat_pembayaran_tab` (`id`, `uuid`, `tipe_pembayaran`, `name`, `hari_kadaluarsa`, `denda`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, '94c3a2ba-2f35-407a-a1dd-df11e140ac2d', '540f97b0-840f-439f-8566-808b7eca6a7a', '30 HARI (10%)', '30', 10, 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 22:09:14', '2024-12-04 22:09:14'),
(2, '8b3c7947-533e-4073-b9fa-d95ceffa0070', 'ba506b51-5427-44b6-8674-b51de38ed253', 'TIDAK ADA', '0', 0, 'b5e4bad6-d212-4b93-9085-3ec48302dcab', 'Empty', 1, '2024-12-04 22:29:55', '2024-12-04 22:29:55');

-- --------------------------------------------------------

--
-- Table structure for table `tipe_pembayaran_tab`
--

CREATE TABLE `tipe_pembayaran_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tipe_pembayaran_tab`
--

INSERT INTO `tipe_pembayaran_tab` (`id`, `uuid`, `name`, `createdBy`, `updatedBy`, `enabled`, `createdAt`, `updatedAt`) VALUES
(1, 'ba506b51-5427-44b6-8674-b51de38ed253', 'CASH', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 22:08:13', '2024-12-04 22:08:13'),
(2, '540f97b0-840f-439f-8566-808b7eca6a7a', 'KREDIT', 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'Empty', 1, '2024-12-04 22:08:21', '2024-12-04 22:08:21');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_bank_tab`
--

CREATE TABLE `transaksi_bank_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `nilai` int(11) NOT NULL,
  `uraian` varchar(255) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_kas_tab`
--

CREATE TABLE `transaksi_kas_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `nilai` int(11) NOT NULL,
  `uraian` varchar(255) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `transfer_bahan_baku_tab`
--

CREATE TABLE `transfer_bahan_baku_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `kode_transfer_bahan_baku` varchar(255) NOT NULL,
  `daftar_gudang_asal` varchar(255) NOT NULL,
  `daftar_gudang_akhir` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `transfer_barang_tab`
--

CREATE TABLE `transfer_barang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `kode_transfer_barang` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `daftar_gudang_asal` varchar(255) NOT NULL,
  `daftar_gudang_akhir` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tunjangan_uang_tab`
--

CREATE TABLE `tunjangan_uang_tab` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `pegawai` varchar(255) NOT NULL,
  `periode` int(11) NOT NULL,
  `gaji` varchar(255) NOT NULL,
  `kode_akun_perkiraan` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL,
  `bukti_transaksi` varchar(255) NOT NULL,
  `bonus` double NOT NULL,
  `insentif` double NOT NULL,
  `thr` double NOT NULL,
  `bpjs_kesehatan` double NOT NULL,
  `bpjs_kesehatan_persentase` double NOT NULL,
  `jkk` double NOT NULL,
  `jkk_persentase` double NOT NULL,
  `jkm` double NOT NULL,
  `jkm_persentase` double NOT NULL,
  `jht` double NOT NULL,
  `jht_persentase` double NOT NULL,
  `jp` double NOT NULL,
  `jp_persentase` double NOT NULL,
  `bpjs_karyawan` double NOT NULL,
  `bpjs_karyawan_persentase` double NOT NULL,
  `kode_akun_perkiraan_jht_karyawan` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `jp_karyawan` double NOT NULL,
  `jp_karyawan_persentase` double NOT NULL,
  `jht_karyawan` double NOT NULL
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
  `role` text NOT NULL,
  `serial_key` varchar(255) NOT NULL,
  `mac_address` varchar(255) NOT NULL,
  `os_info` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `perusahaan` varchar(255) NOT NULL,
  `jumlah_entry_data` int(11) NOT NULL,
  `batas_entry_data` int(11) NOT NULL,
  `end_date_akses` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_tab`
--

INSERT INTO `user_tab` (`id`, `uuid`, `username`, `password`, `name`, `role`, `serial_key`, `mac_address`, `os_info`, `createdAt`, `updatedAt`, `perusahaan`, `jumlah_entry_data`, `batas_entry_data`, `end_date_akses`) VALUES
(1, 'b5e4bad6-d212-4b93-9085-3ec48302dcab', 'erick14', '$2b$10$1mOvkBEjMfnU10ZNcDIViuqBudkuh73CMB91gPsPUidVv9uXGwyVe', 'Erick Hene', '[\"Dashboard\", \"Dashboard_Overview\", \"Dashboard_Penjualan\",\"Dashboard_Pembelian\",\"Dashboard_Biaya\",\"Dashboard_AktivitasDokumen\",\"Perusahaan\",\"Perusahaan_Master\",\"Perusahaan_Master_KodeAkun\",\"Perusahaan_Master_Customer\",\"Perusahaan_Master_Supplier\",\"Perusahaan_Master_Pegawai\",\"Perusahaan_Cabang\",\"Perusahaan_Divisi\",\"Perusahaan_Jabatan\",\"Perusahaan_TipePembayaran\",\"Perusahaan_SyaratPembayaran\",\"Perusahaan_StatusTanggungan\",\"Transaksi\",\"Transaksi_KasDanBank\",\"Transaksi_Penjualan\",\"Transaksi_Penjualan_Barang\",\"Transaksi_Penjualan_Jasa\",\"Transaksi_Pembelian\",\"Transaksi_Pembelian_Barang\",\"Transaksi_Payroll\",\"Transaksi_Payroll_PendapatanPegawai\",\"Transaksi_Payroll_PotonganPegawai\",\"Transaksi_Payroll_SlipGajiPegawai\",\"AsetTetapDanPerlengkapan\",\"AsetTetapDanPerlengkapan_Aset\",\"AsetTetapDanPerlengkapan_Aset_DaftarAset\",\"AsetTetapDanPerlengkapan_Aset_KategoriAset\",\"AsetTetapDanPerlengkapan_Aset_KelompokAset\",\"AsetTetapDanPerlengkapan_Perlengkapan\",\"AsetTetapDanPerlengkapan_Perlengkapan_DaftarPerlengkapan\",\"AsetTetapDanPerlengkapan_Perlengkapan_PenggunaanPerlengkapan\",\"AsetTetapDanPerlengkapan_Perlengkapan_KategoriPerlengkapan\",\"AsetTetapDanPerlengkapan_Penyusutan\",\"AsetTetapDanPerlengkapan_Penyusutan_MetodePenyusutan\",\"AsetTetapDanPerlengkapan_Penyusutan_PersentasePenyusutan\",\"AsetTetapDanPerlengkapan_Penyusutan_HitunganPenyusutan\",\"AsetTetapDanPerlengkapan_Penyusutan_JurnalPenyusutan\",\"Persediaan\",\"Persediaan_Barang\",\"Persediaan_Barang_DaftarBarang\",\"Persediaan_Barang_SatuanBarang\",\"Persediaan_Barang_KategoriBarang\",\"Persediaan_Barang_Jenis_Barang\",\"Persediaan_Barang_JenisPenjualanBarang\",\"Persediaan_Barang_TransferBarang\",\"Persediaan_Barang_KonversiBarang\",\"Persediaan_Jasa\",\"Persediaan_Jasa_DaftarJasa\",\"Persediaan_Jasa_SatuanJasa\",\"Persediaan_Jasa_KategoriJasa\",\"Persediaan_Jasa_JenisJasa\",\"Persediaan_Jasa_JenisPenjualanJasa\",\"Persediaan_Opname\",\"Persediaan_Opname_PerintahStokOpname\",\"Persediaan_Opname_HasilStokOpname\",\"Persediaan_Opname_PenyesuaianPersediaan\",\"Persediaan_Opname_JurnalStokOpname\",\"Persediaan_Gudang\",\"Persediaan_Gudang_DaftarGudang\",\"Persediaan_Gudang_JenisGudang\",\"Persediaan_Gudang_KategoriGudang\",\"Persediaan_Pengiriman\",\"Persediaan_Pengiriman_Barang\",\"BukuBesar\",\"BukuBesar_JurnalUmum\",\"BukuBesar_HistoryAkun\",\"Laporan\",\"Laporan_Stok_Barang\",\"Laporan_Pengiriman_Barang\",\"Laporan_Harga_Barang_Beli\",\"Laporan_Faktur_Penjualan_Barang\",\"Laporan_Faktur_Pembelian_Barang\",\"Laporan_Penjualan_Barang\",\"Laporan_Pembelian_Barang\",\"Laporan_NeracaSaldo\",\"Laporan_LabaRugi\",\"Laporan_Neraca\",\"Laporan_PerubahanModal\",\"AktivitasDokumen\"]', 'Z6A7G-RS78E-VI2DZ-4HNF1-YYX1Q', '14:5a:fc:5d:44:23', '{\"hostname\":\"erickhene-Aspire-A515-45\",\"arch\":\"x64\",\"platform\":\"linux\",\"type\":\"Linux\",\"memory\":\"16\",\"cpu\":\"AMD Ryzen 5 5500U with Radeon Graphics\"}', '2024-06-15 01:33:29', '2024-06-15 01:33:29', 'PT. Karya Entitas Purida', 0, 0, 'UNLIMITED'),
(2, 'd6fd798e-bd82-4308-bed7-ddacf91a4e62', 'super_admin_keps123@@', '$2b$10$pSR2F/Ju.4sOEj5ELqnP2.9ozBUsh.ZTmSd4OQ5ybvzM30EJwByrS', 'Capriati Bintari D. T', '[\"Dashboard\", \"Dashboard_Overview\", \"Dashboard_Penjualan\",\"Dashboard_Pembelian\",\"Dashboard_Biaya\",\"Dashboard_AktivitasDokumen\",\"Perusahaan\",\"Perusahaan_Master\",\"Perusahaan_Master_KodeAkun\",\"Perusahaan_Master_Customer\",\"Perusahaan_Master_Supplier\",\"Perusahaan_Master_Pegawai\",\"Perusahaan_Cabang\",\"Perusahaan_Divisi\",\"Perusahaan_Jabatan\",\"Perusahaan_TipePembayaran\",\"Perusahaan_SyaratPembayaran\",\"Perusahaan_StatusTanggungan\",\"Transaksi\",\"Transaksi_KasDanBank\",\"Transaksi_Penjualan\",\"Transaksi_Penjualan_Barang\",\"Transaksi_Penjualan_Jasa\",\"Transaksi_Pembelian\",\"Transaksi_Pembelian_Barang\",\"Transaksi_Payroll\",\"Transaksi_Payroll_PendapatanPegawai\",\"Transaksi_Payroll_PotonganPegawai\",\"Transaksi_Payroll_SlipGajiPegawai\",\"AsetTetapDanPerlengkapan\",\"AsetTetapDanPerlengkapan_Aset\",\"AsetTetapDanPerlengkapan_Aset_DaftarAset\",\"AsetTetapDanPerlengkapan_Aset_KategoriAset\",\"AsetTetapDanPerlengkapan_Aset_KelompokAset\",\"AsetTetapDanPerlengkapan_Perlengkapan\",\"AsetTetapDanPerlengkapan_Perlengkapan_DaftarPerlengkapan\",\"AsetTetapDanPerlengkapan_Perlengkapan_PenggunaanPerlengkapan\",\"AsetTetapDanPerlengkapan_Perlengkapan_KategoriPerlengkapan\",\"AsetTetapDanPerlengkapan_Penyusutan\",\"AsetTetapDanPerlengkapan_Penyusutan_MetodePenyusutan\",\"AsetTetapDanPerlengkapan_Penyusutan_PersentasePenyusutan\",\"AsetTetapDanPerlengkapan_Penyusutan_HitunganPenyusutan\",\"AsetTetapDanPerlengkapan_Penyusutan_JurnalPenyusutan\",\"Persediaan\",\"Persediaan_Barang\",\"Persediaan_Barang_DaftarBarang\",\"Persediaan_Barang_SatuanBarang\",\"Persediaan_Barang_KategoriBarang\",\"Persediaan_Barang_Jenis_Barang\",\"Persediaan_Barang_JenisPenjualanBarang\",\"Persediaan_Barang_TransferBarang\",\"Persediaan_Barang_KonversiBarang\",\"Persediaan_Jasa\",\"Persediaan_Jasa_DaftarJasa\",\"Persediaan_Jasa_SatuanJasa\",\"Persediaan_Jasa_KategoriJasa\",\"Persediaan_Jasa_JenisJasa\",\"Persediaan_Jasa_JenisPenjualanJasa\",\"Persediaan_Opname\",\"Persediaan_Opname_PerintahStokOpname\",\"Persediaan_Opname_HasilStokOpname\",\"Persediaan_Opname_PenyesuaianPersediaan\",\"Persediaan_Opname_JurnalStokOpname\",\"Persediaan_Gudang\",\"Persediaan_Gudang_DaftarGudang\",\"Persediaan_Gudang_JenisGudang\",\"Persediaan_Gudang_KategoriGudang\",\"Persediaan_Pengiriman\",\"Persediaan_Pengiriman_Barang\",\"BukuBesar\",\"BukuBesar_JurnalUmum\",\"BukuBesar_HistoryAkun\",\"Laporan\",\"Laporan_Stok_Barang\",\"Laporan_Pengiriman_Barang\",\"Laporan_Harga_Barang_Beli\",\"Laporan_Faktur_Penjualan_Barang\",\"Laporan_Faktur_Pembelian_Barang\",\"Laporan_Penjualan_Barang\",\"Laporan_Pembelian_Barang\",\"Laporan_NeracaSaldo\",\"Laporan_LabaRugi\",\"Laporan_Neraca\",\"Laporan_PerubahanModal\",\"AktivitasDokumen\"]', 'Z6A7G-RS78E-VI2DZ-4HNF1-YYX1Q', '74:12:b3:25:02:4d', '{\"hostname\":\"LAPTOP-OG7VTITA\",\"arch\":\"x64\",\"platform\":\"win32\",\"type\":\"Windows_NT\",\"memory\":\"82\",\"cpu\":\"Intel(R) Core(TM) i5-1035G1 CPU @ 1.00GHz\"}', '2024-06-15 01:33:29', '2024-06-15 01:33:29', 'PT. Karya Entitas Purida', 0, 0, 'UNLIMITED');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aktivitas_dokumen_tab`
--
ALTER TABLE `aktivitas_dokumen_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cabang_tab`
--
ALTER TABLE `cabang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer_tab`
--
ALTER TABLE `customer_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `daftar_aset_tab`
--
ALTER TABLE `daftar_aset_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `daftar_bahan_baku_tab`
--
ALTER TABLE `daftar_bahan_baku_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `daftar_barang_tab`
--
ALTER TABLE `daftar_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `daftar_gudang_tab`
--
ALTER TABLE `daftar_gudang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `daftar_jasa_tab`
--
ALTER TABLE `daftar_jasa_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `daftar_perlengkapan_tab`
--
ALTER TABLE `daftar_perlengkapan_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `divisi_tab`
--
ALTER TABLE `divisi_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dokumen_klien_tab`
--
ALTER TABLE `dokumen_klien_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faktur_pembelian_barang_tab`
--
ALTER TABLE `faktur_pembelian_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faktur_penjualan_barang_tab`
--
ALTER TABLE `faktur_penjualan_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faktur_penjualan_jasa_tab`
--
ALTER TABLE `faktur_penjualan_jasa_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gaji_tab`
--
ALTER TABLE `gaji_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hadiah_tab`
--
ALTER TABLE `hadiah_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hasil_stok_opname_tab`
--
ALTER TABLE `hasil_stok_opname_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hitungan_penyusutan_tab`
--
ALTER TABLE `hitungan_penyusutan_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jabatan_tab`
--
ALTER TABLE `jabatan_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jenis_bahan_baku_tab`
--
ALTER TABLE `jenis_bahan_baku_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jenis_barang_tab`
--
ALTER TABLE `jenis_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jenis_gudang_tab`
--
ALTER TABLE `jenis_gudang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jenis_jasa_tab`
--
ALTER TABLE `jenis_jasa_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jenis_penjualan_bahan_baku_tab`
--
ALTER TABLE `jenis_penjualan_bahan_baku_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jenis_penjualan_barang_tab`
--
ALTER TABLE `jenis_penjualan_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jenis_penjualan_jasa_tab`
--
ALTER TABLE `jenis_penjualan_jasa_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jurnal_umum_tab`
--
ALTER TABLE `jurnal_umum_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori_aset_tab`
--
ALTER TABLE `kategori_aset_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori_bahan_baku_tab`
--
ALTER TABLE `kategori_bahan_baku_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori_barang_tab`
--
ALTER TABLE `kategori_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori_gudang_tab`
--
ALTER TABLE `kategori_gudang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori_harga_bahan_baku_tab`
--
ALTER TABLE `kategori_harga_bahan_baku_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori_harga_barang_tab`
--
ALTER TABLE `kategori_harga_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori_harga_jasa_tab`
--
ALTER TABLE `kategori_harga_jasa_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori_jasa_tab`
--
ALTER TABLE `kategori_jasa_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori_perlengkapan_tab`
--
ALTER TABLE `kategori_perlengkapan_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kelompok_aset_tab`
--
ALTER TABLE `kelompok_aset_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kerugian_tab`
--
ALTER TABLE `kerugian_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kode_akun_perkiraan_tab`
--
ALTER TABLE `kode_akun_perkiraan_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `konversi_bahan_baku_tab`
--
ALTER TABLE `konversi_bahan_baku_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `konversi_barang_tab`
--
ALTER TABLE `konversi_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lain_lain_tab`
--
ALTER TABLE `lain_lain_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lembur_tab`
--
ALTER TABLE `lembur_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `metode_penyusutan_tab`
--
ALTER TABLE `metode_penyusutan_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `neraca_tab`
--
ALTER TABLE `neraca_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pegawai_tab`
--
ALTER TABLE `pegawai_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pelunasan_pembelian_barang_tab`
--
ALTER TABLE `pelunasan_pembelian_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pelunasan_penjualan_barang_tab`
--
ALTER TABLE `pelunasan_penjualan_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pelunasan_penjualan_jasa_tab`
--
ALTER TABLE `pelunasan_penjualan_jasa_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pengembalian_denda_pembelian_barang_tab`
--
ALTER TABLE `pengembalian_denda_pembelian_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pengembalian_denda_penjualan_barang_tab`
--
ALTER TABLE `pengembalian_denda_penjualan_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pengembalian_denda_penjualan_jasa_tab`
--
ALTER TABLE `pengembalian_denda_penjualan_jasa_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `penggunaan_perlengkapan_tab`
--
ALTER TABLE `penggunaan_perlengkapan_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pengiriman_barang_tab`
--
ALTER TABLE `pengiriman_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `penyesuaian_persediaan_tab`
--
ALTER TABLE `penyesuaian_persediaan_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `perintah_stok_opname_jurnal_tab`
--
ALTER TABLE `perintah_stok_opname_jurnal_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `perintah_stok_opname_tab`
--
ALTER TABLE `perintah_stok_opname_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `persentase_penyusutan_tab`
--
ALTER TABLE `persentase_penyusutan_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pesanan_pembelian_barang_tab`
--
ALTER TABLE `pesanan_pembelian_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pesanan_penjualan_barang_tab`
--
ALTER TABLE `pesanan_penjualan_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pesanan_penjualan_jasa_tab`
--
ALTER TABLE `pesanan_penjualan_jasa_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `piutang_karyawan_tab`
--
ALTER TABLE `piutang_karyawan_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pph2126_tab`
--
ALTER TABLE `pph2126_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `retur_pembelian_barang_tab`
--
ALTER TABLE `retur_pembelian_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `retur_penjualan_barang_tab`
--
ALTER TABLE `retur_penjualan_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `retur_penjualan_jasa_tab`
--
ALTER TABLE `retur_penjualan_jasa_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_konversi_bahan_baku_tab`
--
ALTER TABLE `rincian_konversi_bahan_baku_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_konversi_barang_tab`
--
ALTER TABLE `rincian_konversi_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_pelunasan_pembelian_barang_tab`
--
ALTER TABLE `rincian_pelunasan_pembelian_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_pelunasan_pembelian_denda_barang_tab`
--
ALTER TABLE `rincian_pelunasan_pembelian_denda_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_pelunasan_penjualan_barang_tab`
--
ALTER TABLE `rincian_pelunasan_penjualan_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_pelunasan_penjualan_denda_barang_tab`
--
ALTER TABLE `rincian_pelunasan_penjualan_denda_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_pelunasan_penjualan_denda_jasa_tab`
--
ALTER TABLE `rincian_pelunasan_penjualan_denda_jasa_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_pelunasan_penjualan_jasa_tab`
--
ALTER TABLE `rincian_pelunasan_penjualan_jasa_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_pengembalian_denda_pembelian_barang_tab`
--
ALTER TABLE `rincian_pengembalian_denda_pembelian_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_pengembalian_denda_penjualan_barang_tab`
--
ALTER TABLE `rincian_pengembalian_denda_penjualan_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_pengembalian_denda_penjualan_jasa_tab`
--
ALTER TABLE `rincian_pengembalian_denda_penjualan_jasa_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_pengiriman_barang_tab`
--
ALTER TABLE `rincian_pengiriman_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_pesanan_pembelian_barang_tab`
--
ALTER TABLE `rincian_pesanan_pembelian_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_pesanan_penjualan_barang_tab`
--
ALTER TABLE `rincian_pesanan_penjualan_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_pesanan_penjualan_jasa_tab`
--
ALTER TABLE `rincian_pesanan_penjualan_jasa_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_retur_pembelian_barang_tab`
--
ALTER TABLE `rincian_retur_pembelian_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_retur_penjualan_barang_tab`
--
ALTER TABLE `rincian_retur_penjualan_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_retur_penjualan_jasa_tab`
--
ALTER TABLE `rincian_retur_penjualan_jasa_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_transaksi_bank_tab`
--
ALTER TABLE `rincian_transaksi_bank_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_transaksi_kas_tab`
--
ALTER TABLE `rincian_transaksi_kas_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_transfer_bahan_baku_tab`
--
ALTER TABLE `rincian_transfer_bahan_baku_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rincian_transfer_barang_tab`
--
ALTER TABLE `rincian_transfer_barang_tab`
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
-- Indexes for table `satuan_bahan_baku_tab`
--
ALTER TABLE `satuan_bahan_baku_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `satuan_barang_tab`
--
ALTER TABLE `satuan_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `satuan_jasa_tab`
--
ALTER TABLE `satuan_jasa_tab`
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
-- Indexes for table `status_tanggungan_tab`
--
ALTER TABLE `status_tanggungan_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stok_awal_bahan_baku_tab`
--
ALTER TABLE `stok_awal_bahan_baku_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stok_awal_barang_tab`
--
ALTER TABLE `stok_awal_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stok_awal_jasa_tab`
--
ALTER TABLE `stok_awal_jasa_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `supplier_tab`
--
ALTER TABLE `supplier_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `syarat_pembayaran_tab`
--
ALTER TABLE `syarat_pembayaran_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tipe_pembayaran_tab`
--
ALTER TABLE `tipe_pembayaran_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transaksi_bank_tab`
--
ALTER TABLE `transaksi_bank_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transaksi_kas_tab`
--
ALTER TABLE `transaksi_kas_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfer_bahan_baku_tab`
--
ALTER TABLE `transfer_bahan_baku_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfer_barang_tab`
--
ALTER TABLE `transfer_barang_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tunjangan_uang_tab`
--
ALTER TABLE `tunjangan_uang_tab`
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
-- AUTO_INCREMENT for table `cabang_tab`
--
ALTER TABLE `cabang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_tab`
--
ALTER TABLE `customer_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `daftar_aset_tab`
--
ALTER TABLE `daftar_aset_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `daftar_bahan_baku_tab`
--
ALTER TABLE `daftar_bahan_baku_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `daftar_barang_tab`
--
ALTER TABLE `daftar_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `daftar_gudang_tab`
--
ALTER TABLE `daftar_gudang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `daftar_jasa_tab`
--
ALTER TABLE `daftar_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `daftar_perlengkapan_tab`
--
ALTER TABLE `daftar_perlengkapan_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `divisi_tab`
--
ALTER TABLE `divisi_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `dokumen_klien_tab`
--
ALTER TABLE `dokumen_klien_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faktur_pembelian_barang_tab`
--
ALTER TABLE `faktur_pembelian_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `faktur_penjualan_barang_tab`
--
ALTER TABLE `faktur_penjualan_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `faktur_penjualan_jasa_tab`
--
ALTER TABLE `faktur_penjualan_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gaji_tab`
--
ALTER TABLE `gaji_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hadiah_tab`
--
ALTER TABLE `hadiah_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hasil_stok_opname_tab`
--
ALTER TABLE `hasil_stok_opname_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hitungan_penyusutan_tab`
--
ALTER TABLE `hitungan_penyusutan_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jabatan_tab`
--
ALTER TABLE `jabatan_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `jenis_bahan_baku_tab`
--
ALTER TABLE `jenis_bahan_baku_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jenis_barang_tab`
--
ALTER TABLE `jenis_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `jenis_gudang_tab`
--
ALTER TABLE `jenis_gudang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `jenis_jasa_tab`
--
ALTER TABLE `jenis_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jenis_penjualan_bahan_baku_tab`
--
ALTER TABLE `jenis_penjualan_bahan_baku_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jenis_penjualan_barang_tab`
--
ALTER TABLE `jenis_penjualan_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `jenis_penjualan_jasa_tab`
--
ALTER TABLE `jenis_penjualan_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jurnal_umum_tab`
--
ALTER TABLE `jurnal_umum_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `kategori_aset_tab`
--
ALTER TABLE `kategori_aset_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategori_bahan_baku_tab`
--
ALTER TABLE `kategori_bahan_baku_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategori_barang_tab`
--
ALTER TABLE `kategori_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `kategori_gudang_tab`
--
ALTER TABLE `kategori_gudang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `kategori_harga_bahan_baku_tab`
--
ALTER TABLE `kategori_harga_bahan_baku_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategori_harga_barang_tab`
--
ALTER TABLE `kategori_harga_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `kategori_harga_jasa_tab`
--
ALTER TABLE `kategori_harga_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategori_jasa_tab`
--
ALTER TABLE `kategori_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategori_perlengkapan_tab`
--
ALTER TABLE `kategori_perlengkapan_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `kelompok_aset_tab`
--
ALTER TABLE `kelompok_aset_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kerugian_tab`
--
ALTER TABLE `kerugian_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kode_akun_perkiraan_tab`
--
ALTER TABLE `kode_akun_perkiraan_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `konversi_bahan_baku_tab`
--
ALTER TABLE `konversi_bahan_baku_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `konversi_barang_tab`
--
ALTER TABLE `konversi_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lain_lain_tab`
--
ALTER TABLE `lain_lain_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lembur_tab`
--
ALTER TABLE `lembur_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `metode_penyusutan_tab`
--
ALTER TABLE `metode_penyusutan_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `neraca_tab`
--
ALTER TABLE `neraca_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pegawai_tab`
--
ALTER TABLE `pegawai_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pelunasan_pembelian_barang_tab`
--
ALTER TABLE `pelunasan_pembelian_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pelunasan_penjualan_barang_tab`
--
ALTER TABLE `pelunasan_penjualan_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pelunasan_penjualan_jasa_tab`
--
ALTER TABLE `pelunasan_penjualan_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengembalian_denda_pembelian_barang_tab`
--
ALTER TABLE `pengembalian_denda_pembelian_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengembalian_denda_penjualan_barang_tab`
--
ALTER TABLE `pengembalian_denda_penjualan_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengembalian_denda_penjualan_jasa_tab`
--
ALTER TABLE `pengembalian_denda_penjualan_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `penggunaan_perlengkapan_tab`
--
ALTER TABLE `penggunaan_perlengkapan_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pengiriman_barang_tab`
--
ALTER TABLE `pengiriman_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `penyesuaian_persediaan_tab`
--
ALTER TABLE `penyesuaian_persediaan_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `perintah_stok_opname_jurnal_tab`
--
ALTER TABLE `perintah_stok_opname_jurnal_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `perintah_stok_opname_tab`
--
ALTER TABLE `perintah_stok_opname_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `persentase_penyusutan_tab`
--
ALTER TABLE `persentase_penyusutan_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pesanan_pembelian_barang_tab`
--
ALTER TABLE `pesanan_pembelian_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pesanan_penjualan_barang_tab`
--
ALTER TABLE `pesanan_penjualan_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pesanan_penjualan_jasa_tab`
--
ALTER TABLE `pesanan_penjualan_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `piutang_karyawan_tab`
--
ALTER TABLE `piutang_karyawan_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pph2126_tab`
--
ALTER TABLE `pph2126_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `retur_pembelian_barang_tab`
--
ALTER TABLE `retur_pembelian_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `retur_penjualan_barang_tab`
--
ALTER TABLE `retur_penjualan_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `retur_penjualan_jasa_tab`
--
ALTER TABLE `retur_penjualan_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_konversi_bahan_baku_tab`
--
ALTER TABLE `rincian_konversi_bahan_baku_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_konversi_barang_tab`
--
ALTER TABLE `rincian_konversi_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_pelunasan_pembelian_barang_tab`
--
ALTER TABLE `rincian_pelunasan_pembelian_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_pelunasan_pembelian_denda_barang_tab`
--
ALTER TABLE `rincian_pelunasan_pembelian_denda_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_pelunasan_penjualan_barang_tab`
--
ALTER TABLE `rincian_pelunasan_penjualan_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_pelunasan_penjualan_denda_barang_tab`
--
ALTER TABLE `rincian_pelunasan_penjualan_denda_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_pelunasan_penjualan_denda_jasa_tab`
--
ALTER TABLE `rincian_pelunasan_penjualan_denda_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_pelunasan_penjualan_jasa_tab`
--
ALTER TABLE `rincian_pelunasan_penjualan_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_pengembalian_denda_pembelian_barang_tab`
--
ALTER TABLE `rincian_pengembalian_denda_pembelian_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_pengembalian_denda_penjualan_barang_tab`
--
ALTER TABLE `rincian_pengembalian_denda_penjualan_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_pengembalian_denda_penjualan_jasa_tab`
--
ALTER TABLE `rincian_pengembalian_denda_penjualan_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_pengiriman_barang_tab`
--
ALTER TABLE `rincian_pengiriman_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `rincian_pesanan_pembelian_barang_tab`
--
ALTER TABLE `rincian_pesanan_pembelian_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `rincian_pesanan_penjualan_barang_tab`
--
ALTER TABLE `rincian_pesanan_penjualan_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `rincian_pesanan_penjualan_jasa_tab`
--
ALTER TABLE `rincian_pesanan_penjualan_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_retur_pembelian_barang_tab`
--
ALTER TABLE `rincian_retur_pembelian_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_retur_penjualan_barang_tab`
--
ALTER TABLE `rincian_retur_penjualan_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_retur_penjualan_jasa_tab`
--
ALTER TABLE `rincian_retur_penjualan_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_transaksi_bank_tab`
--
ALTER TABLE `rincian_transaksi_bank_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_transaksi_kas_tab`
--
ALTER TABLE `rincian_transaksi_kas_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_transfer_bahan_baku_tab`
--
ALTER TABLE `rincian_transfer_bahan_baku_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_transfer_barang_tab`
--
ALTER TABLE `rincian_transfer_barang_tab`
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
-- AUTO_INCREMENT for table `satuan_bahan_baku_tab`
--
ALTER TABLE `satuan_bahan_baku_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `satuan_barang_tab`
--
ALTER TABLE `satuan_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `satuan_jasa_tab`
--
ALTER TABLE `satuan_jasa_tab`
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
-- AUTO_INCREMENT for table `status_tanggungan_tab`
--
ALTER TABLE `status_tanggungan_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stok_awal_bahan_baku_tab`
--
ALTER TABLE `stok_awal_bahan_baku_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stok_awal_barang_tab`
--
ALTER TABLE `stok_awal_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stok_awal_jasa_tab`
--
ALTER TABLE `stok_awal_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_tab`
--
ALTER TABLE `supplier_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `syarat_pembayaran_tab`
--
ALTER TABLE `syarat_pembayaran_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tipe_pembayaran_tab`
--
ALTER TABLE `tipe_pembayaran_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transaksi_bank_tab`
--
ALTER TABLE `transaksi_bank_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaksi_kas_tab`
--
ALTER TABLE `transaksi_kas_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transfer_bahan_baku_tab`
--
ALTER TABLE `transfer_bahan_baku_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transfer_barang_tab`
--
ALTER TABLE `transfer_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tunjangan_uang_tab`
--
ALTER TABLE `tunjangan_uang_tab`
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
