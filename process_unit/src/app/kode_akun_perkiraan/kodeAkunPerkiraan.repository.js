import { Op, Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KodeAkunPerkiraanModel from "./kodeAkunPerkiraan.model.js";
import { getBankKodeAkun, getKasKodeAkun } from "../../constant/kode_akun_perkiraan_constant.js";


export const getAllKodeAkunPerkiraanByCodeListRepo = async (data, req_id) => {
    const kodeAkunPerkiraans = await db.query(
        `
        SELECT * FROM kode_akun_perkiraan_tab kapt WHERE kapt.code IN (${data.join(",")}) AND kapt.client_id = '${JSON.parse(req_id).client_id}'
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return kodeAkunPerkiraans
}

export const getAllKodeAkunPerkiraanRepo = async (pageNumber, size, search, req_identity) => {
    const kodeAkunPerkiraansCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM kode_akun_perkiraan_tab WHERE name LIKE '%${search}%' AND enabled = 1
            AND client_id = '${JSON.parse(req_identity).client_id}'
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : kodeAkunPerkiraansCount[0].count

    const kodeAkunPerkiraans = await db.query(
        `
            SELECT kapt.* FROM kode_akun_perkiraan_tab kapt
            WHERE kapt.name LIKE '%${search}%' 
            AND kapt.client_id = '${JSON.parse(req_identity).client_id}'
            AND kapt.enabled = 1 
            ORDER BY kapt.code ASC LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: kodeAkunPerkiraans,
        count: kodeAkunPerkiraansCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getAllKodeAkunPerkiraanKasRepo = async () => {
    const kodeAkunPerkiraans = await db.query(
        `
            SELECT * FROM kode_akun_perkiraan_tab WHERE code IN (${getKasKodeAkun.join(",")})
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return kodeAkunPerkiraans;
}

export const getAllKodeAkunPerkiraanNoKasRepo = async () => {
    const kodeAkunPerkiraans = await db.query(
        `
            SELECT * FROM kode_akun_perkiraan_tab WHERE code NOT IN (${getKasKodeAkun.join(",")})
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return kodeAkunPerkiraans;
}

export const getAllKodeAkunPerkiraanBankRepo = async () => {
    const kodeAkunPerkiraans = await db.query(
        `
            SELECT * FROM kode_akun_perkiraan_tab WHERE code IN (${getBankKodeAkun.join(",")})
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return kodeAkunPerkiraans;
}

export const getAllKodeAkunPerkiraanNoBankRepo = async () => {
    const kodeAkunPerkiraans = await db.query(
        `
            SELECT * FROM kode_akun_perkiraan_tab WHERE code NOT IN (${getBankKodeAkun.join(",")})
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return kodeAkunPerkiraans;
}

export const getKodeAkunPerkiraanByCodeRepo = async (code, uuid, req_id) => {
    const kodeAkunPerkiraan = await db.query(
        `
            SELECT COUNT(0) AS count FROM kode_akun_perkiraan_tab WHERE code = '${code}' AND enabled = 1
            ${uuid != null ? `AND kode_akun_perkiraan_tab.uuid != "${uuid}"` : ''}
            AND client_id = '${JSON.parse(req_id).client_id}'
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return kodeAkunPerkiraan
}

export const getKodeAkunPerkiraanByTypeRepo = async (type, req_id) => {
    const kodeAkunPerkiraan = await KodeAkunPerkiraanModel.findAll({
        where: {
            type,
            client_id: JSON.parse(req_id).client_id
        }
    })
    return kodeAkunPerkiraan
}

export const getKodeAkunPerkiraanExceptTypeRepo = async (type, req_id) => {
    const kodeAkunPerkiraan = await KodeAkunPerkiraanModel.findAll({
        where: {
            type: {
                [Op.not]: type
            },
            client_id: JSON.parse(req_id).client_id
        }
    })
    return kodeAkunPerkiraan
}

export const getKodeAkunPerkiraanByUuidRepo = async (uuid, req_id) => {
    const kodeAkunPerkiraan = await KodeAkunPerkiraanModel.findOne({
        where: {
            uuid,
            enabled: true,
            client_id: JSON.parse(req_id).client_id
        }
    })
    return kodeAkunPerkiraan
}

export const createKodeAkunPerkiraanRepo = async (kodeAkunPerkiraanData, req_id) => {
    const kodeAkunPerkiraan = await KodeAkunPerkiraanModel.create({
        type: kodeAkunPerkiraanData.type,
        name: kodeAkunPerkiraanData.name,
        code: kodeAkunPerkiraanData.code,
        enabled: kodeAkunPerkiraanData.enabled,
        client_id: JSON.parse(req_id).client_id
    })
    return kodeAkunPerkiraan
}

export const deleteKodeAkunPerkiraanByUuidRepo = async (uuid, req_id) => {
    await KodeAkunPerkiraanModel.update({
        enabled: false
    }, {
        where: {
            uuid,
            client_id: JSON.parse(req_id).client_id
        }
    })
}

export const updateKodeAkunPerkiraanByUuidRepo = async (uuid, kodeAkunPerkiraanData, req_id) => {
    const kodeAkunPerkiraan = await KodeAkunPerkiraanModel.update({
        type: kodeAkunPerkiraanData.type,
        name: kodeAkunPerkiraanData.name,
        code: kodeAkunPerkiraanData.code,
    }, {
        where: {
            uuid,
            client_id: JSON.parse(req_id).client_id
        }
    })
    return kodeAkunPerkiraan
}