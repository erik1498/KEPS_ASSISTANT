import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import StokAwalJasaModel from "./stokAwalJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllStokAwalJasaRepo = async (pageNumber, size, search, req_id) => {
    const stokAwalJasasCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.stok_awal_jasa_tab WHERE daftar_jasa LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : stokAwalJasasCount[0].count

    const stokAwalJasas = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.stok_awal_jasa_tab WHERE daftar_jasa LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: stokAwalJasas,
        count: stokAwalJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getStokAwalJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        StokAwalJasaModel,
        null,
        {
            uuid,
            enabled: 1
        }
    )
}

export const getDaftarCabangByKategoriHargaJasaUUIDAndPesananPenjualanJasaUUIDRepo = async (kategori_harga_jasa, pesanan_penjualan_jasa, req_id) => {
    const daftarCabangs = await db.query(
        `
            SELECT 
                sajt.uuid,
                ct.name AS cabang_name
            FROM ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sajt 
            JOIN ${generateDatabaseName(req_id)}.cabang_tab ct ON ct.uuid = sajt.cabang
            WHERE sajt.kategori_harga_jasa = "${kategori_harga_jasa}"
            AND sajt.enabled = 1
            AND sajt.tanggal <= (
                SELECT 
                    ppjt.tanggal_pesanan_penjualan_jasa
                FROM ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppjt
                WHERE ppjt.uuid = "${pesanan_penjualan_jasa}"
            )
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return daftarCabangs
}

export const getStokAwalJasaByJasaUUIDRepo = async (uuid, req_id) => {
    const stokAwalJasas = await db.query(
        `
            SELECT 
                sajt.*,
                ct.name AS cabang_name,
                khbt.kode_jasa AS kategori_harga_jasa_kode_jasa,
                sbt.name AS satuan_jasa_name
            FROM ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sajt
            JOIN ${generateDatabaseName(req_id)}.cabang_tab ct ON ct.uuid = sajt.cabang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sajt.kategori_harga_jasa 
            JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
            WHERE sajt.daftar_jasa = "${uuid}"
            AND sajt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return stokAwalJasas
}

export const createStokAwalJasaRepo = async (stokAwalJasaData, req_id) => {
    stokAwalJasaData = removeDotInRupiahInput(stokAwalJasaData, [
        "jumlah"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StokAwalJasaModel,
        {
            daftar_jasa: stokAwalJasaData.daftar_jasa,
            cabang: stokAwalJasaData.cabang,
            kategori_harga_jasa: stokAwalJasaData.kategori_harga_jasa,
            jumlah: stokAwalJasaData.jumlah,
            tanggal: stokAwalJasaData.tanggal,
            enabled: stokAwalJasaData.enabled
        }
    )
}

export const deleteStokAwalJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StokAwalJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateStokAwalJasaByUuidRepo = async (uuid, stokAwalJasaData, req_id) => {
    stokAwalJasaData = removeDotInRupiahInput(stokAwalJasaData, [
        "jumlah"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StokAwalJasaModel,
        {
            daftar_jasa: stokAwalJasaData.daftar_jasa,
            cabang: stokAwalJasaData.cabang,
            kategori_harga_jasa: stokAwalJasaData.kategori_harga_jasa,
            jumlah: stokAwalJasaData.jumlah,
            tanggal: stokAwalJasaData.tanggal,
        },
        {
            uuid
        }
    )
}

export const getStokAwalJasaByDaftarCabangDanKategoriHargaJasaRepo = async (cabang, kategori_harga_jasa, req_id) => {
    return await db.query(
        `
            SELECT
                COUNT(0) AS count 
            FROM ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sajt 
            WHERE sajt.cabang = "${cabang}"
            AND sajt.kategori_harga_jasa = "${kategori_harga_jasa}"
            AND sajt.enabled = 1
            LIMIT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getRiwayatTransaksiPenjualanByStokAwalJasaUuidRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                res.*
            FROM (
                SELECT 
                    ppbt.nomor_pesanan_penjualan_jasa AS bukti_transaksi,
                    "pesanan_penjualan" AS type,
                    ppbt.tanggal_pesanan_penjualan_jasa AS tanggal,
                    ct.name AS customer,
                    ct.code AS customer_code,
                    JSON_OBJECT(
                        'jumlah', rppbt.jumlah,
                        'diskon_persentase', rppbt.diskon_persentase,
                        'satuan_jasa', sbt.name,
                        'total', rppbt.total_harga 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer
                JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = rppbt.kategori_harga_jasa 
                JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
                WHERE rppbt.stok_awal_jasa = "${uuid}"
                AND rppbt.enabled = 1
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    fpbt.bukti_transaksi,
                    "faktur_penjualan_jasa" AS type,
                    fpbt.tanggal,
                    ct.name AS customer,
                    ct.code AS customer_code,
                    JSON_OBJECT() AS detail
                FROM ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = fpbt.pesanan_penjualan_jasa 
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
                WHERE fpbt.enabled = 1
                AND ppbt.enabled = 1
                AND (
                    SELECT 
                        COUNT(0)
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt 
                    WHERE rppbt.pesanan_penjualan_jasa = ppbt.uuid 
                    AND rppbt.stok_awal_jasa = "${uuid}"
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
                FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_jasa_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt2 On rppbt2.uuid = rppbt.rincian_pesanan_penjualan_jasa
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_penjualan_jasa
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt2.customer
                JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pelunasan_penjualan_jasa 
                WHERE rppbt2.stok_awal_jasa = "${uuid}"
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
                FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_jasa_tab rppdbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt2 On rppbt2.uuid = rppdbt.rincian_pesanan_penjualan_jasa
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_penjualan_jasa
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt2.customer
                JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppdbt.pelunasan_penjualan_jasa 
                WHERE rppbt2.stok_awal_jasa = "${uuid}"
                AND rppdbt.enabled = 1
                AND ppbt.enabled = 1
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    rpbt.bukti_transaksi,
                    "retur_penjualan_jasa" AS type,
                    rpbt.tanggal,
                    ct.name AS customer,
                    ct.code AS customer_code,
                    JSON_OBJECT(
                        'retur', rrpbt.retur,
                        'nilai_retur', rrpbt.nilai_retur 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt ON rppbt.uuid = rrpbt.rincian_pesanan_penjualan_jasa 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer
                JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_jasa 
                WHERE rppbt.stok_awal_jasa = "${uuid}"
                AND rrpbt.enabled = 1
                AND ppbt.enabled = 1
                AND rpbt.enabled = 1
                UNION ALL
                SELECT 
                    pdpbt.bukti_transaksi,
                    "pengembalian_denda_penjualan_jasa" AS type,
                    pdpbt.tanggal,
                    ct.name AS customer,
                    ct.code AS customer_code,
                    JSON_OBJECT(
                        'denda_dikembalikan', rpdpbt.denda_yang_dikembalikan 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_jasa_tab rpdpbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt ON rppbt.uuid = rpdpbt.rincian_pesanan_penjualan_jasa 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer
                JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_penjualan_jasa 
                WHERE rppbt.stok_awal_jasa = "${uuid}"
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

export const getRiwayatTransaksiPembelianByStokAwalJasaUuidRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                res.*
            FROM (
                SELECT 
                    ppbt.nomor_pesanan_pembelian_jasa AS bukti_transaksi,
                    "pesanan_pembelian" AS type,
                    ppbt.tanggal_pesanan_pembelian_jasa AS tanggal,
                    st.name AS supplier,
                    st.code AS supplier_code,
                    JSON_OBJECT(
                        'jumlah', rppbt.jumlah,
                        'diskon_persentase', rppbt.diskon_persentase,
                        'satuan_jasa', sbt.name,
                        'total', rppbt.total_harga 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_jasa_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_jasa
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier
                JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = rppbt.kategori_harga_jasa 
                JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
                WHERE rppbt.stok_awal_jasa = "d9120905-3090-474b-b16a-1f7b29d6bf06"
                AND rppbt.enabled = 1
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    fpbt.bukti_transaksi,
                    "faktur_pembelian_jasa" AS type,
                    fpbt.tanggal,
                    st.name AS supplier,
                    st.code AS supplier_code,
                    JSON_OBJECT() AS detail
                FROM ${generateDatabaseName(req_id)}.faktur_pembelian_jasa_tab fpbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_jasa_tab ppbt ON ppbt.uuid = fpbt.pesanan_pembelian_jasa 
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier 
                WHERE fpbt.enabled = 1
                AND ppbt.enabled = 1
                AND (
                    SELECT 
                        COUNT(0)
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_jasa_tab rppbt 
                    WHERE rppbt.pesanan_pembelian_jasa = ppbt.uuid 
                    AND rppbt.stok_awal_jasa = "d9120905-3090-474b-b16a-1f7b29d6bf06"
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
                FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_jasa_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_jasa_tab rppbt2 On rppbt2.uuid = rppbt.rincian_pesanan_pembelian_jasa
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_jasa_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_pembelian_jasa
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt2.supplier
                JOIN ${generateDatabaseName(req_id)}.pelunasan_pembelian_jasa_tab ppbt ON ppbt.uuid = rppbt.pelunasan_pembelian_jasa 
                WHERE rppbt2.stok_awal_jasa = "d9120905-3090-474b-b16a-1f7b29d6bf06"
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
                FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_jasa_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_jasa_tab rppbt2 On rppbt2.uuid = rppbt.rincian_pesanan_pembelian_jasa
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_jasa_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_pembelian_jasa
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt2.supplier
                JOIN ${generateDatabaseName(req_id)}.pelunasan_pembelian_jasa_tab ppbt ON ppbt.uuid = rppbt.pelunasan_pembelian_jasa 
                WHERE rppbt2.stok_awal_jasa = "d9120905-3090-474b-b16a-1f7b29d6bf06"
                AND rppbt.enabled = 1
                AND ppbt.enabled = 1
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    rpbt.bukti_transaksi,
                    "retur_pembelian_jasa" AS type,
                    rpbt.tanggal,
                    st.name AS supplier,
                    st.code AS supplier_code,
                    JSON_OBJECT(
                        'retur', rrpbt.retur,
                        'nilai_retur', rrpbt.nilai_retur 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_jasa_tab rrpbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_jasa_tab rppbt ON rppbt.uuid = rrpbt.rincian_pesanan_pembelian_jasa 
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_jasa
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier
                JOIN ${generateDatabaseName(req_id)}.retur_pembelian_jasa_tab rpbt ON rpbt.uuid = rrpbt.retur_pembelian_jasa 
                WHERE rppbt.stok_awal_jasa = "d9120905-3090-474b-b16a-1f7b29d6bf06"
                AND rrpbt.enabled = 1
                AND ppbt.enabled = 1
                AND rpbt.enabled = 1
                UNION ALL
                SELECT 
                    pdpbt.bukti_transaksi,
                    "pengembalian_denda_pembelian_jasa" AS type,
                    pdpbt.tanggal,
                    st.name AS supplier,
                    st.code AS supplier_code,
                    JSON_OBJECT(
                        'denda_dikembalikan', rpdpbt.denda_yang_dikembalikan 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_pembelian_jasa_tab rpdpbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_jasa_tab rppbt ON rppbt.uuid = rpdpbt.rincian_pesanan_pembelian_jasa 
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_jasa
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier
                JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_pembelian_jasa_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_pembelian_jasa 
                WHERE rppbt.stok_awal_jasa = "d9120905-3090-474b-b16a-1f7b29d6bf06"
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

export const checkStokAwalJasaAllowToEditRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                (
                    SELECT 
                        JSON_OBJECT(
                            'nomor_pesanan_penjualan_jasa', ppbt.nomor_pesanan_penjualan_jasa,
                            'tanggal', ppbt.tanggal_pesanan_penjualan_jasa
                        ) 
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt 
                    JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
                    WHERE rppbt.stok_awal_jasa = sajt.uuid
                    AND rppbt.enabled = 1
                    LIMIT 1
                ) AS pesanan_penjualan_jasa,
                sajt.*
            FROM ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sajt 
            WHERE sajt.uuid = "${uuid}"
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}