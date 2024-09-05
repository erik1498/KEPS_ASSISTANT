import { daftarBarangValidation } from "./daftarBarang.validation.js"
import { createDaftarBarangService, deleteDaftarBarangByUuidService, getAllDaftarBarangService, getDaftarBarangByUuidService, updateDaftarBarangByUuidService } from "./daftarBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllDaftarBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllDaftarBarangController", null, req.identity)
    try {
        const daftarBarangs = await getAllDaftarBarangService(req.query, req.identity)
        res.json({
            data: daftarBarangs,
            message: "Get Data Success"
        })
    } catch (error) {    
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const getDaftarBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getDaftarBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getDaftarBarangByUuidService(uuid, req.identity),
            message: "Get Data By UUID Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const postCreateDaftarBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createDaftarBarangController", null, req.identity)
    try {
        const daftarBarangData = req.body
        const { error, value } = daftarBarangValidation(daftarBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const daftarBarang = await createDaftarBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, daftarBarang, req.identity)
        res.json({
            data: daftarBarang,
            message: "Create data Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const deleteDaftarBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteDaftarBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteDaftarBarangByUuidService(uuid, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, { uuid }, req.identity)
        res.status(200).json({
            message: "Delete Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const updateDaftarBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateDaftarBarangByUuidController", null, req.identity)
    try {    
        const daftarBarangData = req.body
        const { error, value } = daftarBarangValidation(daftarBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateDaftarBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
        return res.status(200).json({
            message: "Update Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}