import { rincianPengembalianDendaPembelianBarangValidation } from "./rincianPengembalianDendaPembelianBarang.validation.js"
import { createRincianPengembalianDendaPembelianBarangService, deleteRincianPengembalianDendaPembelianBarangByUuidService, getAllRincianPengembalianDendaPembelianBarangService, getRincianPengembalianDendaPembelianBarangByFakturPembelianBarangUUIDService, getRincianPengembalianDendaPembelianBarangByUuidService, updateRincianPengembalianDendaPembelianBarangByUuidService } from "./rincianPengembalianDendaPembelianBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianPengembalianDendaPembelianBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPengembalianDendaPembelianBarangController", null, req.identity)
    try {
        const rincianPengembalianDendaPembelianBarangs = await getAllRincianPengembalianDendaPembelianBarangService(req.query, req.identity)
        res.json({
            data: rincianPengembalianDendaPembelianBarangs,
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

export const getRincianPengembalianDendaPembelianBarangByFakturPembelianBarangUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianPengembalianDendaPembelianBarangByFakturPembelianBarangUUIDController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianPengembalianDendaPembelianBarangByFakturPembelianBarangUUIDService(uuid, req.identity),
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

export const postCreateRincianPengembalianDendaPembelianBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianPengembalianDendaPembelianBarangController", null, req.identity)
    try {
        const rincianPengembalianDendaPembelianBarangData = req.body
        const { error, value } = rincianPengembalianDendaPembelianBarangValidation(rincianPengembalianDendaPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianPengembalianDendaPembelianBarang = await createRincianPengembalianDendaPembelianBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianPengembalianDendaPembelianBarang, req.identity)
        res.json({
            data: rincianPengembalianDendaPembelianBarang,
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

export const deleteRincianPengembalianDendaPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianPengembalianDendaPembelianBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianPengembalianDendaPembelianBarangByUuidService(uuid, req.identity)
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

export const updateRincianPengembalianDendaPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianPengembalianDendaPembelianBarangByUuidController", null, req.identity)
    try {    
        const rincianPengembalianDendaPembelianBarangData = req.body
        const { error, value } = rincianPengembalianDendaPembelianBarangValidation(rincianPengembalianDendaPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianPengembalianDendaPembelianBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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