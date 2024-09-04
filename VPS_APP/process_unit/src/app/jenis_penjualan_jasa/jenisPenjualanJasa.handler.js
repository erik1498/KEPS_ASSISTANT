import { jenisPenjualanJasaValidation } from "./jenisPenjualanJasa.validation.js"
import { createJenisPenjualanJasaService, deleteJenisPenjualanJasaByUuidService, getAllJenisPenjualanJasaService, getJenisPenjualanJasaByUuidService, updateJenisPenjualanJasaByUuidService } from "./jenisPenjualanJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllJenisPenjualanJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllJenisPenjualanJasaController", null, req.identity)
    try {
        const jenisPenjualanJasas = await getAllJenisPenjualanJasaService(req.query, req.identity)
        res.json({
            data: jenisPenjualanJasas,
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

export const getJenisPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getJenisPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getJenisPenjualanJasaByUuidService(uuid, req.identity),
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

export const postCreateJenisPenjualanJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createJenisPenjualanJasaController", null, req.identity)
    try {
        const jenisPenjualanJasaData = req.body
        const { error, value } = jenisPenjualanJasaValidation(jenisPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const jenisPenjualanJasa = await createJenisPenjualanJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, jenisPenjualanJasa, req.identity)
        res.json({
            data: jenisPenjualanJasa,
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

export const deleteJenisPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteJenisPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteJenisPenjualanJasaByUuidService(uuid, req.identity)
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

export const updateJenisPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateJenisPenjualanJasaByUuidController", null, req.identity)
    try {    
        const jenisPenjualanJasaData = req.body
        const { error, value } = jenisPenjualanJasaValidation(jenisPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateJenisPenjualanJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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