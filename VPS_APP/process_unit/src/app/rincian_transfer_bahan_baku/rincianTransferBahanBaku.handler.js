import { rincianTransferBahanBakuValidation } from "./rincianTransferBahanBaku.validation.js"
import { createRincianTransferBahanBakuService, deleteRincianTransferBahanBakuByUuidService, getAllRincianTransferBahanBakuService, getRincianTransferBahanBakuByTransferBahanBakuUuidService, getRincianTransferBahanBakuByUuidService, updateRincianTransferBahanBakuByUuidService } from "./rincianTransferBahanBaku.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianTransferBahanBakus = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianTransferBahanBakuController", null, req.identity)
    try {
        const rincianTransferBahanBakus = await getAllRincianTransferBahanBakuService(req.query, req.identity)
        res.json({
            data: rincianTransferBahanBakus,
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

export const getRincianTransferBahanBakuByTransferBahanBakuUuid = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianTransferBahanBakuByTransferBahanBakuUuid", null, req.identity)
    try {
        const { transfer_bahan_baku } = req.params
        res.json({
            data: await getRincianTransferBahanBakuByTransferBahanBakuUuidService(transfer_bahan_baku, req.identity),
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

export const getRincianTransferBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianTransferBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianTransferBahanBakuByUuidService(uuid, req.identity),
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

export const postCreateRincianTransferBahanBaku = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianTransferBahanBakuController", null, req.identity)
    try {
        const rincianTransferBahanBakuData = req.body
        const { error, value } = rincianTransferBahanBakuValidation(rincianTransferBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianTransferBahanBaku = await createRincianTransferBahanBakuService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianTransferBahanBaku, req.identity)
        res.json({
            data: rincianTransferBahanBaku,
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

export const deleteRincianTransferBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianTransferBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianTransferBahanBakuByUuidService(uuid, req.identity)
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

export const updateRincianTransferBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianTransferBahanBakuByUuidController", null, req.identity)
    try {
        const rincianTransferBahanBakuData = req.body
        const { error, value } = rincianTransferBahanBakuValidation(rincianTransferBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianTransferBahanBakuByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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