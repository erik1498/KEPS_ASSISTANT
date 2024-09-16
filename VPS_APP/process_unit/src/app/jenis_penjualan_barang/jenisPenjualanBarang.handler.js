import { jenisPenjualanBarangValidation } from "./jenisPenjualanBarang.validation.js"
import { createJenisPenjualanBarangService, deleteJenisPenjualanBarangByUuidService, getAllJenisPenjualanBarangService, getJenisPenjualanBarangByUuidService, updateJenisPenjualanBarangByUuidService } from "./jenisPenjualanBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllJenisPenjualanBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllJenisPenjualanBarangController", null, req.identity)
    try {
        const jenisPenjualanBarangs = await getAllJenisPenjualanBarangService(req.query, req.identity)
        res.json({
            data: jenisPenjualanBarangs,
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

export const getJenisPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getJenisPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getJenisPenjualanBarangByUuidService(uuid, req.identity),
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

export const postCreateJenisPenjualanBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createJenisPenjualanBarangController", null, req.identity)
    try {
        const jenisPenjualanBarangData = req.body
        const { error, value } = jenisPenjualanBarangValidation(jenisPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const jenisPenjualanBarang = await createJenisPenjualanBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, jenisPenjualanBarang, req.identity)
        res.json({
            data: jenisPenjualanBarang,
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

export const deleteJenisPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteJenisPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteJenisPenjualanBarangByUuidService(uuid, req.identity)
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

export const updateJenisPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateJenisPenjualanBarangByUuidController", null, req.identity)
    try {    
        const jenisPenjualanBarangData = req.body
        const { error, value } = jenisPenjualanBarangValidation(jenisPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateJenisPenjualanBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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