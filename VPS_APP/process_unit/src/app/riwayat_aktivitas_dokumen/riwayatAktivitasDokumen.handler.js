import { riwayatAktivitasDokumenValidation } from "./riwayatAktivitasDokumen.validation.js"
import { createRiwayatAktivitasDokumenService, deleteRiwayatAktivitasDokumenByUuidService, getAllRiwayatAktivitasDokumensByAktivitasDokumenService, getRiwayatAktivitasDokumenByUuidService, updateRiwayatAktivitasDokumenByUuidService } from "./riwayatAktivitasDokumen.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRiwayatAktivitasDokumensByAktivitasDokumen = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRiwayatAktivitasDokumenController", null, req.identity)
    try {
        const riwayatAktivitasDokumens = await getAllRiwayatAktivitasDokumensByAktivitasDokumenService(req.params.aktivitas_dokumen, req.query, req.identity)
        res.json({
            data: riwayatAktivitasDokumens,
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

export const getRiwayatAktivitasDokumenByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRiwayatAktivitasDokumenByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRiwayatAktivitasDokumenByUuidService(uuid, req.identity),
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

export const postCreateRiwayatAktivitasDokumen = async (req, res) => {
    LOGGER(logType.INFO, "Start createRiwayatAktivitasDokumenController", null, req.identity)
    try {
        const riwayatAktivitasDokumenData = req.body
        const { error, value } = riwayatAktivitasDokumenValidation(riwayatAktivitasDokumenData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const riwayatAktivitasDokumen = await createRiwayatAktivitasDokumenService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, aktivitasDokumen, req.identity)
        res.json({
            data: riwayatAktivitasDokumen,
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

export const deleteRiwayatAktivitasDokumenByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRiwayatAktivitasDokumenByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRiwayatAktivitasDokumenByUuidService(uuid, req.identity)
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

export const updateRiwayatAktivitasDokumenByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRiwayatAktivitasDokumenByUuidController", null, req.identity)
    try {
        const riwayatAktivitasDokumenData = req.body
        const { error, value } = riwayatAktivitasDokumenValidation(riwayatAktivitasDokumenData)
        const { uuid } = req.params
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRiwayatAktivitasDokumenByUuidService(uuid, value, req.identity, req.originalUrl, req.method)
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