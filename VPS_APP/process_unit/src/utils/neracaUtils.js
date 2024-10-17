import { HARTA_TYPE, MODAL_TYPE, UTANG_TYPE } from "../constant/labaRugiConstant.js"
import { getBulanText, getSumMinusOfStringValue, getSumOfStringValue } from "./mathUtil.js"
import { generateReportValue, generateReportValueByMinusValue, convertByPlusMinusValue, minusTypeCode } from "./validateKreditDebetTypeUtil.js"

export const getNeracaReport = (data, laba_rugi_data_berjalan, bulan, tahun, validate) => {
    return new Promise(async (res, rej) => {

        let labaTahunBerjalan = null

        if (laba_rugi_data_berjalan.laba_rugi.gain) {
            labaTahunBerjalan = {
                kode_akun_perkiraan_code: "399",
                kode_akun_perkiraan_name: "Laba/Rugi Periode Berjalan",
                kode_akun_perkiraan_type: MODAL_TYPE,
                debet: 0,
                kredit: laba_rugi_data_berjalan.laba_rugi.gain
            }
            labaTahunBerjalan.uraian = getBulanText(bulan - 1).toUpperCase() + " " + tahun
            data.push(labaTahunBerjalan)
        }
        if (laba_rugi_data_berjalan.laba_rugi.loss != null) {
            labaTahunBerjalan = {
                kode_akun_perkiraan_code: "399",
                kode_akun_perkiraan_name: "Laba/Rugi Periode Berjalan",
                kode_akun_perkiraan_type: MODAL_TYPE,
                debet: Math.abs(laba_rugi_data_berjalan.laba_rugi.loss),
                kredit: 0
            }
            data.push(labaTahunBerjalan)
        }

        let resultAset = []
        let resultAsetCount = 0.0

        let resultUtang = []
        let resultUtangCount = 0.0

        let resultModal = []
        let resultModalCount = 0.0

        for (let i = 0; i < data.length; i++) {
            data[i] = minusTypeCode(data[i])
            if (data[i].kode_akun_perkiraan_type == HARTA_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultAset.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
            if (data[i].kode_akun_perkiraan_type == UTANG_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultUtang.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
            if (data[i].kode_akun_perkiraan_type == MODAL_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultModal.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
        }

        resultAsetCount = getSumMinusOfStringValue([getSumOfStringValue(resultAset.map(i => i.debet)), getSumOfStringValue(resultAset.map(i => i.kredit))])
        resultUtangCount = getSumMinusOfStringValue([getSumOfStringValue(resultUtang.map(i => i.debet)), getSumOfStringValue(resultUtang.map(i => i.kredit))])
        resultModalCount = getSumMinusOfStringValue([getSumOfStringValue(resultModal.map(i => i.debet)), getSumOfStringValue(resultModal.map(i => i.kredit))])



        res({
            harta: {
                data: resultAset,
                count: generateReportValueByMinusValue(resultAsetCount)
            },
            utang: {
                data: resultUtang,
                count: generateReportValueByMinusValue(resultUtangCount)
            },
            modal: {
                data: resultModal,
                count: generateReportValueByMinusValue(resultModalCount)
            },
            neraca: {
                aktiva: resultAsetCount,
                pasiva: getSumOfStringValue([resultUtangCount, resultModalCount]),
                difference: Math.abs(resultAsetCount) - Math.abs(getSumOfStringValue([resultUtangCount, resultModalCount]))
            }
        })
    })
}