import { Sequelize } from "sequelize"
import NeracaModel from "./neraca.model.js"
import db from "../../config/Database.js"
import { generateDatabaseName, insertQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js"

export const createNeracaRepo = async (neracaData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        NeracaModel,
        {
            json: neracaData.json,
            bulan: neracaData.bulan,
            tahun: neracaData.tahun,
            enabled: neracaData.enabled
        }
    )
}

export const getNeracaByBulanAndTahun = async (bulan, tahun, req_id) => {
    const neraca = await db.query(
        `
            SELECT 
                nt.*
            FROM ${generateDatabaseName(req_id)}.neraca_tab nt 
            WHERE nt.bulan = "${bulan}" AND nt.tahun = "${tahun}"
            AND nt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return neraca
}

export const deleteNeracaByBulanAndTahun = async (bulan, tahun, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        NeracaModel,
        {
            enabled: false
        },
        {
            bulan,
            tahun
        }
    )
}

export const getNeracaValidasiByTanggalRepo = async (tanggal, req_id) => {
    return db.query(
        `
            SELECT 
                COUNT(0) AS count,
                nt.bulan,
                nt.tahun
            FROM ${generateDatabaseName(req_id)}.neraca_tab nt 
            WHERE nt.bulan = MONTH("${tanggal}") AND nt.tahun = YEAR("${tanggal}")
            AND nt.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}