import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import TransaksiBankModel from "./transaksiBank.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllTransaksiBankRepo = async (pageNumber, size, search, req_id) => {
    const transaksiBanksCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.transaksi_bank_tab WHERE kode_akun_perkiraan LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : transaksiBanksCount[0].count

    const transaksiBanks = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.transaksi_bank_tab WHERE kode_akun_perkiraan LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: transaksiBanks,
        count: transaksiBanksCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getTransaksiBankByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        TransaksiBankModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createTransaksiBankRepo = async (transaksiBankData, req_id) => {
    transaksiBankData = removeDotInRupiahInput(transaksiBankData, [
        "nilai"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TransaksiBankModel,
        {   
        kode_akun_perkiraan: transaksiBankData.kode_akun_perkiraan,
        bukti_transaksi: transaksiBankData.bukti_transaksi,
        tanggal: transaksiBankData.tanggal,
        nilai: transaksiBankData.nilai,
        uraian: transaksiBankData.uraian,
        type: transaksiBankData.type,
            enabled: transaksiBankData.enabled
        }
    )
}

export const deleteTransaksiBankByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TransaksiBankModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateTransaksiBankByUuidRepo = async (uuid, transaksiBankData, req_id) => {
    transaksiBankData = removeDotInRupiahInput(transaksiBankData, [
        "nilai"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TransaksiBankModel,
        {
        kode_akun_perkiraan: transaksiBankData.kode_akun_perkiraan,
        bukti_transaksi: transaksiBankData.bukti_transaksi,
        tanggal: transaksiBankData.tanggal,
        nilai: transaksiBankData.nilai,
        uraian: transaksiBankData.uraian,
        type: transaksiBankData.type,
        },
        {
            uuid
        }
    )
}