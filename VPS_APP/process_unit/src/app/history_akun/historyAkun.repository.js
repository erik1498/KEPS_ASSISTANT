import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import { generateDatabaseName } from "../../utils/databaseUtil.js";
import { payrollPegawaiViewQueryBuilder } from "../../config/viewDatabase/payrollPegawaiViewQueryBuilder.js";

export const getHistoryAkunByUuidAndBulanRepo = async (uuid, bulan, tahun, search, req_id) => {
    const historyAkun = await db.query(
        `
            SELECT 
                res.*
            FROM
            (
                SELECT 
                    jut.uuid,
                    jut.bukti_transaksi,
                    jut.tanggal,
                    jut.bulan,
                    jut.tahun,
                    jut.waktu,
                    jut.transaksi,
                    jut.debet,
                    jut.kredit,
                    kapt.code AS kode_akun,
                    kapt.name AS nama_akun,
                    kapt.type AS type_akun,
                    jut.uraian,
                    "JURNAL UMUM" AS sumber,
                    jut.enabled
                FROM ${generateDatabaseName(req_id)}.jurnal_umum_tab jut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = jut.kode_akun_uuid
                WHERE kapt.enabled = 1 AND jut.enabled = 1
                UNION ALL
                SELECT 
                    tkt.uuid,
                    tkt.bukti_transaksi,
                    LPAD(DATE(tkt.tanggal), 2, '0') AS tanggal,
                    LPAD(MONTH(tkt.tanggal), 2, '0') AS bulan,
                    YEAR(tkt.tanggal) AS tahun,
                    TIME(tkt.tanggal) AS waktu,
                    0 AS transaksi,
                    CASE 
                        WHEN tkt.type = 1
                        THEN tkt.nilai
                        ELSE 0
                    END AS debet,
                    CASE 
                        WHEN tkt.type = 0
                        THEN tkt.nilai
                        ELSE 0
                    END AS kredit,
                    kapt.code AS kode_akun,
                    kapt.name AS nama_akun,
                    kapt.type AS type_akun,
                    tkt.uraian,
                    "TRANSAKSI KAS" AS sumber,
                    tkt.enabled 
                FROM ${generateDatabaseName(req_id)}.transaksi_kas_tab tkt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tkt.kode_akun_perkiraan 
                WHERE tkt.enabled = 1
                UNION ALL
                SELECT 
                    rtkt.uuid,
                    tkt.bukti_transaksi,
                    LPAD(DATE(tkt.tanggal), 2, '0') AS tanggal,
                    LPAD(MONTH(tkt.tanggal), 2, '0') AS bulan,
                    YEAR(tkt.tanggal) AS tahun,
                    rtkt.waktu,
                    0 AS transaksi,
                    CASE 
                        WHEN tkt.type = 2
                        THEN rtkt.nilai
                        ELSE 0
                    END AS debet,
                    CASE 
                        WHEN tkt.type = 1
                        THEN rtkt.nilai
                        ELSE 0
                    END AS kredit,
                    kapt.code AS kode_akun,
                    kapt.name AS nama_akun,
                    kapt.type AS type_akun,
                    rtkt.uraian,
                    "TRANSAKSI KAS" AS sumber,
                    rtkt.enabled 
                FROM ${generateDatabaseName(req_id)}.rincian_transaksi_kas_tab rtkt 
                JOIN ${generateDatabaseName(req_id)}.transaksi_kas_tab tkt ON tkt.uuid = rtkt.transaksi_kas 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = rtkt.kode_akun_perkiraan 
                WHERE rtkt.enabled = 1 AND tkt.enabled = 1
                UNION ALL
                SELECT 
                    tbt.uuid,
                    tbt.bukti_transaksi,
                    LPAD(DATE(tbt.tanggal), 2, '0') AS tanggal,
                    LPAD(MONTH(tbt.tanggal), 2, '0') AS bulan,
                    YEAR(tbt.tanggal) AS tahun,
                    TIME(tbt.tanggal) AS waktu,
                    0 AS transaksi,
                    CASE 
                        WHEN tbt.type = 1
                        THEN tbt.nilai
                        ELSE 0
                    END AS debet,
                    CASE 
                        WHEN tbt.type = 0
                        THEN tbt.nilai
                        ELSE 0
                    END AS kredit,
                    kapt.code AS kode_akun,
                    kapt.name AS nama_akun,
                    kapt.type AS type_akun,
                    tbt.uraian,
                    "TRANSAKSI KAS" AS sumber,
                    tbt.enabled 
                FROM ${generateDatabaseName(req_id)}.transaksi_bank_tab tbt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tbt.kode_akun_perkiraan 
                WHERE tbt.enabled = 1
                UNION ALL
                SELECT 
                    rtbt.uuid,
                    tbt.bukti_transaksi,
                    LPAD(DATE(tbt.tanggal), 2, '0') AS tanggal,
                    LPAD(MONTH(tbt.tanggal), 2, '0') AS bulan,
                    YEAR(tbt.tanggal) AS tahun,
                    rtbt.waktu,
                    0 AS transaksi,
                    CASE 
                        WHEN tbt.type = 2
                        THEN rtbt.nilai
                        ELSE 0
                    END AS debet,
                    CASE 
                        WHEN tbt.type = 1
                        THEN rtbt.nilai
                        ELSE 0
                    END AS kredit,
                    kapt.code AS kode_akun,
                    kapt.name AS nama_akun,
                    kapt.type AS type_akun,
                    rtbt.uraian,
                    "TRANSAKSI KAS" AS sumber,
                    rtbt.enabled 
                FROM ${generateDatabaseName(req_id)}.rincian_transaksi_bank_tab rtbt 
                JOIN ${generateDatabaseName(req_id)}.transaksi_bank_tab tbt ON tbt.uuid = rtbt.transaksi_bank 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = rtbt.kode_akun_perkiraan 
                WHERE rtbt.enabled = 1 AND tbt.enabled = 1
                UNION ALL -- PAYROLL START
                ${payrollPegawaiViewQueryBuilder(req_id)}
                UNION ALL -- PERINTAH STOK OPNAME START
                SELECT 
                    psojt.uuid,
                    psojt.bukti_transaksi,
                    LPAD(DAY(psojt.tanggal), 2, '0') AS tanggal,
                    LPAD(MONTH(psojt.tanggal), 2, '0') AS bulan,
                    YEAR(psojt.tanggal) AS tahun,
                    TIME(psojt.tanggal) AS waktu,
                    psojt.transaksi,
                    psojt.debet,
                    psojt.kredit,
                    kapt.code AS kode_akun,
                    kapt.name AS nama_akun,
                    kapt.type AS type_akun,
                    JSON_OBJECT(
                        'detail', psojt.detail_data
                    ) AS uraian,
                    psojt.sumber,
                    psojt.enabled 
                FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_jurnal_tab psojt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = psojt.kode_akun_perkiraan 
                UNION ALL -- JURNAL PENYUSUTAN ASET
                SELECT 
                    "NOT_AVAILABLE" AS uuid,
                    dpt.nomor_invoice AS bukti_transaksi,
                    LPAD(DAY(dpt.tanggal_beli), 2, '0') AS tanggal,
                    LPAD(MONTH(dpt.tanggal_beli), 2, '0') AS bulan,
                    YEAR(dpt.tanggal_beli) AS tahun,
                    TIME(dpt.tanggal_beli) AS waktu,
                    0 AS transaksi,
                    dpt.kuantitas * dpt.harga_satuan AS debet,
                    0 AS kredit,
                    kapt.code AS kode_akun,
                    kapt.name AS nama_akun,
                    kapt.type AS type_akun,
                    JSON_OBJECT(
                        'detail', JSON_OBJECT (
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
                        )
                    ) AS uraian,
                    "PEMBELIAN PERLENGKAPAN" AS sumber,
                    dpt.enabled
                FROM ${generateDatabaseName(req_id)}.daftar_perlengkapan_tab dpt 
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dpt.supplier 
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dpt.satuan_barang 
                JOIN ${generateDatabaseName(req_id)}.kategori_perlengkapan_tab kpt ON kpt.uuid = dpt.kategori_perlengkapan 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "c85ac20d-1b1e-45c5-80e1-8db80c5dd283"
                AND dpt.enabled = 1
                UNION ALL
                SELECT 
                    "NOT_AVAILABLE" AS uuid,
                    dpt.nomor_invoice AS bukti_transaksi,
                    LPAD(DAY(dpt.tanggal_beli), 2, '0') AS tanggal,
                    LPAD(MONTH(dpt.tanggal_beli), 2, '0') AS bulan,
                    YEAR(dpt.tanggal_beli) AS tahun,
                    TIME(dpt.tanggal_beli) AS waktu,
                    0 AS transaksi,
                    0 AS debet,
                    dpt.kuantitas * dpt.harga_satuan AS kredit,
                    kapt.code AS kode_akun,
                    kapt.name AS nama_akun,
                    kapt.type AS type_akun,
                    JSON_OBJECT(
                        'detail', JSON_OBJECT (
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
                        )
                    ) AS uraian,
                    "PEMBELIAN PERLENGKAPAN" AS sumber,
                    dpt.enabled
                FROM ${generateDatabaseName(req_id)}.daftar_perlengkapan_tab dpt 
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dpt.supplier 
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dpt.satuan_barang 
                JOIN ${generateDatabaseName(req_id)}.kategori_perlengkapan_tab kpt ON kpt.uuid = dpt.kategori_perlengkapan 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "6e376191-0454-4172-a78b-2bc5f9c8fd6e"
                AND dpt.enabled = 1
                UNION ALL
                SELECT 
                    "NOT_AVAILABLE" AS uuid,
                    dat.nomor_invoice AS bukti_transaksi,
                    LPAD(DAY(dat.tanggal_beli), 2, '0') AS tanggal,
                    LPAD(MONTH(dat.tanggal_beli), 2, '0') AS bulan,
                    YEAR(dat.tanggal_beli) AS tahun,
                    TIME(dat.tanggal_beli) AS waktu,
                    0 AS transaksi,
                    dat.harga_satuan * dat.kuantitas AS debet,
                    0 AS kredit,
                    kapt.code AS kode_akun,
                    kapt.name AS nama_akun,
                    kapt.type AS type_akun,
                    JSON_OBJECT(
                        'detail', JSON_OBJECT (
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
                        )
                    ) AS uraian,
                    "PEMBELIAN ASET" AS sumber,
                    dat.enabled 
                FROM ${generateDatabaseName(req_id)}.daftar_aset_tab dat 
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dat.satuan_barang
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dat.supplier 
                JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = dat.metode_penyusutan 
                JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = dat.kelompok_aset
                JOIN ${generateDatabaseName(req_id)}.kategori_aset_tab kat2 ON kat2.uuid = dat.kategori_aset 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "a88b16d3-4071-4503-9c5b-17cdac4a411f"
                AND dat.enabled = 1
                UNION ALL
                SELECT 
                    "NOT_AVAILABLE" AS uuid,
                    dat.nomor_invoice AS bukti_transaksi,
                    LPAD(DAY(dat.tanggal_beli), 2, '0') AS tanggal,
                    LPAD(MONTH(dat.tanggal_beli), 2, '0') AS bulan,
                    YEAR(dat.tanggal_beli) AS tahun,
                    TIME(dat.tanggal_beli) AS waktu,
                    1 AS transaksi,
                    0 AS debet,
                    dat.harga_satuan * dat.kuantitas AS kredit,
                    kapt.code AS kode_akun,
                    kapt.name AS nama_akun,
                    kapt.type AS type_akun,
                    JSON_OBJECT(
                        'detail', JSON_OBJECT (
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
                        )
                    ) AS uraian,
                    "PEMBELIAN ASET" AS sumber,
                    dat.enabled 
                FROM ${generateDatabaseName(req_id)}.daftar_aset_tab dat 
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dat.satuan_barang
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dat.supplier 
                JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = dat.metode_penyusutan 
                JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = dat.kelompok_aset
                JOIN ${generateDatabaseName(req_id)}.kategori_aset_tab kat2 ON kat2.uuid = dat.kategori_aset 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = dat.kode_akun_perkiraan
                AND dat.enabled = 1
                UNION ALL
                SELECT 
                    "NOT_AVAILABLE" AS uuid,
                    CONCAT("HP", dat.nomor_invoice) AS bukti_transaksi,
                    LPAD(hpt.tanggal, 2, '0') AS tanggal,
                    LPAD(hpt.bulan, 2, '0') AS bulan,
                    hpt.tahun AS tahun,
                    TIME(dat.tanggal_beli) AS waktu,
                    0 AS transaksi,
                    CASE
                        WHEN hpt.nilai_penyusutan > 0
                        THEN hpt.nilai_penyusutan * dat.kuantitas 
                        ELSE 0
                    END AS debet,
                    0 AS kredit,
                    kapt.code AS kode_akun,
                    kapt.name AS nama_akun,
                    kapt.type AS type_akun,
                    JSON_OBJECT(
                        'detail', JSON_OBJECT (
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
                        )
                    ) AS uraian,
                    "HITUNGAN PENYUSUTAN ASET" AS sumber,
                    dat.enabled 
                FROM ${generateDatabaseName(req_id)}.hitungan_penyusutan_tab hpt 
                JOIN ${generateDatabaseName(req_id)}.daftar_aset_tab dat ON dat.uuid = hpt.daftar_aset 
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dat.satuan_barang
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dat.supplier 
                JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = dat.metode_penyusutan 
                JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = dat.kelompok_aset
                JOIN ${generateDatabaseName(req_id)}.kategori_aset_tab kat2 ON kat2.uuid = dat.kategori_aset 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "915ac6e8-c528-4f10-9215-74fda0b1c99e"
                AND hpt.enabled = 1
                AND dat.enabled = 1
                UNION ALL
                SELECT 
                    "NOT_AVAILABLE" AS uuid,
                    CONCAT("HP", dat.nomor_invoice) AS bukti_transaksi,
                    LPAD(hpt.tanggal, 2, '0') AS tanggal,
                    LPAD(hpt.bulan, 2, '0') AS bulan,
                    hpt.tahun AS tahun,
                    TIME(dat.tanggal_beli) AS waktu,
                    1 AS transaksi,
                    0 AS debet,
                    CASE
                        WHEN hpt.nilai_penyusutan > 0
                        THEN hpt.nilai_penyusutan * dat.kuantitas 
                        ELSE 0
                    END AS kredit,
                    kapt.code AS kode_akun,
                    kapt.name AS nama_akun,
                    kapt.type AS type_akun,
                    JSON_OBJECT(
                        'detail', JSON_OBJECT (
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
                        )
                    ) AS uraian,
                    "HITUNGAN PENYUSUTAN ASET" AS sumber,
                    dat.enabled 
                FROM ${generateDatabaseName(req_id)}.hitungan_penyusutan_tab hpt 
                JOIN ${generateDatabaseName(req_id)}.daftar_aset_tab dat ON dat.uuid = hpt.daftar_aset 
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dat.satuan_barang
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dat.supplier 
                JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = dat.metode_penyusutan 
                JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = dat.kelompok_aset
                JOIN ${generateDatabaseName(req_id)}.kategori_aset_tab kat2 ON kat2.uuid = dat.kategori_aset 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "a88b16d3-4071-4503-9c5b-17cdac4a411f"
                AND hpt.enabled = 1
                AND dat.enabled = 1
            ) AS res
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.code = res.kode_akun
            WHERE res.bulan = "${bulan}" AND res.tahun = "${tahun}"
            AND kapt.uuid = "${uuid}"
            ORDER BY res.tahun ASC, res.bulan ASC, res.tanggal ASC, res.waktu ASC, res.transaksi ASC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return historyAkun
}