import { pengembalianDendaPembelianBarangValidation } from "./pengembalianDendaPembelianBarang.validation.js"
import { createPengembalianDendaPembelianBarangService, deletePengembalianDendaPembelianBarangByUuidService, getAllPengembalianDendaPembelianBarangService, getPengembalianDendaPembelianBarangByUuidService, updatePengembalianDendaPembelianBarangByUuidService } from "./pengembalianDendaPembelianBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPengembalianDendaPembelianBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPengembalianDendaPembelianBarangController", null, req.identity)
    try {
        const pengembalianDendaPembelianBarangs = await getAllPengembalianDendaPembelianBarangService(req.query, req.identity)
        res.json({
            data: pengembalianDendaPembelianBarangs,
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

export const getPengembalianDendaPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPengembalianDendaPembelianBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getPengembalianDendaPembelianBarangByUuidService(uuid, req.identity),
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

export const postCreatePengembalianDendaPembelianBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createPengembalianDendaPembelianBarangController", null, req.identity)
    try {
        const pengembalianDendaPembelianBarangData = req.body
        const { error, value } = pengembalianDendaPembelianBarangValidation(pengembalianDendaPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const pengembalianDendaPembelianBarang = await createPengembalianDendaPembelianBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, pengembalianDendaPembelianBarang, req.identity)
        res.json({
            data: pengembalianDendaPembelianBarang,
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

export const deletePengembalianDendaPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePengembalianDendaPembelianBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePengembalianDendaPembelianBarangByUuidService(uuid, req.identity)
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

export const updatePengembalianDendaPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePengembalianDendaPembelianBarangByUuidController", null, req.identity)
    try {    
        const pengembalianDendaPembelianBarangData = req.body
        const { error, value } = pengembalianDendaPembelianBarangValidation(pengembalianDendaPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePengembalianDendaPembelianBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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