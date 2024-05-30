import { Sequelize } from "sequelize"
import NeracaModel from "./neraca.model.js"
import db from "../../config/Database.js"
import { generateDatabaseName, insertQueryUtil } from "../../utils/databaseUtil.js"

export const createNeracaRepo = async (neracaData, req_id) => {
    return insertQueryUtil(
        generateDatabaseName(req_id),
        NeracaModel,
        {
            json: neracaData.json,
            bulan: neracaData.bulan,
            tahun: neracaData.tahun
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
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return neraca
}

export const deleteNeracaByBulanAndTahun = async (bulan, tahun, req_id) => {
    await db.query(
        `
            DELETE FROM ${generateDatabaseName(req_id)}.neraca_tab nt WHERE nt.bulan >= "${bulan}" AND nt.tahun >= "${tahun}"
        `,
        { type: Sequelize.QueryTypes.DELETE }
    )
}