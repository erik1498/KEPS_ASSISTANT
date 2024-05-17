import { kodeAkunPerkiraanValidation } from "./kodeAkunPerkiraan.validation.js"
import { createKodeAkunPerkiraanService, deleteKodeAkunPerkiraanByUuidService, getAllKodeAkunPerkiraanBankService, getAllKodeAkunPerkiraanByCodeListService, getAllKodeAkunPerkiraanByTypeService, getAllKodeAkunPerkiraanExceptTypeService, getAllKodeAkunPerkiraanKasService, getAllKodeAkunPerkiraanNoBankService, getAllKodeAkunPerkiraanNoKasService, getAllKodeAkunPerkiraanService, getKodeAkunPerkiraanByUuidService, updateKodeAkunPerkiraanByUuidService } from "./kodeAkunPerkiraan.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllKodeAkunPerkiraans = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraanController", null, req.identity)
    try {
        const kodeAkunPerkiraans = await getAllKodeAkunPerkiraanService(req.query, req.identity)
        res.json({
            data: kodeAkunPerkiraans,
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

export const getKodeAkunPerkiraansByCodeList = async (req, res) => {
    LOGGER(logType.INFO, "Start getKodeAkunPerkiraansByCodeListController", null, req.identity)
    try {
        const kodeAkunPerkiraans = await getAllKodeAkunPerkiraanByCodeListService(req.body, req.identity)
        res.json({
            data: kodeAkunPerkiraans,
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

export const getAllKodeAkunPerkiraanKas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraanKasController", null, req.identity)
    try {
        const { type } = req.params
        const kodeAkunPerkiraans = await getAllKodeAkunPerkiraanKasService(req.id)
        res.json({
            data: kodeAkunPerkiraans,
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

export const getAllKodeAkunPerkiraanNoKas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraanKasController", null, req.identity)
    try {
        const { type } = req.params
        const kodeAkunPerkiraans = await getAllKodeAkunPerkiraanNoKasService(req.id)
        res.json({
            data: kodeAkunPerkiraans,
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

export const getAllKodeAkunPerkiraanBank = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraanBankController", null, req.identity)
    try {
        const { type } = req.params
        const kodeAkunPerkiraans = await getAllKodeAkunPerkiraanBankService(req.id)
        res.json({
            data: kodeAkunPerkiraans,
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

export const getAllKodeAkunPerkiraanNoBank = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraanNoBankController", null, req.identity)
    try {
        const { type } = req.params
        const kodeAkunPerkiraans = await getAllKodeAkunPerkiraanNoBankService(req.id)
        res.json({
            data: kodeAkunPerkiraans,
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

export const getAllKodeAkunPerkiraanByType = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraanByTypeController", null, req.identity)
    try {
        const { type } = req.params
        const kodeAkunPerkiraans = await getAllKodeAkunPerkiraanByTypeService(type, req.identity)
        res.json({
            data: kodeAkunPerkiraans,
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

export const getAllKodeAkunPerkiraanExceptType = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraanExceptTypeController", null, req.identity)
    try {
        const { type } = req.params
        const kodeAkunPerkiraans = await getAllKodeAkunPerkiraanExceptTypeService(type, req.identity)
        res.json({
            data: kodeAkunPerkiraans,
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

export const getKodeAkunPerkiraanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getKodeAkunPerkiraanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getKodeAkunPerkiraanByUuidService(uuid, req.identity),
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

export const postCreateKodeAkunPerkiraan = async (req, res) => {
    LOGGER(logType.INFO, "Start createKodeAkunPerkiraanController", null, req.identity)
    try {
        const kodeAkunPerkiraanData = req.body
        const { error, value } = kodeAkunPerkiraanValidation(kodeAkunPerkiraanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const kodeAkunPerkiraan = await createKodeAkunPerkiraanService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, kodeAkunPerkiraan, req.identity)
        res.json({
            data: kodeAkunPerkiraan,
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

export const deleteKodeAkunPerkiraanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteKodeAkunPerkiraanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteKodeAkunPerkiraanByUuidService(uuid, req.identity)
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

export const updateKodeAkunPerkiraanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateKodeAkunPerkiraanByUuidController", null, req.identity)
    try {
        const kodeAkunPerkiraanData = req.body
        const { error, value } = kodeAkunPerkiraanValidation(kodeAkunPerkiraanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateKodeAkunPerkiraanByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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