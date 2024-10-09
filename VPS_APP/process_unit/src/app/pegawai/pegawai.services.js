import { formatDate } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { checkPegawaiPayrollSudahDiNeracaValidRepo, createPegawaiRepo, deletePegawaiByUuidRepo, getAllPegawaiRepo, getPegawaiByUuidRepo, updatePegawaiByUuidRepo } from "./pegawai.repository.js"

export const getAllPegawaiService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPegawaiService", null, req_identity)

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

    const pegawais = await getAllPegawaiRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(pegawais.entry, pegawais.count, pegawais.pageNumber, pegawais.size)
}

export const getPegawaiByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPegawaiByUuidService [${uuid}]`, null, req_identity)
    const pegawai = await getPegawaiByUuidRepo(uuid, req_identity)

    if (!pegawai) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return pegawai
}

export const createPegawaiService = async (pegawaiData, req_identity) => {
    LOGGER(logType.INFO, `Start createPegawaiService`, pegawaiData, req_identity)
    pegawaiData.enabled = 1

    const pegawai = await createPegawaiRepo(pegawaiData, req_identity)
    return pegawai
}

export const deletePegawaiByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePegawaiByUuidService [${uuid}]`, null, req_identity)
    await getPegawaiByUuidService(uuid, req_identity)
    await checkPegawaiPayrollSudahDiNeracaValidService(uuid, req_identity)
    await deletePegawaiByUuidRepo(uuid, req_identity)
    return true
}

export const updatePegawaiByUuidService = async (uuid, pegawaiData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePegawaiByUuidService [${uuid}]`, pegawaiData, req_identity)
    const beforeData = await getPegawaiByUuidService(uuid, req_identity)
    await checkPegawaiPayrollSudahDiNeracaValidService(uuid, req_identity)
    const pegawai = await updatePegawaiByUuidRepo(uuid, pegawaiData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        pegawaiData
    }, req_identity)

    return pegawai
}

export const checkPegawaiPayrollSudahDiNeracaValidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkPegawaiPayrollSudahDiNeracaValidService`, { uuid }, req_identity)
    const pegawai = await checkPegawaiPayrollSudahDiNeracaValidRepo(uuid, req_identity)
    await getNeracaValidasiByTanggalService(
        `Pegawai Tidak Bisa Eksekusi Karena Terdapat Pembayaran Payroll Pada ${formatDate(pegawai[0].tanggal_awal_payroll, true)} Dan `,
        pegawai[0].tanggal_awal_payroll,
        req_identity)
}