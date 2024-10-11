import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createCustomerRepo, deleteCustomerByUuidRepo, getAllCustomerRepo, getCustomerByUuidRepo, updateCustomerByUuidRepo } from "./customer.repository.js"

export const getAllCustomerService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllCustomerService", null, req_identity)

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
    
    const customers = await getAllCustomerRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(customers.entry, customers.count, customers.pageNumber, customers.size)
}

export const getCustomerByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getCustomerByUuidService [${uuid}]`, null, req_identity)
    const customer = await getCustomerByUuidRepo(uuid, req_identity)

    if (!customer) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return customer
}

export const createCustomerService = async (customerData, req_identity) => {
    LOGGER(logType.INFO, `Start createCustomerService`, customerData, req_identity)
    customerData.enabled = 1

    const customer = await createCustomerRepo(customerData, req_identity)
    return customer
}

export const deleteCustomerByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteCustomerByUuidService [${uuid}]`, null, req_identity)
    await getCustomerByUuidService(uuid, req_identity)
    await deleteCustomerByUuidRepo(uuid, req_identity)
    return true
}

export const updateCustomerByUuidService = async (uuid, customerData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateCustomerByUuidService [${uuid}]`, customerData, req_identity)
    const beforeData = await getCustomerByUuidService(uuid, req_identity)
    const customer = await updateCustomerByUuidRepo(uuid, customerData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        customerData
    }, req_identity)

    return customer
}