import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createSupplierRepo, deleteSupplierByUuidRepo, getAllSupplierRepo, getSupplierByUuidRepo, updateSupplierByUuidRepo } from "./supplier.repository.js"

export const getAllSupplierService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllSupplierService", null, req_identity)

    let { page, size, search } = query
    page = page ? page : null
    size = size ? size : null
    if (size == "all") {
        page = null
        size = null
    }
    search = search ? search : ""
    const pageNumber = (page - 1) * size

    LOGGER(logType.INFO, "Pagination", {
        pageNumber, size, search
    }, req_identity)
    
    const suppliers = await getAllSupplierRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(suppliers.entry, suppliers.count, suppliers.pageNumber, suppliers.size)
}

export const getSupplierByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getSupplierByUuidService [${uuid}]`, null, req_identity)
    const supplier = await getSupplierByUuidRepo(uuid, req_identity)

    if (!supplier) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return supplier
}

export const createSupplierService = async (supplierData, req_identity) => {
    LOGGER(logType.INFO, `Start createSupplierService`, supplierData, req_identity)
    supplierData.enabled = 1

    const supplier = await createSupplierRepo(supplierData, req_identity)
    return supplier
}

export const deleteSupplierByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteSupplierByUuidService [${uuid}]`, null, req_identity)
    await getSupplierByUuidService(uuid, req_identity)
    await deleteSupplierByUuidRepo(uuid, req_identity)
    return true
}

export const updateSupplierByUuidService = async (uuid, supplierData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateSupplierByUuidService [${uuid}]`, supplierData, req_identity)
    const beforeData = await getSupplierByUuidService(uuid, req_identity)
    const supplier = await updateSupplierByUuidRepo(uuid, supplierData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        supplierData
    }, req_identity)

    return supplier
}