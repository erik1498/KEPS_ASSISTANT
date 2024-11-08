import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PerintahStokOpnameModel from "./perintahStokOpname.model.js";
import { generateDatabaseName, getUserIdFromRequestIdentity, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { getTanggalTerakhirPadaBulan } from "../../utils/jurnalUmumUtil.js";

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
    const pesananPenjualanBarangQuery = `
        SELECT 
            JSON_ARRAY(
                JSON_OBJECT (
                    'debet', rppbt.harga * rppbt.jumlah,
                    'kredit', 0,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "33105460-6ac0-4744-a56c-6822bb4d4ba3"		
                    )
                ),
                JSON_OBJECT (
                    'debet', 0,
                    'kredit', rppbt.harga * rppbt.jumlah,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "453764da-957f-4099-a03d-268367987dc2"	
                    )
                ),
                JSON_OBJECT (
                    'debet', rppbt.ppn * rppbt.jumlah,
                    'kredit', 0,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "33105460-6ac0-4744-a56c-6822bb4d4ba3"		
                    )
                ),
                JSON_OBJECT (
                    'debet', 0,
                    'kredit', rppbt.ppn * rppbt.jumlah,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "c457def6-7f3c-478d-9190-15ab0b70e630"	
                    )
                ),
                JSON_OBJECT (
                    'debet', rppbt.diskon_angka * rppbt.jumlah,
                    'kredit', 0,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "5b04e881-b908-4400-a7f4-b78c34cc7a8c"		
                    )
                ),
                JSON_OBJECT (
                    'debet', 0,
                    'kredit', rppbt.diskon_angka * rppbt.jumlah,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "33105460-6ac0-4744-a56c-6822bb4d4ba3"		
                    )
                ),
                JSON_OBJECT (
                    'debet', (rppbt.ppn - rppbt.ppn_setelah_diskon) * rppbt.jumlah,
                    'kredit', 0,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "5b04e881-b908-4400-a7f4-b78c34cc7a8c"		
                    )
                ),
                JSON_OBJECT (
                    'debet', 0,
                    'kredit', (rppbt.ppn - rppbt.ppn_setelah_diskon) * rppbt.jumlah,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "c457def6-7f3c-478d-9190-15ab0b70e630"		
                    )
                )
            ) AS detail_json,
            "NOT_AVAILABLE" AS uuid,
            fpbt.bukti_transaksi AS bukti_transaksi,
            fpbt.tanggal AS tanggal,
            (
                CASE WHEN MONTH(fpbt.tanggal) < 10 THEN CONCAT("0", MONTH(fpbt.tanggal)) ELSE MONTH(fpbt.tanggal) END
            ) AS bulan,
            YEAR(fpbt.tanggal) AS tahun,
            fpbt.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_barang_name', sbt.name,
                'faktur_penjualan_barang', fpbt.bukti_transaksi,
                'kategori_harga_barang_kode_barang', khbt.kode_barang,
                'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'daftar_gudang_name', dgt.name,
                'daftar_barang_name', dbt.name,
                'jumlah', rppbt.jumlah,
                'harga', rppbt.harga,
                'ppn', rppbt.ppn,
                'diskon_persentase', rppbt.diskon_persentase
            ) AS detail_data,
            "FAKTUR PENJUALAN BARANG" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
        JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
        JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
        JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
        WHERE ppbt.enabled = 1 
        AND rppbt.enabled = 1
        AND fpbt.enabled = 1
        AND MONTH(fpbt.tanggal) = ${bulan} 
        AND YEAR(fpbt.tanggal) = ${tahun}
    `

    const pelunasanPenjualanBarangQuery = `
        SELECT 
            JSON_ARRAY(
                JSON_OBJECT (
                    'debet', rppbt.nilai_pelunasan,
                    'kredit', 0,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = ppbt.kode_akun_perkiraan		
                    )
                ),
                JSON_OBJECT (
                    'debet', 0,
                    'kredit', rppbt.nilai_pelunasan,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "33105460-6ac0-4744-a56c-6822bb4d4ba3"		
                    )
                )
            ) AS detail_json,
            "NOT_AVAILABLE" AS uuid,
            ppbt.bukti_transaksi AS bukti_transaksi,
            ppbt.tanggal AS tanggal,
            (
                CASE WHEN MONTH(ppbt.tanggal) < 10 THEN CONCAT("0", MONTH(ppbt.tanggal)) ELSE MONTH(ppbt.tanggal) END
            ) AS bulan,
            YEAR(ppbt.tanggal) AS tahun,
            ppbt.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_barang_name', sbt.name,
                'faktur_penjualan_barang', fpbt.bukti_transaksi,
                'kategori_harga_barang_kode_barang', khbt.kode_barang,
                'pesanan_penjualan_barang', ppbt2.nomor_pesanan_penjualan_barang,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'daftar_gudang_name', dgt.name,
                'daftar_barang_name', dbt.name,
                'jumlah', rppbt2.jumlah,
                'harga', rppbt2.harga,
                'ppn', rppbt2.ppn,
                'diskon_persentase', rppbt2.diskon_persentase
            ) AS detail_data,
            "PELUNASAN PENJUALAN BARANG" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab rppbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt2 ON rppbt2.uuid = rppbt.rincian_pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt2.stok_awal_barang 
        JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
        JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
        JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt ON ppbt.uuid= rppbt.pelunasan_penjualan_barang
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt2.uuid 
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt2.customer 
        WHERE rppbt.enabled = 1
        AND ppbt.enabled = 1
        AND rppbt2.enabled = 1
        AND ppbt2.enabled = 1
        AND fpbt.enabled = 1
        AND MONTH(ppbt.tanggal) = ${bulan} 
        AND YEAR(ppbt.tanggal) = ${tahun}
    `

    const pelunasanDendaPenjualanBarangQuery = `
        SELECT 
            JSON_ARRAY(
                JSON_OBJECT (
                    'debet', rppdbt.nilai_pelunasan,
                    'kredit', 0,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "ddb0e69f-9704-4555-b427-5748365034f7"		
                    )
                ),
                JSON_OBJECT (
                    'debet', 0,
                    'kredit', rppdbt.nilai_pelunasan,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = ppbt2.kode_akun_perkiraan		
                    )
                )
            ) AS detail_json,
            "NOT_AVAILABLE" AS uuid,
            ppbt2.bukti_transaksi AS bukti_transaksi,
            ppbt2.tanggal AS tanggal,
            (
                CASE WHEN MONTH(ppbt2.tanggal) < 10 THEN CONCAT("0", MONTH(ppbt2.tanggal)) ELSE MONTH(ppbt2.tanggal) END
            ) AS bulan,
            YEAR(ppbt2.tanggal) AS tahun,
            ppbt2.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_barang_name', sbt.name,
                'faktur_penjualan_barang', fpbt.bukti_transaksi,
                'kategori_harga_barang_kode_barang', khbt.kode_barang,
                'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'daftar_gudang_name', dgt.name,
                'daftar_barang_name', dbt.name,
                'hari_terlewat', rppdbt.hari_terlewat,
                'jatuh_tempo', ADDDATE( fpbt.tanggal, INTERVAL spt.hari_kadaluarsa DAY ),
                'tanggal_faktur', fpbt.tanggal
            ) AS detail_data,
            "PELUNASAN DENDA PENJUALAN BARANG" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_barang_tab rppdbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt ON rppbt.uuid = rppdbt.rincian_pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
        JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
        JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
        JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 ON ppbt2.uuid= rppdbt.pelunasan_penjualan_barang
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
        JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpbt.syarat_pembayaran
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
        WHERE rppbt.enabled = 1
        AND ppbt.enabled = 1
        AND rppbt.enabled = 1
        AND ppbt2.enabled = 1
        AND fpbt.enabled = 1
        AND MONTH(ppbt2.tanggal) = ${bulan}
        AND YEAR(ppbt2.tanggal) = ${tahun}
    `

    const returPenjualanBarangQuery = `
        SELECT 
            JSON_ARRAY (
                JSON_OBJECT (
                    'debet', (
                        SELECT 
                            CASE 
                                WHEN (rppbt2.harga_setelah_diskon + rppbt2.ppn_setelah_diskon) * rrpbt.retur > rrpbt.nilai_retur 
                                THEN ((100 - rppbt2.diskon_persentase) * rrpbt.nilai_retur) / 100
                                ELSE rppbt2.harga_setelah_diskon  * rrpbt.retur
                            END
                    ),
                    'kredit', 0,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "f3827c1b-b8d8-4c1f-94e9-8249e9292a03"		
                    )
                ),
                JSON_OBJECT (
                    'debet', 0,
                    'kredit', (
                        SELECT 
                            CASE 
                                WHEN (rppbt2.harga_setelah_diskon + rppbt2.ppn_setelah_diskon) * rrpbt.retur > rrpbt.nilai_retur 
                                THEN ((100 - rppbt2.diskon_persentase) * rrpbt.nilai_retur) / 100
                                ELSE rppbt2.harga_setelah_diskon  * rrpbt.retur
                            END
                    ),
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = rpbt.kode_akun_perkiraan		
                    )
                ),
                JSON_OBJECT (
                    'debet', (
                        SELECT 
                            CASE 
                                WHEN (rppbt2.harga_setelah_diskon + rppbt2.ppn_setelah_diskon) * rrpbt.retur > rrpbt.nilai_retur 
                                THEN (rppbt2.diskon_persentase * rrpbt.nilai_retur) / 100
                                ELSE rppbt2.ppn_setelah_diskon  * rrpbt.retur
                            END
                    ),
                    'kredit', 0,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "c457def6-7f3c-478d-9190-15ab0b70e630"	
                    )
                ),
                JSON_OBJECT (
                    'debet', 0,
                    'kredit', (
                        SELECT 
                            CASE 
                                WHEN (rppbt2.harga_setelah_diskon + rppbt2.ppn_setelah_diskon) * rrpbt.retur > rrpbt.nilai_retur 
                                THEN (rppbt2.diskon_persentase * rrpbt.nilai_retur) / 100
                                ELSE rppbt2.ppn_setelah_diskon  * rrpbt.retur
                            END
                    ),
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = rpbt.kode_akun_perkiraan		
                    )
                )
            ) AS detail_json,
            "NOT_AVAILABLE" AS uuid,
            rpbt.bukti_transaksi AS bukti_transaksi,
            rpbt.tanggal AS tanggal,
            (
                CASE WHEN MONTH(rpbt.tanggal) < 10 THEN CONCAT("0", MONTH(rpbt.tanggal)) ELSE MONTH(rpbt.tanggal) END
            ) AS bulan,
            YEAR(rpbt.tanggal) AS tahun,
            rpbt.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_barang_name', sbt.name,
                'faktur_penjualan_barang', fpbt.bukti_transaksi,
                'kategori_harga_barang_kode_barang', khbt.kode_barang,
                'pesanan_penjualan_barang', ppbt2.nomor_pesanan_penjualan_barang,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'daftar_gudang_name', dgt.name,
                'daftar_barang_name', dbt.name,
                'jumlah', rrpbt.retur,
                'harga', rppbt2.harga,
                'ppn', rppbt2.ppn,
                'diskon_persentase', rppbt2.diskon_persentase
            ) AS detail_data,
            "RETUR PENJUALAN BARANG" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt2 ON rppbt2.uuid = rrpbt.rincian_pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt2.stok_awal_barang 
        JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
        JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
        JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt ON rpbt.uuid= rrpbt.retur_penjualan_barang
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt2.uuid 
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt2.customer 
        WHERE rrpbt.enabled = 1
        AND rpbt.enabled = 1
        AND rppbt2.enabled = 1
        AND ppbt2.enabled = 1
        AND fpbt.enabled = 1
        AND MONTH(rpbt.tanggal) = ${bulan} 
        AND YEAR(rpbt.tanggal) = ${tahun}
    `

    const pengembalianDendaPenjualanBarangQuery = `
        SELECT
            JSON_ARRAY(
                JSON_OBJECT (
                    'debet', 0,
                    'kredit', rpdpbt.denda_yang_dikembalikan,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = pdpbt.kode_akun_perkiraan		
                    )
                ),
                JSON_OBJECT (
                    'debet', rpdpbt.denda_yang_dikembalikan ,
                    'kredit', 0,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "ddb0e69f-9704-4555-b427-5748365034f7"		
                    )
                )
            ) AS detail_json,
            "NOT_AVAILABLE" AS uuid,
            pdpbt.bukti_transaksi AS bukti_transaksi,
            pdpbt.tanggal AS tanggal,
            (
                CASE WHEN MONTH(pdpbt.tanggal) < 10 THEN CONCAT("0", MONTH(pdpbt.tanggal)) ELSE MONTH(pdpbt.tanggal) END
            ) AS bulan,
            YEAR(pdpbt.tanggal) AS tahun,
            pdpbt.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_barang_name', sbt.name,
                'faktur_penjualan_barang', fpbt.bukti_transaksi,
                'kategori_harga_barang_kode_barang', khbt.kode_barang,
                'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'daftar_gudang_name', dgt.name,
                'daftar_barang_name', dbt.name
            ) AS detail_data,
            "PENGEMBALIAN DENDA PENJUALAN BARANG" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_barang_tab rpdpbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt ON rppbt.uuid = rpdpbt.rincian_pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
        JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
        JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
        JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
        JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab pdpbt ON pdpbt.uuid= rpdpbt.pengembalian_denda_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
        WHERE rppbt.enabled = 1
        AND ppbt.enabled = 1
        AND rppbt.enabled = 1
        AND pdpbt.enabled = 1
        AND fpbt.enabled = 1
        AND MONTH(pdpbt.tanggal) = ${bulan}
        AND YEAR(pdpbt.tanggal) = ${tahun}
    `

    const fakturPenjualanBarangDendaBulanIniQuery = `
        SELECT 
            JSON_ARRAY(
                JSON_OBJECT (
                    'debet', (
                        SELECT
                            CASE
                                WHEN res.piutang_denda > 0
                                THEN res.piutang_denda
                                ELSE 0
                            END
                    ),
                    'kredit', 0,
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "eb5b6dcd-1146-4550-a9f0-1fe8439b085f"	
                    )
                ),
                JSON_OBJECT (
                    'debet', 0,
                    'kredit', (
                        SELECT
                            CASE
                                WHEN res.piutang_denda > 0
                                THEN res.piutang_denda
                                ELSE 0
                            END
                    ),
                    'kode_akun_perkiraan',
                    (
                        SELECT 
                            JSON_OBJECT (
                                'uuid', kapt.uuid,
                                'name', kapt.name,
                                'type', kapt.type,
                                'code', kapt.code
                            ) 
                        FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt WHERE kapt.uuid = "ddb0e69f-9704-4555-b427-5748365034f7"		
                    )
                )
            ) AS detail_json,
            "NOT_AVAILABLE" AS uuid,
            res.bukti_transaksi AS bukti_transaksi,
            "${tahun + "-" + (bulan < 10 ? `0${bulan}` : `${bulan}`) + `-${getTanggalTerakhirPadaBulan(tahun, bulan)}`}T23:59:59" AS tanggal,
            ${bulan < 10 ? `0${bulan}` : bulan} AS bulan,
            YEAR("${tahun + "-" + (bulan < 10 ? `0${bulan}` : `${bulan}`) + `-${getTanggalTerakhirPadaBulan(tahun, bulan)}`}T23:59:59") AS tahun,
            "DENDA PENJUALAN BARANG" AS uraian,
            res.detail_data_2 AS detail_data,
            "DENDA PENJUALAN BARANG" AS sumber
        FROM (
            SELECT 
                (res.piutang * (res.syarat_pembayaran_denda / 100) * res.hari_terlewat) AS total_denda,
                (res.piutang * (res.syarat_pembayaran_denda / 100) * res.hari_terlewat) - res.denda_sudah_dibayar AS piutang_denda,
                res.*
            FROM (
                SELECT 
                    (res.sudah_dibayar - res.nilai_retur) AS sudah_dibayar_fix,
                    CASE
                        WHEN ((res.harga_setelah_diskon + res.ppn_setelah_diskon) * (res.jumlah - res.retur)) - (res.sudah_dibayar - res.nilai_retur) > 0
                        THEN ((res.harga_setelah_diskon + res.ppn_setelah_diskon) * (res.jumlah - res.retur)) - (res.sudah_dibayar - res.nilai_retur)
                        ELSE 0
                    END AS piutang,
                    JSON_MERGE_PRESERVE (
                        res.detail_data_1,
                        JSON_OBJECT(
                            'denda_sudah_dibayar', res.denda_sudah_dibayar,
                            'hari_terlewat', res.hari_terlewat,
                            'sudah_dibayar', res.sudah_dibayar,
                            'retur', res.nilai_retur
                        )
                    ) AS detail_data_2,
                    res.*
                FROM (
                    SELECT 
                        IFNULL((
                            SELECT 
                                SUM(rrpbt.retur) 
                            FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                            JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_barang 
                            WHERE rrpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                            AND rrpbt.enabled = 1
                            AND rpbt.enabled = 1
                            AND rpbt.tanggal < "${tahun + "-" + (bulan < 10 ? `0${bulan}` : `${bulan}`) + `-${getTanggalTerakhirPadaBulan(tahun, bulan)}`}T23:59:59"
                        ), 0) AS retur,
                        IFNULL((
                            SELECT 
                                SUM(rrpbt.nilai_retur) 
                            FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                            JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_barang 
                            WHERE rrpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                            AND rrpbt.enabled = 1
                            AND rpbt.enabled = 1
                            AND rpbt.tanggal < "${tahun + "-" + (bulan < 10 ? `0${bulan}` : `${bulan}`) + `-${getTanggalTerakhirPadaBulan(tahun, bulan)}`}T23:59:59"
                        ), 0) AS nilai_retur,
                        IFNULL((
                            SELECT 
                                SUM(rppbt2.nilai_pelunasan) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab rppbt2
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pelunasan_penjualan_barang
                            WHERE rppbt2.rincian_pesanan_penjualan_barang = rppbt.uuid
                            AND ppbt2.enabled = 1
                            AND ppbt2.tanggal < "${tahun + "-" + (bulan < 10 ? `0${bulan}` : `${bulan}`) + `-${getTanggalTerakhirPadaBulan(tahun, bulan)}`}T23:59:59"
                        ), 0) AS sudah_dibayar,
                        IFNULL((
                            SELECT 
                                SUM(rppdbt.nilai_pelunasan)
                                - IFNULL((
                                    SELECT 
                                        SUM(rpdpbt.denda_yang_dikembalikan) 
                                    FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_barang_tab rpdpbt 
                                    JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_penjualan_barang
                                    WHERE rpdpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                                    AND pdpbt.enabled = 1
                                    AND rpdpbt.enabled = 1
                                ), 0) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_barang_tab rppdbt
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt ON ppbt.uuid = rppdbt.pelunasan_penjualan_barang
                            WHERE rppdbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                            AND ppbt.tanggal < "${tahun + "-" + (bulan < 10 ? `0${bulan}` : `${bulan}`) + `-${getTanggalTerakhirPadaBulan(tahun, bulan)}`}T23:59:59"
                            AND rppdbt.enabled = 1
                            AND ppbt.enabled = 1
                        ), 0) AS denda_sudah_dibayar, 
                        (
                            DATEDIFF(
                                "${tahun + "-" + (bulan < 10 ? `0${bulan}` : `${bulan}`) + `-${getTanggalTerakhirPadaBulan(tahun, bulan)}`}T23:59:59"
                                ,
                                (
                                    ADDDATE( fpbt.tanggal, INTERVAL spt.hari_kadaluarsa DAY )
                                )
                            )
                        ) AS hari_terlewat,
                        rppbt.harga_setelah_diskon,
                        rppbt.ppn_setelah_diskon,
                        rppbt.jumlah,
                        rppbt.diskon_angka,
                        rppbt.diskon_persentase,
                        spt.denda AS syarat_pembayaran_denda,
                        fpbt.bukti_transaksi,
                        rppbt.id,
                        JSON_OBJECT (
                            'satuan_barang_name', sbt.name,
                            'faktur_penjualan_barang', fpbt.nomor_faktur_penjualan_barang,
                            'kategori_harga_barang_kode_barang', khbt.kode_barang,
                            'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                            'customer_name', ct.name,
                            'customer_code', ct.code,
                            'daftar_gudang_name', dgt.name,
                            'daftar_barang_name', dbt.name,
                            'jatuh_tempo', ADDDATE( fpbt.tanggal, INTERVAL spt.hari_kadaluarsa DAY ),
                            'tanggal_faktur', fpbt.tanggal
                        ) AS detail_data_1
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
                    JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang
                    JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = rppbt.kategori_harga_barang 
                    JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
                    JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
                    JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = khbt.daftar_barang
                    JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang
                    JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
                    JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpbt.syarat_pembayaran
                    JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer
                    WHERE rppbt.enabled = 1
                    AND ppbt.enabled = 1
                    AND fpbt.enabled = 1
                ) AS res
            ) AS res
        ) AS res
    `

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
                    detail_json, 
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
                        res.detail_json,
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
            ORDER BY res.tanggal ASC
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