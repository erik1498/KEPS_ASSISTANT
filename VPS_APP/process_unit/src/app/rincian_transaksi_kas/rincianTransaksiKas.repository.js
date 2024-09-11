import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianTransaksiKasModel from "./rincianTransaksiKas.model.js";
import { generateDatabaseName, insertQueryUtil, selectAllQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllRincianTransaksiKasRepo = async (pageNumber, size, search, req_id) => {
    const rincianTransaksiKassCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_transaksi_kas_tab WHERE transaksi_kas LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianTransaksiKassCount[0].count

    const rincianTransaksiKass = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_transaksi_kas_tab WHERE transaksi_kas LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianTransaksiKass,
        count: rincianTransaksiKassCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getRincianTransaksiKasByTransaksiKasUUIDRepo = async (uuid, req_id) => {
    return selectAllQueryUtil(
        generateDatabaseName(req_id),
        RincianTransaksiKasModel,
        null,
        {
            transaksi_kas: uuid,
            enabled: true
        }
    )
}

export const getRincianTransaksiKasByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianTransaksiKasModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianTransaksiKasRepo = async (rincianTransaksiKasData, req_id) => {
    rincianTransaksiKasData = removeDotInRupiahInput(rincianTransaksiKasData, [
        "nilai"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianTransaksiKasModel,
        {
            transaksi_kas: rincianTransaksiKasData.transaksi_kas,
            kode_akun_perkiraan: rincianTransaksiKasData.kode_akun_perkiraan,
            nilai: rincianTransaksiKasData.nilai,
            uraian: rincianTransaksiKasData.uraian,
            waktu: rincianTransaksiKasData.waktu,
            enabled: rincianTransaksiKasData.enabled
        }
    )
}

export const deleteRincianTransaksiKasByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianTransaksiKasModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianTransaksiKasByUuidRepo = async (uuid, rincianTransaksiKasData, req_id) => {
    rincianTransaksiKasData = removeDotInRupiahInput(rincianTransaksiKasData, [
        "nilai"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianTransaksiKasModel,
        {
            transaksi_kas: rincianTransaksiKasData.transaksi_kas,
            kode_akun_perkiraan: rincianTransaksiKasData.kode_akun_perkiraan,
            nilai: rincianTransaksiKasData.nilai,
            waktu: rincianTransaksiKasData.waktu,
            uraian: rincianTransaksiKasData.uraian,
        },
        {
            uuid
        }
    )
}