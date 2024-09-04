import { pegawaiValidation } from "./pegawai.validation.js"
import { createPegawaiService, deletePegawaiByUuidService, getAllPegawaiService, getPegawaiByUuidService, updatePegawaiByUuidService } from "./pegawai.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPegawais = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPegawaiController", null, req.identity)
    try {
        const pegawais = await getAllPegawaiService(req.query, req.identity)
        res.json({
            data: pegawais,
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

export const getPegawaiByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPegawaiByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getPegawaiByUuidService(uuid, req.identity),
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

export const postCreatePegawai = async (req, res) => {
    LOGGER(logType.INFO, "Start createPegawaiController", null, req.identity)
    try {
        const pegawaiData = req.body
        const { error, value } = pegawaiValidation(pegawaiData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const pegawai = await createPegawaiService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, pegawai, req.identity)
        res.json({
            data: pegawai,
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

export const deletePegawaiByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePegawaiByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePegawaiByUuidService(uuid, req.identity)
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

export const updatePegawaiByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePegawaiByUuidController", null, req.identity)
    try {    
        const pegawaiData = req.body
        const { error, value } = pegawaiValidation(pegawaiData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePegawaiByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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