import { Op, Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KodeAkunPerkiraanModel from "./kodeAkunPerkiraan.model.js";
import { getBankKodeAkun, getKasKodeAkun } from "../../constant/kode_akun_perkiraan_constant.js";


export const getAllKodeAkunPerkiraanByCodeListRepo = async (data) => {
    const kodeAkunPerkiraans = await db.query(
        `
        SELECT * FROM kode_akun_perkiraan_tab kapt WHERE kapt.code IN (${data.join(",")})
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return kodeAkunPerkiraans
}

export const getAllKodeAkunPerkiraanRepo = async (pageNumber, size, search) => {
    const kodeAkunPerkiraansCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM kode_akun_perkiraan_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : kodeAkunPerkiraansCount[0].count

    const kodeAkunPerkiraans = await db.query(
        `
            SELECT * FROM kode_akun_perkiraan_tab WHERE name LIKE '%${search}%' AND enabled = 1 ORDER BY code ASC LIMIT ${pageNumber}, ${size}
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

export const getKodeAkunPerkiraanByCodeRepo = async (code, uuid) => {
    const kodeAkunPerkiraan = await db.query(
        `
            SELECT COUNT(0) AS count FROM kode_akun_perkiraan_tab WHERE code = '${code}' AND enabled = 1
            ${uuid != null ? `AND kode_akun_perkiraan_tab.uuid != "${uuid}"` : ''}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return kodeAkunPerkiraan
}

export const getKodeAkunPerkiraanByTypeRepo = async (type) => {
    const kodeAkunPerkiraan = await KodeAkunPerkiraanModel.findAll({
        where: {
            type
        }
    })
    return kodeAkunPerkiraan
}

export const getKodeAkunPerkiraanExceptTypeRepo = async (type) => {
    const kodeAkunPerkiraan = await KodeAkunPerkiraanModel.findAll({
        where: {
            type: {
                [Op.not]: type
            }
        }
    })
    return kodeAkunPerkiraan
}

export const getKodeAkunPerkiraanByUuidRepo = async (uuid) => {
    const kodeAkunPerkiraan = await KodeAkunPerkiraanModel.findOne({
        where: {
            uuid,
            enabled: true
        }
    })
    return kodeAkunPerkiraan
}

export const createKodeAkunPerkiraanRepo = async (kodeAkunPerkiraanData) => {
    const kodeAkunPerkiraan = await KodeAkunPerkiraanModel.create({
        type: kodeAkunPerkiraanData.type,
        name: kodeAkunPerkiraanData.name,
        code: kodeAkunPerkiraanData.code,
        enabled: kodeAkunPerkiraanData.enabled
    })
    return kodeAkunPerkiraan
}

export const deleteKodeAkunPerkiraanByUuidRepo = async (uuid) => {
    await KodeAkunPerkiraanModel.update({
        enabled: false
    }, {
        where: {
            uuid
        }
    })
}

export const updateKodeAkunPerkiraanByUuidRepo = async (uuid, kodeAkunPerkiraanData, req_identity) => {
    const kodeAkunPerkiraan = await KodeAkunPerkiraanModel.update({
        type: kodeAkunPerkiraanData.type,
        name: kodeAkunPerkiraanData.name,
        code: kodeAkunPerkiraanData.code,
    }, {
        where: {
            uuid
        }
    })
    return kodeAkunPerkiraan
}