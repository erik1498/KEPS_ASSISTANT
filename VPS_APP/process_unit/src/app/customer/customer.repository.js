import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import CustomerModel from "./customer.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllCustomerRepo = async (pageNumber, size, search, req_id) => {
    const customersCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.customer_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : customersCount[0].count

    const customers = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.customer_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: customers,
        count: customersCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getCustomerByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        CustomerModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createCustomerRepo = async (customerData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        CustomerModel,
        {   
        name: customerData.name,
        code: customerData.code,
        npwp: customerData.npwp,
        alamat_rumah: customerData.alamat_rumah,
        alamat_kantor: customerData.alamat_kantor,
        no_telp: customerData.no_telp,
        no_hp: customerData.no_hp,
        kode_harga: customerData.kode_harga,
            enabled: customerData.enabled
        }
    )
}

export const deleteCustomerByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        CustomerModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateCustomerByUuidRepo = async (uuid, customerData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        CustomerModel,
        {
        name: customerData.name,
        code: customerData.code,
        npwp: customerData.npwp,
        alamat_rumah: customerData.alamat_rumah,
        alamat_kantor: customerData.alamat_kantor,
        no_telp: customerData.no_telp,
        no_hp: customerData.no_hp,
        kode_harga: customerData.kode_harga,
        },
        {
            uuid
        }
    )
}