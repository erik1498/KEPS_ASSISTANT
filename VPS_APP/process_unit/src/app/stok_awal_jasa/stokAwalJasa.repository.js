import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import StokAwalJasaModel from "./stokAwalJasa.model.js";
import { generateDatabaseName, insertQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
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

export const getStokAwalJasaByJasaUUIDRepo = async (uuid, req_id) => {
    const stokAwalJasas = await db.query(
        // `
        //     SELECT 
        //         sajt.*,
        //         dgt.name AS daftar_gudang_name,
        //         sjt.name AS satuan_jasa_name,
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
        //             WHERE rppt.kategori_harga = sajt.kategori_harga 
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
        //             WHERE rppt.kategori_harga = sajt.kategori_harga 
        //         ), 0) AS jumlah_pembelian,
        //         IFNULL((
        //             SELECT 
        //                 SUM(rtjt.jumlah)
        //             FROM rincian_transfer_jasa_tab rtjt 
        //             JOIN transfer_jasa_tab tjt ON tjt.uuid = rtjt.transfer_jasa 
        //             WHERE sajt.gudang = tjt.gudang_asal
        //             AND rtjt.stok_awal_jasa = sajt.uuid 
        //         ), 0) AS transfer_jasa_keluar, 
        //         IFNULL((
        //             SELECT 
        //                 SUM(rtjt.jumlah)
        //             FROM rincian_transfer_jasa_tab rtjt 
        //             JOIN transfer_jasa_tab tjt ON tjt.uuid = rtjt.transfer_jasa 
        //             WHERE sajt.gudang != tjt.gudang_asal
        //             AND rtjt.stok_awal_jasa = sajt.uuid 
        //         ), 0) AS transfer_jasa_masuk, 
        //         IFNULL((
        //             SELECT 
        //                 SUM(kjt.jumlah_stok_awal_jasa_asal)
        //             FROM konversi_jasa_tab kjt 
        //             WHERE kjt.stok_awal_jasa_asal = sajt.uuid
        //         ), 0) AS konversi_jasa_keluar,
        //         IFNULL((
        //             SELECT 
        //                 SUM(kjt.jumlah_stok_awal_jasa_akhir)
        //             FROM konversi_jasa_tab kjt 
        //             WHERE kjt.stok_awal_jasa_akhir = sajt.uuid
        //         ), 0) AS konversi_jasa_masuk,
        //         IFNULL((
        //             SELECT
        //                 SUM(rtjt2.jumlah)
        //             FROM rincian_tunjangan_jasa_tab rtjt2 
        //             JOIN tunjangan_jasa_tab tjt2 ON tjt2.uuid = rtjt2.tunjangan_jasa
        //             WHERE rtjt2.stok_awal_jasa = sajt.uuid
        //         ), 0) AS tunjangan_jasa,
        //         IFNULL((
        //             SELECT 
        //                 ppt.kuantitas 
        //             FROM penyesuaian_persediaan_tab ppt 
        //             JOIN hasil_stok_opname_tab hsot ON hsot.uuid = ppt.hasil_stok_opname 
        //             JOIN perintah_stok_opname_tab psot ON psot.uuid = hsot.perintah_stok_opname 
        //             WHERE hsot.stok_awal_jasa = sajt.uuid 
        //             ORDER BY psot.tanggal DESC LIMIT 1
        //         ), 0) AS penyesuaian_persediaan
        //     FROM stok_awal_jasa_tab sajt 
        //     JOIN daftar_gudang_tab dgt ON sajt.gudang = dgt.uuid 
        //     JOIN kategori_harga_tab kht ON kht.uuid = sajt.kategori_harga 
        //     JOIN satuan_jasa_tab sjt ON sjt.uuid = kht.satuan_jasa 
        //     WHERE sajt.daftar_jasa = "${uuid}"
        // `,
        `
            SELECT 
                sajt.*,
                dgt.name AS daftar_gudang_name,
                khjt.kode_jasa AS kategori_harga_jasa_kode_jasa,
                sjt.name AS satuan_jasa_name
            FROM ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sajt
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sajt.daftar_gudang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khjt ON khjt.uuid = sajt.kategori_harga_jasa 
            JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sjt ON sjt.uuid = khjt.satuan_jasa 
            WHERE sajt.daftar_jasa = "${uuid}"
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
            daftar_gudang: stokAwalJasaData.daftar_gudang,
            kategori_harga_jasa: stokAwalJasaData.kategori_harga_jasa,
            jumlah: stokAwalJasaData.jumlah,
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
            daftar_gudang: stokAwalJasaData.daftar_gudang,
            kategori_harga_jasa: stokAwalJasaData.kategori_harga_jasa,
            jumlah: stokAwalJasaData.jumlah,
        },
        {
            uuid
        }
    )
}

export const getStokAwalJasaByDaftarGudangDanKategoriHargaJasaRepo = async(daftar_gudang, kategori_harga_jasa, req_id) => {
    return await db.query(
        `
            SELECT
                COUNT(0) AS count 
            FROM ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sajt 
            WHERE sajt.daftar_gudang = "${daftar_gudang}"
            AND sajt.kategori_harga_jasa = "${kategori_harga_jasa}"
            AND sajt.enabled = 1
            LIMIT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}