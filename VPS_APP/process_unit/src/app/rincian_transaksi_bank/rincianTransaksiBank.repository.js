import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianTransaksiBankModel from "./rincianTransaksiBank.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllRincianTransaksiBankRepo = async (pageNumber, size, search, req_id) => {
    const rincianTransaksiBanksCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_transaksi_bank_tab WHERE transaksi_bank LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianTransaksiBanksCount[0].count

    const rincianTransaksiBanks = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_transaksi_bank_tab WHERE transaksi_bank LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianTransaksiBanks,
        count: rincianTransaksiBanksCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getRincianTransaksiBankByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianTransaksiBankModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianTransaksiBankRepo = async (rincianTransaksiBankData, req_id) => {
    rincianTransaksiBankData = removeDotInRupiahInput(rincianTransaksiBankData, [
        "nilai"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianTransaksiBankModel,
        {
            transaksi_bank: rincianTransaksiBankData.transaksi_bank,
            kode_akun_perkiraan: rincianTransaksiBankData.kode_akun_perkiraan,
            nilai: rincianTransaksiBankData.nilai,
            uraian: rincianTransaksiBankData.uraian,
            waktu: rincianTransaksiBankData.waktu,
            enabled: rincianTransaksiBankData.enabled
        }
    )
}

export const deleteRincianTransaksiBankByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianTransaksiBankModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianTransaksiBankByUuidRepo = async (uuid, rincianTransaksiBankData, req_id) => {
    rincianTransaksiBankData = removeDotInRupiahInput(rincianTransaksiBankData, [
        "nilai"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianTransaksiBankModel,
        {
            transaksi_bank: rincianTransaksiBankData.transaksi_bank,
            kode_akun_perkiraan: rincianTransaksiBankData.kode_akun_perkiraan,
            nilai: rincianTransaksiBankData.nilai,
            waktu: rincianTransaksiBankData.waktu,
            uraian: rincianTransaksiBankData.uraian,
        },
        {
            uuid
        }
    )
}