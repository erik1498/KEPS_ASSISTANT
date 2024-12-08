import { jenisPenjualanBahanBakuValidation } from "./jenisPenjualanBahanBaku.validation.js"
import { createJenisPenjualanBahanBakuService, deleteJenisPenjualanBahanBakuByUuidService, getAllJenisPenjualanBahanBakuService, getJenisPenjualanBahanBakuByUuidService, updateJenisPenjualanBahanBakuByUuidService } from "./jenisPenjualanBahanBaku.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllJenisPenjualanBahanBakus = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllJenisPenjualanBahanBakuController", null, req.identity)
    try {
        const jenisPenjualanBahanBakus = await getAllJenisPenjualanBahanBakuService(req.query, req.identity)
        res.json({
            data: jenisPenjualanBahanBakus,
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

export const getJenisPenjualanBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getJenisPenjualanBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getJenisPenjualanBahanBakuByUuidService(uuid, req.identity),
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

export const postCreateJenisPenjualanBahanBaku = async (req, res) => {
    LOGGER(logType.INFO, "Start createJenisPenjualanBahanBakuController", null, req.identity)
    try {
        const jenisPenjualanBahanBakuData = req.body
        const { error, value } = jenisPenjualanBahanBakuValidation(jenisPenjualanBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const jenisPenjualanBahanBaku = await createJenisPenjualanBahanBakuService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, jenisPenjualanBahanBaku, req.identity)
        res.json({
            data: jenisPenjualanBahanBaku,
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

export const deleteJenisPenjualanBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteJenisPenjualanBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteJenisPenjualanBahanBakuByUuidService(uuid, req.identity)
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

export const updateJenisPenjualanBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateJenisPenjualanBahanBakuByUuidController", null, req.identity)
    try {    
        const jenisPenjualanBahanBakuData = req.body
        const { error, value } = jenisPenjualanBahanBakuValidation(jenisPenjualanBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateJenisPenjualanBahanBakuByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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