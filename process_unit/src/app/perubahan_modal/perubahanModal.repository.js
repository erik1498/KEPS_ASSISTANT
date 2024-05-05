import { Sequelize } from "sequelize"
import db from "../../config/Database.js"

export const getPerubahanModalByTahunRepo = async (tahun) => {
    const perubahanModal = await db.query(
        `
            SELECT 
                nt.*
            FROM neraca_tab nt WHERE nt.tahun = '${tahun}'
            ORDER BY nt.bulan ASC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return perubahanModal
}