import { daftarGudangValidation } from "./daftarGudang.validation.js"
import { createDaftarGudangService, deleteDaftarGudangByUuidService, getAllDaftarGudangService, getDaftarGudangByUuidService, updateDaftarGudangByUuidService } from "./daftarGudang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllDaftarGudangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllDaftarGudangController", null, req.identity)
    try {
        const daftarGudangs = await getAllDaftarGudangService(req.query, req.identity)
        res.json({
            data: daftarGudangs,
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

export const getDaftarGudangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getDaftarGudangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getDaftarGudangByUuidService(uuid, req.identity),
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

export const postCreateDaftarGudang = async (req, res) => {
    LOGGER(logType.INFO, "Start createDaftarGudangController", null, req.identity)
    try {
        const daftarGudangData = req.body
        const { error, value } = daftarGudangValidation(daftarGudangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const daftarGudang = await createDaftarGudangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, daftarGudang, req.identity)
        res.json({
            data: daftarGudang,
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

export const deleteDaftarGudangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteDaftarGudangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteDaftarGudangByUuidService(uuid, req.identity)
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

export const updateDaftarGudangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateDaftarGudangByUuidController", null, req.identity)
    try {    
        const daftarGudangData = req.body
        const { error, value } = daftarGudangValidation(daftarGudangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateDaftarGudangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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