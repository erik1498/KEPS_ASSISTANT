import { Sequelize } from "sequelize"
import NeracaModel from "./neraca.model.js"
import db from "../../config/Database.js"

export const createNeracaRepo = async (neracaData) => {
    const neraca = await NeracaModel.create({
        json: neracaData.json,
        bulan: neracaData.bulan,
        tahun: neracaData.tahun
    })
    return neraca
}

export const getNeracaByBulanAndTahun = async (bulan, tahun) => {
    const neraca = await db.query(
        `
            SELECT 
                nt.*
            FROM neraca_tab nt 
            WHERE nt.bulan = "${bulan}" AND nt.tahun = "${tahun}"
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return neraca
}

export const deleteNeracaByBulanAndTahun = async (bulan, tahun) => {
    await db.query(
        `
            DELETE FROM neraca_tab WHERE bulan >= "${bulan}" AND tahun >= "${tahun}"
        `,
        { type: Sequelize.QueryTypes.DELETE }
    )
}