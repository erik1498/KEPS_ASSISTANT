import { daftarJasaValidation } from "./daftarJasa.validation.js"
import { createDaftarJasaService, deleteDaftarJasaByUuidService, getAllDaftarJasaService, getDaftarJasaByUuidService, updateDaftarJasaByUuidService } from "./daftarJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllDaftarJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllDaftarJasaController", null, req.identity)
    try {
        const daftarJasas = await getAllDaftarJasaService(req.query, req.identity)
        res.json({
            data: daftarJasas,
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

export const getDaftarJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getDaftarJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getDaftarJasaByUuidService(uuid, req.identity),
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

export const postCreateDaftarJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createDaftarJasaController", null, req.identity)
    try {
        const daftarJasaData = req.body
        const { error, value } = daftarJasaValidation(daftarJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const daftarJasa = await createDaftarJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, daftarJasa, req.identity)
        res.json({
            data: daftarJasa,
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

export const deleteDaftarJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteDaftarJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteDaftarJasaByUuidService(uuid, req.identity)
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

export const updateDaftarJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateDaftarJasaByUuidController", null, req.identity)
    try {    
        const daftarJasaData = req.body
        const { error, value } = daftarJasaValidation(daftarJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateDaftarJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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