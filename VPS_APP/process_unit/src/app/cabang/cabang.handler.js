import { cabangValidation } from "./cabang.validation.js"
import { createCabangService, deleteCabangByUuidService, getAllCabangService, getCabangByUuidService, updateCabangByUuidService } from "./cabang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllCabangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllCabangController", null, req.identity)
    try {
        const cabangs = await getAllCabangService(req.query, req.identity)
        res.json({
            data: cabangs,
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

export const getCabangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getCabangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getCabangByUuidService(uuid, req.identity),
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

export const postCreateCabang = async (req, res) => {
    LOGGER(logType.INFO, "Start createCabangController", null, req.identity)
    try {
        const cabangData = req.body
        const { error, value } = cabangValidation(cabangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const cabang = await createCabangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, cabang, req.identity)
        res.json({
            data: cabang,
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

export const deleteCabangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteCabangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteCabangByUuidService(uuid, req.identity)
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

export const updateCabangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateCabangByUuidController", null, req.identity)
    try {
        const cabangData = req.body
        const { error, value } = cabangValidation(cabangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }

        await updateCabangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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