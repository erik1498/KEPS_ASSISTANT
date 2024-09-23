import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import DaftarAsetModel from "./daftarAset.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllDaftarAsetRepo = async (pageNumber, size, search, req_id) => {
    const daftarAsetsCount = await db.query(
        `
            SELECT
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.daftar_aset_tab dat 
            JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = dat.metode_penyusutan
            JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = dat.kelompok_aset
            WHERE dat.enabled = 1
            AND mpt.enabled = 1
            AND kat.enabled = 1
            AND dat.name LIKE '%${search}%'
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : daftarAsetsCount[0].count

    const daftarAsets = await db.query(
        `
            SELECT
                dat.*,
                mpt.name AS metode_penyusutan_name,
                kat.name AS kelompok_aset_name
            FROM ${generateDatabaseName(req_id)}.daftar_aset_tab dat 
            JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = dat.metode_penyusutan
            JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = dat.kelompok_aset
            WHERE dat.enabled = 1
            AND mpt.enabled = 1
            AND kat.enabled = 1
            AND dat.name LIKE '%${search}%'
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: daftarAsets,
        count: daftarAsetsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getDaftarAsetByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        DaftarAsetModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createDaftarAsetRepo = async (daftarAsetData, req_id) => {
    daftarAsetData = removeDotInRupiahInput(daftarAsetData, [
        "kuantitas", "harga_satuan", "dpp", "ppn"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarAsetModel,
        {
            name: daftarAsetData.name,
            tanggal_beli: daftarAsetData.tanggal_beli,
            supplier: daftarAsetData.supplier,
            nomor_invoice: daftarAsetData.nomor_invoice,
            kuantitas: daftarAsetData.kuantitas,
            satuan_barang: daftarAsetData.satuan_barang,
            harga_satuan: daftarAsetData.harga_satuan,
            dpp: daftarAsetData.dpp,
            ppn: daftarAsetData.ppn,
            metode_penyusutan: daftarAsetData.metode_penyusutan,
            kelompok_aset: daftarAsetData.kelompok_aset,
            enabled: daftarAsetData.enabled
        }
    )
}

export const deleteDaftarAsetByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarAsetModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateDaftarAsetByUuidRepo = async (uuid, daftarAsetData, req_id) => {
    daftarAsetData = removeDotInRupiahInput(daftarAsetData, [
        "kuantitas", "harga_satuan", "dpp", "ppn"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarAsetModel,
        {
            name: daftarAsetData.name,
            tanggal_beli: daftarAsetData.tanggal_beli,
            supplier: daftarAsetData.supplier,
            nomor_invoice: daftarAsetData.nomor_invoice,
            kuantitas: daftarAsetData.kuantitas,
            satuan_barang: daftarAsetData.satuan_barang,
            harga_satuan: daftarAsetData.harga_satuan,
            dpp: daftarAsetData.dpp,
            ppn: daftarAsetData.ppn,
            metode_penyusutan: daftarAsetData.metode_penyusutan,
            kelompok_aset: daftarAsetData.kelompok_aset,
        },
        {
            uuid
        }
    )
}

export const getDaftarAsetByUuidWithKelompokAsetAndPersentasePenyusutanRepo = async (uuid, req_id) => {
    const daftarAsets = await db.query(
        `
            SELECT
                dat.*,
                mpt.name AS metode_penyusutan_name,
                kat.name AS kelompok_aset_name,
                kat.masa_penyusutan AS masa_penyusutan,
                (
                    SELECT
                        ppt.persentase
                    FROM ${generateDatabaseName(req_id)}.persentase_penyusutan_tab ppt 
                    WHERE ppt.metode_penyusutan = dat.metode_penyusutan 
                    AND ppt.kelompok_aset = dat.kelompok_aset 
                ) AS nilai
            FROM ${generateDatabaseName(req_id)}.daftar_aset_tab dat 
            JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = dat.metode_penyusutan 
            JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = dat.kelompok_aset 
            WHERE dat.uuid = "${uuid}"
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return daftarAsets
}