import { getAllNeracaSaldoByBulanService } from "./neracaSaldo.services.js"
import { LOGGER, logType } from "../../utils/loggerUtil.js"
import { getBulanText } from "../../utils/mathUtil.js"
import { getNeracaSaldoReport, renderDataNeracaSaldo } from "../../utils/neracaSaldoUtil.js"

export const getAllNeracaSaldoByBulanController = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllNeracaSaldoByBulanController", null, req.identity)
    try {
        const { bulan, tahun } = req.params
        const data = await getAllNeracaSaldoByBulanService(bulan, tahun, null, req.identity)

        const { print } = req.query

        if (print) {
            const neracaSaldos = await renderDataNeracaSaldo(await getNeracaSaldoReport(data))
            neracaSaldos.bulan = getBulanText(bulan - 1)
        }

        const neracaSaldos = await getNeracaSaldoReport(data)

        res.json({
            data: neracaSaldos,
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