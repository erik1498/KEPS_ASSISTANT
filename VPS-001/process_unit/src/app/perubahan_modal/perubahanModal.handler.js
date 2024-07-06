import { getAllPerubahanModalService } from "./perubahanModal.services.js"
import { LOGGER, logType } from "../../utils/loggerUtil.js"

export const getAllPerubahanModals = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPerubahanModalController", null, req.identity)
    try {
        const perubahanModals = await getAllPerubahanModalService(req.params.tahun, req.identity)
        res.json({
            data: perubahanModals,
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