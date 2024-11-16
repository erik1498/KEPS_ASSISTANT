import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KategoriPerlengkapanModel from "./kategoriPerlengkapan.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllKategoriPerlengkapanRepo = async (pageNumber, size, search, req_id) => {
    const kategoriPerlengkapansCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.kategori_perlengkapan_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : kategoriPerlengkapansCount[0].count

    const kategoriPerlengkapans = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.kategori_perlengkapan_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: kategoriPerlengkapans,
        count: kategoriPerlengkapansCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getKategoriPerlengkapanByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KategoriPerlengkapanModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const checkKategoriPerlengkapanSudahDigunakanRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.daftar_perlengkapan_tab dat
            WHERE dat.kategori_perlengkapan = "${uuid}"
            AND dat.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const createKategoriPerlengkapanRepo = async (kategoriPerlengkapanData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriPerlengkapanModel,
        {   
        name: kategoriPerlengkapanData.name,
            enabled: kategoriPerlengkapanData.enabled
        }
    )
}

export const deleteKategoriPerlengkapanByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriPerlengkapanModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateKategoriPerlengkapanByUuidRepo = async (uuid, kategoriPerlengkapanData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriPerlengkapanModel,
        {
        name: kategoriPerlengkapanData.name,
        },
        {
            uuid
        }
    )
}