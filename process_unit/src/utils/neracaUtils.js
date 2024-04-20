import { HARTA_TYPE, MODAL_TYPE, UTANG_TYPE } from "../constant/labaRugiConstant.js"
import { getBulanText, getSumMinusOfStringValue, getSumOfStringValue } from "./mathUtil.js"
import { parseToRupiahText } from "./numberParsingUtil.js"
import { generateCountValue, generateReportValue, generateReportValueByMinusValue, MODAL_MINUS_KODE_AKUN, convertByPlusMinusValue } from "./validateKreditDebetTypeUtil.js"

export const getNeracaReport = (data, laba_rugi_data_berjalan, bulan, tahun, validate) => {
    return new Promise(async (res, rej) => {

        let labaTahunBerjalan = null
        let modalMinusKodeAkun = MODAL_MINUS_KODE_AKUN

        if (laba_rugi_data_berjalan.laba_rugi.gain) {
            labaTahunBerjalan = {
                kode_akun_perkiraan_code: "304",
                kode_akun_perkiraan_name: "Laba/Rugi Periode Berjalan",
                kode_akun_perkiraan_type: MODAL_TYPE,
                debet: 0,
                kredit: laba_rugi_data_berjalan.laba_rugi.gain
                // debet: !validate ? 0 : laba_rugi_data_berjalan.laba_rugi.gain,
                // kredit: !validate ? laba_rugi_data_berjalan.laba_rugi.gain : 0,
            }
            labaTahunBerjalan.uraian = getBulanText(bulan - 1).toUpperCase() + " " + tahun
            data.push(labaTahunBerjalan)
        }
        if (laba_rugi_data_berjalan.laba_rugi.loss != null) {
            labaTahunBerjalan = {
                kode_akun_perkiraan_code: "304",
                kode_akun_perkiraan_name: "Laba/Rugi Periode Berjalan",
                kode_akun_perkiraan_type: MODAL_TYPE,
                debet: Math.abs(laba_rugi_data_berjalan.laba_rugi.loss),
                kredit: 0
                // debet: !validate ? 0 : Math.abs(laba_rugi_data_berjalan.laba_rugi.loss),
                // kredit: !validate ? Math.abs(laba_rugi_data_berjalan.laba_rugi.loss) : 0,
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
            if (data[i].kode_akun_perkiraan_type == HARTA_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultAset.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
                // resultAsetCount += generateCountValue(data[i])
            }
            if (data[i].kode_akun_perkiraan_type == UTANG_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultUtang.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
                // resultUtangCount += Math.abs(generateCountValue(data[i]))
            }
            if (data[i].kode_akun_perkiraan_type == MODAL_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultModal.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
                // resultModalCount += generateCountValue(data[i])
            }
        }

        resultAsetCount = getSumMinusOfStringValue([getSumOfStringValue(resultAset.map(i => i.debet)), getSumOfStringValue(resultAset.map(i => i.kredit))])
        resultUtangCount = getSumMinusOfStringValue([getSumOfStringValue(resultUtang.map(i => i.debet)), getSumOfStringValue(resultUtang.map(i => i.kredit))])
        resultModalCount = getSumMinusOfStringValue([getSumOfStringValue(resultModal.map(i => i.debet)), getSumOfStringValue(resultModal.map(i => i.kredit))], true)



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
                // difference: Math.abs(resultAsetCount) - Math.abs(resultUtangCount + resultModalCount)
                difference: 0
            }
        })
    })
}