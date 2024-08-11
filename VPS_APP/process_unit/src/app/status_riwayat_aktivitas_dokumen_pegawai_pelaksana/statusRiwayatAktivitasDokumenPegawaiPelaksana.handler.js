import { statusRiwayatAktivitasDokumenPegawaiPelaksanaValidation } from "./statusRiwayatAktivitasDokumenPegawaiPelaksana.validation.js"
import { createStatusRiwayatAktivitasDokumenPegawaiPelaksanaService, deleteStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidService, getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasByStatusRiwayatAktivitasDokumenService, getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasService, getStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidService, updateStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidService } from "./statusRiwayatAktivitasDokumenPegawaiPelaksana.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanas", null, req.identity)
    try {
        const statusRiwayatAktivitasDokumenPegawaiPelaksanas = await getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasService(req.params.tahun, req.identity)
        res.json({
            data: statusRiwayatAktivitasDokumenPegawaiPelaksanas,
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

export const getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasByStatusRiwayatAktivitasDokumen = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasByStatusRiwayatAktivitasDokumenController", null, req.identity)
    try {
        const statusRiwayatAktivitasDokumenPegawaiPelaksanas = await getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasByStatusRiwayatAktivitasDokumenService(req.params.status_riwayat_aktivitas_dokumen, req.query, req.identity)
        res.json({
            data: statusRiwayatAktivitasDokumenPegawaiPelaksanas,
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

export const getStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidService(uuid, req.identity),
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

export const postCreateStatusRiwayatAktivitasDokumenPegawaiPelaksana = async (req, res) => {
    LOGGER(logType.INFO, "Start createStatusRiwayatAktivitasDokumenPegawaiPelaksanaController", null, req.identity)
    try {
        const statusRiwayatAktivitasDokumenPegawaiPelaksanaData = req.body
        const { error, value } = statusRiwayatAktivitasDokumenPegawaiPelaksanaValidation(statusRiwayatAktivitasDokumenPegawaiPelaksanaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const statusRiwayatAktivitasDokumenPegawaiPelaksana = await createStatusRiwayatAktivitasDokumenPegawaiPelaksanaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, statusRiwayatAktivitasDokumenPegawaiPelaksana, req.identity)
        res.json({
            data: statusRiwayatAktivitasDokumenPegawaiPelaksana,
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

export const deleteStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidService(uuid, req.identity)
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

export const updateStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidController", null, req.identity)
    try {
        const statusRiwayatAktivitasDokumenPegawaiPelaksanaData = req.body
        const { error, value } = statusRiwayatAktivitasDokumenPegawaiPelaksanaValidation(statusRiwayatAktivitasDokumenPegawaiPelaksanaData)
        const { uuid } = req.params
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidService(uuid, value, req.identity, req.originalUrl, req.method)
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