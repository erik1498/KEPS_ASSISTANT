import { daftarBahanBakuValidation } from "./daftarBahanBaku.validation.js"
import { createDaftarBahanBakuService, deleteDaftarBahanBakuByUuidService, getAllDaftarBahanBakusAktifByDaftarGudangService, getAllDaftarBahanBakuService, getAllDaftarBahanBakuUntukTransaksiService, getDaftarBahanBakuByUuidService, updateDaftarBahanBakuByUuidService } from "./daftarBahanBaku.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllDaftarBahanBakus = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllDaftarBahanBakuController", null, req.identity)
    try {
        const daftarBahanBakus = await getAllDaftarBahanBakuService(req.query, req.identity)
        res.json({
            data: daftarBahanBakus,
            message: "Get Data Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const getAllDaftarBahanBakusAktifByDaftarGudang = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllDaftarBahanBakusAktifByDaftarGudang", null, req.identity)
    try {
        const { daftar_gudang } = req.params
        const daftarBahanBakus = await getAllDaftarBahanBakusAktifByDaftarGudangService(req.identity)
        res.json({
            data: daftarBahanBakus,
            message: "Get Data Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const getAllDaftarBahanBakuUntukTransaksi = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllDaftarBahanBakuUntukTransaksi", null, req.identity)
    try {
        const daftarBahanBakus = await getAllDaftarBahanBakuUntukTransaksiService(req.identity)
        res.json({
            data: daftarBahanBakus,
            message: "Get Data Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const getDaftarBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getDaftarBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getDaftarBahanBakuByUuidService(uuid, req.identity),
            message: "Get Data By UUID Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const postCreateDaftarBahanBaku = async (req, res) => {
    LOGGER(logType.INFO, "Start createDaftarBahanBakuController", null, req.identity)
    try {
        const daftarBahanBakuData = req.body
        const { error, value } = daftarBahanBakuValidation(daftarBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const daftarBahanBaku = await createDaftarBahanBakuService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, daftarBahanBaku, req.identity)
        res.json({
            data: daftarBahanBaku,
            message: "Create data Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const deleteDaftarBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteDaftarBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteDaftarBahanBakuByUuidService(uuid, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, { uuid }, req.identity)
        res.status(200).json({
            message: "Delete Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const updateDaftarBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateDaftarBahanBakuByUuidController", null, req.identity)
    try {
        const daftarBahanBakuData = req.body
        const { error, value } = daftarBahanBakuValidation(daftarBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateDaftarBahanBakuByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
        return res.status(200).json({
            message: "Update Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}