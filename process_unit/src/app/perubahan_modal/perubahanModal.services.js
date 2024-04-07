import { LOGGER, logType } from "../../utils/loggerUtil.js"
import { parseToRupiahText } from "../../utils/numberParsingUtil.js"
import { getPerubahanModalByTahunRepo } from "./perubahanModal.repository.js"

export const getAllPerubahanModalService = async (tahun, req_identity) => {
    LOGGER(logType.INFO, `Start getAllPerubahanModalService [${tahun}]`, null, req_identity)
    const perubahanModal = await getPerubahanModalByTahunRepo(tahun)
    let returnData = []
    perubahanModal.map(item => {
        const modalData = JSON.parse(item.json).modal.data.filter(i => i.kode_akun_perkiraan_code == "304")[0]
        let value = modalData?.debet - modalData?.kredit < 0 ? `( ${parseToRupiahText(Math.abs(modalData?.debet - modalData?.kredit))} )` : parseToRupiahText(modalData?.debet - modalData?.kredit)
        value = value == "NaN" ? 0 : value
        returnData[parseInt(item.bulan) - 1] = value
    })
    return returnData
}