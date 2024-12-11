import { parseToRupiahText } from "./numberParsingUtil.js"
import { ASSET_MINUS_KODE_AKUN, DEBET_POSITIF_TYPE, KREDIT_POSITIF_TYPE, EKUITAS_MINUS_KODE_AKUN, UTANG_MINUS_KODE_AKUN, generateCountValue, generateCountValueByPositifType, generateReportValue, generateReportValueByMinusValue, generateReportValueByPositifType } from "./validateKreditDebetTypeUtil.js"


export const MODAL_TYPE = "Modal"

export const getPerubahanModalReport = (data, laba_rugi_data_berjalan) => {
    return new Promise(async (res, rej) => {
        let resultModal = []
        let resultModalCount = 0.0

        for (let i = 0; i < data.length; i++) {
            if (data[i].kode_akun_perkiraan_type == MODAL_TYPE) {
                let kredit = data[i].kredit > 0 ? `( ${parseToRupiahText(Math.abs(data[i].kredit))} )` : data[i].kredit
                resultModal.push({
                    ...data[i],
                    value: generateReportValue(data[i], EKUITAS_MINUS_KODE_AKUN)
                })
                resultModalCount += generateCountValue(data[i], EKUITAS_MINUS_KODE_AKUN)
            }
        }
        let labaTahunBerjalan = null
        if (laba_rugi_data_berjalan.laba_rugi.gain) {
            labaTahunBerjalan = {
                kode_akun_perkiraan_code: "304",
                kode_akun_perkiraan_name: "Laba/Rugi Periode Berjalan",
                kode_akun_perkiraan_type: MODAL_TYPE,
                debet: laba_rugi_data_berjalan.laba_rugi.gain,
                kredit: 0,
                value: 0
            }
            labaTahunBerjalan.value = generateReportValue(labaTahunBerjalan, EKUITAS_MINUS_KODE_AKUN)
            resultModal.push(labaTahunBerjalan)
            resultModalCount += generateCountValue(labaTahunBerjalan, EKUITAS_MINUS_KODE_AKUN)
        }
        if (laba_rugi_data_berjalan.laba_rugi.loss) {
            labaTahunBerjalan = {
                kode_akun_perkiraan_code: "304",
                kode_akun_perkiraan_name: "Laba/Rugi Periode Berjalan",
                kode_akun_perkiraan_type: MODAL_TYPE,
                debet: 0,
                kredit: Math.abs(laba_rugi_data_berjalan.laba_rugi.loss),
                value: 0
            }
            labaTahunBerjalan.value = generateReportValue(labaTahunBerjalan, EKUITAS_MINUS_KODE_AKUN)
            resultModal.push(labaTahunBerjalan)
            resultModalCount += generateCountValue(labaTahunBerjalan, EKUITAS_MINUS_KODE_AKUN)
        }
        res({
            modal: {
                data: resultModal,
                count: generateReportValueByMinusValue(resultModalCount)
            }
        })
    })
}