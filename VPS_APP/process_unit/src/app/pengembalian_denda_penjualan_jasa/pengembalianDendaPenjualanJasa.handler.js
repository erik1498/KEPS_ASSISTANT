import { pengembalianDendaPenjualanJasaValidation } from "./pengembalianDendaPenjualanJasa.validation.js"
import { createPengembalianDendaPenjualanJasaService, deletePengembalianDendaPenjualanJasaByUuidService, getAllPengembalianDendaPenjualanJasaService, getPengembalianDendaPenjualanJasaByUuidService, updatePengembalianDendaPenjualanJasaByUuidService } from "./pengembalianDendaPenjualanJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPengembalianDendaPenjualanJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPengembalianDendaPenjualanJasaController", null, req.identity)
    try {
        const pengembalianDendaPenjualanJasas = await getAllPengembalianDendaPenjualanJasaService(req.query, req.identity)
        res.json({
            data: pengembalianDendaPenjualanJasas,
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

export const getPengembalianDendaPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPengembalianDendaPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getPengembalianDendaPenjualanJasaByUuidService(uuid, req.identity),
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

export const postCreatePengembalianDendaPenjualanJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createPengembalianDendaPenjualanJasaController", null, req.identity)
    try {
        const pengembalianDendaPenjualanJasaData = req.body
        const { error, value } = pengembalianDendaPenjualanJasaValidation(pengembalianDendaPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const pengembalianDendaPenjualanJasa = await createPengembalianDendaPenjualanJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, pengembalianDendaPenjualanJasa, req.identity)
        res.json({
            data: pengembalianDendaPenjualanJasa,
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

export const deletePengembalianDendaPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePengembalianDendaPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePengembalianDendaPenjualanJasaByUuidService(uuid, req.identity)
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

export const updatePengembalianDendaPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePengembalianDendaPenjualanJasaByUuidController", null, req.identity)
    try {    
        const pengembalianDendaPenjualanJasaData = req.body
        const { error, value } = pengembalianDendaPenjualanJasaValidation(pengembalianDendaPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePengembalianDendaPenjualanJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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