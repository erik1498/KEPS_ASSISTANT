import { Sequelize } from "sequelize"
import NeracaModel from "./neraca.model.js"
import db from "../../config/Database.js"

export const createNeracaRepo = async (neracaData, req_id) => {
    const neraca = await NeracaModel.create({
        json: neracaData.json,
        bulan: neracaData.bulan,
        tahun: neracaData.tahun,
        client_id: JSON.parse(req_id).client_id
    })
    return neraca
}

export const getNeracaByBulanAndTahun = async (bulan, tahun, req_id) => {
    const neraca = await db.query(
        `
            SELECT 
                nt.*
            FROM neraca_tab nt 
            WHERE nt.bulan = "${bulan}" AND nt.tahun = "${tahun}"
            AND nt.client_id = '${JSON.parse(req_id).client_id}'
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return neraca
}

export const deleteNeracaByBulanAndTahun = async (bulan, tahun, req_id) => {
    await db.query(
        `
            DELETE FROM neraca_tab nt WHERE nt.bulan >= "${bulan}" AND nt.tahun >= "${tahun}"
            AND nt.client_id = '${JSON.parse(req_id).client_id}'
        `,
        { type: Sequelize.QueryTypes.DELETE }
    )
}