import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PerintahStokOpnameModel from "./perintahStokOpname.model.js";
import { generateDatabaseName, getUserIdFromRequestIdentity, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { getTanggalTerakhirPadaBulan } from "../../utils/jurnalUmumUtil.js";
import { getDataFromPesananPenjualanBarangViewQuery } from "../../config/viewDatabase/pesananPenjualanBarangViewQueryBuilder.js";
import { getDataFromPelunasanPenjualanBarangViewQuery } from "../../config/viewDatabase/pelunasanPenjualanBarangViewQueryBuilder.js";
import { getDataFromPelunasanPenjualanDendaBarangViewQuery } from "../../config/viewDatabase/pelunasanPenjualanDendaBarangViewQueryBuilder.js";
import { getDataFromReturPenjualanBarangViewQuery } from "../../config/viewDatabase/returPenjualanBarangViewQueryBuilder.js";
import { getDataFrompengembalianDendaPenjualanBarangViewQuery } from "../../config/viewDatabase/pengembalianDendaPenjualanBarangViewQueryBuilder.js";
import { fakturPenjualanBarangQueryBuilder } from "../../config/viewDatabase/fakturPenjualanBarangViewQueryBuilder.js";

export const getAllPerintahStokOpnameRepo = async (pageNumber, size, search, tahun, req_id) => {
    const perintahStokOpnamesCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count 
            FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot 
            WHERE psot.tanggal LIKE '%${search}%'
            AND psot.enabled = 1
            AND psot.tahun = "${tahun}"
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : perintahStokOpnamesCount[0].count

    const perintahStokOpnames = await db.query(
        `
            SELECT 
                psot.*,
                IFNULL((
                    SELECT 
                        ppt.tanggal 
                    FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt 
                    WHERE ppt.perintah_stok_opname = psot.uuid 
                    AND ppt.enabled = 1
                    LIMIT 1
                ), "BELUM SELESAI") AS tanggal_selesai,
                IFNULL((
                    SELECT COUNT(0) FROM ${generateDatabaseName(req_id)}.hasil_stok_opname_tab hsot WHERE hsot.perintah_stok_opname = psot.uuid AND hsot.enabled = 1
                ), 0 ) AS hasil_stok_opname_count,
                IFNULL((
                    SELECT COUNT(0) FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt WHERE ppt.perintah_stok_opname = psot.uuid AND ppt.enabled = 1
                ), 0 ) AS penyesuaian_persediaan_count,
                (
                    SELECT hsot.tanggal FROM ${generateDatabaseName(req_id)}.hasil_stok_opname_tab hsot WHERE hsot.perintah_stok_opname = psot.uuid AND hsot.enabled = 1 LIMIT 1
                ) AS hasil_stok_opname_tanggal,
                (
                    SELECT ppt.tanggal FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt WHERE ppt.perintah_stok_opname = psot.uuid AND ppt.enabled = 1 LIMIT 1
                ) AS penyesuaian_persediaan_tanggal,
                pt.name AS pegawai_penanggung_jawab_name,
                pt2.name AS pegawai_pelaksana_name,
                kbt.name AS kategori_barang_name,
                dgt.name AS daftar_gudang_name
            FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON psot.pegawai_penanggung_jawab = pt.uuid
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt2 ON psot.pegawai_pelaksana = pt2.uuid 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON psot.gudang_asal = dgt.uuid 
            JOIN ${generateDatabaseName(req_id)}.kategori_barang_tab kbt ON psot.kategori_barang = kbt.uuid 
            WHERE psot.tanggal LIKE '%${search}%'
            AND psot.enabled = 1 
            AND psot.tahun = "${tahun}"
            ORDER BY psot.tanggal ASC
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: perintahStokOpnames,
        count: perintahStokOpnamesCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPerintahStokOpnameByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PerintahStokOpnameModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const getPerintahStokOpnameByUUIDWithTanggalRepo = async (uuid, req_id) => {
    const perintahStokOpnames = await db.query(
        `
            SELECT 
                psot.*,
                IFNULL((
                    SELECT 
                        ppt.tanggal 
                    FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt 
                    WHERE ppt.perintah_stok_opname = psot.uuid 
                    AND ppt.enabled = 1
                    LIMIT 1
                ), "BELUM SELESAI") AS tanggal_selesai
            FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot
            WHERE psot.uuid = "${uuid}"
            AND psot.enabled = 1 
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return perintahStokOpnames
}

export const createPerintahStokOpnameRepo = async (perintahStokOpnameData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PerintahStokOpnameModel,
        {
            tanggal: perintahStokOpnameData.tanggal,
            bulan_transaksi: perintahStokOpnameData.bulan_transaksi,
            tahun: perintahStokOpnameData.tahun,
            nomor_surat_perintah: perintahStokOpnameData.nomor_surat_perintah,
            pegawai_penanggung_jawab: perintahStokOpnameData.pegawai_penanggung_jawab,
            pegawai_pelaksana: perintahStokOpnameData.pegawai_pelaksana,
            kategori_barang: perintahStokOpnameData.kategori_barang,
            gudang_asal: perintahStokOpnameData.gudang_asal,
            validasi: perintahStokOpnameData.validasi,
            enabled: perintahStokOpnameData.enabled
        }
    )
}

export const deletePerintahStokOpnameByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PerintahStokOpnameModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePerintahStokOpnameByUuidRepo = async (uuid, perintahStokOpnameData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PerintahStokOpnameModel,
        {
            tanggal: perintahStokOpnameData.tanggal,
            bulan_transaksi: perintahStokOpnameData.bulan_transaksi,
            tahun: perintahStokOpnameData.tahun,
            nomor_surat_perintah: perintahStokOpnameData.nomor_surat_perintah,
            pegawai_penanggung_jawab: perintahStokOpnameData.pegawai_penanggung_jawab,
            pegawai_pelaksana: perintahStokOpnameData.pegawai_pelaksana,
            kategori_barang: perintahStokOpnameData.kategori_barang,
            gudang_asal: perintahStokOpnameData.gudang_asal,
            validasi: perintahStokOpnameData.validasi,
        },
        {
            uuid
        }
    )
}

