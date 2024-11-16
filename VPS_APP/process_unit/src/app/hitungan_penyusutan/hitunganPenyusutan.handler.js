import { deleteHitunganPenyusutanByUuidService, getHitunganPenyusutanByUuidService } from "./hitunganPenyusutan.services.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getHitunganPenyusutanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getHitunganPenyusutanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getHitunganPenyusutanByUuidService(uuid, false, req.identity),
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


export const postCreateHitunganPenyusutan = async (req, res) => {
    LOGGER(logType.INFO, "Start postCreateHitunganPenyusutan", null, req.identity)
    try {
        const { uuid } = req.body

        res.json({
            data: await getHitunganPenyusutanByUuidService(uuid, true, req.identity),
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

export const deleteHitunganPenyusutanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteHitunganPenyusutanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteHitunganPenyusutanByUuidService(uuid, req.identity)
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