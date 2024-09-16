import { statusRiwayatAktivitasDokumenKeteranganValidation } from "./statusRiwayatAktivitasDokumenKeterangan.validation.js"
import { createStatusRiwayatAktivitasDokumenKeteranganService, deleteStatusRiwayatAktivitasDokumenKeteranganByUuidService, getAllStatusRiwayatAktivitasDokumenKeterangansByStatusRiwayatAktivitasDokumenService, getStatusRiwayatAktivitasDokumenKeteranganByUuidService, updateStatusRiwayatAktivitasDokumenKeteranganByUuidService } from "./statusRiwayatAktivitasDokumenKeterangan.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllStatusRiwayatAktivitasDokumenKeterangansByStatusRiwayatAktivitasDokumen = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllStatusRiwayatAktivitasDokumenKeterangansByStatusRiwayatAktivitasDokumenController", null, req.identity)
    try {
        const statusRiwayatAktivitasDokumenKeterangans = await getAllStatusRiwayatAktivitasDokumenKeterangansByStatusRiwayatAktivitasDokumenService(req.params.status_riwayat_aktivitas_dokumen, req.query, req.identity)
        res.json({
            data: statusRiwayatAktivitasDokumenKeterangans,
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

export const getStatusRiwayatAktivitasDokumenKeteranganByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getStatusRiwayatAktivitasDokumenKeteranganByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getStatusRiwayatAktivitasDokumenKeteranganByUuidService(uuid, req.identity),
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

export const postCreateStatusRiwayatAktivitasDokumenKeterangan = async (req, res) => {
    LOGGER(logType.INFO, "Start createStatusRiwayatAktivitasDokumenKeteranganController", null, req.identity)
    try {
        const statusRiwayatAktivitasDokumenKeteranganData = req.body
        const { error, value } = statusRiwayatAktivitasDokumenKeteranganValidation(statusRiwayatAktivitasDokumenKeteranganData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const statusRiwayatAktivitasDokumenKeterangan = await createStatusRiwayatAktivitasDokumenKeteranganService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, statusRiwayatAktivitasDokumenKeterangan, req.identity)
        res.json({
            data: statusRiwayatAktivitasDokumenKeterangan,
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

export const deleteStatusRiwayatAktivitasDokumenKeteranganByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteStatusRiwayatAktivitasDokumenKeteranganByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteStatusRiwayatAktivitasDokumenKeteranganByUuidService(uuid, req.identity)
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

export const updateStatusRiwayatAktivitasDokumenKeteranganByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateStatusRiwayatAktivitasDokumenKeteranganByUuidController", null, req.identity)
    try {
        const statusRiwayatAktivitasDokumenKeteranganData = req.body
        const { error, value } = statusRiwayatAktivitasDokumenKeteranganValidation(statusRiwayatAktivitasDokumenKeteranganData)
        const { uuid } = req.params
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateStatusRiwayatAktivitasDokumenKeteranganByUuidService(uuid, value, req.identity, req.originalUrl, req.method)
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