export const validasiPerintahStokOpnameByUuidRepo = async (perintahStokOpnameData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PerintahStokOpnameModel,
        {
            validasi: perintahStokOpnameData.validasi,
        },
        {
            uuid: perintahStokOpnameData.perintah_stok_opname
        }
    )
}

export const getStatusPerintahStokOpnameAktifByTanggalRepo = async (tanggal, uuid, req_id) => {
    return await db.query(
        `
            SELECT  
                psot.uuid,
                psot.tanggal,
                IFNULL((
                    SELECT 
                        ppt.tanggal 
                    FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt 
                    WHERE ppt.perintah_stok_opname = psot.uuid 
                    LIMIT 1
                ), "BELUM SELESAI") AS tanggal_selesai,
                psot.nomor_surat_perintah
            FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot 
            WHERE psot.bulan_transaksi = MONTH("${tanggal}")
            ${uuid ? `AND psot.uuid != "${uuid}"` : ``}
            AND psot.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const perintahStokOpnameStatusRepo = async (perintah_stok_opname, req_id) => {
    const perintahStokOpname = await db.query(
        `
            SELECT 
                (
                    SELECT 
                        COUNT(0) 
                    FROM ${generateDatabaseName(req_id)}.hasil_stok_opname_tab hsot
                    WHERE hsot.perintah_stok_opname = psot.uuid 
                    AND hsot.enabled = 1
                ) AS hasil_stok_opname,
                (
                    SELECT
                        COUNT(0)
                    FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt
                    WHERE ppt.perintah_stok_opname = psot.uuid 
                    AND ppt.enabled = 1
                ) AS penyesuaian_persediaan,
                (
                    SELECT 
                        COUNT(0)
                    FROM ${generateDatabaseName(req_id)}.neraca_tab nt 
                    WHERE nt.bulan = MONTH(psot.tanggal) AND nt.tahun = YEAR(psot.tanggal)
                ) AS status_validasi,
                YEAR(psot.tanggal) AS tahun,
                MONTH(psot.tanggal) AS bulan,
                psot.validasi
            FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot 
            WHERE psot.uuid = "${perintah_stok_opname}"
            AND psot.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return perintahStokOpname
}

export const getJurnalPerintahStokOpnameRepo = async (bulan, tahun, saveToPerintahStokOpnameJurnal, req_id) => {
    const pesananPenjualanBarangQuery = getDataFromPesananPenjualanBarangViewQuery(bulan, tahun, null, req_id)

    const pelunasanPenjualanBarangQuery = getDataFromPelunasanPenjualanBarangViewQuery(bulan, tahun, null, req_id)

    const pelunasanDendaPenjualanBarangQuery = getDataFromPelunasanPenjualanDendaBarangViewQuery(bulan, tahun, null, req_id)

    const returPenjualanBarangQuery = getDataFromReturPenjualanBarangViewQuery(bulan, tahun, null, req_id)

    const pengembalianDendaPenjualanBarangQuery = getDataFrompengembalianDendaPenjualanBarangViewQuery(bulan, tahun, null, req_id)

    const fakturPenjualanBarangDendaBulanIniQuery = fakturPenjualanBarangQueryBuilder(bulan, tahun, req_id)

    const queryList = [
        pesananPenjualanBarangQuery,
        pelunasanPenjualanBarangQuery,
        pelunasanDendaPenjualanBarangQuery,
        returPenjualanBarangQuery,
        pengembalianDendaPenjualanBarangQuery,
        fakturPenjualanBarangDendaBulanIniQuery
    ]

    const penjualanBarang = await db.query(
        `
            ${saveToPerintahStokOpnameJurnal ? `
                INSERT INTO 
                    ${generateDatabaseName(req_id)}.perintah_stok_opname_jurnal_tab
                (
                    uuid,
                    perintah_stok_opname, 
                    bukti_transaksi, 
                    bulan, 
                    detail_data, 
                    kode_akun_perkiraan,
                    debet,
                    kredit,
                    transaksi,
                    sumber, 
                    tahun, 
                    tanggal, 
                    uraian, 
                    enabled, 
                    createdBy, 
                    updatedBy, 
                    createdAt,
                    updatedAt
                )
                ` : ``}
            SELECT 
                ${saveToPerintahStokOpnameJurnal ? `
                        UUID() AS uuid,
                        "${saveToPerintahStokOpnameJurnal}" AS perintah_stok_opname,
                        res.bukti_transaksi,
                        res.bulan,
                        res.detail_data,
                        res.uuid_akun AS kode_akun_perkiraan,
                        res.debet,
                        res.kredit,
                        res.transaksi,
                        res.sumber,
                        res.tahun,
                        res.tanggal,
                        res.uraian,
                        1,
                        "${getUserIdFromRequestIdentity(req_id)}" AS createdBy,
                        "" AS updatedBy,
                        NOW() AS createdAt,
                        NOW() AS updatedBy
                    ` : `res.*`
        }
            FROM (
                ${queryList.join("UNION ALL")}
            ) AS res
            ORDER BY res.tanggal ASC, res.transaksi ASC
        `,
        {
            type: saveToPerintahStokOpnameJurnal ? Sequelize.QueryTypes.INSERT : Sequelize.QueryTypes.SELECT
        }
    )

    return penjualanBarang
}

export const getRincianPelunasanPenjualanJasaRepo = async (tanggal_mulai, tanggal_selesai, req_id) => {
    const fakturPenjualan = await db.query(
        `
            SELECT 
                res.uuid,
                res.bukti_transaksi,
                0 AS transaksi,
                res.tanggal,
                res.tanggal AS waktu,
                res.bulan,
                res.tahun,
                res.debet,
                res.kredit,
                res.kategori_harga_jasa_kode_jasa,
                res.pelunasan_penjualan_jasa,
                res.bukti_transaksi AS faktur_penjualan_jasa,	
                JSON_EXTRACT(res.kode_akun_detail, '$[3]') AS kode_akun,
                REPLACE(JSON_EXTRACT(res.kode_akun_detail, '$[1]'), '"', '') AS nama_akun,
                REPLACE(JSON_EXTRACT(res.kode_akun_detail, '$[2]'), '"', '') AS type_akun,
                res.uraian,
                res.sumber
            FROM (
                SELECT 
                    "NOT_AVAILABLE" AS uuid,
                    ppjt.bukti_transaksi AS bukti_transaksi,
                    ppjt.tanggal AS tanggal,
                    (
                        CASE WHEN MONTH(ppjt.tanggal) < 10 THEN CONCAT("0", MONTH(ppjt.tanggal)) ELSE MONTH(ppjt.tanggal) END
                    ) AS bulan,
                    CONCAT(YEAR(ppjt.tanggal), "")  AS tahun,
                    0 AS debet,
                    rppjt.nilai_pelunasan AS kredit,
                    ppjt.keterangan AS uraian,
                    khjt.kode_jasa AS kategori_harga_jasa_kode_jasa,
                    (
                        SELECT 
                            CONCAT('["', kapt.uuid, '","', kapt.name, '","', kapt.type, '",', kapt.code, ']')
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "453764da-957f-4099-a03d-268367987dc2"
                    ) AS kode_akun_detail,
                    ppjt.bukti_transaksi AS pelunasan_penjualan_jasa,
                    fpjt.bukti_transaksi AS faktur_penjualan_jasa,
                    "PELUNASAN PENJUALAN BARANG" AS sumber
                FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_jasa_tab rppjt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppjt2 ON rppjt2.uuid = rppjt.rincian_pesanan_penjualan_jasa 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppjt2 ON ppjt2.uuid = rppjt2.pesanan_penjualan_jasa 
                JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sajt ON sajt.uuid = rppjt2.stok_awal_jasa 
                JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khjt ON khjt.uuid = sajt.kategori_harga_jasa 
                JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppjt ON ppjt.uuid= rppjt.pelunasan_penjualan_jasa
                JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpjt ON fpjt.pesanan_penjualan_jasa =ppjt2.uuid 
                WHERE rppjt.enabled = 1
                AND ppjt.enabled = 1
                AND rppjt2.enabled = 1
                AND ppjt2.enabled = 1
                AND fpjt.enabled = 1
                AND ppjt.tanggal >= "${tanggal_mulai}" 
                AND ppjt.tanggal <= "${tanggal_selesai}"
            ) AS res
            UNION ALL
            SELECT 
                res.uuid,
                res.bukti_transaksi,
                0 AS transaksi,
                res.tanggal,
                res.tanggal AS waktu,
                res.bulan,
                res.tahun,
                res.debet,
                res.kredit,
                res.kategori_harga_jasa_kode_jasa,
                res.pelunasan_penjualan_jasa,
                res.bukti_transaksi AS faktur_penjualan_jasa,	
                JSON_EXTRACT(res.kode_akun_detail, '$[3]') AS kode_akun,
                REPLACE(JSON_EXTRACT(res.kode_akun_detail, '$[1]'), '"', '') AS nama_akun,
                REPLACE(JSON_EXTRACT(res.kode_akun_detail, '$[2]'), '"', '') AS type_akun,
                res.uraian,
                res.sumber
            FROM (
                SELECT 
                    "NOT_AVAILABLE" AS uuid,
                    ppjt.bukti_transaksi AS bukti_transaksi,
                    ppjt.tanggal AS tanggal,
                    (
                        CASE WHEN MONTH(ppjt.tanggal) < 10 THEN CONCAT("0", MONTH(ppjt.tanggal)) ELSE MONTH(ppjt.tanggal) END
                    ) AS bulan,
                    CONCAT(YEAR(ppjt.tanggal), "")  AS tahun,
                    rppjt.nilai_pelunasan AS debet,
                    0 AS kredit,
                    ppjt.keterangan AS uraian,
                    khjt.kode_jasa AS kategori_harga_jasa_kode_jasa,
                    (
                        SELECT 
                            CONCAT('["', kapt.uuid, '","', kapt.name, '","', kapt.type, '",', kapt.code, ']')
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "33105460-6ac0-4744-a56c-6822bb4d4ba3"
                    ) AS kode_akun_detail,
                    ppjt.bukti_transaksi AS pelunasan_penjualan_jasa,
                    fpjt.bukti_transaksi AS faktur_penjualan_jasa,
                    "PELUNASAN PENJUALAN BARANG" AS sumber
                FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_jasa_tab rppjt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppjt2 ON rppjt2.uuid = rppjt.rincian_pesanan_penjualan_jasa 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppjt2 ON ppjt2.uuid = rppjt2.pesanan_penjualan_jasa 
                JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sajt ON sajt.uuid = rppjt2.stok_awal_jasa 
                JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khjt ON khjt.uuid = sajt.kategori_harga_jasa 
                JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppjt ON ppjt.uuid= rppjt.pelunasan_penjualan_jasa
                JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpjt ON fpjt.pesanan_penjualan_jasa =ppjt2.uuid 
                WHERE rppjt.enabled = 1
                AND ppjt.enabled = 1
                AND rppjt2.enabled = 1
                AND ppjt2.enabled = 1
                AND fpjt.enabled = 1
                AND ppjt.tanggal >= "${tanggal_mulai}" 
                AND ppjt.tanggal <= "${tanggal_selesai}"
            ) AS res
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return fakturPenjualan
}

export const checkPerintahStokOpnameAktifRepo = async (tanggal, req_id) => {
    return await db.query(
        `
            SELECT 
                psot.*
            FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot 
            WHERE psot.tanggal_mulai_transaksi <= "${tanggal}"
            AND psot.tanggal_akhir_transaksi >= "${tanggal}"
            AND psot.enabled = 1
            AND psot.validasi = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiRepo = async (nomor_surat_perintah, bulan_transaksi, tahun, uuid, req_id) => {
    return await db.query(
        `
            SELECT
                psot.*
                ${bulan_transaksi.length > 2 ? `,
                    IFNULL((
                        SELECT COUNT(0) FROM ${generateDatabaseName(req_id)}.hasil_stok_opname_tab hsot WHERE hsot.perintah_stok_opname = psot.uuid AND hsot.enabled = 1
                    ), 0) AS hasil_stok_opname_count ` : ""
        }
            FROM (
                SELECT 
                    psot.* 
                FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot 
                WHERE psot.bulan_transaksi = ${bulan_transaksi.length > 2 ? `MONTH("${bulan_transaksi}")` : bulan_transaksi}
                ${nomor_surat_perintah ? `OR psot.nomor_surat_perintah = "${nomor_surat_perintah}"` : ``}
            ) AS psot
            WHERE psot.enabled = 1
            ${tahun ? `AND psot.tahun = ${tahun}` : `AND psot.tahun = YEAR("${bulan_transaksi}")`}
            ${uuid ? `AND psot.uuid != "${uuid}"` : ""}
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const checkPerintahStokOpnameSudahAdaBulanTransaksiSebelumOrSesudahRepo = async (uuid, sesudah, perintahStokOpname, req_id) => {
    return await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot 
            WHERE psot.bulan_transaksi ${sesudah ? ` > ${perintahStokOpname.bulan_transaksi}` : ` = ${perintahStokOpname.bulan_transaksi - 1}`}
            AND psot.enabled = 1
            AND psot.kategori_barang = "${perintahStokOpname.kategori_barang}"
            AND psot.gudang_asal = "${perintahStokOpname.gudang_asal}"
            ${uuid ? `AND psot.uuid != "${uuid}"` : ``}
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const removeJurnalPerintahStokOpanameRepo = async (uuid, req_id) => {
    return await db.query(
        `
            DELETE FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_jurnal_tab WHERE perintah_stok_opname = "${uuid}"
        `,
        {
            type: Sequelize.QueryTypes.DELETE
        }
    )
}

export const perintahStokOpnemeAllowToValidasiRepo = async (perintah_stok_opname, req_id) => {
    return await db.query(
        `
            SELECT 
                (
                    SELECT
                        psot2.nomor_surat_perintah
                    FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot2 
                    WHERE psot2.enabled = 1
                    AND psot2.validasi = 0
                    AND psot2.kategori_barang = psot.kategori_barang 
                    AND psot2.gudang_asal = psot.gudang_asal
                    AND psot2.bulan_transaksi = psot.bulan_transaksi - 1 
                    AND psot2.tahun = psot.tahun 
                    LIMIT 1
                ) AS sudah_divalidasi_bulan_sebelum,
                (
                    SELECT
                        psot2.nomor_surat_perintah
                    FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot2 
                    WHERE psot2.enabled = 1
                    AND psot2.validasi = 1
                    AND psot2.kategori_barang = psot.kategori_barang 
                    AND psot2.gudang_asal = psot.gudang_asal
                    AND psot2.bulan_transaksi = psot.bulan_transaksi + 1
                    AND psot2.tahun = psot.tahun 
                    LIMIT 1
                ) AS sudah_divalidasi_bulan_sesudah,
                IFNULL((
                    SELECT 
                        ppt.tanggal 
                    FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt 
                    WHERE ppt.perintah_stok_opname = psot.uuid 
                    AND ppt.enabled = 1
                    LIMIT 1
                ), "BELUM SELESAI") AS tanggal_selesai,
                psot.nomor_surat_perintah
            FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot 
            WHERE psot.uuid = "${perintah_stok_opname}"
            AND psot.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getCountOfViewRepo = async (query) => {
    return await db.query(
        query,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const createViewRepo = async (query) => {
    return await db.query(
        query,
        {
            type: Sequelize.QueryTypes.RAW
        }
    )
}