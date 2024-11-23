import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KategoriAsetModel from "./kategoriAset.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllKategoriAsetRepo = async (pageNumber, size, search, req_id) => {
    const kategoriAsetsCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count 
            FROM ${generateDatabaseName(req_id)}.kategori_aset_tab kat 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kat.kode_akun_perkiraan_debet
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt2 ON kapt2.uuid = kat.kode_akun_perkiraan_kredit  
            WHERE kat.enabled = 1
            AND kat.name LIKE '%${search}%'
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : kategoriAsetsCount[0].count

    const kategoriAsets = await db.query(
        `
            SELECT 
                kat.*,
                kapt.name AS kode_akun_perkiraan_debet_name,
                kapt2.name AS kode_akun_perkiraan_kredit_name
            FROM ${generateDatabaseName(req_id)}.kategori_aset_tab kat 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kat.kode_akun_perkiraan_debet
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt2 ON kapt2.uuid = kat.kode_akun_perkiraan_kredit  
            WHERE kat.enabled = 1
            AND kat.name LIKE '%${search}%'
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: kategoriAsets,
        count: kategoriAsetsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getKategoriAsetByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KategoriAsetModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const checkKategoriAsetSudahDigunakanRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.daftar_aset_tab dat
            WHERE dat.kategori_aset = "${uuid}"
            AND dat.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const createKategoriAsetRepo = async (kategoriAsetData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriAsetModel,
        {
            name: kategoriAsetData.name,
            kode_akun_perkiraan_debet: kategoriAsetData.kode_akun_perkiraan_debet,
            kode_akun_perkiraan_kredit: kategoriAsetData.kode_akun_perkiraan_kredit,
            name: kategoriAsetData.name,
            enabled: kategoriAsetData.enabled
        }
    )
}

export const deleteKategoriAsetByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriAsetModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateKategoriAsetByUuidRepo = async (uuid, kategoriAsetData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriAsetModel,
        {
            name: kategoriAsetData.name,
            kode_akun_perkiraan_debet: kategoriAsetData.kode_akun_perkiraan_debet,
            kode_akun_perkiraan_kredit: kategoriAsetData.kode_akun_perkiraan_kredit,
        },
        {
            uuid
        }
    )
}