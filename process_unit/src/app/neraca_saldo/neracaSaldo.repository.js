import { Sequelize } from "sequelize";
import db from "../../config/Database.js";

export const getNeracaSaldoByBulanRepo = async (bulan, tahun, whereIN) => {
    const neracaSaldo = await db.query(
        `   
            SELECT 
                CASE
                    WHEN LENGTH(res.debet - res.kredit) - LENGTH(REPLACE(res.debet - res.kredit, '.', '')) > 0
                    THEN
                        CASE
                            WHEN LENGTH(SUBSTRING_INDEX(res.debet - res.kredit, ".", -1)) = 1
                            THEN CONCAT(SUBSTRING_INDEX(res.debet - res.kredit, ".", 1), ".", SUBSTRING_INDEX(res.debet - res.kredit, ".", -1), "0")
                            ELSE res.debet - res.kredit
                        END
                    ELSE res.debet - res.kredit
                END AS sum_result,
                res.kode_akun_perkiraan_name,
                res.kode_akun_perkiraan_code,
                res.kode_akun_perkiraan_type
            FROM
            (
                SELECT 
                    CASE
                        WHEN SUM(res.debet_after_titik) > 0
                        THEN CONCAT(SUM(res.debet), (
                            CASE 
                                WHEN SUM(res.debet_after_titik) < 10
                                THEN CONCAT(".0", SUM(res.debet_after_titik))
                                ELSE CONCAT(".", SUM(res.debet_after_titik))
                            END
                        ))
                        ELSE SUM(res.debet)
                    END AS debet,
                    CASE
                        WHEN SUM(res.kredit_after_titik) > 0
                        THEN CONCAT(SUM(res.kredit), (
                            CASE 
                                WHEN SUM(res.kredit_after_titik) < 10
                                THEN CONCAT(".0", SUM(res.kredit_after_titik))
                                ELSE CONCAT(".", SUM(res.kredit_after_titik))
                            END
                        ))
                        ELSE SUM(res.kredit)
                    END AS kredit,
                    kapt.name AS kode_akun_perkiraan_name, 
                    kapt.code AS kode_akun_perkiraan_code, 
                    kapt.type AS kode_akun_perkiraan_type
                FROM
                (
                    SELECT 
                        SUBSTRING_INDEX(jut.debet, ".", 1) AS debet,
                        SUBSTRING_INDEX(jut.kredit, ".", 1) AS kredit,
                        CASE 
                            WHEN LENGTH(jut.debet) - LENGTH(REPLACE(jut.debet, '.', '')) > 0
                            THEN SUBSTRING_INDEX(jut.debet, ".", -1)
                            ELSE "0"
                        END AS debet_after_titik,
                        CASE 
                            WHEN LENGTH(jut.kredit) - LENGTH(REPLACE(jut.kredit, '.', '')) > 0
                            THEN SUBSTRING_INDEX(jut.kredit, ".", -1)
                            ELSE "0"
                        END AS kredit_after_titik,
                        jut.kode_akun_uuid,
                        jut.bulan AS bulan,
                        jut.tahun AS tahun
                    FROM jurnal_umum_tab jut 
                    WHERE jut.enabled = 1
                ) AS res
                JOIN kode_akun_perkiraan_tab kapt ON kapt.uuid = res.kode_akun_uuid
                WHERE res.bulan = "${bulan}" AND res.tahun = "${tahun}"
                ${whereIN != null && whereIN.length > 0 ? `AND kapt.type IN ( "` + whereIN.join(`","`) + `" )` : ""}
                GROUP BY kapt.code
            ) AS res
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return neracaSaldo
}

export const getPembatalanPenjualanJasaByBulanRepo = async (tahun, bulan) => {
    const pembatalanPenjualanJasa = await db.query(
        `
            SELECT 
                ppjt.uuid, 
                (
                    SELECT IFNULL(SUM(harga), 0) FROM rincian_pembatalan_penjualan_jasa_tab rppjt 
                    WHERE rppjt.faktur_penjualan_jasa_uuid = fpjt.uuid 
                    AND rppjt.status = 1
                ) AS nilai
            FROM pembatalan_penjualan_jasa_tab ppjt 
            JOIN faktur_penjualan_jasa_tab fpjt ON fpjt.uuid = ppjt.faktur_penjualan_jasa 
            WHERE fpjt.tanggal <= "${tahun}-${bulan}-31" AND fpjt.tanggal >= "${tahun}-${bulan}-01"
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return pembatalanPenjualanJasa
}

export const getFakturPenjualanJasaByBulanRepo = async (tahun, bulan) => {
    const pesananPenjualanJasa = await db.query(
        `            
            SELECT
            (
                SELECT IFNULL(SUM(harga), 0) FROM rincian_faktur_penjualan_jasa_tab rfpjt 
                WHERE rfpjt.faktur_penjualan_jasa = fpjt.uuid 
            ) AS hutang, fpjt.uuid 
            FROM faktur_penjualan_jasa_tab fpjt 
            WHERE fpjt.tanggal <= "${tahun}-${bulan}-31" AND fpjt.tanggal >= "${tahun}-${bulan}-01"
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return pesananPenjualanJasa
}

export const getFakturPenjualanBarangByBulanRepo = async (tahun, bulan) => {
    const pesananPenjualanBarang = await db.query(
        `            
            SELECT 
                fpt.*,
                tpt.name AS tipe_pembayaran,
                (
                    SELECT IFNULL(SUM(harga * jumlah) + SUM(ppn * jumlah) , 0) FROM rincian_pesanan_penjualan_tab rppt 
                    WHERE rppt.pesanan_penjualan = ppt.uuid
                ) AS total,
                (
                    SELECT IFNULL(SUM(ppn * jumlah) , 0) FROM rincian_pesanan_penjualan_tab rppt 
                    WHERE rppt.pesanan_penjualan = ppt.uuid
                ) AS ppn,
                (
                    SELECT IFNULL(SUM(harga * jumlah) , 0) FROM rincian_pesanan_penjualan_tab rppt 
                    WHERE rppt.pesanan_penjualan = ppt.uuid
                ) AS dpp
            FROM faktur_penjualan_tab fpt 
            JOIN pesanan_penjualan_tab ppt ON ppt.uuid = fpt.pesanan_penjualan 
            JOIN tipe_pembayaran_tab tpt ON tpt.uuid = fpt.tipe_pembayaran 
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
                        SELECT SUM(IFNULL(nilai, 0)) FROM rincian_pelunasan_penjualan_tab rppt 
                        WHERE rppt.pelunasan_penjualan = ppt.uuid 
                    ) AS sudah_dibayar,
                    fpt.no_faktur_penjualan, fpt.uuid AS faktur_penjualan, ppt2.uuid AS pesanan_penjualan 
                FROM pelunasan_penjualan_tab ppt 
                JOIN kode_akun_perkiraan_tab kapt ON kapt.uuid = ppt.kode_akun 
                JOIN faktur_penjualan_tab fpt ON fpt.uuid = ppt.faktur_penjualan 
                JOIN pesanan_penjualan_tab ppt2 ON ppt2.uuid = fpt.pesanan_penjualan 
                JOIN tipe_pembayaran_tab tpt ON tpt.uuid = fpt.tipe_pembayaran
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
                SUM(rincian_retur_penjualan_tab.harga * rincian_retur_penjualan_tab.retur) AS dpp,
                SUM(rincian_retur_penjualan_tab.ppn * rincian_retur_penjualan_tab.retur) AS ppn,
                (
                    SUM(rincian_retur_penjualan_tab.harga * rincian_retur_penjualan_tab.retur) + SUM(rincian_retur_penjualan_tab.ppn * rincian_retur_penjualan_tab.retur)
                ) AS total,
                tipe_pembayaran_tab.name AS tipe_pembayaran,
                kode_akun_perkiraan_tab.code AS kode_akun
            FROM rincian_retur_penjualan_tab 
            JOIN retur_penjualan_tab ON retur_penjualan_tab.uuid = rincian_retur_penjualan_tab.retur_penjualan_uuid 
            JOIN faktur_penjualan_tab ON faktur_penjualan_tab.uuid = retur_penjualan_tab.faktur_penjualan
            JOIN tipe_pembayaran_tab ON tipe_pembayaran_tab.uuid = faktur_penjualan_tab.tipe_pembayaran 
            JOIN pesanan_penjualan_tab ON pesanan_penjualan_tab.uuid = faktur_penjualan_tab.pesanan_penjualan      
            JOIN pelunasan_penjualan_tab ON pelunasan_penjualan_tab.faktur_penjualan = faktur_penjualan_tab.uuid
            JOIN kode_akun_perkiraan_tab ON kode_akun_perkiraan_tab.uuid = pelunasan_penjualan_tab.kode_akun 
            WHERE rincian_retur_penjualan_tab.tanggal <= "${tahun}-${bulan}-31" AND rincian_retur_penjualan_tab.tanggal >= "${tahun}-${bulan}-01"
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return pesananPenjualanBarang
}