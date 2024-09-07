import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import StokAwalBarangModel from "./stokAwalBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

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

export const getStokAwalBarangByBarangUUIDRepo = async (uuid, req_id) => {
    const stokAwalBarangs = await db.query(
        // `
        //     SELECT 
        //         sabt.*,
        //         dgt.name AS daftar_gudang_name,
        //         sbt.name AS satuan_barang_name,
        //         IFNULL((
        //             SELECT 
        //                 SUM(rppt.jumlah) - IFNULL((
        //                     SELECT 
        //                         SUM(rrpt.retur)
        //                     FROM rincian_retur_penjualan_tab rrpt 
        //                     JOIN retur_penjualan_tab rpt ON rpt.uuid = rrpt.retur_penjualan
        //                     WHERE rrpt.rincian_pesanan_penjualan = rppt.uuid
        //                 ), 0)
        //             FROM rincian_pesanan_penjualan_tab rppt 
        //             JOIN pesanan_penjualan_tab ppt ON ppt.uuid = rppt.pesanan_penjualan 
        //             JOIN faktur_penjualan_tab fpt ON fpt.pesanan_penjualan = ppt.uuid 
        //             WHERE rppt.kategori_harga = sabt.kategori_harga 
        //         ), 0) AS jumlah_penjualan,
        //         IFNULL((
        //             SELECT 
        //                 SUM(rppt.jumlah) - IFNULL((
        //                     SELECT 
        //                         SUM(rrpt.retur)
        //                     FROM rincian_retur_pembelian_tab rrpt 
        //                     JOIN retur_pembelian_tab rpt ON rpt.uuid = rrpt.retur_pembelian
        //                     WHERE rrpt.rincian_pesanan_pembelian = rppt.uuid
        //                 ), 0)
        //             FROM rincian_pesanan_pembelian_tab rppt 
        //             JOIN pesanan_pembelian_tab ppt ON ppt.uuid = rppt.pesanan_pembelian 
        //             JOIN faktur_pembelian_tab fpt ON fpt.pesanan_pembelian = ppt.uuid 
        //             WHERE rppt.kategori_harga = sabt.kategori_harga 
        //         ), 0) AS jumlah_pembelian,
        //         IFNULL((
        //             SELECT 
        //                 SUM(rtbt.jumlah)
        //             FROM rincian_transfer_barang_tab rtbt 
        //             JOIN transfer_barang_tab tbt ON tbt.uuid = rtbt.transfer_barang 
        //             WHERE sabt.gudang = tbt.gudang_asal
        //             AND rtbt.stok_awal_barang = sabt.uuid 
        //         ), 0) AS transfer_barang_keluar, 
        //         IFNULL((
        //             SELECT 
        //                 SUM(rtbt.jumlah)
        //             FROM rincian_transfer_barang_tab rtbt 
        //             JOIN transfer_barang_tab tbt ON tbt.uuid = rtbt.transfer_barang 
        //             WHERE sabt.gudang != tbt.gudang_asal
        //             AND rtbt.stok_awal_barang = sabt.uuid 
        //         ), 0) AS transfer_barang_masuk, 
        //         IFNULL((
        //             SELECT 
        //                 SUM(kbt.jumlah_stok_awal_barang_asal)
        //             FROM konversi_barang_tab kbt 
        //             WHERE kbt.stok_awal_barang_asal = sabt.uuid
        //         ), 0) AS konversi_barang_keluar,
        //         IFNULL((
        //             SELECT 
        //                 SUM(kbt.jumlah_stok_awal_barang_akhir)
        //             FROM konversi_barang_tab kbt 
        //             WHERE kbt.stok_awal_barang_akhir = sabt.uuid
        //         ), 0) AS konversi_barang_masuk,
        //         IFNULL((
        //             SELECT
        //                 SUM(rtbt2.jumlah)
        //             FROM rincian_tunjangan_barang_tab rtbt2 
        //             JOIN tunjangan_barang_tab tbt2 ON tbt2.uuid = rtbt2.tunjangan_barang
        //             WHERE rtbt2.stok_awal_barang = sabt.uuid
        //         ), 0) AS tunjangan_barang,
        //         IFNULL((
        //             SELECT 
        //                 ppt.kuantitas 
        //             FROM penyesuaian_persediaan_tab ppt 
        //             JOIN hasil_stok_opname_tab hsot ON hsot.uuid = ppt.hasil_stok_opname 
        //             JOIN perintah_stok_opname_tab psot ON psot.uuid = hsot.perintah_stok_opname 
        //             WHERE hsot.stok_awal_barang = sabt.uuid 
        //             ORDER BY psot.tanggal DESC LIMIT 1
        //         ), 0) AS penyesuaian_persediaan
        //     FROM stok_awal_barang_tab sabt 
        //     JOIN daftar_gudang_tab dgt ON sabt.gudang = dgt.uuid 
        //     JOIN kategori_harga_tab kht ON kht.uuid = sabt.kategori_harga 
        //     JOIN satuan_barang_tab sbt ON sbt.uuid = kht.satuan_barang 
        //     WHERE sabt.daftar_barang = "${uuid}"
        // `,
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
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return stokAwalBarangs
}

export const createStokAwalBarangRepo = async (stokAwalBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StokAwalBarangModel,
        {
            daftar_barang: stokAwalBarangData.daftar_barang,
            daftar_gudang: stokAwalBarangData.daftar_gudang,
            kategori_harga_barang: stokAwalBarangData.kategori_harga_barang,
            jumlah: stokAwalBarangData.jumlah,
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
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StokAwalBarangModel,
        {
            daftar_barang: stokAwalBarangData.daftar_barang,
            daftar_gudang: stokAwalBarangData.daftar_gudang,
            kategori_harga_barang: stokAwalBarangData.kategori_harga_barang,
            jumlah: stokAwalBarangData.jumlah,
        },
        {
            uuid
        }
    )
}