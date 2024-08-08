import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import DokumenKlienModel from "./dokumenKlien.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";


export const getAllDokumenKlienByAktivitasDokumenRepo = async (aktivitas_dokumen, pageNumber, size, search, req_id) => {
    const DokumenKliensCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.dokumen_klien_tab WHERE aktivitas_dokumen = "${aktivitas_dokumen}" AND nomor_dokumen LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : DokumenKliensCount[0].count

    const DokumenKliens = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.dokumen_klien_tab WHERE aktivitas_dokumen = "${aktivitas_dokumen}" AND nomor_dokumen LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: DokumenKliens,
        count: DokumenKliensCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getDokumenKlienByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        DokumenKlienModel,
        null,
        {
            uuid
        }
    )
}

export const createDokumenKlienRepo = async (dokumenKlienData, req_id) => {
    return insertQueryUtil(
        generateDatabaseName(req_id),
        DokumenKlienModel,
        {
            aktivitas_dokumen: dokumenKlienData.aktivitas_dokumen,
            nomor_dokumen: dokumenKlienData.nomor_dokumen,
            keterangan_dokumen: dokumenKlienData.keterangan_dokumen,
            enabled: dokumenKlienData.enabled,
        }
    )
}

export const deleteDokumenKlienByUuidRepo = async (uuid, req_id) => {
    return updateQueryUtil(
        generateDatabaseName(req_id),
        DokumenKlienModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateDokumenKlienByUuidRepo = async (uuid, dokumenKlienData) => {
    const dokumenKlien = await DokumenKlienModel.update({
        aktivitas_dokumen: dokumenKlienData.aktivitas_dokumen,
        nomor_dokumen: dokumenKlienData.nomor_dokumen,
        keterangan_dokumen: dokumenKlienData.keterangan_dokumen,
        enabled: dokumenKlienData.enabled,
    }, {
        where: {
            uuid
        }
    })
    return dokumenKlien
}