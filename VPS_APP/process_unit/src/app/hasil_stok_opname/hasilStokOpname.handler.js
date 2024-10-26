import { hasilStokOpnameValidation } from "./hasilStokOpname.validation.js"
import { createHasilStokOpnameService, deleteHasilStokOpnameByUuidService, getAllHasilStokOpnameService, getHasilStokOpnameByUuidService, updateHasilStokOpnameByUuidService } from "./hasilStokOpname.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllHasilStokOpnames = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllHasilStokOpnameController", null, req.identity)
    try {
        const hasilStokOpnames = await getAllHasilStokOpnameService(req.query, req.identity)
        res.json({
            data: hasilStokOpnames,
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

export const getHasilStokOpnameByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getHasilStokOpnameByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getHasilStokOpnameByUuidService(uuid, req.identity),
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

export const postCreateHasilStokOpname = async (req, res) => {
    LOGGER(logType.INFO, "Start createHasilStokOpnameController", null, req.identity)
    try {
        const hasilStokOpnameData = req.body
        const { error, value } = hasilStokOpnameValidation(hasilStokOpnameData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const hasilStokOpname = await createHasilStokOpnameService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, hasilStokOpname, req.identity)
        res.json({
            data: hasilStokOpname,
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

export const deleteHasilStokOpnameByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteHasilStokOpnameByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteHasilStokOpnameByUuidService(uuid, req.identity)
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

export const updateHasilStokOpnameByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateHasilStokOpnameByUuidController", null, req.identity)
    try {    
        const hasilStokOpnameData = req.body
        const { error, value } = hasilStokOpnameValidation(hasilStokOpnameData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateHasilStokOpnameByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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