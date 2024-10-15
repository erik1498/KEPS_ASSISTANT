import { pelunasanPenjualanJasaValidation } from "./pelunasanPenjualanJasa.validation.js"
import { createPelunasanPenjualanJasaService, deletePelunasanPenjualanJasaByUuidService, getAllPelunasanPenjualanJasaService, getCekDendaByPelunasanPenjualanUUIDService, getPelunasanPenjualanJasaByUuidService, updatePelunasanPenjualanJasaByUuidService } from "./pelunasanPenjualanJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPelunasanPenjualanJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPelunasanPenjualanJasaController", null, req.identity)
    try {
        const pelunasanPenjualanJasas = await getAllPelunasanPenjualanJasaService(req.query, req.identity)
        res.json({
            data: pelunasanPenjualanJasas,
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

export const getCekDendaByPelunasanPenjualanUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getCekDendaByPelunasanPenjualanUUID", null, req.identity)
    try {
        const cekDenda = await getCekDendaByPelunasanPenjualanUUIDService(req.params.uuid, req.identity)
        res.json({
            data: cekDenda,
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

export const getPelunasanPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPelunasanPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getPelunasanPenjualanJasaByUuidService(uuid, req.identity),
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

export const postCreatePelunasanPenjualanJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createPelunasanPenjualanJasaController", null, req.identity)
    try {
        const pelunasanPenjualanJasaData = req.body
        const { error, value } = pelunasanPenjualanJasaValidation(pelunasanPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const pelunasanPenjualanJasa = await createPelunasanPenjualanJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, pelunasanPenjualanJasa, req.identity)
        res.json({
            data: pelunasanPenjualanJasa,
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

export const deletePelunasanPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePelunasanPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePelunasanPenjualanJasaByUuidService(uuid, req.identity)
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

export const updatePelunasanPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePelunasanPenjualanJasaByUuidController", null, req.identity)
    try {    
        const pelunasanPenjualanJasaData = req.body
        const { error, value } = pelunasanPenjualanJasaValidation(pelunasanPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePelunasanPenjualanJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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