import { kelompokAsetValidation } from "./kelompokAset.validation.js"
import { createKelompokAsetService, deleteKelompokAsetByUuidService, getAllKelompokAsetService, getKelompokAsetByUuidService, updateKelompokAsetByUuidService } from "./kelompokAset.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllKelompokAsets = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKelompokAsetController", null, req.identity)
    try {
        const kelompokAsets = await getAllKelompokAsetService(req.query, req.identity)
        res.json({
            data: kelompokAsets,
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

export const getKelompokAsetByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getKelompokAsetByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getKelompokAsetByUuidService(uuid, req.identity),
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

export const postCreateKelompokAset = async (req, res) => {
    LOGGER(logType.INFO, "Start createKelompokAsetController", null, req.identity)
    try {
        const kelompokAsetData = req.body
        const { error, value } = kelompokAsetValidation(kelompokAsetData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const kelompokAset = await createKelompokAsetService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, kelompokAset, req.identity)
        res.json({
            data: kelompokAset,
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

export const deleteKelompokAsetByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteKelompokAsetByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteKelompokAsetByUuidService(uuid, req.identity)
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

export const updateKelompokAsetByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateKelompokAsetByUuidController", null, req.identity)
    try {    
        const kelompokAsetData = req.body
        const { error, value } = kelompokAsetValidation(kelompokAsetData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateKelompokAsetByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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