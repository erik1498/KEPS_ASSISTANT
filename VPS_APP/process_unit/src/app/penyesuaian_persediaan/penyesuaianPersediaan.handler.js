import { penyesuaianPersediaanValidation } from "./penyesuaianPersediaan.validation.js"
import { createPenyesuaianPersediaanService, deletePenyesuaianPersediaanByUuidService, getAllPenyesuaianPersediaanService, getPenyesuaianPersediaanByPerintahStokOpnameService, getPenyesuaianPersediaanByUuidService, updatePenyesuaianPersediaanByUuidService } from "./penyesuaianPersediaan.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPenyesuaianPersediaans = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPenyesuaianPersediaanController", null, req.identity)
    try {
        const penyesuaianPersediaans = await getAllPenyesuaianPersediaanService(req.query, req.identity)
        res.json({
            data: penyesuaianPersediaans,
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

export const getPenyesuaianPersediaanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPenyesuaianPersediaanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getPenyesuaianPersediaanByUuidService(uuid, req.identity),
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

export const getPenyesuaianPersediaanByPerintahStokOpname = async (req, res) => {
    LOGGER(logType.INFO, "Start getPenyesuaianPersediaanByPerintahStokOpname", null, req.identity)
    try {
        const { perintah_stok_opname } = req.params

        res.json({
            data: await getPenyesuaianPersediaanByPerintahStokOpnameService(perintah_stok_opname, req.identity),
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

export const postCreatePenyesuaianPersediaan = async (req, res) => {
    LOGGER(logType.INFO, "Start createPenyesuaianPersediaanController", null, req.identity)
    try {
        const penyesuaianPersediaanData = req.body
        const { error, value } = penyesuaianPersediaanValidation(penyesuaianPersediaanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const penyesuaianPersediaan = await createPenyesuaianPersediaanService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, penyesuaianPersediaan, req.identity)
        res.json({
            data: penyesuaianPersediaan,
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

export const deletePenyesuaianPersediaanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePenyesuaianPersediaanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePenyesuaianPersediaanByUuidService(uuid, req.identity)
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

export const updatePenyesuaianPersediaanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePenyesuaianPersediaanByUuidController", null, req.identity)
    try {    
        const penyesuaianPersediaanData = req.body
        const { error, value } = penyesuaianPersediaanValidation(penyesuaianPersediaanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePenyesuaianPersediaanByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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