import { tunjanganUangValidation } from "./tunjanganUang.validation.js"
import { createTunjanganUangService, deleteTunjanganUangByUuidService, getAllTunjanganUangService, getTunjanganUangByPegawaiUUIDService, updateTunjanganUangByUuidService } from "./tunjanganUang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllTunjanganUangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllTunjanganUangController", null, req.identity)
    try {
        const tunjanganUangs = await getAllTunjanganUangService(req.query, req.identity)
        res.json({
            data: tunjanganUangs,
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

export const getTunjanganUangByPegawaiUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getTunjanganUangByPegawaiUUIDController", null, req.identity)
    try {
        const { uuid, periode, tahun } = req.params

        res.json({
            data: await getTunjanganUangByPegawaiUUIDService(uuid, periode, tahun, req.identity),
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

export const postCreateTunjanganUang = async (req, res) => {
    LOGGER(logType.INFO, "Start createTunjanganUangController", null, req.identity)
    try {
        const tunjanganUangData = req.body
        const { error, value } = tunjanganUangValidation(tunjanganUangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const tunjanganUang = await createTunjanganUangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, tunjanganUang, req.identity)
        res.json({
            data: tunjanganUang,
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

export const deleteTunjanganUangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteTunjanganUangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteTunjanganUangByUuidService(uuid, req.identity)
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

export const updateTunjanganUangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateTunjanganUangByUuidController", null, req.identity)
    try {
        const tunjanganUangData = req.body
        const { error, value } = tunjanganUangValidation(tunjanganUangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateTunjanganUangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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