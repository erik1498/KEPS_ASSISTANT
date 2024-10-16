import { returPembelianBarangValidation } from "./returPembelianBarang.validation.js"
import { createReturPembelianBarangService, deleteReturPembelianBarangByUuidService, getAllReturPembelianBarangService, getCekDendaByReturPembelianUUIDService, getReturPembelianBarangByUuidService, updateReturPembelianBarangByUuidService } from "./returPembelianBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllReturPembelianBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllReturPembelianBarangController", null, req.identity)
    try {
        const returPembelianBarangs = await getAllReturPembelianBarangService(req.query, req.identity)
        res.json({
            data: returPembelianBarangs,
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

export const getReturPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getReturPembelianBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getReturPembelianBarangByUuidService(uuid, req.identity),
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

export const postCreateReturPembelianBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createReturPembelianBarangController", null, req.identity)
    try {
        const returPembelianBarangData = req.body
        const { error, value } = returPembelianBarangValidation(returPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const returPembelianBarang = await createReturPembelianBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, returPembelianBarang, req.identity)
        res.json({
            data: returPembelianBarang,
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

export const deleteReturPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteReturPembelianBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteReturPembelianBarangByUuidService(uuid, req.identity)
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

export const updateReturPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateReturPembelianBarangByUuidController", null, req.identity)
    try {    
        const returPembelianBarangData = req.body
        const { error, value } = returPembelianBarangValidation(returPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateReturPembelianBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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