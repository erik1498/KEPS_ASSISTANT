import { Sequelize } from "sequelize"
import db from "../../config/Database.js"
import { generateDatabaseName } from "../../utils/databaseUtil.js"

export const getPerubahanModalByTahunRepo = async (tahun, req_id) => {
    const perubahanModal = await db.query(
        `
            SELECT 
                nt.*
            FROM ${generateDatabaseName(req_id)}.neraca_tab nt 
            WHERE 
            nt.tahun = '${tahun}'
            ORDER BY nt.bulan ASC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return perubahanModal
}