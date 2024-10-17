import { pelunasanPembelianBarangValidation } from "./pelunasanPembelianBarang.validation.js"
import { createPelunasanPembelianBarangService, deletePelunasanPembelianBarangByUuidService, getAllPelunasanPembelianBarangService, getPelunasanPembelianBarangByUuidService, updatePelunasanPembelianBarangByUuidService } from "./pelunasanPembelianBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPelunasanPembelianBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPelunasanPembelianBarangController", null, req.identity)
    try {
        const pelunasanPembelianBarangs = await getAllPelunasanPembelianBarangService(req.query, req.identity)
        res.json({
            data: pelunasanPembelianBarangs,
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

export const getPelunasanPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPelunasanPembelianBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getPelunasanPembelianBarangByUuidService(uuid, req.identity),
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

export const postCreatePelunasanPembelianBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createPelunasanPembelianBarangController", null, req.identity)
    try {
        const pelunasanPembelianBarangData = req.body
        const { error, value } = pelunasanPembelianBarangValidation(pelunasanPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const pelunasanPembelianBarang = await createPelunasanPembelianBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, pelunasanPembelianBarang, req.identity)
        res.json({
            data: pelunasanPembelianBarang,
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

export const deletePelunasanPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePelunasanPembelianBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePelunasanPembelianBarangByUuidService(uuid, req.identity)
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

export const updatePelunasanPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePelunasanPembelianBarangByUuidController", null, req.identity)
    try {    
        const pelunasanPembelianBarangData = req.body
        const { error, value } = pelunasanPembelianBarangValidation(pelunasanPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePelunasanPembelianBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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