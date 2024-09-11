import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createTransaksiBankRepo, deleteTransaksiBankByUuidRepo, getAllTransaksiBankRepo, getTransaksiBankByUuidRepo, updateTransaksiBankByUuidRepo } from "./transaksiBank.repository.js"

export const getAllTransaksiBankService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllTransaksiBankService", null, req_identity)

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
    
    const transaksiBanks = await getAllTransaksiBankRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(transaksiBanks.entry, transaksiBanks.count, transaksiBanks.pageNumber, transaksiBanks.size)
}

export const getTransaksiBankByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getTransaksiBankByUuidService [${uuid}]`, null, req_identity)
    const transaksiBank = await getTransaksiBankByUuidRepo(uuid, req_identity)

    if (!transaksiBank) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return transaksiBank
}

export const createTransaksiBankService = async (transaksiBankData, req_identity) => {
    LOGGER(logType.INFO, `Start createTransaksiBankService`, transaksiBankData, req_identity)
    transaksiBankData.enabled = 1

    const transaksiBank = await createTransaksiBankRepo(transaksiBankData, req_identity)
    return transaksiBank
}

export const deleteTransaksiBankByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteTransaksiBankByUuidService [${uuid}]`, null, req_identity)
    await getTransaksiBankByUuidService(uuid, req_identity)
    await deleteTransaksiBankByUuidRepo(uuid, req_identity)
    return true
}

export const updateTransaksiBankByUuidService = async (uuid, transaksiBankData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateTransaksiBankByUuidService [${uuid}]`, transaksiBankData, req_identity)
    const beforeData = await getTransaksiBankByUuidService(uuid, req_identity)
    const transaksiBank = await updateTransaksiBankByUuidRepo(uuid, transaksiBankData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        transaksiBankData
    }, req_identity)

    return transaksiBank
}