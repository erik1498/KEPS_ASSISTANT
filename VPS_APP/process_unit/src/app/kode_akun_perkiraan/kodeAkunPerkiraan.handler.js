import { kodeAkunPerkiraanValidation } from "./kodeAkunPerkiraan.validation.js"
import { createKodeAkunPerkiraanService, deleteKodeAkunPerkiraanByUuidService, getAllKodeAkunPerkiraanService, getAllKodeAkunPerkiraanWhereInService, getKodeAkunPerkiraanByUuidService, updateKodeAkunPerkiraanByUuidService } from "./kodeAkunPerkiraan.services.js"
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

export const getPiutangUsahaKodeAkun = async (req, res) => {
    LOGGER(logType.INFO, "Start getPiutangUsahaKodeAkun", null, req.identity)
    try {
        const kodeAkunPerkiraans = await getKodeAkunPerkiraanByUuidService("33105460-6ac0-4744-a56c-6822bb4d4ba3", req.identity)
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

export const getAllKodeAkunPerkiraansKas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraansKas", null, req.identity)
    try {
        const kodeAkunPerkiraans = await getAllKodeAkunPerkiraanWhereInService([
            1
        ], req.identity)
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

export const getAllKodeAkunPerkiraansKasBank = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraansKasBank", null, req.identity)
    try {
        const kodeAkunPerkiraans = await getAllKodeAkunPerkiraanWhereInService([
            1, 2
        ], req.identity)
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

export const getAllKodeAkunPerkiraansNoKas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraansKas", null, req.identity)
    try {
        const kodeAkunPerkiraans = await getAllKodeAkunPerkiraanWhereInService([
            0, 2
        ], req.identity)
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


export const getAllKodeAkunPerkiraansBank = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraansBank", null, req.identity)
    try {
        const kodeAkunPerkiraans = await getAllKodeAkunPerkiraanWhereInService([
            2
        ], req.identity)
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

export const getAllKodeAkunPerkiraansNoBank = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraansBank", null, req.identity)
    try {
        const kodeAkunPerkiraans = await getAllKodeAkunPerkiraanWhereInService([
            0, 1
        ], req.identity)
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