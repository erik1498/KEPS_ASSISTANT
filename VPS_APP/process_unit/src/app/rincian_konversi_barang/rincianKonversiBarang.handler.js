import { rincianKonversiBarangValidation } from "./rincianKonversiBarang.validation.js"
import { createRincianKonversiBarangService, deleteRincianKonversiBarangByUuidService, getAllRincianKonversiBarangService, getRincianKonversiBarangByKonversiBarangUuidService, getRincianKonversiBarangByUuidService, updateRincianKonversiBarangByUuidService } from "./rincianKonversiBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianKonversiBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianKonversiBarangController", null, req.identity)
    try {
        const rincianKonversiBarangs = await getAllRincianKonversiBarangService(req.query, req.identity)
        res.json({
            data: rincianKonversiBarangs,
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

export const getRincianKonversiBarangByKonversiBarangUuid = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianKonversiBarangByKonversiBarangUuid", null, req.identity)
    try {
        const { konversi_barang } = req.params
        res.json({
            data: await getRincianKonversiBarangByKonversiBarangUuidService(konversi_barang, req.identity),
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

export const getRincianKonversiBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianKonversiBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianKonversiBarangByUuidService(uuid, req.identity),
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

export const postCreateRincianKonversiBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianKonversiBarangController", null, req.identity)
    try {
        const rincianKonversiBarangData = req.body
        const { error, value } = rincianKonversiBarangValidation(rincianKonversiBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianKonversiBarang = await createRincianKonversiBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianKonversiBarang, req.identity)
        res.json({
            data: rincianKonversiBarang,
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

export const deleteRincianKonversiBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianKonversiBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianKonversiBarangByUuidService(uuid, req.identity)
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

export const updateRincianKonversiBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianKonversiBarangByUuidController", null, req.identity)
    try {
        const rincianKonversiBarangData = req.body
        const { error, value } = rincianKonversiBarangValidation(rincianKonversiBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianKonversiBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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