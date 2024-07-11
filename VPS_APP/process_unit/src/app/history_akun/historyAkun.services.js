import { selectedJurnalUmumByKodeAkunCode } from "../../utils/historyAkunUtil.js"
import { LOGGER, logType } from "../../utils/loggerUtil.js"
import { getJurnalUmumByBulanSebelumService } from "../jurnal_umum/jurnalUmum.services.js"
import { getKodeAkunPerkiraanByUuidService } from "../kode_akun_perkiraan/kodeAkunPerkiraan.services.js"
import { getHistoryAkunByUuidAndBulanRepo } from "./historyAkun.repository.js"

export const getAllHistoryAkunByUUIDAndBulanService = async (uuid, bulan, tahun, search, req_identity) => {
    bulan = bulan < 10 ? "0" + bulan : bulan
    search = search ? search.trim() : ""
    LOGGER(logType.INFO, `Start getAllHistoryAkunByUUIDService [${uuid} ${bulan} ${tahun} ${search}]`, null, req_identity)
    const historyAkunsBulanSebelumnya = await getJurnalUmumByBulanSebelumService(bulan, tahun, req_identity)
    const kodeAkunPerkiraan = await getKodeAkunPerkiraanByUuidService(uuid, req_identity);
    const historyAkunTerpilih = await selectedJurnalUmumByKodeAkunCode(historyAkunsBulanSebelumnya, kodeAkunPerkiraan?.code)
    const historyAkuns = historyAkunTerpilih.concat(...await getHistoryAkunByUuidAndBulanRepo(uuid, bulan, tahun, search, req_identity))
    return historyAkuns
}