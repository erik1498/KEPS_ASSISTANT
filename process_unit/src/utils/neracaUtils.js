import { getBulanText } from "./mathUtil.js"
import { parseToRupiahText } from "./numberParsingUtil.js"
import { ASSET_MINUS_KODE_AKUN, UTANG_MINUS_KODE_AKUN, generateCountValue, generateReportValue, generateReportValueByMinusValue, MODAL_MINUS_KODE_AKUN } from "./validateKreditDebetTypeUtil.js"


export const MODAL_TYPE = "Modal"
export const HARTA_TYPE = "Harta"
export const UTANG_TYPE = "Utang"

export const getNeracaReport = (data, laba_rugi_data_berjalan, bulan, tahun, validate) => {
    return new Promise(async (res, rej) => {

        let labaTahunBerjalan = null
        let modalMinusKodeAkun = MODAL_MINUS_KODE_AKUN

        if (laba_rugi_data_berjalan.laba_rugi.gain) {
            labaTahunBerjalan = {
                kode_akun_perkiraan_code: "304",
                kode_akun_perkiraan_name: "Laba/Rugi Periode Berjalan",
                kode_akun_perkiraan_type: MODAL_TYPE,
                debet: !validate ? 0 : laba_rugi_data_berjalan.laba_rugi.gain,
                kredit: !validate ? laba_rugi_data_berjalan.laba_rugi.gain : 0,
            }
            labaTahunBerjalan.uraian = getBulanText(bulan - 1).toUpperCase() + " " + tahun
            data.push(labaTahunBerjalan)
        }
        if (laba_rugi_data_berjalan.laba_rugi.loss) {
            labaTahunBerjalan = {
                kode_akun_perkiraan_code: "304",
                kode_akun_perkiraan_name: "Laba/Rugi Periode Berjalan",
                kode_akun_perkiraan_type: MODAL_TYPE,
                debet: !validate ? 0 : Math.abs(laba_rugi_data_berjalan.laba_rugi.loss),
                kredit: !validate ? Math.abs(laba_rugi_data_berjalan.laba_rugi.loss) : 0,
            }
            modalMinusKodeAkun.push("304")
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
                resultAset.push({
                    ...data[i],
                    value: generateReportValue(data[i], ASSET_MINUS_KODE_AKUN)
                })
                resultAsetCount += generateCountValue(data[i], ASSET_MINUS_KODE_AKUN)
            }
            if (data[i].kode_akun_perkiraan_type == UTANG_TYPE) {
                resultUtang.push({
                    ...data[i],
                    value: generateReportValue(data[i], UTANG_MINUS_KODE_AKUN)
                })
                if (UTANG_MINUS_KODE_AKUN.indexOf(data[i].kode_akun_perkiraan_code) > -1) {
                    resultUtangCount += Math.abs(generateCountValue(data[i], UTANG_MINUS_KODE_AKUN))
                }else{
                    resultUtangCount -= Math.abs(generateCountValue(data[i], UTANG_MINUS_KODE_AKUN))
                }
            }
            if (data[i].kode_akun_perkiraan_type == MODAL_TYPE) {
                if (data[i].kode_akun_perkiraan_code == "303") {
                    let bulanLalu = bulan - 2 < 0 ? 12 : bulan - 2
                    let kredit = data[i].kredit

                    data[i].kredit = data[i].debet
                    data[i].debet = kredit

                    if (data[i].kredit > 0) {
                        modalMinusKodeAkun.push("303")
                    }
                    
                    resultModal.push({
                        ...data[i],
                        uraian: getBulanText(bulanLalu).toUpperCase() + " " + (bulan - 2 < 0 ? tahun - 1 : tahun),
                        value: generateReportValue(data[i], modalMinusKodeAkun)
                    })
                }else{
                    resultModal.push({
                        ...data[i],
                        value: generateReportValue(data[i], modalMinusKodeAkun)
                    })
                }
                if (modalMinusKodeAkun.indexOf(data[i].kode_akun_perkiraan_code) > -1) {
                    resultModalCount += Math.abs(generateCountValue(data[i], modalMinusKodeAkun))
                }else{
                    resultModalCount -= Math.abs(generateCountValue(data[i], modalMinusKodeAkun))
                }
            }
        }
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
                aktiva: resultAsetCount > 0 ? parseToRupiahText(resultAsetCount) : "( " + parseToRupiahText(Math.abs(resultAsetCount)) + " )",
                pasiva: resultUtangCount + resultModalCount > 0 ? parseToRupiahText(resultUtangCount + resultModalCount) : "( " + parseToRupiahText(Math.abs(resultUtangCount + resultModalCount)) + " )",
                difference: Math.abs(resultAsetCount) - Math.abs(resultUtangCount + resultModalCount)
            }
        })
    })
}