import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import HitunganPenyusutanModel from "./hitunganPenyusutan.model.js";
import { generateDatabaseName, insertQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getHitunganPenyusutanByUuidRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                hpt.*
            FROM ${generateDatabaseName(req_id)}.hitungan_penyusutan_tab hpt 
            WHERE hpt.daftar_aset = "${uuid}"
            AND hpt.enabled = 1
            ORDER BY hpt.transaksi ASC 
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const createHitunganPenyusutanRepo = async (hitunganPenyusutanData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        HitunganPenyusutanModel,
        {
            daftar_aset: hitunganPenyusutanData.daftar_aset,
            transaksi: hitunganPenyusutanData.transaksi,
            tahun_perolehan: hitunganPenyusutanData.tahun_perolehan,
            bulan: hitunganPenyusutanData.bulan,
            tahun: hitunganPenyusutanData.tahun,
            harga_beli: hitunganPenyusutanData.harga_beli,
            masa_awal: hitunganPenyusutanData.masa_awal,
            masa_akhir: hitunganPenyusutanData.masa_akhir,
            nilai_buku: hitunganPenyusutanData.nilai_buku,
            nilai_penyusutan: hitunganPenyusutanData.nilai_penyusutan,
            persentase: hitunganPenyusutanData.persentase,
            metode_penyusutan: hitunganPenyusutanData.metode_penyusutan,
            akumulasi_penyusutan_awal_tahun: hitunganPenyusutanData.akumulasi_penyusutan_awal_tahun,
            persentase_penyusutan: hitunganPenyusutanData.persentase_penyusutan,
            nilai_buku_awal_tahun: hitunganPenyusutanData.nilai_buku_awal_tahun,
            nilai_buku_akhir_tahun: hitunganPenyusutanData.nilai_buku_akhir_tahun,
            enabled: hitunganPenyusutanData.enabled
        }
    )
}

export const deleteHitunganPenyusutanByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        HitunganPenyusutanModel,
        {
            enabled: false
        },
        {
            daftar_aset: uuid
        }
    )
}