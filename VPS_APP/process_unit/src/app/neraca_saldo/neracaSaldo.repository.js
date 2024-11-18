import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import { generateDatabaseName } from "../../utils/databaseUtil.js";
import { payrollPegawaiNeracaSaldo } from "../../config/viewDatabase/payrollPegawaiViewQueryBuilder.js";

export const getNeracaSaldoByBulanRepo = async (bulan, tahun, whereIN, req_id) => {
    const neracaSaldo = await db.query(
        `   
            SELECT 
                res.kode_akun_perkiraan AS kode_akun_uuid,
                res.bulan,
                res.tahun,
                SUM(res.debet) - SUM(res.kredit) AS sum_result,
                kapt.name AS kode_akun_perkiraan_name,
                kapt.code AS kode_akun_perkiraan_code,
                kapt.type AS kode_akun_perkiraan_type
            FROM (
                SELECT
                    jut.kode_akun_uuid AS kode_akun_perkiraan,
                    jut.bulan,
                    jut.tahun,
                    jut.debet,
                    jut.kredit
                FROM ${generateDatabaseName(req_id)}.jurnal_umum_tab jut 
                WHERE jut.enabled = 1
                UNION ALL
                SELECT 
                    tkt.kode_akun_perkiraan,
                    LPAD(MONTH(tkt.tanggal), 2, '0') AS bulan,
                    YEAR(tkt.tanggal) AS tahun,
                    CASE 
                        WHEN tkt.type = 1
                        THEN tkt.nilai
                        ELSE 0
                    END AS debet,
                    CASE 
                        WHEN tkt.type = 0
                        THEN tkt.nilai
                        ELSE 0
                    END AS kredit
                FROM ${generateDatabaseName(req_id)}.transaksi_kas_tab tkt 
                WHERE tkt.enabled = 1
                UNION ALL
                SELECT 
                    rtkt.kode_akun_perkiraan,
                    LPAD(MONTH(tkt.tanggal), 2, '0') AS bulan,
                    YEAR(tkt.tanggal) AS tahun,
                    CASE 
                        WHEN tkt.type = 1
                        THEN 0
                        ELSE rtkt.nilai 
                    END AS debet,
                    CASE 
                        WHEN tkt.type = 0
                        THEN 0
                        ELSE rtkt.nilai 
                    END AS kredit
                FROM ${generateDatabaseName(req_id)}.rincian_transaksi_kas_tab rtkt 
                JOIN ${generateDatabaseName(req_id)}.transaksi_kas_tab tkt ON tkt.uuid = rtkt.transaksi_kas 
                WHERE tkt.enabled = 1 AND rtkt.enabled = 1
                UNION ALL
                SELECT 
                    tbt.kode_akun_perkiraan,
                    LPAD(MONTH(tbt.tanggal), 2, '0') AS bulan,
                    YEAR(tbt.tanggal) AS tahun,
                    CASE 
                        WHEN tbt.type = 1
                        THEN tbt.nilai
                        ELSE 0
                    END AS debet,
                    CASE 
                        WHEN tbt.type = 0
                        THEN tbt.nilai
                        ELSE 0
                    END AS kredit
                FROM ${generateDatabaseName(req_id)}.transaksi_bank_tab tbt 
                WHERE tbt.enabled = 1
                UNION ALL
                SELECT 
                    rtbt.kode_akun_perkiraan,
                    LPAD(MONTH(tbt.tanggal), 2, '0') AS bulan,
                    YEAR(tbt.tanggal) AS tahun,
                    CASE 
                        WHEN tbt.type = 1
                        THEN 0
                        ELSE rtbt.nilai 
                    END AS debet,
                    CASE 
                        WHEN tbt.type = 0
                        THEN 0
                        ELSE rtbt.nilai 
                    END AS kredit
                FROM ${generateDatabaseName(req_id)}.rincian_transaksi_bank_tab rtbt 
                JOIN ${generateDatabaseName(req_id)}.transaksi_bank_tab tbt ON tbt.uuid = rtbt.transaksi_bank 
                WHERE tbt.enabled = 1 AND rtbt.enabled = 1
                UNION ALL 
                ${payrollPegawaiNeracaSaldo(req_id)}
                UNION ALL
                SELECT 
                    psojt.kode_akun_perkiraan,
                    LPAD(MONTH(psojt.tanggal), 2, '0') AS bulan,
                    YEAR(psojt.tanggal) AS tahun,
                    psojt.debet,
                    psojt.kredit 
                FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_jurnal_tab psojt
                UNION ALL
                SELECT 
                    "c85ac20d-1b1e-45c5-80e1-8db80c5dd283" AS kode_akun_perkiraan,
                    LPAD(MONTH(dpt.tanggal_beli), 2, '0') AS bulan,
                    YEAR(dpt.tanggal_beli) AS tahun,
                    dpt.kuantitas * dpt.harga_satuan AS debet,
                    0 AS kredit
                FROM ${generateDatabaseName(req_id)}.daftar_perlengkapan_tab dpt
                WHERE dpt.enabled = 1
                UNION ALL
                SELECT 
                    "6e376191-0454-4172-a78b-2bc5f9c8fd6e" AS kode_akun_perkiraan,
                    LPAD(MONTH(dpt.tanggal_beli), 2, '0') AS bulan,
                    YEAR(dpt.tanggal_beli) AS tahun,
                    0 AS debet,
                    dpt.kuantitas * dpt.harga_satuan AS kredit
                FROM ${generateDatabaseName(req_id)}.daftar_perlengkapan_tab dpt 
                WHERE dpt.enabled = 1
                UNION ALL
                SELECT 
                    "a88b16d3-4071-4503-9c5b-17cdac4a411f" AS kode_akun_perkiraan,
                    LPAD(MONTH(dat.tanggal_beli), 2, '0') AS bulan,
                    YEAR(dat.tanggal_beli) AS tahun,
                    dat.harga_satuan * dat.kuantitas AS debet,
                    0 AS kredit
                FROM ${generateDatabaseName(req_id)}.daftar_aset_tab dat 
                WHERE dat.enabled = 1
                UNION ALL
                SELECT 
                    dat.kode_akun_perkiraan,
                    LPAD(MONTH(dat.tanggal_beli), 2, '0') AS bulan,
                    YEAR(dat.tanggal_beli) AS tahun,
                    0 AS debet,
                    dat.harga_satuan * dat.kuantitas AS kredit
                FROM ${generateDatabaseName(req_id)}.daftar_aset_tab dat 
                WHERE dat.enabled = 1
                UNION ALL
                SELECT 
                    "915ac6e8-c528-4f10-9215-74fda0b1c99e" AS kode_akun_perkiraan,
                    LPAD(hpt.bulan, 2, '0') AS bulan,
                    hpt.tahun AS tahun,
                    CASE
                        WHEN hpt.nilai_penyusutan > 0
                        THEN hpt.nilai_penyusutan * dat.kuantitas 
                        ELSE 0
                    END AS debet,
                    0 AS kredit
                FROM ${generateDatabaseName(req_id)}.hitungan_penyusutan_tab hpt 
                JOIN ${generateDatabaseName(req_id)}.daftar_aset_tab dat ON dat.uuid = hpt.daftar_aset
                WHERE hpt.enabled = 1
                AND dat.enabled = 1
                UNION ALL
                SELECT 
                    "a88b16d3-4071-4503-9c5b-17cdac4a411f" AS kode_akun_perkiraan,
                    LPAD(hpt.bulan, 2, '0') AS bulan,
                    hpt.tahun AS tahun,
                    0 AS debet,
                    CASE
                        WHEN hpt.nilai_penyusutan > 0
                        THEN hpt.nilai_penyusutan * dat.kuantitas 
                        ELSE 0
                    END AS kredit
                FROM ${generateDatabaseName(req_id)}.hitungan_penyusutan_tab hpt 
                JOIN ${generateDatabaseName(req_id)}.daftar_aset_tab dat ON dat.uuid = hpt.daftar_aset
                WHERE hpt.enabled = 1
                AND dat.enabled = 1
            ) AS res
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = res.kode_akun_perkiraan
            AND res.bulan = "${bulan}" 
            AND res.tahun = "${tahun}"
            AND kapt.enabled = 1
            ${whereIN != null && whereIN.length > 0 ? `AND kapt.type IN ( "` + whereIN.join(`","`) + `" )` : ""}
            GROUP BY res.kode_akun_perkiraan 
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