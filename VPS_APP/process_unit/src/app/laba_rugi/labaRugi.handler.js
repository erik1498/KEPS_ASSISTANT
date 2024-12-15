import { BEBAN_LAIN_LAIN_TYPE, BEBAN_OPERASIONAL_DAN_ADMINISTRASI_TYPE, BEBAN_POKOK_PENJUALAN_TYPE, HARGA_POKOK_PENJUALAN_TYPE, PENDAPATAN_LAIN_LAIN_TYPE, PENDAPATAN_TYPE } from "../../constant/labaRugiConstant.js"
import { getLabaRugiReport } from "../../utils/labaRugiUtil.js"
import { LOGGER, logType } from "../../utils/loggerUtil.js"
import { getBulanText } from "../../utils/mathUtil.js"
import { getNeracaSaldoReport } from "../../utils/neracaSaldoUtil.js"
import { parseToRupiahText } from "../../utils/numberParsingUtil.js"
import { getAllNeracaSaldoByBulanService } from "../neraca_saldo/neracaSaldo.services.js"

export const getAllLabaRugiByBulanController = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllLabaRugiByBulanController", null, req.identity)
    try {
        const { bulan, tahun } = req.params
        const data = await getAllNeracaSaldoByBulanService(bulan, tahun, [
            PENDAPATAN_TYPE,
            HARGA_POKOK_PENJUALAN_TYPE,
            BEBAN_POKOK_PENJUALAN_TYPE,
            BEBAN_OPERASIONAL_DAN_ADMINISTRASI_TYPE,
            PENDAPATAN_LAIN_LAIN_TYPE,
            BEBAN_LAIN_LAIN_TYPE,
        ], req.identity)
        const neracaSaldos = await getNeracaSaldoReport(data)
        const labaRugis = await getLabaRugiReport(neracaSaldos)

        const { print } = req.query

        if (print) {
            labaRugis.bulan = getBulanText(req.params.bulan - 1)
            labaRugis.laba_rugi.loss = parseToRupiahText(labaRugis.laba_rugi.loss)
            labaRugis.laba_rugi.gain = parseToRupiahText(labaRugis.laba_rugi.gain)
        }

        res.json({
            data: labaRugis,
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