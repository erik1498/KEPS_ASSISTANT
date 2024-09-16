import { jabatanValidation } from "./jabatan.validation.js"
import { createJabatanService, deleteJabatanByUuidService, getAllJabatanService, getJabatanByUuidService, updateJabatanByUuidService } from "./jabatan.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllJabatans = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllJabatanController", null, req.identity)
    try {
        const jabatans = await getAllJabatanService(req.query, req.identity)
        res.json({
            data: jabatans,
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

export const getJabatanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getJabatanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getJabatanByUuidService(uuid, req.identity),
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

export const postCreateJabatan = async (req, res) => {
    LOGGER(logType.INFO, "Start createJabatanController", null, req.identity)
    try {
        const jabatanData = req.body
        const { error, value } = jabatanValidation(jabatanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const jabatan = await createJabatanService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, jabatan, req.identity)
        res.json({
            data: jabatan,
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

export const deleteJabatanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteJabatanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteJabatanByUuidService(uuid, req.identity)
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

export const updateJabatanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateJabatanByUuidController", null, req.identity)
    try {    
        const jabatanData = req.body
        const { error, value } = jabatanValidation(jabatanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateJabatanByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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