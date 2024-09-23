import { daftarAsetValidation } from "./daftarAset.validation.js"
import { createDaftarAsetService, deleteDaftarAsetByUuidService, getAllDaftarAsetService, getDaftarAsetByUuidService, getPerhitunganPenyusutanService, updateDaftarAsetByUuidService } from "./daftarAset.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllDaftarAsets = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllDaftarAsetController", null, req.identity)
    try {
        const daftarAsets = await getAllDaftarAsetService(req.query, req.identity)
        res.json({
            data: daftarAsets,
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

export const getHitunganPenyusutanAset = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllDaftarAsetController", null, req.identity)
    try {
        const daftarAsets = await getPerhitunganPenyusutanService(req.params.uuid, req.identity)
        res.json({
            data: daftarAsets,
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

export const getDaftarAsetByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getDaftarAsetByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getDaftarAsetByUuidService(uuid, req.identity),
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

export const postCreateDaftarAset = async (req, res) => {
    LOGGER(logType.INFO, "Start createDaftarAsetController", null, req.identity)
    try {
        const daftarAsetData = req.body
        const { error, value } = daftarAsetValidation(daftarAsetData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const daftarAset = await createDaftarAsetService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, daftarAset, req.identity)
        res.json({
            data: daftarAset,
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

export const deleteDaftarAsetByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteDaftarAsetByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteDaftarAsetByUuidService(uuid, req.identity)
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

export const updateDaftarAsetByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateDaftarAsetByUuidController", null, req.identity)
    try {
        const daftarAsetData = req.body
        const { error, value } = daftarAsetValidation(daftarAsetData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateDaftarAsetByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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