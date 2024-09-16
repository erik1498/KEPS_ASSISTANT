import { rincianTransaksiBankValidation } from "./rincianTransaksiBank.validation.js"
import { createRincianTransaksiBankService, deleteRincianTransaksiBankByUuidService, getAllRincianTransaksiBankService, getRincianTransaksiBankByTransaksiBankUUIDService, updateRincianTransaksiBankByUuidService } from "./rincianTransaksiBank.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianTransaksiBanks = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianTransaksiBankController", null, req.identity)
    try {
        const rincianTransaksiBanks = await getAllRincianTransaksiBankService(req.query, req.identity)
        res.json({
            data: rincianTransaksiBanks,
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

export const getRincianTransaksiBankByTransaksiBankUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianTransaksiBankByTransaksiBankUUIDController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianTransaksiBankByTransaksiBankUUIDService(uuid, req.identity),
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

export const postCreateRincianTransaksiBank = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianTransaksiBankController", null, req.identity)
    try {
        const rincianTransaksiBankData = req.body
        const { error, value } = rincianTransaksiBankValidation(rincianTransaksiBankData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianTransaksiBank = await createRincianTransaksiBankService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianTransaksiBank, req.identity)
        res.json({
            data: rincianTransaksiBank,
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

export const deleteRincianTransaksiBankByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianTransaksiBankByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianTransaksiBankByUuidService(uuid, req.identity)
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

export const updateRincianTransaksiBankByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianTransaksiBankByUuidController", null, req.identity)
    try {    
        const rincianTransaksiBankData = req.body
        const { error, value } = rincianTransaksiBankValidation(rincianTransaksiBankData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianTransaksiBankByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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