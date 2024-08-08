import { aktivitasDokumenValidation } from "./aktivitasDokumen.validation.js"
import { createAktivitasDokumenService, deleteAktivitasDokumenByUuidService, getAllAktivitasDokumenService, getAktivitasDokumenByUuidService, updateAktivitasDokumenByUuidService } from "./aktivitasDokumen.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllAktivitasDokumens = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllAktivitasDokumenController", null, req.identity)
    try {
        const aktivitasDokumens = await getAllAktivitasDokumenService(req.params.tahun, req.query, req.identity)
        res.json({
            data: aktivitasDokumens,
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

export const getAktivitasDokumenByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getAktivitasDokumenByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getAktivitasDokumenByUuidService(uuid, req.identity),
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

export const postCreateAktivitasDokumen = async (req, res) => {
    LOGGER(logType.INFO, "Start createAktivitasDokumenController", null, req.identity)
    try {
        const aktivitasDokumenData = req.body
        const { error, value } = aktivitasDokumenValidation(aktivitasDokumenData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const aktivitasDokumen = await createAktivitasDokumenService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, aktivitasDokumen, req.identity)
        res.json({
            data: aktivitasDokumen,
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

export const deleteAktivitasDokumenByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteAktivitasDokumenByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteAktivitasDokumenByUuidService(uuid, req.identity)
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

export const updateAktivitasDokumenByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateAktivitasDokumenByUuidController", null, req.identity)
    try {
        const aktivitasDokumenData = req.body
        const { error, value } = aktivitasDokumenValidation(aktivitasDokumenData)
        const { uuid } = req.params
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateAktivitasDokumenByUuidService(uuid, value, req.identity, req.originalUrl, req.method)
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