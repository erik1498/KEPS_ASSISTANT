import { pengembalianDendaPenjualanBarangValidation } from "./pengembalianDendaPenjualanBarang.validation.js"
import { createPengembalianDendaPenjualanBarangService, deletePengembalianDendaPenjualanBarangByUuidService, getAllPengembalianDendaPenjualanBarangService, getPengembalianDendaPenjualanBarangByUuidService, updatePengembalianDendaPenjualanBarangByUuidService } from "./pengembalianDendaPenjualanBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPengembalianDendaPenjualanBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPengembalianDendaPenjualanBarangController", null, req.identity)
    try {
        const pengembalianDendaPenjualanBarangs = await getAllPengembalianDendaPenjualanBarangService(req.query, req.identity)
        res.json({
            data: pengembalianDendaPenjualanBarangs,
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

export const getPengembalianDendaPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPengembalianDendaPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getPengembalianDendaPenjualanBarangByUuidService(uuid, req.identity),
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

export const postCreatePengembalianDendaPenjualanBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createPengembalianDendaPenjualanBarangController", null, req.identity)
    try {
        const pengembalianDendaPenjualanBarangData = req.body
        const { error, value } = pengembalianDendaPenjualanBarangValidation(pengembalianDendaPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const pengembalianDendaPenjualanBarang = await createPengembalianDendaPenjualanBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, pengembalianDendaPenjualanBarang, req.identity)
        res.json({
            data: pengembalianDendaPenjualanBarang,
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

export const deletePengembalianDendaPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePengembalianDendaPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePengembalianDendaPenjualanBarangByUuidService(uuid, req.identity)
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

export const updatePengembalianDendaPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePengembalianDendaPenjualanBarangByUuidController", null, req.identity)
    try {    
        const pengembalianDendaPenjualanBarangData = req.body
        const { error, value } = pengembalianDendaPenjualanBarangValidation(pengembalianDendaPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePengembalianDendaPenjualanBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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