import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import StokAwalBarangModel from "./stokAwalBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllStokAwalBarangRepo = async (pageNumber, size, search, req_id) => {
    const stokAwalBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab WHERE daftar_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : stokAwalBarangsCount[0].count

    const stokAwalBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab WHERE daftar_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: stokAwalBarangs,
        count: stokAwalBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getReportStokAwalBarangsRepo = async (pageNumber, size, search, bulan, tahun, req_id) => {
    const stokAwalBarangsCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count 
            FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang
            WHERE dbt.name LIKE '%${search}%' AND sabt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : stokAwalBarangsCount[0].count

    const stokAwalBarangs = await db.query(
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
                        FROM ${generateDatabaseName(req_id)}.rincian_konversi_barang_tab rkbt
                        JOIN ${generateDatabaseName(req_id)}.konversi_barang_tab kbt ON kbt.uuid = rkbt.konversi_barang 
                        WHERE rkbt.stok_awal_barang = sabt.uuid 
                        AND rkbt.enabled = 1
                        AND kbt.enabled = 1
                        AND MONTH(kbt.tanggal) = ${bulan}
                        AND YEAR(kbt.tanggal) = ${tahun}
                    ), 0) AS konversi_keluar,
                    IFNULL((
                        SELECT 
                            SUM(rtbt.jumlah) 
                        FROM ${generateDatabaseName(req_id)}.rincian_transfer_barang_tab rtbt 
                        JOIN ${generateDatabaseName(req_id)}.transfer_barang_tab tbt ON tbt.uuid = rtbt.transfer_barang 
                        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt2 ON sabt2.uuid = rtbt.stok_awal_barang 
                        WHERE tbt.enabled = 1
                        AND sabt2.daftar_gudang = tbt.daftar_gudang_asal 
                        AND rtbt.stok_awal_barang_tujuan = sabt.uuid
                        AND MONTH(tbt.tanggal) = ${bulan}
                        AND YEAR(tbt.tanggal) = ${tahun}
                    ), 0) AS transfer_masuk,
                    IFNULL((
                        SELECT 
                            SUM(rtbt.jumlah) 
                        FROM ${generateDatabaseName(req_id)}.rincian_transfer_barang_tab rtbt 
                        JOIN ${generateDatabaseName(req_id)}.transfer_barang_tab tbt ON tbt.uuid = rtbt.transfer_barang 
                        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt2 ON sabt2.uuid = rtbt.stok_awal_barang 
                        WHERE tbt.enabled = 1
                        AND sabt2.daftar_gudang = tbt.daftar_gudang_asal 
                        AND rtbt.stok_awal_barang = sabt.uuid
                        AND MONTH(tbt.tanggal) = ${bulan}
                        AND YEAR(tbt.tanggal) = ${tahun}
                    ), 0) AS transfer_keluar,
                    IFNULL((
                        SELECT
                            SUM(rkbt.jumlah_hasil_konversi_kode_barang_tujuan)
                        FROM ${generateDatabaseName(req_id)}.rincian_konversi_barang_tab rkbt
                        JOIN ${generateDatabaseName(req_id)}.konversi_barang_tab kbt ON kbt.uuid = rkbt.konversi_barang 
                        WHERE rkbt.stok_awal_barang_tujuan = sabt.uuid 
                        AND rkbt.enabled = 1
                        AND kbt.enabled = 1
                        AND MONTH(kbt.tanggal) = ${bulan}
                        AND YEAR(kbt.tanggal) = ${tahun}
                    ), 0) AS konversi_masuk,
                    IFNULL((
                        SELECT
                            SUM(rppbt.jumlah) 
                        FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
                        JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang 
                        WHERE rppbt.stok_awal_barang = sabt.uuid 
                        AND ppbt.enabled = 1 
                        AND rppbt.enabled = 1
                        AND MONTH(ppbt.tanggal_pesanan_pembelian_barang) = ${bulan}
                        AND YEAR(ppbt.tanggal_pesanan_pembelian_barang) = ${tahun}
                    ), 0) AS pembelian,
                    IFNULL((
                        SELECT 
                            SUM(rrpbt.retur) 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_pembelian_barang
                        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt ON rppbt.uuid = rrpbt.rincian_pesanan_pembelian_barang
                        WHERE rppbt.stok_awal_barang = sabt.uuid 
                        AND rrpbt.enabled = 1
                        AND rppbt.enabled = 1
                        AND MONTH(rpbt.tanggal) = ${bulan}
                        AND YEAR(rpbt.tanggal) = ${tahun}
                    ), 0) AS retur_pembelian,
                    IFNULL((
                        SELECT
                            SUM(rppbt.jumlah) 
                        FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
                        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
                        WHERE rppbt.stok_awal_barang = sabt.uuid 
                        AND ppbt.enabled = 1 
                        AND rppbt.enabled = 1
                        AND MONTH(ppbt.tanggal_pesanan_penjualan_barang) = ${bulan}
                        AND YEAR(ppbt.tanggal_pesanan_penjualan_barang) = ${tahun}
                    ), 0) AS penjualan,
                    IFNULL((
                        SELECT 
                            SUM(rrpbt.retur) 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt ON rppbt.uuid = rrpbt.rincian_pesanan_penjualan_barang
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_barang
                        WHERE rppbt.stok_awal_barang = sabt.uuid 
                        AND rrpbt.enabled = 1
                        AND rppbt.enabled = 1
                        AND rpbt.enabled = 1
                        AND MONTH(rpbt.tanggal) = ${bulan}
                        AND YEAR(rpbt.tanggal) = ${tahun}
                    ), 0) AS retur_penjualan,
                    kht.kode_barang AS kategori_harga_barang_kode_barang,
                    dbt.name AS daftar_barang_name,
                    dgt.name AS daftar_gudang_name,
                    sbt.name AS satuan_barang_name
                FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt 
                JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang
                JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
                JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab kht ON kht.uuid = sabt.kategori_harga_barang
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = kht.satuan_barang 
                WHERE sabt.enabled = 1
            ) AS res    
            WHERE res.daftar_barang_name LIKE '%${search}%'
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: stokAwalBarangs,
        count: stokAwalBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getStokAwalBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        StokAwalBarangModel,
        null,
        {
            uuid,
            enabled: 1
        }
    )
}

