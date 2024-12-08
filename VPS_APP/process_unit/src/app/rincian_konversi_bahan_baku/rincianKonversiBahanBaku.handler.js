import { rincianKonversiBahanBakuValidation } from "./rincianKonversiBahanBaku.validation.js"
import { createRincianKonversiBahanBakuService, deleteRincianKonversiBahanBakuByUuidService, getAllRincianKonversiBahanBakuService, getRincianKonversiBahanBakuByKonversiBahanBakuUuidService, getRincianKonversiBahanBakuByUuidService, updateRincianKonversiBahanBakuByUuidService } from "./rincianKonversiBahanBaku.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianKonversiBahanBakus = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianKonversiBahanBakuController", null, req.identity)
    try {
        const rincianKonversiBahanBakus = await getAllRincianKonversiBahanBakuService(req.query, req.identity)
        res.json({
            data: rincianKonversiBahanBakus,
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

export const getRincianKonversiBahanBakuByKonversiBahanBakuUuid = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianKonversiBahanBakuByKonversiBahanBakuUuid", null, req.identity)
    try {
        const { konversi_bahan_baku } = req.params
        res.json({
            data: await getRincianKonversiBahanBakuByKonversiBahanBakuUuidService(konversi_bahan_baku, req.identity),
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

export const getRincianKonversiBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianKonversiBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianKonversiBahanBakuByUuidService(uuid, req.identity),
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

export const postCreateRincianKonversiBahanBaku = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianKonversiBahanBakuController", null, req.identity)
    try {
        const rincianKonversiBahanBakuData = req.body
        const { error, value } = rincianKonversiBahanBakuValidation(rincianKonversiBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianKonversiBahanBaku = await createRincianKonversiBahanBakuService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianKonversiBahanBaku, req.identity)
        res.json({
            data: rincianKonversiBahanBaku,
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

export const deleteRincianKonversiBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianKonversiBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianKonversiBahanBakuByUuidService(uuid, req.identity)
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

export const updateRincianKonversiBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianKonversiBahanBakuByUuidController", null, req.identity)
    try {
        const rincianKonversiBahanBakuData = req.body
        const { error, value } = rincianKonversiBahanBakuValidation(rincianKonversiBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianKonversiBahanBakuByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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