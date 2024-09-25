import { pesananPenjualanBarangValidation } from "./pesananPenjualanBarang.validation.js"
import { createPesananPenjualanBarangService, deletePesananPenjualanBarangByUuidService, getAllPesananPenjualanBarangService, getPesananPenjualanBarangByUuidService, updatePesananPenjualanBarangByUuidService } from "./pesananPenjualanBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPesananPenjualanBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPesananPenjualanBarangController", null, req.identity)
    try {
        const pesananPenjualanBarangs = await getAllPesananPenjualanBarangService(req.query, req.identity)
        res.json({
            data: pesananPenjualanBarangs,
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

export const getPesananPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPesananPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getPesananPenjualanBarangByUuidService(uuid, req.identity),
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

export const postCreatePesananPenjualanBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createPesananPenjualanBarangController", null, req.identity)
    try {
        const pesananPenjualanBarangData = req.body
        const { error, value } = pesananPenjualanBarangValidation(pesananPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const pesananPenjualanBarang = await createPesananPenjualanBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, pesananPenjualanBarang, req.identity)
        res.json({
            data: pesananPenjualanBarang,
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

export const deletePesananPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePesananPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePesananPenjualanBarangByUuidService(uuid, req.identity)
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

export const updatePesananPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePesananPenjualanBarangByUuidController", null, req.identity)
    try {    
        const pesananPenjualanBarangData = req.body
        const { error, value } = pesananPenjualanBarangValidation(pesananPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePesananPenjualanBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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