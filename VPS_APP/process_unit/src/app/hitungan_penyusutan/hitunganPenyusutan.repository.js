import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import HitunganPenyusutanModel from "./hitunganPenyusutan.model.js";
import { generateDatabaseName, insertQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getJurnalHitunganPenyusutanRepo = async (bulan, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                res.*
            FROM (
                SELECT 
                    "NOT_AVAILABLE" AS uuid,
                    ppt.bukti_transaksi AS bukti_transaksi,
                    LPAD(DAY(ppt.tanggal), 2, '0') AS tanggal,
                    LPAD(MONTH(ppt.tanggal), 2, '0') AS bulan,
                    YEAR(ppt.tanggal) AS tahun,
                    TIME(ppt.tanggal) AS waktu,
                    0 AS transaksi,
                    ppt.jumlah  * dpt.harga_satuan AS debet,
                    0 AS kredit,
                    kapt.name AS nama_akun,
                    kapt.code AS kode_akun,
                    kapt.type AS type_akun,
                    kapt.uuid AS uuid_akun,
                    NULL AS uraian,
                    JSON_OBJECT (
                        'kuantitas', ppt.jumlah,
                        'keterangan', ppt.keterangan,
                        'harga_satuan', dpt.harga_satuan,
                        'dpp', dpt.dpp,
                        'ppn', dpt.ppn,
                        'kategori_perlengkaan', kpt.name,
                        'daftar_perlengkapan_name', dpt.name,
                        'daftar_perlengkapan_invoice', dpt.nomor_invoice
                    ) AS detail_data,
                    "PENGGUNAAN PERLENGKAPAN" AS sumber
                FROM ${generateDatabaseName(req_id)}.penggunaan_perlengkapan_tab ppt 
                JOIN ${generateDatabaseName(req_id)}.daftar_perlengkapan_tab dpt ON dpt.uuid = ppt.daftar_perlengkapan 
                JOIN ${generateDatabaseName(req_id)}.kategori_perlengkapan_tab kpt ON kpt.uuid = dpt.kategori_perlengkapan 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "6e376191-0454-4172-a78b-2bc5f9c8fd6e" 
                WHERE ppt.enabled = 1
                AND dpt.enabled = 1 
                AND MONTH(ppt.tanggal) = ${bulan}
                AND YEAR(ppt.tanggal) = ${tahun}
                UNION ALL
                SELECT 
                    "NOT_AVAILABLE" AS uuid,
                    ppt.bukti_transaksi AS bukti_transaksi,
                    LPAD(DAY(ppt.tanggal), 2, '0') AS tanggal,
                    LPAD(MONTH(ppt.tanggal), 2, '0') AS bulan,
                    YEAR(ppt.tanggal) AS tahun,
                    TIME(ppt.tanggal) AS waktu,
                    1 AS transaksi,
                    0 AS debet,
                    ppt.jumlah  * dpt.harga_satuan AS kredit,
                    kapt.name AS nama_akun,
                    kapt.code AS kode_akun,
                    kapt.type AS type_akun,
                    kapt.uuid AS uuid_akun,
                    NULL AS uraian,
                    JSON_OBJECT (
                        'kuantitas', ppt.jumlah,
                        'keterangan', ppt.keterangan,
                        'harga_satuan', dpt.harga_satuan,
                        'dpp', dpt.dpp,
                        'ppn', dpt.ppn,
                        'kategori_perlengkaan', kpt.name,
                        'daftar_perlengkapan_name', dpt.name,
                        'daftar_perlengkapan_invoice', dpt.nomor_invoice
                    ) AS detail_data,
                    "PENGGUNAAN PERLENGKAPAN" AS sumber
                FROM ${generateDatabaseName(req_id)}.penggunaan_perlengkapan_tab ppt 
                JOIN ${generateDatabaseName(req_id)}.daftar_perlengkapan_tab dpt ON dpt.uuid = ppt.daftar_perlengkapan 
                JOIN ${generateDatabaseName(req_id)}.kategori_perlengkapan_tab kpt ON kpt.uuid = dpt.kategori_perlengkapan 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kpt.kode_akun_perkiraan 
                WHERE ppt.enabled = 1
                AND dpt.enabled = 1 
                AND MONTH(ppt.tanggal) = ${bulan}
                AND YEAR(ppt.tanggal) = ${tahun}
                UNION ALL
                SELECT 
                    "NOT_AVAILABLE" AS uuid,
                    dpt.bukti_transaksi AS bukti_transaksi,
                    LPAD(DAY(dpt.tanggal_beli), 2, '0') AS tanggal,
                    LPAD(MONTH(dpt.tanggal_beli), 2, '0') AS bulan,
                    YEAR(dpt.tanggal_beli) AS tahun,
                    TIME(dpt.tanggal_beli) AS waktu,
                    0 AS transaksi,
                    dpt.kuantitas * dpt.harga_satuan AS debet,
                    0 AS kredit,
                    kapt.name AS nama_akun,
                    kapt.code AS kode_akun,
                    kapt.type AS type_akun,
                    kapt.uuid AS uuid_akun,
                    NULL AS uraian,
                    JSON_OBJECT (
                        'satuan_barang_name', sbt.name,
                        'kuantitas', dpt.kuantitas,
                        'harga_satuan', dpt.harga_satuan,
                        'dpp', dpt.dpp,
                        'ppn', dpt.ppn,
                        'kategori_perlengkaan', kpt.name,
                        'supplier_name', st.name,
                        'supplier_code', st.code,
                        'daftar_perlengkapan_name', dpt.name,
                        'daftar_perlengkapan_invoice', dpt.nomor_invoice
                    ) AS detail_data,
                    "PEMBELIAN PERLENGKAPAN" AS sumber
                FROM ${generateDatabaseName(req_id)}.daftar_perlengkapan_tab dpt 
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dpt.supplier 
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dpt.satuan_barang 
                JOIN ${generateDatabaseName(req_id)}.kategori_perlengkapan_tab kpt ON kpt.uuid = dpt.kategori_perlengkapan 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kpt.kode_akun_perkiraan 
                WHERE MONTH(dpt.tanggal_beli) = ${bulan}
                AND YEAR(dpt.tanggal_beli) = ${tahun}
                AND dpt.enabled = 1
                UNION ALL
                SELECT 
                    "NOT_AVAILABLE" AS uuid,
                    dpt.bukti_transaksi AS bukti_transaksi,
                    LPAD(DAY(dpt.tanggal_beli), 2, '0') AS tanggal,
                    LPAD(MONTH(dpt.tanggal_beli), 2, '0') AS bulan,
                    YEAR(dpt.tanggal_beli) AS tahun,
                    TIME(dpt.tanggal_beli) AS waktu,
                    1 AS transaksi,
                    0 AS debet,
                    dpt.kuantitas * dpt.harga_satuan AS kredit,
                    kapt.name AS nama_akun,
                    kapt.code AS kode_akun,
                    kapt.type AS type_akun,
                    kapt.uuid AS uuid_akun,
                    NULL AS uraian,
                    JSON_OBJECT (
                        'satuan_barang_name', sbt.name,
                        'kuantitas', dpt.kuantitas,
                        'harga_satuan', dpt.harga_satuan,
                        'dpp', dpt.dpp,
                        'ppn', dpt.ppn,
                        'kategori_perlengkaan', kpt.name,
                        'supplier_name', st.name,
                        'supplier_code', st.code,
                        'daftar_perlengkapan_name', dpt.name,
                        'daftar_perlengkapan_invoice', dpt.nomor_invoice
                    ) AS detail_data,
                    "PEMBELIAN PERLENGKAPAN" AS sumber
                FROM ${generateDatabaseName(req_id)}.daftar_perlengkapan_tab dpt 
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dpt.supplier 
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dpt.satuan_barang 
                JOIN ${generateDatabaseName(req_id)}.kategori_perlengkapan_tab kpt ON kpt.uuid = dpt.kategori_perlengkapan 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = dpt.kode_akun_perkiraan 
                WHERE MONTH(dpt.tanggal_beli) = ${bulan}
                AND YEAR(dpt.tanggal_beli) = ${tahun}
                AND dpt.enabled = 1
                UNION ALL
                SELECT 
                    "NOT_AVAILABLE" AS uuid,
                    dat.bukti_transaksi AS bukti_transaksi,
                    LPAD(DAY(dat.tanggal_beli), 2, '0') AS tanggal,
                    LPAD(MONTH(dat.tanggal_beli), 2, '0') AS bulan,
                    YEAR(dat.tanggal_beli) AS tahun,
                    TIME(dat.tanggal_beli) AS waktu,
                    0 AS transaksi,
                    dat.harga_satuan * dat.kuantitas AS debet,
                    0 AS kredit,
                    kapt.name AS nama_akun,
                    kapt.code AS kode_akun,
                    kapt.type AS type_akun,
                    kapt.uuid AS uuid_akun,
                    NULL AS uraian,
                    JSON_OBJECT (
                        'satuan_barang_name', sbt.name,
                        'kuantitas', dat.kuantitas,
                        'harga_satuan', dat.harga_satuan,
                        'dpp', dat.dpp,
                        'ppn', dat.ppn,
                        'metode_penyusutan', mpt.name,
                        'kelompok_aset', kat.name,
                        'kategori_aset', kat2.name,
                        'supplier_name', st.name,
                        'supplier_code', st.code,
                        'daftar_aset_name', dat.name,
                        'daftar_aset_invoice', dat.nomor_invoice
                    ) AS detail_data,
                    "PEMBELIAN ASET" AS sumber
                FROM ${generateDatabaseName(req_id)}.daftar_aset_tab dat 
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dat.satuan_barang
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dat.supplier 
                JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = dat.metode_penyusutan 
                JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = dat.kelompok_aset
                JOIN ${generateDatabaseName(req_id)}.kategori_aset_tab kat2 ON kat2.uuid = dat.kategori_aset 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kat2.kode_akun_perkiraan_debet
                WHERE MONTH(dat.tanggal_beli) = ${bulan}
                AND YEAR(dat.tanggal_beli) = ${tahun}
                AND dat.enabled = 1
                UNION ALL
                SELECT 
                    "NOT_AVAILABLE" AS uuid,
                    dat.bukti_transaksi AS bukti_transaksi,
                    LPAD(DAY(dat.tanggal_beli), 2, '0') AS tanggal,
                    LPAD(MONTH(dat.tanggal_beli), 2, '0') AS bulan,
                    YEAR(dat.tanggal_beli) AS tahun,
                    TIME(dat.tanggal_beli) AS waktu,
                    1 AS transaksi,
                    0 AS debet,
                    dat.harga_satuan * dat.kuantitas AS kredit,
                    kapt.name AS nama_akun,
                    kapt.code AS kode_akun,
                    kapt.type AS type_akun,
                    kapt.uuid AS uuid_akun,
                    NULL AS uraian,
                    JSON_OBJECT (
                        'satuan_barang_name', sbt.name,
                        'kuantitas', dat.kuantitas,
                        'harga_satuan', dat.harga_satuan,
                        'dpp', dat.dpp,
                        'ppn', dat.ppn,
                        'metode_penyusutan', mpt.name,
                        'kelompok_aset', kat.name,
                        'kategori_aset', kat2.name,
                        'supplier_name', st.name,
                        'supplier_code', st.code,
                        'daftar_aset_name', dat.name,
                        'daftar_aset_invoice', dat.nomor_invoice
                    ) AS detail_data,
                    "PEMBELIAN ASET" AS sumber
                FROM ${generateDatabaseName(req_id)}.daftar_aset_tab dat 
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dat.satuan_barang
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dat.supplier 
                JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = dat.metode_penyusutan 
                JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = dat.kelompok_aset
                JOIN ${generateDatabaseName(req_id)}.kategori_aset_tab kat2 ON kat2.uuid = dat.kategori_aset 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = dat.kode_akun_perkiraan
                WHERE MONTH(dat.tanggal_beli) = ${bulan}
                AND YEAR(dat.tanggal_beli) = ${tahun}
                AND dat.enabled = 1
                UNION ALL
                SELECT 
                    "NOT_AVAILABLE" AS uuid,
                    CONCAT("HP", dat.nomor_invoice) AS bukti_transaksi,
                    hpt.tanggal AS tanggal,
                    hpt.bulan AS bulan,
                    hpt.tahun AS tahun,
                    TIME(dat.tanggal_beli) AS waktu,
                    0 AS transaksi,
                    CASE
                        WHEN hpt.nilai_penyusutan > 0
                        THEN hpt.nilai_penyusutan * dat.kuantitas 
                        ELSE 0
                    END AS debet,
                    0 AS kredit,
                    kapt.name AS nama_akun,
                    kapt.code AS kode_akun,
                    kapt.type AS type_akun,
                    kapt.uuid AS uuid_akun,
                    NULL AS uraian,
                    JSON_OBJECT (
                        'satuan_barang_name', sbt.name,
                        'kuantitas', dat.kuantitas,
                        'harga_satuan', dat.harga_satuan,
                        'dpp', dat.dpp,
                        'ppn', dat.ppn,
                        'metode_penyusutan', mpt.name,
                        'kelompok_aset', kat.name,
                        'kategori_aset', kat2.name,
                        'supplier_name', st.name,
                        'supplier_code', st.code,
                        'daftar_aset_name', dat.name,
                        'daftar_aset_invoice', dat.nomor_invoice
                    ) AS detail_data,
                    "HITUNGAN PENYUSUTAN ASET" AS sumber
                FROM ${generateDatabaseName(req_id)}.hitungan_penyusutan_tab hpt 
                JOIN ${generateDatabaseName(req_id)}.daftar_aset_tab dat ON dat.uuid = hpt.daftar_aset 
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dat.satuan_barang
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dat.supplier 
                JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = dat.metode_penyusutan 
                JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = dat.kelompok_aset
                JOIN ${generateDatabaseName(req_id)}.kategori_aset_tab kat2 ON kat2.uuid = dat.kategori_aset 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kat2.kode_akun_perkiraan_kredit
                WHERE hpt.tahun = ${tahun}
                AND hpt.bulan = ${bulan} 
                AND hpt.enabled = 1
                AND dat.enabled = 1
                UNION ALL
                SELECT 
                    "NOT_AVAILABLE" AS uuid,
                    CONCAT("HP", dat.nomor_invoice) AS bukti_transaksi,
                    hpt.tanggal AS tanggal,
                    hpt.bulan AS bulan,
                    hpt.tahun AS tahun,
                    TIME(dat.tanggal_beli) AS waktu,
                    1 AS transaksi,
                    0 AS debet,
                    CASE
                        WHEN hpt.nilai_penyusutan > 0
                        THEN hpt.nilai_penyusutan * dat.kuantitas 
                        ELSE 0
                    END AS kredit,
                    kapt.name AS nama_akun,
                    kapt.code AS kode_akun,
                    kapt.type AS type_akun,
                    kapt.uuid AS uuid_akun,
                    NULL AS uraian,
                    JSON_OBJECT (
                        'satuan_barang_name', sbt.name,
                        'kuantitas', dat.kuantitas,
                        'harga_satuan', dat.harga_satuan,
                        'dpp', dat.dpp,
                        'ppn', dat.ppn,
                        'metode_penyusutan', mpt.name,
                        'kelompok_aset', kat.name,
                        'kategori_aset', kat2.name,
                        'supplier_name', st.name,
                        'supplier_code', st.code,
                        'daftar_aset_name', dat.name,
                        'daftar_aset_invoice', dat.nomor_invoice
                    ) AS detail_data,
                    "HITUNGAN PENYUSUTAN ASET" AS sumber
                FROM ${generateDatabaseName(req_id)}.hitungan_penyusutan_tab hpt 
                JOIN ${generateDatabaseName(req_id)}.daftar_aset_tab dat ON dat.uuid = hpt.daftar_aset 
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dat.satuan_barang
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dat.supplier 
                JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = dat.metode_penyusutan 
                JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = dat.kelompok_aset
                JOIN ${generateDatabaseName(req_id)}.kategori_aset_tab kat2 ON kat2.uuid = dat.kategori_aset 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kat2.kode_akun_perkiraan_debet
                WHERE hpt.tahun = ${tahun}
                AND hpt.bulan = ${bulan} 
                AND hpt.enabled = 1
                AND dat.enabled = 1
            ) AS res
            ORDER BY res.tanggal ASC, res.transaksi ASC, res.debet DESC
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getHitunganPenyusutanByUuidRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                hpt.*
            FROM ${generateDatabaseName(req_id)}.hitungan_penyusutan_tab hpt 
            WHERE hpt.daftar_aset = "${uuid}"
            AND hpt.enabled = 1
            ORDER BY hpt.transaksi ASC 
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const createHitunganPenyusutanRepo = async (hitunganPenyusutanData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        HitunganPenyusutanModel,
        {
            daftar_aset: hitunganPenyusutanData.daftar_aset,
            transaksi: hitunganPenyusutanData.transaksi,
            tahun_perolehan: hitunganPenyusutanData.tahun_perolehan,
            tanggal: hitunganPenyusutanData.tanggal,
            bulan: hitunganPenyusutanData.bulan,
            tahun: hitunganPenyusutanData.tahun,
            harga_beli: hitunganPenyusutanData.harga_beli,
            masa_awal: hitunganPenyusutanData.masa_awal,
            masa_akhir: hitunganPenyusutanData.masa_akhir,
            nilai_buku: hitunganPenyusutanData.nilai_buku,
            nilai_penyusutan: hitunganPenyusutanData.nilai_penyusutan,
            persentase: hitunganPenyusutanData.persentase,
            metode_penyusutan: hitunganPenyusutanData.metode_penyusutan,
            akumulasi_penyusutan_awal_tahun: hitunganPenyusutanData.akumulasi_penyusutan_awal_tahun,
            persentase_penyusutan: hitunganPenyusutanData.persentase_penyusutan,
            nilai_buku_awal_tahun: hitunganPenyusutanData.nilai_buku_awal_tahun,
            nilai_buku_akhir_tahun: hitunganPenyusutanData.nilai_buku_akhir_tahun,
            enabled: hitunganPenyusutanData.enabled
        }
    )
}

export const deleteHitunganPenyusutanByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        HitunganPenyusutanModel,
        {
            enabled: false
        },
        {
            daftar_aset: uuid
        }
    )
}