import { getAllHistoryAkunByUUIDAndBulanService } from "./historyAkun.services.js"
import { LOGGER, logType } from "../../utils/loggerUtil.js"
import { getHistoryAkunReport } from "../../utils/historyAkunUtil.js"

export const getAllHistoryAkunByUUIDAndBulanController = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllHistoryAkunByUUIDAndBulanController", null, req.identity)
    try {
        const { uuid, bulan, tahun } = req.params
        let { search } = req.query
        search = search ? search.trim() : ""
        const data = await getAllHistoryAkunByUUIDAndBulanService(uuid, bulan, tahun, search, req.identity)
        const historyAkuns = await getHistoryAkunReport(data)
        res.json({
            data: historyAkuns,
            message: "Get Data Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}