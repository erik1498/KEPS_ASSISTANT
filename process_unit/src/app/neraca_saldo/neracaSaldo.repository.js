import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import { generateDatabaseName } from "../../utils/databaseUtil.js";

export const getNeracaSaldoByBulanRepo = async (bulan, tahun, whereIN, req_id) => {
    const neracaSaldo = await db.query(
        `   
            SELECT
                jut.kode_akun_uuid,
                jut.bulan,
                jut.tahun,
                SUM(jut.debet) - SUM(jut.kredit) AS sum_result,
                kapt.name AS kode_akun_perkiraan_name,
                kapt.code AS kode_akun_perkiraan_code,
                kapt.type AS kode_akun_perkiraan_type
            FROM ${generateDatabaseName(req_id)}.jurnal_umum_tab jut 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = jut.kode_akun_uuid 
            WHERE jut.enabled = 1
            AND jut.bulan = "${bulan}" 
            AND jut.tahun = "${tahun}"
            ${whereIN != null && whereIN.length > 0 ? `AND kapt.type IN ( "` + whereIN.join(`","`) + `" )` : ""}
            GROUP BY jut.kode_akun_uuid 
            ORDER BY kapt.code ASC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return neracaSaldo
}

export const getPembatalanPenjualanJasaByBulanRepo = async (tahun, bulan, req_id) => {
    const pembatalanPenjualanJasa = await db.query(
        `
            SELECT 
                ppjt.uuid, 
                (
                    SELECT IFNULL(SUM(harga), 0) FROM ${generateDatabaseName(req_id)}.rincian_pembatalan_penjualan_jasa_tab rppjt 
                    WHERE rppjt.faktur_penjualan_jasa_uuid = fpjt.uuid 
                    AND rppjt.status = 1
                ) AS nilai
            FROM ${generateDatabaseName(req_id)}.pembatalan_penjualan_jasa_tab ppjt 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpjt ON fpjt.uuid = ppjt.faktur_penjualan_jasa 
            WHERE fpjt.tanggal <= "${tahun}-${bulan}-31" AND fpjt.tanggal >= "${tahun}-${bulan}-01"
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return pembatalanPenjualanJasa
}

export const getFakturPenjualanJasaByBulanRepo = async (tahun, bulan, req_id) => {
    const pesananPenjualanJasa = await db.query(
        `            
            SELECT
            (
                SELECT IFNULL(SUM(harga), 0) FROM ${generateDatabaseName(req_id)}.rincian_faktur_penjualan_jasa_tab rfpjt 
                WHERE rfpjt.faktur_penjualan_jasa = fpjt.uuid 
            ) AS hutang, fpjt.uuid 
            FROM ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpjt 
            WHERE fpjt.tanggal <= "${tahun}-${bulan}-31" AND fpjt.tanggal >= "${tahun}-${bulan}-01"
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return pesananPenjualanJasa
}

export const getFakturPenjualanBarangByBulanRepo = async (tahun, bulan, req_id) => {
    const pesananPenjualanBarang = await db.query(
        `            
            SELECT 
                fpt.*,
                tpt.name AS tipe_pembayaran,
                (
                    SELECT IFNULL(SUM(harga * jumlah) + SUM(ppn * jumlah) , 0) FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_tab rppt 
                    WHERE rppt.pesanan_penjualan = ppt.uuid
                ) AS total,
                (
                    SELECT IFNULL(SUM(ppn * jumlah) , 0) FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_tab rppt 
                    WHERE rppt.pesanan_penjualan = ppt.uuid
                ) AS ppn,
                (
                    SELECT IFNULL(SUM(harga * jumlah) , 0) FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_tab rppt 
                    WHERE rppt.pesanan_penjualan = ppt.uuid
                ) AS dpp
            FROM ${generateDatabaseName(req_id)}.faktur_penjualan_tab fpt 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_tab ppt ON ppt.uuid = fpt.pesanan_penjualan 
            JOIN ${generateDatabaseName(req_id)}.tipe_pembayaran_tab tpt ON tpt.uuid = fpt.tipe_pembayaran 
            WHERE fpt.tanggal <= "${tahun}-${bulan}-31" AND fpt.tanggal >= "${tahun}-${bulan}-01"
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return pesananPenjualanBarang
}

export const getPelunasanPenjualanBarangByBulanRepo = async (tahun, bulan) => {
    const pesananPenjualanBarang = await db.query(
        `   
            SELECT * FROM (
                SELECT 
                    ppt.uuid AS pelunasan_pembayaran,
                    kapt.code AS kode_akun,
                    kapt.name AS nama_akun,
                    kapt.type AS type_akun,
                    (
                        SELECT SUM(IFNULL(nilai, 0)) FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_tab rppt 
                        WHERE rppt.pelunasan_penjualan = ppt.uuid 
                    ) AS sudah_dibayar,
                    fpt.no_faktur_penjualan, fpt.uuid AS faktur_penjualan, ppt2.uuid AS pesanan_penjualan 
                FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_tab ppt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ppt.kode_akun 
                JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_tab fpt ON fpt.uuid = ppt.faktur_penjualan 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_tab ppt2 ON ppt2.uuid = fpt.pesanan_penjualan 
                JOIN ${generateDatabaseName(req_id)}.tipe_pembayaran_tab tpt ON tpt.uuid = fpt.tipe_pembayaran
                WHERE ppt.tanggal <= "${tahun}-${bulan}-31" AND ppt.tanggal >= "${tahun}-${bulan}-01"
            ) AS res WHERE res.sudah_dibayar > 0
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return pesananPenjualanBarang
}

export const getReturPenjualanBarangByBulanRepo = async (tahun, bulan) => {
    const pesananPenjualanBarang = await db.query(
        `            
            SELECT 
                SUM(rrpt.harga * rrpt.retur) AS dpp,
                SUM(rrpt.ppn * rrpt.retur) AS ppn,
                (
                    SUM(rrpt.harga * rrpt.retur) + SUM(rrpt.ppn * rrpt.retur)
                ) AS total,
                tpt.name AS tipe_pembayaran,
                kapt.code AS kode_akun
            FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_tab rrpt
            JOIN ${generateDatabaseName(req_id)}.retur_penjualan_tab rpt ON rpt.uuid = rrpt.retur_penjualan_uuid 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_tab fpt ON fpt.uuid = rpt.faktur_penjualan
            JOIN ${generateDatabaseName(req_id)}.tipe_pembayaran_tab tpt ON tpt.uuid = fpt.tipe_pembayaran 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_tab ppt ON ppt.uuid = fpt.pesanan_penjualan      
            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_tab ppt2 ON ppt2.faktur_penjualan = fpt.uuid
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ppt2.kode_akun 
            WHERE rrpt.tanggal <= "${tahun}-${bulan}-31" AND rrpt.tanggal >= "${tahun}-${bulan}-01"
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return pesananPenjualanBarang
}