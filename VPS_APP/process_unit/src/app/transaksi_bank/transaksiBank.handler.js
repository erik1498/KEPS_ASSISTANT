import { transaksiBankValidation } from "./transaksiBank.validation.js"
import { createTransaksiBankService, deleteTransaksiBankByUuidService, getAllTransaksiBankService, getTransaksiBankByUuidService, updateTransaksiBankByUuidService } from "./transaksiBank.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllTransaksiBanks = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllTransaksiBankController", null, req.identity)
    try {
        const transaksiBanks = await getAllTransaksiBankService(req.params.bulan, req.params.tahun, req.query, req.identity)
        res.json({
            data: transaksiBanks,
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

export const getTransaksiBankByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getTransaksiBankByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getTransaksiBankByUuidService(uuid, req.identity),
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

export const postCreateTransaksiBank = async (req, res) => {
    LOGGER(logType.INFO, "Start createTransaksiBankController", null, req.identity)
    try {
        const transaksiBankData = req.body
        const { error, value } = transaksiBankValidation(transaksiBankData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const transaksiBank = await createTransaksiBankService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, transaksiBank, req.identity)
        res.json({
            data: transaksiBank,
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

export const deleteTransaksiBankByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteTransaksiBankByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteTransaksiBankByUuidService(uuid, req.identity)
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

export const updateTransaksiBankByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateTransaksiBankByUuidController", null, req.identity)
    try {    
        const transaksiBankData = req.body
        const { error, value } = transaksiBankValidation(transaksiBankData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateTransaksiBankByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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