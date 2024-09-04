import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PegawaiModel from "./pegawai.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPegawaiRepo = async (pageNumber, size, search, req_id) => {
    const pegawaisCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.pegawai_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : pegawaisCount[0].count

    const pegawais = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.pegawai_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: pegawais,
        count: pegawaisCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPegawaiByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PegawaiModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPegawaiRepo = async (pegawaiData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PegawaiModel,
        {   
        name: pegawaiData.name,
        nip: pegawaiData.nip,
        nik: pegawaiData.nik,
        npwp: pegawaiData.npwp,
        tempat_lahir: pegawaiData.tempat_lahir,
        tanggal_lahir: pegawaiData.tanggal_lahir,
        jenis_kelamin: pegawaiData.jenis_kelamin,
        agama: pegawaiData.agama,
        no_hp: pegawaiData.no_hp,
        alamat: pegawaiData.alamat,
        status_tanggungan: pegawaiData.status_tanggungan,
        divisi: pegawaiData.divisi,
        status_kerja: pegawaiData.status_kerja,
        jabatan: pegawaiData.jabatan,
            enabled: pegawaiData.enabled
        }
    )
}

export const deletePegawaiByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PegawaiModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePegawaiByUuidRepo = async (uuid, pegawaiData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PegawaiModel,
        {
        name: pegawaiData.name,
        nip: pegawaiData.nip,
        nik: pegawaiData.nik,
        npwp: pegawaiData.npwp,
        tempat_lahir: pegawaiData.tempat_lahir,
        tanggal_lahir: pegawaiData.tanggal_lahir,
        jenis_kelamin: pegawaiData.jenis_kelamin,
        agama: pegawaiData.agama,
        no_hp: pegawaiData.no_hp,
        alamat: pegawaiData.alamat,
        status_tanggungan: pegawaiData.status_tanggungan,
        divisi: pegawaiData.divisi,
        status_kerja: pegawaiData.status_kerja,
        jabatan: pegawaiData.jabatan,
        },
        {
            uuid
        }
    )
}