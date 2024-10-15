import { pesananPembelianBarangValidation } from "./pesananPembelianBarang.validation.js"
import { createPesananPembelianBarangService, deletePesananPembelianBarangByUuidService, getAllPesananPembelianBarangService, getPesananPembelianBarangByUuidService, updatePesananPembelianBarangByUuidService } from "./pesananPembelianBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPesananPembelianBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPesananPembelianBarangController", null, req.identity)
    try {
        const pesananPembelianBarangs = await getAllPesananPembelianBarangService(req.query, req.identity)
        res.json({
            data: pesananPembelianBarangs,
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

export const getPesananPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPesananPembelianBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getPesananPembelianBarangByUuidService(uuid, req.identity),
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

export const postCreatePesananPembelianBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createPesananPembelianBarangController", null, req.identity)
    try {
        const pesananPembelianBarangData = req.body
        const { error, value } = pesananPembelianBarangValidation(pesananPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const pesananPembelianBarang = await createPesananPembelianBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, pesananPembelianBarang, req.identity)
        res.json({
            data: pesananPembelianBarang,
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

export const deletePesananPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePesananPembelianBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePesananPembelianBarangByUuidService(uuid, req.identity)
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

export const updatePesananPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePesananPembelianBarangByUuidController", null, req.identity)
    try {    
        const pesananPembelianBarangData = req.body
        const { error, value } = pesananPembelianBarangValidation(pesananPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePesananPembelianBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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