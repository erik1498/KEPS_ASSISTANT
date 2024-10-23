import { rincianTransferBarangValidation } from "./rincianTransferBarang.validation.js"
import { createRincianTransferBarangService, deleteRincianTransferBarangByUuidService, getAllRincianTransferBarangService, getRincianTransferBarangByTransferBarangUuidService, getRincianTransferBarangByUuidService, updateRincianTransferBarangByUuidService } from "./rincianTransferBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianTransferBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianTransferBarangController", null, req.identity)
    try {
        const rincianTransferBarangs = await getAllRincianTransferBarangService(req.query, req.identity)
        res.json({
            data: rincianTransferBarangs,
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

export const getRincianTransferBarangByTransferBarangUuid = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianTransferBarangByTransferBarangUuid", null, req.identity)
    try {
        const { transfer_barang } = req.params
        res.json({
            data: await getRincianTransferBarangByTransferBarangUuidService(transfer_barang, req.identity),
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

export const getRincianTransferBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianTransferBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianTransferBarangByUuidService(uuid, req.identity),
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

export const postCreateRincianTransferBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianTransferBarangController", null, req.identity)
    try {
        const rincianTransferBarangData = req.body
        const { error, value } = rincianTransferBarangValidation(rincianTransferBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianTransferBarang = await createRincianTransferBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianTransferBarang, req.identity)
        res.json({
            data: rincianTransferBarang,
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

export const deleteRincianTransferBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianTransferBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianTransferBarangByUuidService(uuid, req.identity)
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

export const updateRincianTransferBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianTransferBarangByUuidController", null, req.identity)
    try {
        const rincianTransferBarangData = req.body
        const { error, value } = rincianTransferBarangValidation(rincianTransferBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianTransferBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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