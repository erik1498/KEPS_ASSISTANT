import { piutangKaryawanValidation } from "./piutangKaryawan.validation.js"
import { createPiutangKaryawanService, deletePiutangKaryawanByUuidService, getAllPiutangKaryawanService, getPiutangKaryawanByPegawaiUUIDService, getTotalPiutangKaryawanService, updatePiutangKaryawanByUuidService } from "./piutangKaryawan.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPiutangKaryawans = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPiutangKaryawanController", null, req.identity)
    try {
        const piutangKaryawans = await getAllPiutangKaryawanService(req.query, req.identity)
        res.json({
            data: piutangKaryawans,
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

export const getPiutangKaryawanByPegawaiUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPiutangKaryawanByPegawaiUUIDController", null, req.identity)
    try {
        const { uuid, periode, tahun } = req.params

        res.json({
            data: await getPiutangKaryawanByPegawaiUUIDService(uuid, periode, tahun, req.identity),
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

export const getTotalPiutangKaryawan = async (req, res) => {
    LOGGER(logType.INFO, "Start getTotalPiutangKaryawan", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getTotalPiutangKaryawanService(uuid, req.identity),
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

export const postCreatePiutangKaryawan = async (req, res) => {
    LOGGER(logType.INFO, "Start createPiutangKaryawanController", null, req.identity)
    try {
        const piutangKaryawanData = req.body
        const { error, value } = piutangKaryawanValidation(piutangKaryawanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const piutangKaryawan = await createPiutangKaryawanService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, piutangKaryawan, req.identity)
        res.json({
            data: piutangKaryawan,
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

export const deletePiutangKaryawanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePiutangKaryawanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePiutangKaryawanByUuidService(uuid, req.identity)
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

export const updatePiutangKaryawanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePiutangKaryawanByUuidController", null, req.identity)
    try {
        const piutangKaryawanData = req.body
        const { error, value } = piutangKaryawanValidation(piutangKaryawanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePiutangKaryawanByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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