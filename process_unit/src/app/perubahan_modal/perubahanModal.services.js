import { MODAL_MINUS_KODE_AKUN } from "../../constant/akuntansiConstant.js"
import { LOGGER, logType } from "../../utils/loggerUtil.js"
import { getBulanText, getSumMinusOfStringValue, getSumOfStringValue } from "../../utils/mathUtil.js"
import { parseToRupiahText } from "../../utils/numberParsingUtil.js"
import { getPerubahanModalByTahunRepo } from "./perubahanModal.repository.js"

export const getAllPerubahanModalService = async (tahun, req_identity) => {
    LOGGER(logType.INFO, `Start getAllPerubahanModalService [${tahun}]`, null, req_identity)
    const perubahanModal = await getPerubahanModalByTahunRepo(tahun, req_identity)
    let returnData = []
    perubahanModal.map((item, idx) => {
        const modalData = JSON.parse(item.json).modal.data
        const modalDataPlus = modalData.filter((i) => MODAL_MINUS_KODE_AKUN.indexOf(i.kode_akun_perkiraan_code) < 0)
        const modalDataMinus = modalData.filter((i) => MODAL_MINUS_KODE_AKUN.indexOf(i.kode_akun_perkiraan_code) >= 0)
        returnData[parseInt(item.bulan) - 1] = {
            data: {
                plus: modalDataPlus,
                minus: modalDataMinus
            },
            count: {
                plus: parseToRupiahText(Math.abs(getSumMinusOfStringValue([getSumOfStringValue(modalDataPlus.map(i => i.debet)), getSumOfStringValue(modalDataPlus.map(i => i.kredit))]))),
                minus: parseToRupiahText(Math.abs(getSumMinusOfStringValue([getSumOfStringValue(modalDataMinus.map(i => i.debet)), getSumOfStringValue(modalDataMinus.map(i => i.kredit))])))
            },
            all_count: parseToRupiahText(Math.abs(getSumMinusOfStringValue([getSumOfStringValue(modalData.map(i => i.debet)), getSumOfStringValue(modalData.map(i => i.kredit))]))),
            bulan: getBulanText(idx)
        }
    })
    return returnData
}