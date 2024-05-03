import { LOGGER, logType } from "../../utils/loggerUtil.js"
import { getSumOfStringValue } from "../../utils/mathUtil.js"
import { convertJurnalUmumToNeracaSaldo } from "../../utils/neracaSaldoUtil.js"
import { getJurnalUmumByBulanSebelumService } from "../jurnal_umum/jurnalUmum.services.js"
import { getNeracaSaldoByBulanRepo } from "./neracaSaldo.repository.js"

export const getAllNeracaSaldoByBulanService = async (bulan, tahun, whereIN, req_identity) => {
    bulan = parseFloat(bulan) < 10 ? "0" + bulan : bulan
    tahun = parseFloat(tahun) < 10 ? "0" + tahun : tahun
    LOGGER(logType.INFO, `Start getAllNeracaSaldoByBulanService [${bulan} ${tahun}]`, whereIN, req_identity)
    let jurnalUmumBulanSebelum = await convertJurnalUmumToNeracaSaldo(await getJurnalUmumByBulanSebelumService(bulan, tahun, req_identity))
    let historyAkuns = await getNeracaSaldoByBulanRepo(bulan, tahun, whereIN)

    jurnalUmumBulanSebelum.map((item) => {
        const getHistory = historyAkuns.filter((history) => history.kode_akun_perkiraan_code == item.kode_akun_perkiraan_code)
        const index = historyAkuns.indexOf(getHistory.length > 0 ? getHistory[0] : null)
        if (index >= 0) {
            historyAkuns[index].sum_result = getSumOfStringValue([historyAkuns[index].sum_result, item.sum_result])
        }else{
            item.sum_result = item.sum_result.toFixed(2);
            historyAkuns.push(item)
        }
    })

    return historyAkuns
}