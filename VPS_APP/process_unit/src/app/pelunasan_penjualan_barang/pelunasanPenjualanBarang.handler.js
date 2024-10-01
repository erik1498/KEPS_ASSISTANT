import { pelunasanPenjualanBarangValidation } from "./pelunasanPenjualanBarang.validation.js"
import { createPelunasanPenjualanBarangService, deletePelunasanPenjualanBarangByUuidService, getAllPelunasanPenjualanBarangService, getPelunasanPenjualanBarangByUuidService, updatePelunasanPenjualanBarangByUuidService } from "./pelunasanPenjualanBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPelunasanPenjualanBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPelunasanPenjualanBarangController", null, req.identity)
    try {
        const pelunasanPenjualanBarangs = await getAllPelunasanPenjualanBarangService(req.query, req.identity)
        res.json({
            data: pelunasanPenjualanBarangs,
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

export const getPelunasanPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPelunasanPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getPelunasanPenjualanBarangByUuidService(uuid, req.identity),
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

export const postCreatePelunasanPenjualanBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createPelunasanPenjualanBarangController", null, req.identity)
    try {
        const pelunasanPenjualanBarangData = req.body
        const { error, value } = pelunasanPenjualanBarangValidation(pelunasanPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const pelunasanPenjualanBarang = await createPelunasanPenjualanBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, pelunasanPenjualanBarang, req.identity)
        res.json({
            data: pelunasanPenjualanBarang,
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

export const deletePelunasanPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePelunasanPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePelunasanPenjualanBarangByUuidService(uuid, req.identity)
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

export const updatePelunasanPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePelunasanPenjualanBarangByUuidController", null, req.identity)
    try {    
        const pelunasanPenjualanBarangData = req.body
        const { error, value } = pelunasanPenjualanBarangValidation(pelunasanPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePelunasanPenjualanBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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