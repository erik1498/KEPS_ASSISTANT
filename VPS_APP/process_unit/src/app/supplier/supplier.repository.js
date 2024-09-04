import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import SupplierModel from "./supplier.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllSupplierRepo = async (pageNumber, size, search, req_id) => {
    const suppliersCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.supplier_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : suppliersCount[0].count

    const suppliers = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.supplier_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: suppliers,
        count: suppliersCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getSupplierByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        SupplierModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createSupplierRepo = async (supplierData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        SupplierModel,
        {   
        name: supplierData.name,
        code: supplierData.code,
        npwp: supplierData.npwp,
        alamat_rumah: supplierData.alamat_rumah,
        alamat_kantor: supplierData.alamat_kantor,
        no_telp: supplierData.no_telp,
        no_hp: supplierData.no_hp,
        jenis_barang: supplierData.jenis_barang,
            enabled: supplierData.enabled
        }
    )
}

export const deleteSupplierByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        SupplierModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateSupplierByUuidRepo = async (uuid, supplierData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        SupplierModel,
        {
        name: supplierData.name,
        code: supplierData.code,
        npwp: supplierData.npwp,
        alamat_rumah: supplierData.alamat_rumah,
        alamat_kantor: supplierData.alamat_kantor,
        no_telp: supplierData.no_telp,
        no_hp: supplierData.no_hp,
        jenis_barang: supplierData.jenis_barang,
        },
        {
            uuid
        }
    )
}