export const getDaftarGudangBarangByKategoriHargaBarangUUIDAndPesananPenjualanBarangUUIDRepo = async (kategori_harga_barang, pesanan_penjualan_or_pembelian_barang, type, req_id) => {
    const daftarGudangBarangs = await db.query(
        `
            SELECT 
                sabt.uuid,
                dgt.name AS daftar_gudang_name
            FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            WHERE sabt.kategori_harga_barang = "${kategori_harga_barang}"
            AND sabt.enabled = 1
            ${pesanan_penjualan_or_pembelian_barang ? `
                    AND sabt.tanggal <= (
                        SELECT 
                            ppbt.tanggal_pesanan_${type}_barang
                        FROM ${generateDatabaseName(req_id)}.pesanan_${type}_barang_tab ppbt
                        WHERE ppbt.uuid = "${pesanan_penjualan_or_pembelian_barang}"
                    )
                ` : ``
        }
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return daftarGudangBarangs
}

export const getStokAwalBarangByBarangUUIDRepo = async (uuid, req_id) => {
    const stokAwalBarangs = await db.query(
        `
            SELECT 
                sabt.*,
                dgt.name AS daftar_gudang_name,
                khbt.kode_barang AS kategori_harga_barang_kode_barang,
                sbt.name AS satuan_barang_name
            FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            WHERE sabt.daftar_barang = "${uuid}"
            AND sabt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return stokAwalBarangs
}

export const createStokAwalBarangRepo = async (stokAwalBarangData, req_id) => {
    stokAwalBarangData = removeDotInRupiahInput(stokAwalBarangData, [
        "jumlah"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StokAwalBarangModel,
        {
            daftar_barang: stokAwalBarangData.daftar_barang,
            daftar_gudang: stokAwalBarangData.daftar_gudang,
            kategori_harga_barang: stokAwalBarangData.kategori_harga_barang,
            jumlah: stokAwalBarangData.jumlah,
            tanggal: stokAwalBarangData.tanggal,
            enabled: stokAwalBarangData.enabled
        }
    )
}

export const deleteStokAwalBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StokAwalBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateStokAwalBarangByUuidRepo = async (uuid, stokAwalBarangData, req_id) => {
    stokAwalBarangData = removeDotInRupiahInput(stokAwalBarangData, [
        "jumlah"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StokAwalBarangModel,
        {
            daftar_barang: stokAwalBarangData.daftar_barang,
            daftar_gudang: stokAwalBarangData.daftar_gudang,
            kategori_harga_barang: stokAwalBarangData.kategori_harga_barang,
            jumlah: stokAwalBarangData.jumlah,
            tanggal: stokAwalBarangData.tanggal,
        },
        {
            uuid
        }
    )
}

export const getStokAwalBarangByDaftarGudangDanKategoriHargaBarangRepo = async (daftar_gudang, kategori_harga_barang, req_id) => {
    return await db.query(
        `
            SELECT
                COUNT(0) AS count 
            FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt 
            WHERE sabt.daftar_gudang = "${daftar_gudang}"
            AND sabt.kategori_harga_barang = "${kategori_harga_barang}"
            AND sabt.enabled = 1
            LIMIT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getRiwayatTransaksiPenjualanByStokAwalBarangUuidRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                res.*
            FROM (
                SELECT 
                    ppbt.nomor_pesanan_penjualan_barang AS bukti_transaksi,
                    "pesanan_penjualan" AS type,
                    ppbt.tanggal_pesanan_penjualan_barang AS tanggal,
                    ct.name AS customer,
                    ct.code AS customer_code,
                    JSON_OBJECT(
                        'jumlah', rppbt.jumlah,
                        'diskon_persentase', rppbt.diskon_persentase,
                        'satuan_barang', sbt.name,
                        'total', rppbt.total_harga 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer
                JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = rppbt.kategori_harga_barang 
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
                WHERE rppbt.stok_awal_barang = "${uuid}"
                AND rppbt.enabled = 1
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    fpbt.nomor_faktur_penjualan_barang,
                    "faktur_penjualan_barang" AS type,
                    fpbt.tanggal,
                    ct.name AS customer,
                    ct.code AS customer_code,
                    JSON_OBJECT() AS detail
                FROM ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = fpbt.pesanan_penjualan_barang 
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
                WHERE fpbt.enabled = 1
                AND ppbt.enabled = 1
                AND (
                    SELECT 
                        COUNT(0)
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
                    WHERE rppbt.pesanan_penjualan_barang = ppbt.uuid 
                    AND rppbt.stok_awal_barang = "${uuid}"
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
                FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt2 On rppbt2.uuid = rppbt.rincian_pesanan_penjualan_barang
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_penjualan_barang
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt2.customer
                JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pelunasan_penjualan_barang 
                WHERE rppbt2.stok_awal_barang = "${uuid}"
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
                FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_barang_tab rppdbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt2 On rppbt2.uuid = rppdbt.rincian_pesanan_penjualan_barang
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_penjualan_barang
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt2.customer
                JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt ON ppbt.uuid = rppdbt.pelunasan_penjualan_barang 
                WHERE rppbt2.stok_awal_barang = "${uuid}"
                AND rppdbt.enabled = 1
                AND ppbt.enabled = 1
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    rpbt.bukti_transaksi,
                    "retur_penjualan_barang" AS type,
                    rpbt.tanggal,
                    ct.name AS customer,
                    ct.code AS customer_code,
                    JSON_OBJECT(
                        'retur', rrpbt.retur,
                        'nilai_retur', rrpbt.nilai_retur 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt ON rppbt.uuid = rrpbt.rincian_pesanan_penjualan_barang 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer
                JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_barang 
                WHERE rppbt.stok_awal_barang = "${uuid}"
                AND rrpbt.enabled = 1
                AND ppbt.enabled = 1
                AND rpbt.enabled = 1
                UNION ALL
                SELECT 
                    pdpbt.bukti_transaksi,
                    "pengembalian_denda_penjualan_barang" AS type,
                    pdpbt.tanggal,
                    ct.name AS customer,
                    ct.code AS customer_code,
                    JSON_OBJECT(
                        'denda_dikembalikan', rpdpbt.denda_yang_dikembalikan 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_barang_tab rpdpbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt ON rppbt.uuid = rpdpbt.rincian_pesanan_penjualan_barang 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer
                JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_penjualan_barang 
                WHERE rppbt.stok_awal_barang = "${uuid}"
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

export const getRiwayatTransaksiPembelianByStokAwalBarangUuidRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                res.*
            FROM (
                SELECT 
                    ppbt.nomor_pesanan_pembelian_barang AS bukti_transaksi,
                    "pesanan_pembelian" AS type,
                    ppbt.tanggal_pesanan_pembelian_barang AS tanggal,
                    st.name AS supplier,
                    st.code AS supplier_code,
                    JSON_OBJECT(
                        'jumlah', rppbt.jumlah,
                        'diskon_persentase', rppbt.diskon_persentase,
                        'satuan_barang', sbt.name,
                        'total', rppbt.total_harga 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier
                JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = rppbt.kategori_harga_barang 
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
                WHERE rppbt.stok_awal_barang = "${uuid}"
                AND rppbt.enabled = 1
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    fpbt.nomor_faktur_pembelian_barang,
                    "faktur_pembelian_barang" AS type,
                    fpbt.tanggal,
                    st.name AS supplier,
                    st.code AS supplier_code,
                    JSON_OBJECT() AS detail
                FROM ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = fpbt.pesanan_pembelian_barang 
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier 
                WHERE fpbt.enabled = 1
                AND ppbt.enabled = 1
                AND (
                    SELECT 
                        COUNT(0)
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
                    WHERE rppbt.pesanan_pembelian_barang = ppbt.uuid 
                    AND rppbt.stok_awal_barang = "${uuid}"
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
                FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_barang_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt2 On rppbt2.uuid = rppbt.rincian_pesanan_pembelian_barang
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_pembelian_barang
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt2.supplier
                JOIN ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pelunasan_pembelian_barang 
                WHERE rppbt2.stok_awal_barang = "${uuid}"
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
                FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_barang_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt2 On rppbt2.uuid = rppbt.rincian_pesanan_pembelian_barang
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_pembelian_barang
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt2.supplier
                JOIN ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pelunasan_pembelian_barang 
                WHERE rppbt2.stok_awal_barang = "${uuid}"
                AND rppbt.enabled = 1
                AND ppbt.enabled = 1
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    rpbt.bukti_transaksi,
                    "retur_pembelian_barang" AS type,
                    rpbt.tanggal,
                    st.name AS supplier,
                    st.code AS supplier_code,
                    JSON_OBJECT(
                        'retur', rrpbt.retur,
                        'nilai_retur', rrpbt.nilai_retur 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab rrpbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt ON rppbt.uuid = rrpbt.rincian_pesanan_pembelian_barang 
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier
                JOIN ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_pembelian_barang 
                WHERE rppbt.stok_awal_barang = "${uuid}"
                AND rrpbt.enabled = 1
                AND ppbt.enabled = 1
                AND rpbt.enabled = 1
                UNION ALL
                SELECT 
                    pdpbt.bukti_transaksi,
                    "pengembalian_denda_pembelian_barang" AS type,
                    pdpbt.tanggal,
                    st.name AS supplier,
                    st.code AS supplier_code,
                    JSON_OBJECT(
                        'denda_dikembalikan', rpdpbt.denda_yang_dikembalikan 
                    ) AS detail
                FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_pembelian_barang_tab rpdpbt 
                JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt ON rppbt.uuid = rpdpbt.rincian_pesanan_pembelian_barang 
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier
                JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_pembelian_barang_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_pembelian_barang 
                WHERE rppbt.stok_awal_barang = "${uuid}"
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

export const checkStokAwalBarangAllowToEditRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                (
                    SELECT 
                        JSON_OBJECT(
                            'nomor_pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                            'tanggal', ppbt.tanggal_pesanan_penjualan_barang
                        ) 
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
                    JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
                    WHERE rppbt.stok_awal_barang = sabt.uuid
                    AND rppbt.enabled = 1
                    LIMIT 1
                ) AS pesanan_penjualan_barang, 
                (
                    SELECT 
                        JSON_OBJECT(
                            'nomor_pesanan_pembelian_barang', ppbt.nomor_pesanan_pembelian_barang,
                            'tanggal', ppbt.tanggal_pesanan_pembelian_barang
                        ) 
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
                    JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang 
                    WHERE rppbt.stok_awal_barang = sabt.uuid
                    AND rppbt.enabled = 1
                    LIMIT 1
                ) AS pesanan_pembelian_barang,
                (
                    SELECT 
                        JSON_OBJECT(
                            'kode_transfer_barang', tbt.kode_transfer_barang,
                            'tanggal', tbt.tanggal 
                        ) 
                    FROM ${generateDatabaseName(req_id)}.rincian_transfer_barang_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.transfer_barang_tab tbt ON tbt.uuid = rtbt.transfer_barang 
                    WHERE rtbt.enabled = 1
                    AND tbt.enabled = 1
                    AND (
                        rtbt.stok_awal_barang = sabt.uuid 
                        OR rtbt.stok_awal_barang_tujuan = sabt.uuid 
                    )
                    LIMIT 1
                ) AS transfer_barang,
                (
                    SELECT 
                        JSON_OBJECT(
                            'kode_konversi_barang', kbt.kode_konversi_barang,
                            'tanggal', kbt.tanggal 
                        )
                    FROM ${generateDatabaseName(req_id)}.rincian_konversi_barang_tab rkbt 
                    JOIN ${generateDatabaseName(req_id)}.konversi_barang_tab kbt ON kbt.uuid = rkbt.konversi_barang 
                    WHERE rkbt.enabled = 1
                    AND kbt.enabled = 1
                    AND (
                        rkbt.stok_awal_barang = sabt.uuid
                        OR rkbt.stok_awal_barang_tujuan = sabt.uuid
                    )
                    LIMIT 1
                ) AS konversi_barang,
                sabt.*
            FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt 
            WHERE sabt.uuid = "${uuid}"
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}