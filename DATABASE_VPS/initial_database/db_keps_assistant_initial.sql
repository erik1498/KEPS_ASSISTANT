-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 24, 2024 at 07:18 AM
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
  `kode_akun_perkiraan` varchar(255) NOT NULL
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
  `nomor_invoice` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

-- --------------------------------------------------------

--
-- Table structure for table `jurnal_umum_tab_old`
--

CREATE TABLE `jurnal_umum_tab_old` (
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
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  `type_transaksi_payroll` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `kode_akun_perkiraan_tab`
--

INSERT INTO kode_akun_perkiraan_tab (uuid,`type`,name,code,enabled,createdAt,updatedAt,createdBy,updatedBy,type_transaksi_kas_bank,update_permission,type_transaksi_payroll) VALUES
  ('76072236-7685-426b-8f10-6f2acf797c22','Harta','Kas Besar','101',1,'2023-11-11 16:38:43','2024-03-27 05:11:54','SYSTEM','',1,0,1),
  ('9d331f11-7061-4f62-b286-0a87fcc0fd03','Harta','Kas Kecil','102',1,'2023-11-11 16:38:54','2023-11-11 16:38:54','SYSTEM','',1,0,1),
  ('33105460-6ac0-4744-a56c-6822bb4d4ba3','Harta','Piutang Usaha','110',1,'2023-11-11 16:42:19','2023-11-11 16:42:19','SYSTEM','',0,0,0),
  ('f15e2810-c736-42f6-9a80-6d70e03315de','Harta','Piutang Karyawan','111',1,'2023-11-11 16:42:33','2023-11-11 16:42:33','SYSTEM','',0,0,0),
  ('0ebe1d2e-f18b-4c4e-bfdc-304f3dd83735','Modal','Modal','301',1,'2023-11-11 16:50:02','2023-11-17 12:23:48','SYSTEM','',0,0,0),
  ('b073c676-1e2a-4b50-8bf9-eb2c4081e05d','Modal','Prive','302',1,'2023-11-11 16:50:29','2023-12-09 06:47:05','SYSTEM','',0,0,0),
  ('8d975877-fdb8-4388-96c7-250b40942cb5','Modal','Laba/Rugi Periode Sebelumnya','398',1,'2023-11-11 16:50:54','2023-11-11 16:51:26','SYSTEM','',0,0,0),
  ('8e5a1bf2-7180-41a4-ab86-12b417fe9ea8','Modal','Laba/Rugi Periode Berjalan','399',1,'2023-11-11 16:51:18','2023-11-11 16:51:18','SYSTEM','',0,0,0),
  ('453764da-957f-4099-a03d-268367987dc2','Pendapatan','Penjualan Barang','401',1,'2023-11-11 16:52:06','2023-12-02 09:31:57','SYSTEM','',0,0,0),
  ('0c0a1c04-ad98-4818-9a63-9be554b2ae55','Beban Operasional','Beban Gaji','505',1,'2023-11-11 16:55:14','2023-11-11 16:55:14','SYSTEM','',0,0,0),
  ('eadfec72-7d66-4597-998d-8acf959d34b7','Beban Operasional','Beban Pajak','525',1,'2023-11-11 17:02:46','2023-11-11 17:02:46','SYSTEM','',0,0,0),
  ('b7687ceb-6046-4062-979d-bfed5550bd87','Pendapatan Lain - Lain','Pendapatan Lain - Lain','699',1,'2023-11-11 17:05:40','2024-09-21 04:24:33','SYSTEM','',0,0,0),
  ('e86d5fd7-958c-4cb3-839d-ca70f6abe123','Harga Pokok Penjualan','Pembelian','702',1,'2023-11-11 17:05:59','2023-11-11 17:05:59','SYSTEM','',0,0,0),
  ('4710e8be-e0c2-4318-8b42-ea8c58aa2312','Harga Pokok Penjualan','Persediaan Barang Dagang Awal','701',1,'2023-11-11 17:07:27','2023-11-11 17:07:27','SYSTEM','',0,0,0),
  ('018cdcf2-f5ce-4d1a-b320-17b89a0c5556','Harga Pokok Penjualan','Persediaan Barang Dagang Akhir','799',1,'2023-11-11 17:08:02','2023-11-11 17:08:02','SYSTEM','',0,0,0),
  ('826a9418-4b0e-4ca4-8a83-6c392e7a4cf1','Pendapatan','Penjualan Jasa','405',1,'2023-12-02 09:34:10','2023-12-02 09:34:10','SYSTEM','',0,0,0),
  ('96dc1c2e-1cd3-42b8-b580-3932ebe1e82d','Beban Operasional','Beban Lembur Pegawai','531',1,'2023-12-16 13:22:34','2024-09-20 20:14:18','SYSTEM','',0,0,0),
  ('dc632a24-dba2-4c65-9b42-968de322fe1c','Beban Operasional','Beban Tunjangan Uang / Barang','532',1,'2023-12-16 13:55:09','2024-09-21 01:13:38','SYSTEM','',0,0,0),
  ('f3eafc29-6a1c-4e57-b789-532b490dac33','Pendapatan Lain - Lain','Pendapatan Atas Kerugian','604',1,'2024-01-06 16:52:55','2024-09-21 04:28:22','SYSTEM','',0,0,0),
  ('a09a5e0c-9544-4a83-b214-c47cf5c07bdd','Beban Operasional','Beban Tunjangan Hadiah','533',1,'2024-01-07 16:30:29','2024-09-21 00:50:52','SYSTEM','',0,0,0),
  ('4677d2cc-11cb-11ef-a0da-145afc5d4423','Modal','Dividen','303',1,'2023-11-11 16:51:50','2023-11-11 16:51:50','SYSTEM','',0,0,0),
  ('6453a29e-d506-46e5-8f05-1ff8817b8813','Utang','Hutang Dagang','201',1,'2024-10-14 12:21:39','2024-10-15 19:16:36','SYSTEM','',0,0,1),
  ('063b765d-1ccf-4586-9006-64907046364d','Utang','Hutang Gaji','202',1,'2024-10-14 12:21:56','2024-10-15 19:16:45','SYSTEM','',0,0,1),
  ('cb4da807-75ad-4202-b15c-ef6417211481','Utang','Hutang Bank','203',1,'2024-10-14 12:22:15','2024-10-15 19:17:13','SYSTEM','',0,0,1),
  ('faf85905-7eb1-4092-ad6f-b151a9eba828','Utang','Hutang Pajak PPh Pasal 21/26','204',1,'2024-10-14 12:22:41','2024-10-14 12:22:41','SYSTEM','',0,0,1),
  ('46381f2e-f256-4a5b-be56-76688e7b915d','Utang','Hutang Lain-Lain','206',1,'2024-10-14 12:23:11','2024-10-15 19:17:45','SYSTEM','',0,0,1),
  ('261984b1-4a45-4332-aaae-9687fe550262','Utang','Hutang BPJS','215',1,'2024-10-14 12:23:55','2024-10-15 19:17:05','SYSTEM','',0,0,1),
  ('fb8aadc0-f121-46fe-a83b-f56a1723b337','Pendapatan Lain - Lain','Pendapatan BPJS','610',1,'2024-10-14 12:34:46','2024-10-15 19:16:24','SYSTEM','',0,0,1),
  ('5555ff3a-9de0-42b5-bdc8-f39c43947496','Beban Operasional','Beban BPJS Kesehatan','514',1,'2023-11-11 16:58:48','2024-09-21 02:06:46','SYSTEM','',0,0,0),
  ('24af525c-4519-4f26-a339-df8ef261b42d','Beban Operasional','Beban BPJS Ketenagakerjaan','530',1,'2023-12-16 13:22:15','2024-09-21 02:15:33','SYSTEM','',0,0,0),
  ('b896af3e-627a-465c-ab50-19533754b788','Pendapatan','Pendapatan BPJS','408',1,'2024-10-13 23:46:34','2024-10-13 23:46:34','SYSTEM','',0,0,0),
  ('04eae5c2-ccf6-46b8-a0f3-2d3d1a723c79','Beban Operasional','Beban Bonus','520',1,'2023-11-11 17:01:03','2023-11-11 17:01:03','SYSTEM','',0,0,0),
  ('885dd610-31f5-4be2-8a9b-87d7494c4942','Beban Operasional','Beban THR','521',1,'2023-11-11 17:01:33','2023-11-11 17:01:33','SYSTEM','',0,0,0),
  ('5d93a16a-843e-42ba-9d3c-916a5998461d','Beban Operasional','Beban Insentif','522',1,'2023-11-11 17:01:55','2023-11-11 17:01:55','SYSTEM','',0,0,0),
  ('c457def6-7f3c-478d-9190-15ab0b70e630','Utang','PPN Keluaran','205',1,'2023-11-11 16:48:47','2023-11-11 16:48:47','SYSTEM','',0,0,0),
  ('f3827c1b-b8d8-4c1f-94e9-8249e9292a03','Pendapatan','Retur Penjualan Barang','403',1,'2023-11-11 16:52:23','2023-12-02 09:32:13','SYSTEM','',0,0,0),
  ('5b04e881-b908-4400-a7f4-b78c34cc7a8c','Pendapatan','Diskon Penjualan Barang','404',1,'2023-11-11 16:53:13','2023-12-02 09:32:32','SYSTEM','',0,0,0),
  ('ddb0e69f-9704-4555-b427-5748365034f7','Pendapatan Lain - Lain','Pendapatan Denda Penjualan Barang','605',1,'2024-01-12 10:33:54','2024-01-19 13:00:50','SYSTEM','',0,0,0),
  ('eb5b6dcd-1146-4550-a9f0-1fe8439b085f','Harta','Piutang Denda Barang','133',1,'2024-01-19 12:59:11','2024-01-19 12:59:11','SYSTEM','',0,0,0),
  ('675780c8-8ab4-401e-afe1-efc5684bb5f3','Pendapatan Lain - Lain','Pendapatan Penyesuaian Stok Opname Barang Lebih','611',1,'2024-11-15 15:11:28','2024-11-15 19:14:01','SYSTEM','',0,0,0),
  ('06bb2055-466d-4c4b-a0f8-7805648ffd01','Beban Lainnya','Kerugian Barang Hasil Stok Opname Berkurang','804',1,'2024-11-15 15:08:15','2024-11-15 19:13:42','SYSTEM','',0,0,0),
  ('c28c00b1-b274-4c33-9f47-2e0e7a01b21e','Beban Operasional','Denda Pembelian Barang','541',1,'2024-11-16 00:06:00','2024-11-16 00:06:00','SYSTEM','',0,0,0),
  ('93919470-8a98-4f67-a373-fe6726b7aae2','Harta','PPN Masukan','117',1,'2023-11-11 16:44:35','2023-11-11 16:44:35','SYSTEM','',0,0,0),
  ('71786d7c-f0e3-4e4e-b8da-ebd79cac3c02','Harga Pokok Penjualan','Diskon Pembelian','704',1,'2023-11-11 17:06:34','2023-11-11 17:06:34','SYSTEM','',0,0,0),
  ('915ac6e8-c528-4f10-9215-74fda0b1c99e','Beban Operasional','Beban Penyusutan','509',1,'2023-11-11 16:56:41','2024-11-17 14:25:16','SYSTEM','',0,0,0),
  ('a88b16d3-4071-4503-9c5b-17cdac4a411f','Harta','Akumulasi Penyusutan','135',1,'2024-11-17 14:51:26','2024-11-17 14:51:26','SYSTEM','',0,0,0),
  ('c85ac20d-1b1e-45c5-80e1-8db80c5dd283','Harta','Perlengkapan Kantor','113',1,'2023-11-11 16:43:06','2023-11-11 16:43:06','SYSTEM','',0,0,0),
  ('6e376191-0454-4172-a78b-2bc5f9c8fd6e','Beban Operasional','Beban Perlengkapan','501',1,'2023-11-11 16:53:48','2023-11-11 16:53:48','SYSTEM','',0,0,0),
  ('ad6d4852-27dd-4b6e-8d26-eb812084d248','Pendapatan','Retur Penjualan Jasa','406',1,'2023-12-02 09:34:28','2023-12-02 09:34:28','SYSTEM','',0,0,0),
  ('dea2ce84-fb39-4c6d-bac2-99e37b4fd492','Harga Pokok Penjualan','Retur Pembelian','703',1,'2023-11-11 17:06:15','2023-11-11 17:06:15','SYSTEM','',0,0,0),
  ('7eee8bbd-b5c3-4351-9ff8-cdbe814806b9','Pendapatan','Diskon Penjualan Jasa','407',1,'2023-12-02 09:34:46','2023-12-02 09:34:46','SYSTEM','',0,0,0),
  ('c5319b9f-41b9-4c92-bbc4-94bf07583263','Harta','Persediaan Barang Dagang','108',1,'2023-11-11 16:41:00','2023-11-11 16:41:00','SYSTEM','',0,0,0),
  ('2e186c0a-bd7c-4266-89ab-b4fdd2957e6e','Beban Lainnya','Beban Pengembalian Denda Penjualan Jasa','806',1,'2024-11-23 17:00:05','2024-11-23 17:00:05','SYSTEM','',0,0,0),
  ('7b7a9b89-a712-4085-bdac-617ce712561c','Beban Lainnya','Beban Pengembalian Denda Penjualan Barang','805',1,'2024-11-21 19:45:23','2024-11-21 19:45:23','SYSTEM','',0,0,0),
  ('c48a5704-ffa6-471b-a468-12a74aedd100','Pendapatan Lain - Lain','Pendapatan Denda Pembelian Barang','613',1,'2024-11-21 18:57:52','2024-11-21 18:57:52','SYSTEM','',0,0,0),
  ('c28c00b1-b274-4c33-9f47-2e0e7a01b21e','Beban Operasional','Denda Pembelian Barang','541',1,'2024-11-16 00:06:00','2024-11-16 00:06:00','SYSTEM','',0,0,0);

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

INSERT INTO metode_penyusutan_tab (uuid,name,createdBy,updatedBy,enabled,createdAt,updatedAt) VALUES
('22687f1e-964c-43f8-91ef-fa2016a8aa1e','Garis Lurus','SYSTEM','',1,'2024-09-06 00:08:02','2024-09-06 00:08:02'),
('d4a81ba9-d30e-475e-87ee-1dfc12b013c1','Saldo Menurun','SYSTEM','',1,'2024-09-06 00:08:12','2024-09-06 00:08:12');

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
-- Indexes for table `jurnal_umum_tab_old`
--
ALTER TABLE `jurnal_umum_tab_old`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori_aset_tab`
--
ALTER TABLE `kategori_aset_tab`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `daftar_aset_tab`
--
ALTER TABLE `daftar_aset_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `daftar_barang_tab`
--
ALTER TABLE `daftar_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `daftar_gudang_tab`
--
ALTER TABLE `daftar_gudang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `daftar_jasa_tab`
--
ALTER TABLE `daftar_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `daftar_perlengkapan_tab`
--
ALTER TABLE `daftar_perlengkapan_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `divisi_tab`
--
ALTER TABLE `divisi_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dokumen_klien_tab`
--
ALTER TABLE `dokumen_klien_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faktur_pembelian_barang_tab`
--
ALTER TABLE `faktur_pembelian_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faktur_penjualan_barang_tab`
--
ALTER TABLE `faktur_penjualan_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jenis_barang_tab`
--
ALTER TABLE `jenis_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jenis_gudang_tab`
--
ALTER TABLE `jenis_gudang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jenis_jasa_tab`
--
ALTER TABLE `jenis_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jenis_penjualan_barang_tab`
--
ALTER TABLE `jenis_penjualan_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jenis_penjualan_jasa_tab`
--
ALTER TABLE `jenis_penjualan_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jurnal_umum_tab`
--
ALTER TABLE `jurnal_umum_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jurnal_umum_tab_old`
--
ALTER TABLE `jurnal_umum_tab_old`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategori_aset_tab`
--
ALTER TABLE `kategori_aset_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategori_barang_tab`
--
ALTER TABLE `kategori_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategori_gudang_tab`
--
ALTER TABLE `kategori_gudang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategori_harga_barang_tab`
--
ALTER TABLE `kategori_harga_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=149;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pegawai_tab`
--
ALTER TABLE `pegawai_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pesanan_penjualan_barang_tab`
--
ALTER TABLE `pesanan_penjualan_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT for table `rincian_pesanan_pembelian_barang_tab`
--
ALTER TABLE `rincian_pesanan_pembelian_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rincian_pesanan_penjualan_barang_tab`
--
ALTER TABLE `rincian_pesanan_penjualan_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT for table `satuan_barang_tab`
--
ALTER TABLE `satuan_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stok_awal_barang_tab`
--
ALTER TABLE `stok_awal_barang_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stok_awal_jasa_tab`
--
ALTER TABLE `stok_awal_jasa_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_tab`
--
ALTER TABLE `supplier_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `syarat_pembayaran_tab`
--
ALTER TABLE `syarat_pembayaran_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tipe_pembayaran_tab`
--
ALTER TABLE `tipe_pembayaran_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
