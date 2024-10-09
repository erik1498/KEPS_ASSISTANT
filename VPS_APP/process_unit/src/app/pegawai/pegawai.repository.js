import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PegawaiModel from "./pegawai.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPegawaiRepo = async (pageNumber, size, search, req_id) => {
    const pegawaisCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count 
            FROM ${generateDatabaseName(req_id)}.pegawai_tab pt
            JOIN ${generateDatabaseName(req_id)}.divisi_tab dt ON dt.uuid = pt.divisi 
            JOIN ${generateDatabaseName(req_id)}.jabatan_tab jt ON jt.uuid = pt.jabatan
            JOIN ${generateDatabaseName(req_id)}.status_tanggungan_tab stt ON stt.uuid = pt.status_tanggungan 
            WHERE pt.name LIKE '%${search}%' 
            AND pt.enabled = 1
            AND dt.enabled = 1
            AND jt.enabled = 1
            AND stt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : pegawaisCount[0].count

    const pegawais = await db.query(
        `
            SELECT 
                pt.*,
                dt.name AS divisi_name,
                jt.name AS jabatan_name,
                stt.name AS status_tanggungan_name
            FROM ${generateDatabaseName(req_id)}.pegawai_tab pt
            JOIN ${generateDatabaseName(req_id)}.divisi_tab dt ON dt.uuid = pt.divisi 
            JOIN ${generateDatabaseName(req_id)}.jabatan_tab jt ON jt.uuid = pt.jabatan
            JOIN ${generateDatabaseName(req_id)}.status_tanggungan_tab stt ON stt.uuid = pt.status_tanggungan 
            WHERE pt.name LIKE '%${search}%' 
            AND pt.enabled = 1
            AND dt.enabled = 1
            AND jt.enabled = 1
            AND stt.enabled = 1
            LIMIT ${pageNumber}, ${size}
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

export const checkPegawaiPayrollSudahDiNeracaValidRepo = async (uuid, req_id) => {
    return await db.query(
        `   
            SELECT 
                MIN(res.tanggal) AS tanggal_awal_payroll
            FROM (
                SELECT MIN(gt.tanggal) AS tanggal FROM ${generateDatabaseName(req_id)}.gaji_tab gt WHERE gt.pegawai = "${uuid}"
                UNION ALL
                SELECT MIN(tut.tanggal) AS tanggal FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut WHERE tut.pegawai = "${uuid}"
                UNION ALL
                SELECT MIN(lt.tanggal) AS tanggal FROM ${generateDatabaseName(req_id)}.lembur_tab lt WHERE lt.pegawai = "${uuid}"
                UNION ALL
                SELECT MIN(ht.tanggal) AS tanggal FROM ${generateDatabaseName(req_id)}.hadiah_tab ht WHERE ht.pegawai = "${uuid}"
                UNION ALL
                SELECT MIN(pt2.tanggal) AS tanggal FROM ${generateDatabaseName(req_id)}.pph2126_tab pt2 WHERE pt2.pegawai = "${uuid}"
                UNION ALL
                SELECT MIN(llt.tanggal) AS tanggal FROM ${generateDatabaseName(req_id)}.lain_lain_tab llt WHERE llt.pegawai = "${uuid}"
                UNION ALL
                SELECT MIN(kt.tanggal) AS tanggal FROM ${generateDatabaseName(req_id)}.kerugian_tab kt WHERE kt.pegawai = "${uuid}"
                UNION ALL
                SELECT MIN(pkt.tanggal) AS tanggal FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pkt WHERE pkt.pegawai = "${uuid}"
            ) AS res
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}