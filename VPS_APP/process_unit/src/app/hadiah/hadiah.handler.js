import { hadiahValidation } from "./hadiah.validation.js"
import { createHadiahService, deleteHadiahByUuidService, getAllHadiahService, getHadiahByPegawaiUUIDService, updateHadiahByUuidService } from "./hadiah.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllHadiahs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllHadiahController", null, req.identity)
    try {
        const hadiahs = await getAllHadiahService(req.query, req.identity)
        res.json({
            data: hadiahs,
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

export const getHadiahByPegawaiUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getHadiahByPegawaiUUID", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getHadiahByPegawaiUUIDService(uuid, req.identity),
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

export const postCreateHadiah = async (req, res) => {
    LOGGER(logType.INFO, "Start createHadiahController", null, req.identity)
    try {
        const hadiahData = req.body
        const { error, value } = hadiahValidation(hadiahData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const hadiah = await createHadiahService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, hadiah, req.identity)
        res.json({
            data: hadiah,
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

export const deleteHadiahByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteHadiahByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteHadiahByUuidService(uuid, req.identity)
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

export const updateHadiahByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateHadiahByUuidController", null, req.identity)
    try {    
        const hadiahData = req.body
        const { error, value } = hadiahValidation(hadiahData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateHadiahByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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