import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import StokAwalBahanBakuModel from "./stokAwalBahanBaku.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllStokAwalBahanBakuRepo = async (pageNumber, size, search, req_id) => {
    const stokAwalBahanBakusCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.stok_awal_bahan_baku_tab WHERE daftar_bahan_baku LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : stokAwalBahanBakusCount[0].count

    const stokAwalBahanBakus = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.stok_awal_bahan_baku_tab WHERE daftar_bahan_baku LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: stokAwalBahanBakus,
        count: stokAwalBahanBakusCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getReportStokAwalBahanBakusRepo = async (pageNumber, size, search, bulan, tahun, req_id) => {
    const stokAwalBahanBakusCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count 
            FROM ${generateDatabaseName(req_id)}.stok_awal_bahan_baku_tab sabt
            JOIN ${generateDatabaseName(req_id)}.daftar_bahan_baku_tab dbt ON dbt.uuid = sabt.daftar_bahan_baku
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_bahan_baku_tab khbt ON khbt.uuid = sabt.kategori_harga_bahan_baku 
            WHERE CONCAT(khbt.kode_bahan_baku, dbt.name) LIKE '%${search}%' 
            AND sabt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : stokAwalBahanBakusCount[0].count

    const stokAwalBahanBakus = await db.query(
        `
            SELECT 
                res.stok_penyesuaian_persediaan_bulan_lalu - res.penjualan + res.retur_penjualan + res.pembelian - res.retur_pembelian - res.konversi_keluar + res.konversi_masuk + res.transfer_masuk - res.transfer_keluar AS stok_sistem,
                res.*
            FROM (
                SELECT 
                    IFNULL((
                        SELECT 
                            ppt.kuantitas
                        FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt 
                        JOIN ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot ON psot.uuid = ppt.perintah_stok_opname 
                        WHERE ppt.enabled = 1
                        AND psot.enabled = 1
                        AND ppt.stok_tersedia_sistem = sabt.uuid 
                        AND psot.bulan_transaksi = ${bulan - 1}
                        AND psot.tahun = ${tahun}
                        LIMIT 1
                    ), 0) AS stok_penyesuaian_persediaan_bulan_lalu,
                    IFNULL((
                        SELECT
                            SUM(rkbt.jumlah_yang_dikonversi)
                        FROM ${generateDatabaseName(req_id)}.rincian_konversi_bahan_baku_tab rkbt
                        JOIN ${generateDatabaseName(req_id)}.konversi_bahan_baku_tab kbt ON kbt.uuid = rkbt.konversi_bahan_baku 
                        WHERE rkbt.stok_awal_bahan_baku = sabt.uuid 
                        AND rkbt.enabled = 1
                        AND kbt.enabled = 1
                        AND MONTH(kbt.tanggal) = ${bulan}
                        AND YEAR(kbt.tanggal) = ${tahun}
                    ), 0) AS konversi_keluar,
                    IFNULL((
                        SELECT 
                            SUM(rtbt.jumlah) 
                        FROM ${generateDatabaseName(req_id)}.rincian_transfer_bahan_baku_tab rtbt 
                        JOIN ${generateDatabaseName(req_id)}.transfer_bahan_baku_tab tbt ON tbt.uuid = rtbt.transfer_bahan_baku 
                        JOIN ${generateDatabaseName(req_id)}.stok_awal_bahan_baku_tab sabt2 ON sabt2.uuid = rtbt.stok_awal_bahan_baku 
                        WHERE tbt.enabled = 1
                        AND sabt2.daftar_gudang = tbt.daftar_gudang_asal 
                        AND rtbt.stok_awal_bahan_baku_tujuan = sabt.uuid
                        AND MONTH(tbt.tanggal) = ${bulan}
                        AND YEAR(tbt.tanggal) = ${tahun}
                    ), 0) AS transfer_masuk,
                    IFNULL((
                        SELECT 
                            SUM(rtbt.jumlah) 
                        FROM ${generateDatabaseName(req_id)}.rincian_transfer_bahan_baku_tab rtbt 
                        JOIN ${generateDatabaseName(req_id)}.transfer_bahan_baku_tab tbt ON tbt.uuid = rtbt.transfer_bahan_baku 
                        JOIN ${generateDatabaseName(req_id)}.stok_awal_bahan_baku_tab sabt2 ON sabt2.uuid = rtbt.stok_awal_bahan_baku 
                        WHERE tbt.enabled = 1
                        AND sabt2.daftar_gudang = tbt.daftar_gudang_asal 
                        AND rtbt.stok_awal_bahan_baku = sabt.uuid
                        AND MONTH(tbt.tanggal) = ${bulan}
                        AND YEAR(tbt.tanggal) = ${tahun}
                    ), 0) AS transfer_keluar,
                    IFNULL((
                        SELECT
                            SUM(rkbt.jumlah_hasil_konversi_kode_bahan_baku_tujuan)
                        FROM ${generateDatabaseName(req_id)}.rincian_konversi_bahan_baku_tab rkbt
                        JOIN ${generateDatabaseName(req_id)}.konversi_bahan_baku_tab kbt ON kbt.uuid = rkbt.konversi_bahan_baku 
                        WHERE rkbt.stok_awal_bahan_baku_tujuan = sabt.uuid 
                        AND rkbt.enabled = 1
                        AND kbt.enabled = 1
                        AND MONTH(kbt.tanggal) = ${bulan}
                        AND YEAR(kbt.tanggal) = ${tahun}
                    ), 0) AS konversi_masuk,
                    IFNULL((
                        SELECT
                            SUM(rppbt.jumlah) 
                        FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_bahan_baku_tab rppbt 
                        JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_bahan_baku_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_bahan_baku 
                        WHERE rppbt.stok_awal_bahan_baku = sabt.uuid 
                        AND ppbt.enabled = 1 
                        AND rppbt.enabled = 1
                        AND MONTH(ppbt.tanggal_pesanan_pembelian_bahan_baku) = ${bulan}
                        AND YEAR(ppbt.tanggal_pesanan_pembelian_bahan_baku) = ${tahun}
                    ), 0) AS pembelian,
                    IFNULL((
                        SELECT 
                            SUM(rrpbt.retur) 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_bahan_baku_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_pembelian_bahan_baku_tab rpbt ON rpbt.uuid = rrpbt.retur_pembelian_bahan_baku
                        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_bahan_baku_tab rppbt ON rppbt.uuid = rrpbt.rincian_pesanan_pembelian_bahan_baku
                        WHERE rppbt.stok_awal_bahan_baku = sabt.uuid 
                        AND rrpbt.enabled = 1
                        AND rppbt.enabled = 1
                        AND MONTH(rpbt.tanggal) = ${bulan}
                        AND YEAR(rpbt.tanggal) = ${tahun}
                    ), 0) AS retur_pembelian,
                    IFNULL((
                        SELECT
                            SUM(rppbt.jumlah) 
                        FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_bahan_baku_tab rppbt 
                        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_bahan_baku_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_bahan_baku 
                        WHERE rppbt.stok_awal_bahan_baku = sabt.uuid 
                        AND ppbt.enabled = 1 
                        AND rppbt.enabled = 1
                        AND MONTH(ppbt.tanggal_pesanan_penjualan_bahan_baku) = ${bulan}
                        AND YEAR(ppbt.tanggal_pesanan_penjualan_bahan_baku) = ${tahun}
                    ), 0) AS penjualan,
                    IFNULL((
                        SELECT 
                            SUM(rrpbt.retur) 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_bahan_baku_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_bahan_baku_tab rppbt ON rppbt.uuid = rrpbt.rincian_pesanan_penjualan_bahan_baku
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_bahan_baku_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_bahan_baku
                        WHERE rppbt.stok_awal_bahan_baku = sabt.uuid 
                        AND rrpbt.enabled = 1
                        AND rppbt.enabled = 1
                        AND rpbt.enabled = 1
                        AND MONTH(rpbt.tanggal) = ${bulan}
                        AND YEAR(rpbt.tanggal) = ${tahun}
                    ), 0) AS retur_penjualan,
                    khbt.kode_bahan_baku AS kategori_harga_bahan_baku_kode_bahan_baku,
                    dbt.name AS daftar_bahan_baku_name,
                    dgt.name AS daftar_gudang_name,
                    sbt.name AS satuan_bahan_baku_name
                FROM ${generateDatabaseName(req_id)}.stok_awal_bahan_baku_tab sabt 
                JOIN ${generateDatabaseName(req_id)}.daftar_bahan_baku_tab dbt ON dbt.uuid = sabt.daftar_bahan_baku
                JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
                JOIN ${generateDatabaseName(req_id)}.kategori_harga_bahan_baku_tab khbt ON khbt.uuid = sabt.kategori_harga_bahan_baku
                JOIN ${generateDatabaseName(req_id)}.satuan_bahan_baku_tab sbt ON sbt.uuid = khbt.satuan_bahan_baku 
                WHERE sabt.enabled = 1
                AND LPAD(MONTH(sabt.tanggal), 2, "0") <= ${bulan}
                AND YEAR(sabt.tanggal) <= ${tahun} 
            ) AS res    
            WHERE CONCAT(res.daftar_bahan_baku_name, res.kategori_harga_bahan_baku_kode_bahan_baku) LIKE '%${search}%'
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: stokAwalBahanBakus,
        count: stokAwalBahanBakusCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getStokAwalBahanBakuByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        StokAwalBahanBakuModel,
        null,
        {
            uuid,
            enabled: 1
        }
    )
}

export const getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUIDAndPesananPenjualanBahanBakuUUIDRepo = async (kategori_harga_bahan_baku, pesanan_penjualan_or_pembelian_bahan_baku, type, req_id) => {
    const daftarGudangBahanBakus = await db.query(
        `
            SELECT 
                sabt.uuid,
                dgt.name AS daftar_gudang_name
            FROM ${generateDatabaseName(req_id)}.stok_awal_bahan_baku_tab sabt 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            WHERE sabt.kategori_harga_bahan_baku = "${kategori_harga_bahan_baku}"
            AND sabt.enabled = 1
            ${pesanan_penjualan_or_pembelian_bahan_baku ? `
                    AND sabt.tanggal <= (
                        SELECT 
                            ppbt.tanggal_pesanan_${type}_bahan_baku
                        FROM ${generateDatabaseName(req_id)}.pesanan_${type}_bahan_baku_tab ppbt
                        WHERE ppbt.uuid = "${pesanan_penjualan_or_pembelian_bahan_baku}"
                    )
                ` : ``
        }
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return daftarGudangBahanBakus
}

export const getStokAwalBahanBakuByBahanBakuUUIDRepo = async (uuid, req_id) => {
    const stokAwalBahanBakus = await db.query(
        `
            SELECT 
                sabt.*,
                dgt.name AS daftar_gudang_name,
                khbt.kode_bahan_baku AS kategori_harga_bahan_baku_kode_bahan_baku,
                sbt.name AS satuan_bahan_baku_name
            FROM ${generateDatabaseName(req_id)}.stok_awal_bahan_baku_tab sabt
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_bahan_baku_tab khbt ON khbt.uuid = sabt.kategori_harga_bahan_baku 
            JOIN ${generateDatabaseName(req_id)}.satuan_bahan_baku_tab sbt ON sbt.uuid = khbt.satuan_bahan_baku 
            WHERE sabt.daftar_bahan_baku = "${uuid}"
            AND sabt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return stokAwalBahanBakus
}

export const createStokAwalBahanBakuRepo = async (stokAwalBahanBakuData, req_id) => {
    stokAwalBahanBakuData = removeDotInRupiahInput(stokAwalBahanBakuData, [
        "jumlah"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StokAwalBahanBakuModel,
        {
            daftar_bahan_baku: stokAwalBahanBakuData.daftar_bahan_baku,
            daftar_gudang: stokAwalBahanBakuData.daftar_gudang,
            kategori_harga_bahan_baku: stokAwalBahanBakuData.kategori_harga_bahan_baku,
            jumlah: stokAwalBahanBakuData.jumlah,
            tanggal: stokAwalBahanBakuData.tanggal,
            enabled: stokAwalBahanBakuData.enabled
        }
    )
}

export const deleteStokAwalBahanBakuByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StokAwalBahanBakuModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateStokAwalBahanBakuByUuidRepo = async (uuid, stokAwalBahanBakuData, req_id) => {
    stokAwalBahanBakuData = removeDotInRupiahInput(stokAwalBahanBakuData, [
        "jumlah"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StokAwalBahanBakuModel,
        {
            daftar_bahan_baku: stokAwalBahanBakuData.daftar_bahan_baku,
            daftar_gudang: stokAwalBahanBakuData.daftar_gudang,
            kategori_harga_bahan_baku: stokAwalBahanBakuData.kategori_harga_bahan_baku,
            jumlah: stokAwalBahanBakuData.jumlah,
            tanggal: stokAwalBahanBakuData.tanggal,
        },
        {
            uuid
        }
    )
}

export const getStokAwalBahanBakuByDaftarGudangDanKategoriHargaBahanBakuRepo = async (daftar_gudang, kategori_harga_bahan_baku, req_id) => {
    return await db.query(
        `
            SELECT
                COUNT(0) AS count 
            FROM ${generateDatabaseName(req_id)}.stok_awal_bahan_baku_tab sabt 
            WHERE sabt.daftar_gudang = "${daftar_gudang}"
            AND sabt.kategori_harga_bahan_baku = "${kategori_harga_bahan_baku}"
            AND sabt.enabled = 1
            LIMIT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getRiwayatTransaksiPenjualanByStokAwalBahanBakuUuidRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                res.*
            FROM (
                SELECT 
                    ppbt.nomor_pesanan_penjualan_bahan_baku AS bukti_transaksi,
                    "pesanan_penjualan" AS type,
                    ppbt.tanggal_pesanan_penjualan_bahan_baku AS tanggal,
                    ct.name AS customer,
                    ct.code AS customer_code,
                    JSON_OBJECT(
                        'jumlah', rppbt.jumlah,
                        'diskon_persentase', rppbt.diskon_persentase,
                        'satuan_bahan_baku', sbt.name,
                        'total', rppbt.total_harga 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_bahan_baku_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_bahan_baku_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_bahan_baku
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer
                JOIN ${generateDatabaseName(req_id)}.kategori_harga_bahan_baku_tab khbt ON khbt.uuid = rppbt.kategori_harga_bahan_baku 
                JOIN ${generateDatabaseName(req_id)}.satuan_bahan_baku_tab sbt ON sbt.uuid = khbt.satuan_bahan_baku 
                WHERE rppbt.stok_awal_bahan_baku = "${uuid}"
                AND rppbt.enabled = 1
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    fpbt.nomor_faktur_penjualan_bahan_baku,
                    "faktur_penjualan_bahan_baku" AS type,
                    fpbt.tanggal,
                    ct.name AS customer,
                    ct.code AS customer_code,
                    JSON_OBJECT() AS detail
                FROM ${generateDatabaseName(req_id)}.faktur_penjualan_bahan_baku_tab fpbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_bahan_baku_tab ppbt ON ppbt.uuid = fpbt.pesanan_penjualan_bahan_baku 
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
                WHERE fpbt.enabled = 1
                AND ppbt.enabled = 1
                AND (
                    SELECT 
                        COUNT(0)
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_bahan_baku_tab rppbt 
                    WHERE rppbt.pesanan_penjualan_bahan_baku = ppbt.uuid 
                    AND rppbt.stok_awal_bahan_baku = "${uuid}"
                    AND rppbt.enabled = 1
                ) > 0
                UNION ALL
                SELECT 
                    ppbt.bukti_transaksi,
                    "pelunasan_penjualan" AS type,
                    ppbt.tanggal,
                    ct.name AS customer,
                    ct.code AS customer_code,
                    JSON_OBJECT(
                        'nilai_pelunasan', rppbt.nilai_pelunasan
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_bahan_baku_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_bahan_baku_tab rppbt2 On rppbt2.uuid = rppbt.rincian_pesanan_penjualan_bahan_baku
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_bahan_baku_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_penjualan_bahan_baku
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt2.customer
                JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_bahan_baku_tab ppbt ON ppbt.uuid = rppbt.pelunasan_penjualan_bahan_baku 
                WHERE rppbt2.stok_awal_bahan_baku = "${uuid}"
                AND rppbt.enabled = 1
                AND ppbt.enabled = 1
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    ppbt.bukti_transaksi,
                    "pelunasan_denda_penjualan" AS type,
                    ppbt.tanggal,
                    ct.name AS customer,
                    ct.code AS customer_code,
                    JSON_OBJECT(
                        'nilai_pelunasan', rppdbt.nilai_pelunasan
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_bahan_baku_tab rppdbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_bahan_baku_tab rppbt2 On rppbt2.uuid = rppdbt.rincian_pesanan_penjualan_bahan_baku
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_bahan_baku_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_penjualan_bahan_baku
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt2.customer
                JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_bahan_baku_tab ppbt ON ppbt.uuid = rppdbt.pelunasan_penjualan_bahan_baku 
                WHERE rppbt2.stok_awal_bahan_baku = "${uuid}"
                AND rppdbt.enabled = 1
                AND ppbt.enabled = 1
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    rpbt.bukti_transaksi,
                    "retur_penjualan_bahan_baku" AS type,
                    rpbt.tanggal,
                    ct.name AS customer,
                    ct.code AS customer_code,
                    JSON_OBJECT(
                        'retur', rrpbt.retur,
                        'nilai_retur', rrpbt.nilai_retur 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_bahan_baku_tab rrpbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_bahan_baku_tab rppbt ON rppbt.uuid = rrpbt.rincian_pesanan_penjualan_bahan_baku 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_bahan_baku_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_bahan_baku
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer
                JOIN ${generateDatabaseName(req_id)}.retur_penjualan_bahan_baku_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_bahan_baku 
                WHERE rppbt.stok_awal_bahan_baku = "${uuid}"
                AND rrpbt.enabled = 1
                AND ppbt.enabled = 1
                AND rpbt.enabled = 1
                UNION ALL
                SELECT 
                    pdpbt.bukti_transaksi,
                    "pengembalian_denda_penjualan_bahan_baku" AS type,
                    pdpbt.tanggal,
                    ct.name AS customer,
                    ct.code AS customer_code,
                    JSON_OBJECT(
                        'denda_dikembalikan', rpdpbt.denda_yang_dikembalikan 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_bahan_baku_tab rpdpbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_bahan_baku_tab rppbt ON rppbt.uuid = rpdpbt.rincian_pesanan_penjualan_bahan_baku 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_bahan_baku_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_bahan_baku
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer
                JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_bahan_baku_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_penjualan_bahan_baku 
                WHERE rppbt.stok_awal_bahan_baku = "${uuid}"
                AND rpdpbt.enabled = 1
                AND ppbt.enabled = 1
                AND pdpbt.enabled = 1
            ) AS res
            ORDER BY res.tanggal DESC   
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getRiwayatTransaksiPembelianByStokAwalBahanBakuUuidRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                res.*
            FROM (
                SELECT 
                    ppbt.nomor_pesanan_pembelian_bahan_baku AS bukti_transaksi,
                    "pesanan_pembelian" AS type,
                    ppbt.tanggal_pesanan_pembelian_bahan_baku AS tanggal,
                    st.name AS supplier,
                    st.code AS supplier_code,
                    JSON_OBJECT(
                        'jumlah', rppbt.jumlah,
                        'diskon_persentase', rppbt.diskon_persentase,
                        'satuan_bahan_baku', sbt.name,
                        'total', rppbt.total_harga 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_bahan_baku_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_bahan_baku_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_bahan_baku
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier
                JOIN ${generateDatabaseName(req_id)}.kategori_harga_bahan_baku_tab khbt ON khbt.uuid = rppbt.kategori_harga_bahan_baku 
                JOIN ${generateDatabaseName(req_id)}.satuan_bahan_baku_tab sbt ON sbt.uuid = khbt.satuan_bahan_baku 
                WHERE rppbt.stok_awal_bahan_baku = "${uuid}"
                AND rppbt.enabled = 1
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    fpbt.nomor_faktur_pembelian_bahan_baku,
                    "faktur_pembelian_bahan_baku" AS type,
                    fpbt.tanggal,
                    st.name AS supplier,
                    st.code AS supplier_code,
                    JSON_OBJECT() AS detail
                FROM ${generateDatabaseName(req_id)}.faktur_pembelian_bahan_baku_tab fpbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_bahan_baku_tab ppbt ON ppbt.uuid = fpbt.pesanan_pembelian_bahan_baku 
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier 
                WHERE fpbt.enabled = 1
                AND ppbt.enabled = 1
                AND (
                    SELECT 
                        COUNT(0)
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_bahan_baku_tab rppbt 
                    WHERE rppbt.pesanan_pembelian_bahan_baku = ppbt.uuid 
                    AND rppbt.stok_awal_bahan_baku = "${uuid}"
                    AND rppbt.enabled = 1
                ) > 0
                UNION ALL
                SELECT 
                    ppbt.bukti_transaksi,
                    "pelunasan_pembelian" AS type,
                    ppbt.tanggal,
                    st.name AS supplier,
                    st.code AS supplier_code,
                    JSON_OBJECT(
                        'nilai_pelunasan', rppbt.nilai_pelunasan
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_bahan_baku_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_bahan_baku_tab rppbt2 On rppbt2.uuid = rppbt.rincian_pesanan_pembelian_bahan_baku
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_bahan_baku_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_pembelian_bahan_baku
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt2.supplier
                JOIN ${generateDatabaseName(req_id)}.pelunasan_pembelian_bahan_baku_tab ppbt ON ppbt.uuid = rppbt.pelunasan_pembelian_bahan_baku 
                WHERE rppbt2.stok_awal_bahan_baku = "${uuid}"
                AND rppbt.enabled = 1
                AND ppbt.enabled = 1
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    ppbt.bukti_transaksi,
                    "pelunasan_denda_pembelian" AS type,
                    ppbt.tanggal,
                    st.name AS supplier,
                    st.code AS supplier_code,
                    JSON_OBJECT(
                        'nilai_pelunasan', rppbt.nilai_pelunasan_denda
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_bahan_baku_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_bahan_baku_tab rppbt2 On rppbt2.uuid = rppbt.rincian_pesanan_pembelian_bahan_baku
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_bahan_baku_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_pembelian_bahan_baku
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt2.supplier
                JOIN ${generateDatabaseName(req_id)}.pelunasan_pembelian_bahan_baku_tab ppbt ON ppbt.uuid = rppbt.pelunasan_pembelian_bahan_baku 
                WHERE rppbt2.stok_awal_bahan_baku = "${uuid}"
                AND rppbt.enabled = 1
                AND ppbt.enabled = 1
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    rpbt.bukti_transaksi,
                    "retur_pembelian_bahan_baku" AS type,
                    rpbt.tanggal,
                    st.name AS supplier,
                    st.code AS supplier_code,
                    JSON_OBJECT(
                        'retur', rrpbt.retur,
                        'nilai_retur', rrpbt.nilai_retur 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_bahan_baku_tab rrpbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_bahan_baku_tab rppbt ON rppbt.uuid = rrpbt.rincian_pesanan_pembelian_bahan_baku 
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_bahan_baku_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_bahan_baku
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier
                JOIN ${generateDatabaseName(req_id)}.retur_pembelian_bahan_baku_tab rpbt ON rpbt.uuid = rrpbt.retur_pembelian_bahan_baku 
                WHERE rppbt.stok_awal_bahan_baku = "${uuid}"
                AND rrpbt.enabled = 1
                AND ppbt.enabled = 1
                AND rpbt.enabled = 1
                UNION ALL
                SELECT 
                    pdpbt.bukti_transaksi,
                    "pengembalian_denda_pembelian_bahan_baku" AS type,
                    pdpbt.tanggal,
                    st.name AS supplier,
                    st.code AS supplier_code,
                    JSON_OBJECT(
                        'denda_dikembalikan', rpdpbt.denda_yang_dikembalikan 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_pembelian_bahan_baku_tab rpdpbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_bahan_baku_tab rppbt ON rppbt.uuid = rpdpbt.rincian_pesanan_pembelian_bahan_baku 
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_bahan_baku_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_bahan_baku
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier
                JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_pembelian_bahan_baku_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_pembelian_bahan_baku 
                WHERE rppbt.stok_awal_bahan_baku = "${uuid}"
                AND rpdpbt.enabled = 1
                AND ppbt.enabled = 1
                AND pdpbt.enabled = 1
            ) AS res
            ORDER BY res.tanggal DESC   
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const checkStokAwalBahanBakuAllowToEditRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                (
                    SELECT 
                        JSON_OBJECT(
                            'nomor_pesanan_penjualan_bahan_baku', ppbt.nomor_pesanan_penjualan_bahan_baku,
                            'tanggal', ppbt.tanggal_pesanan_penjualan_bahan_baku
                        ) 
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_bahan_baku_tab rppbt 
                    JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_bahan_baku_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_bahan_baku 
                    WHERE rppbt.stok_awal_bahan_baku = sabt.uuid
                    AND rppbt.enabled = 1
                    LIMIT 1
                ) AS pesanan_penjualan_bahan_baku, 
                (
                    SELECT 
                        JSON_OBJECT(
                            'nomor_pesanan_pembelian_bahan_baku', ppbt.nomor_pesanan_pembelian_bahan_baku,
                            'tanggal', ppbt.tanggal_pesanan_pembelian_bahan_baku
                        ) 
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_bahan_baku_tab rppbt 
                    JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_bahan_baku_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_bahan_baku 
                    WHERE rppbt.stok_awal_bahan_baku = sabt.uuid
                    AND rppbt.enabled = 1
                    LIMIT 1
                ) AS pesanan_pembelian_bahan_baku,
                (
                    SELECT 
                        JSON_OBJECT(
                            'kode_transfer_bahan_baku', tbt.kode_transfer_bahan_baku,
                            'tanggal', tbt.tanggal 
                        ) 
                    FROM ${generateDatabaseName(req_id)}.rincian_transfer_bahan_baku_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.transfer_bahan_baku_tab tbt ON tbt.uuid = rtbt.transfer_bahan_baku 
                    WHERE rtbt.enabled = 1
                    AND tbt.enabled = 1
                    AND (
                        rtbt.stok_awal_bahan_baku = sabt.uuid 
                        OR rtbt.stok_awal_bahan_baku_tujuan = sabt.uuid 
                    )
                    LIMIT 1
                ) AS transfer_bahan_baku,
                (
                    SELECT 
                        JSON_OBJECT(
                            'kode_konversi_bahan_baku', kbt.kode_konversi_bahan_baku,
                            'tanggal', kbt.tanggal 
                        )
                    FROM ${generateDatabaseName(req_id)}.rincian_konversi_bahan_baku_tab rkbt 
                    JOIN ${generateDatabaseName(req_id)}.konversi_bahan_baku_tab kbt ON kbt.uuid = rkbt.konversi_bahan_baku 
                    WHERE rkbt.enabled = 1
                    AND kbt.enabled = 1
                    AND (
                        rkbt.stok_awal_bahan_baku = sabt.uuid
                        OR rkbt.stok_awal_bahan_baku_tujuan = sabt.uuid
                    )
                    LIMIT 1
                ) AS konversi_bahan_baku,
                sabt.*
            FROM ${generateDatabaseName(req_id)}.stok_awal_bahan_baku_tab sabt 
            WHERE sabt.uuid = "${uuid}"
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}