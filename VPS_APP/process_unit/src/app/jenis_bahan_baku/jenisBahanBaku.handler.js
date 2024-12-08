import { jenisBahanBakuValidation } from "./jenisBahanBaku.validation.js"
import { createJenisBahanBakuService, deleteJenisBahanBakuByUuidService, getAllJenisBahanBakuService, getJenisBahanBakuByUuidService, updateJenisBahanBakuByUuidService } from "./jenisBahanBaku.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllJenisBahanBakus = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllJenisBahanBakuController", null, req.identity)
    try {
        const jenisBahanBakus = await getAllJenisBahanBakuService(req.query, req.identity)
        res.json({
            data: jenisBahanBakus,
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

export const getJenisBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getJenisBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getJenisBahanBakuByUuidService(uuid, req.identity),
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

export const postCreateJenisBahanBaku = async (req, res) => {
    LOGGER(logType.INFO, "Start createJenisBahanBakuController", null, req.identity)
    try {
        const jenisBahanBakuData = req.body
        const { error, value } = jenisBahanBakuValidation(jenisBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const jenisBahanBaku = await createJenisBahanBakuService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, jenisBahanBaku, req.identity)
        res.json({
            data: jenisBahanBaku,
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

export const deleteJenisBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteJenisBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteJenisBahanBakuByUuidService(uuid, req.identity)
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

export const updateJenisBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateJenisBahanBakuByUuidController", null, req.identity)
    try {    
        const jenisBahanBakuData = req.body
        const { error, value } = jenisBahanBakuValidation(jenisBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateJenisBahanBakuByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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