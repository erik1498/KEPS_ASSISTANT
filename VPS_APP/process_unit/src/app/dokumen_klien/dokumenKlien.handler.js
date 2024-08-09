import { dokumenKlienValidation } from "./dokumenKlien.validation.js"
import { createDokumenKlienService, deleteDokumenKlienByUuidService, getAllDokumenKlienByAktivitasDokumenService, getDokumenKlienByUuidService, updateDokumenKlienByUuidService } from "./dokumenKlien.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllDokumenKliensByAktivitasDokumen = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllDokumenKlienByAktivitasDokumenController", null, req.identity)
    try {
        const dokumenKliens = await getAllDokumenKlienByAktivitasDokumenService(req.params.aktivitas_dokumen, req.query, req.identity)
        res.json({
            data: dokumenKliens,
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

export const getDokumenKlienByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getDokumenKlienByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getDokumenKlienByUuidService(uuid, req.identity),
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

export const postCreateDokumenKlien = async (req, res) => {
    LOGGER(logType.INFO, "Start createDokumenKlienController", null, req.identity)
    try {
        const dokumenKlienData = req.body
        const { error, value } = dokumenKlienValidation(dokumenKlienData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const dokumenKlien = await createDokumenKlienService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, dokumenKlienData, req.identity)
        res.json({
            data: dokumenKlien,
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

export const deleteDokumenKlienByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteDokumenKlienByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteDokumenKlienByUuidService(uuid, req.identity)
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

export const updateDokumenKlienByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateDokumenKlienByUuidController", null, req.identity)
    try {
        const dokumenKlienData = req.body
        const { error, value } = dokumenKlienValidation(dokumenKlienData)
        const { uuid } = req.params
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateDokumenKlienByUuidService(uuid, value, req.identity, req.originalUrl, req.method)
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