import { riwayatPembayaranAktivitasDokumenValidation } from "./riwayatPembayaranAktivitasDokumen.validation.js"
import { createRiwayatPembayaranAktivitasDokumenService, deleteRiwayatPembayaranAktivitasDokumenByUuidService, getAllRiwayatPembayaranAktivitasDokumensByAktivitasDokumenService, getAllRiwayatPembayaranAktivitasDokumensService, getRiwayatPembayaranAktivitasDokumenByUuidService, updateRiwayatPembayaranAktivitasDokumenByUuidService } from "./riwayatPembayaranAktivitasDokumen.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRiwayatPembayaranAktivitasDokumens = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRiwayatPembayaranAktivitasDokumens", null, req.identity)
    try {
        const riwayatPembayaranAktivitasDokumens = await getAllRiwayatPembayaranAktivitasDokumensService(req.params.tahun, req.identity)
        res.json({
            data: riwayatPembayaranAktivitasDokumens,
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

export const getAllRiwayatPembayaranAktivitasDokumensByAktivitasDokumen = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRiwayatPembayaranAktivitasDokumenController", null, req.identity)
    try {
        const riwayatPembayaranAktivitasDokumens = await getAllRiwayatPembayaranAktivitasDokumensByAktivitasDokumenService(req.params.aktivitas_dokumen, req.query, req.identity)
        res.json({
            data: riwayatPembayaranAktivitasDokumens,
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

export const getRiwayatPembayaranAktivitasDokumenByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRiwayatPembayaranAktivitasDokumenByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRiwayatPembayaranAktivitasDokumenByUuidService(uuid, req.identity),
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

export const postCreateRiwayatPembayaranAktivitasDokumen = async (req, res) => {
    LOGGER(logType.INFO, "Start createRiwayatPembayaranAktivitasDokumenController", null, req.identity)
    try {
        const riwayatPembayaranAktivitasDokumenData = req.body
        const { error, value } = riwayatPembayaranAktivitasDokumenValidation(riwayatPembayaranAktivitasDokumenData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const riwayatPembayaranAktivitasDokumen = await createRiwayatPembayaranAktivitasDokumenService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, riwayatPembayaranAktivitasDokumen, req.identity)
        res.json({
            data: riwayatPembayaranAktivitasDokumen,
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

export const deleteRiwayatPembayaranAktivitasDokumenByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRiwayatPembayaranAktivitasDokumenByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRiwayatPembayaranAktivitasDokumenByUuidService(uuid, req.identity)
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

export const updateRiwayatPembayaranAktivitasDokumenByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRiwayatPembayaranAktivitasDokumenByUuidController", null, req.identity)
    try {
        const riwayatPembayaranAktivitasDokumenData = req.body
        const { error, value } = riwayatPembayaranAktivitasDokumenValidation(riwayatPembayaranAktivitasDokumenData)
        const { uuid } = req.params
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRiwayatPembayaranAktivitasDokumenByUuidService(uuid, value, req.identity, req.originalUrl, req.method)
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