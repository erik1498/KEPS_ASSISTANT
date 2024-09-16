import { statusRiwayatAktivitasDokumenValidation } from "./statusRiwayatAktivitasDokumen.validation.js"
import { createStatusRiwayatAktivitasDokumenService, deleteStatusRiwayatAktivitasDokumenByUuidService, getAllStatusRiwayatAktivitasDokumensByRiwayatAktivitasDokumenService, getStatusRiwayatAktivitasDokumenByUuidService, updateStatusRiwayatAktivitasDokumenByUuidService } from "./statusRiwayatAktivitasDokumen.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllStatusRiwayatAktivitasDokumensByRiwayatAktivitasDokumen = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllStatusRiwayatAktivitasDokumenController", null, req.identity)
    try {
        const statusRiwayatAktivitasDokumens = await getAllStatusRiwayatAktivitasDokumensByRiwayatAktivitasDokumenService(req.params.riwayat_aktivitas_dokumen, req.query, req.identity)
        res.json({
            data: statusRiwayatAktivitasDokumens,
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

export const getStatusRiwayatAktivitasDokumenByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getStatusRiwayatAktivitasDokumenByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getStatusRiwayatAktivitasDokumenByUuidService(uuid, req.identity),
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

export const postCreateStatusRiwayatAktivitasDokumen = async (req, res) => {
    LOGGER(logType.INFO, "Start createStatusRiwayatAktivitasDokumenController", null, req.identity)
    try {
        const statusRiwayatAktivitasDokumenData = req.body
        const { error, value } = statusRiwayatAktivitasDokumenValidation(statusRiwayatAktivitasDokumenData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const statusRiwayatAktivitasDokumen = await createStatusRiwayatAktivitasDokumenService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, statusRiwayatAktivitasDokumen, req.identity)
        res.json({
            data: statusRiwayatAktivitasDokumen,
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

export const deleteStatusRiwayatAktivitasDokumenByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteStatusRiwayatAktivitasDokumenByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteStatusRiwayatAktivitasDokumenByUuidService(uuid, req.identity)
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

export const updateStatusRiwayatAktivitasDokumenByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateStatusRiwayatAktivitasDokumenByUuidController", null, req.identity)
    try {
        const statusRiwayatAktivitasDokumenData = req.body
        const { error, value } = statusRiwayatAktivitasDokumenValidation(statusRiwayatAktivitasDokumenData)
        const { uuid } = req.params
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateStatusRiwayatAktivitasDokumenByUuidService(uuid, value, req.identity, req.originalUrl, req.method)
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