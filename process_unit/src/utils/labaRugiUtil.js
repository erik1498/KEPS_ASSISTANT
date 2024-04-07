import { parseToRupiahText } from "./numberParsingUtil.js"
import { BEBAN_LAINNYA_MINUS_KODE_AKUN, BEBAN_OPERASIONAL_MINUS_KODE_AKUN, DEBET_POSITIF_TYPE, HARGA_POKOK_PENJUALAN_MINUS_KODE_AKUN, KREDIT_POSITIF_TYPE, PENDAPATAN_LAIN_LAIN_MINUS_KODE_AKUN, PENDAPATAN_MINUS_KODE_AKUN, generateCountValue, generateCountValueByPositifType, generateReportValue, generateReportValueByMinusValue, generateReportValueByPositifType } from "./validateKreditDebetTypeUtil.js"

export const PENDAPATAN_TYPE = "Pendapatan"
export const HARGA_POKOK_PENJUALAN_TYPE = "Harga Pokok Penjualan"
export const BEBAN_OPERASIONAL_TYPE = "Beban Operasional"
export const PENDAPATAN_LAIN_LAIN_TYPE = "Pendapatan Lain - Lain"
export const BEBAN_LAINNYA_TYPE = "Beban Lainnya"

export const getLabaRugiReport = (data) => {
    return new Promise((res, rej) => {
        let resultPendapatan = []
        let resultPendapatanCount = 0.0

        let resultHargaPokokPenjualan = []
        let resultHargaPokokPenjualanCount = 0.0

        let resultBebanOperasional = []
        let resultBebanOperasionalCount = 0.0

        let resultPendapatanLainLain = []
        let resultPendapatanLainLainCount = 0.0

        let resultBebanLainnya = []
        let resultBebanLainnyaCount = 0.0

        for (let i = 0; i < data.length; i++) {
            if (data[i].kode_akun_perkiraan_type == PENDAPATAN_TYPE) {
                resultPendapatan.push({
                    ...data[i],
                    value: generateReportValue(data[i], PENDAPATAN_MINUS_KODE_AKUN)
                })
                resultPendapatanCount += generateCountValue(data[i], PENDAPATAN_MINUS_KODE_AKUN)
            }
            if (data[i].kode_akun_perkiraan_type == HARGA_POKOK_PENJUALAN_TYPE) {
                resultHargaPokokPenjualan.push({
                    ...data[i],
                    value: generateReportValue(data[i], HARGA_POKOK_PENJUALAN_MINUS_KODE_AKUN)
                })
                resultHargaPokokPenjualanCount += generateCountValue(data[i], HARGA_POKOK_PENJUALAN_MINUS_KODE_AKUN)
            }
            if (data[i].kode_akun_perkiraan_type == BEBAN_OPERASIONAL_TYPE) {
                resultBebanOperasional.push({
                    ...data[i],
                    value: generateReportValue(data[i], BEBAN_OPERASIONAL_MINUS_KODE_AKUN)
                })
                resultBebanOperasionalCount += generateCountValue(data[i], BEBAN_OPERASIONAL_MINUS_KODE_AKUN)
            }
            if (data[i].kode_akun_perkiraan_type == PENDAPATAN_LAIN_LAIN_TYPE) {
                resultPendapatanLainLain.push({
                    ...data[i],
                    value: generateReportValue(data[i], PENDAPATAN_LAIN_LAIN_MINUS_KODE_AKUN)
                })
                resultPendapatanLainLainCount += generateCountValue(data[i], PENDAPATAN_LAIN_LAIN_MINUS_KODE_AKUN)
            }
            if (data[i].kode_akun_perkiraan_type == BEBAN_LAINNYA_TYPE) {
                resultBebanLainnya.push({
                    ...data[i],
                    value: generateReportValue(data[i], BEBAN_LAINNYA_MINUS_KODE_AKUN)
                })
                resultBebanLainnyaCount += generateCountValue(data[i], BEBAN_LAINNYA_MINUS_KODE_AKUN)
            }
        }
        // let lossResult = resultPendapatanCount + resultHargaPokokPenjualanCount + resultBebanOperasionalCount + resultBebanLainnyaCount + resultPendapatanLainLainCount
        let lossResult = Math.abs(resultPendapatanCount) - Math.abs(resultHargaPokokPenjualanCount) - resultBebanOperasionalCount - resultBebanLainnyaCount + Math.abs(resultPendapatanLainLainCount)
        res({
            pendapatanLainLain: {
                data: resultPendapatanLainLain,
                count: resultPendapatanLainLainCount > 0 ? parseToRupiahText(Math.abs(resultPendapatanLainLainCount)) : "( " + parseToRupiahText(Math.abs(resultPendapatanLainLainCount)) + " )"
            },
            pendapatan: {
                data: resultPendapatan,
                count: generateReportValueByMinusValue(resultPendapatanCount)
            },
            harga_pokok_penjualan: {
                data: resultHargaPokokPenjualan,
                count: generateReportValueByMinusValue(resultHargaPokokPenjualanCount)
            },
            beban_operasional: {
                data: resultBebanOperasional,
                count: generateReportValueByMinusValue(resultBebanOperasionalCount)
            },
            beban_lainnya: {
                data: resultBebanLainnya,
                count: generateReportValueByMinusValue(resultBebanLainnyaCount)
            },
            laba_rugi: {
                laba_kotor: resultPendapatanCount - resultHargaPokokPenjualanCount < 0 ? "( " + parseToRupiahText(Math.abs(resultPendapatanCount - resultHargaPokokPenjualanCount)) + " )" : parseToRupiahText(Math.abs(resultPendapatanCount - resultHargaPokokPenjualanCount)),
                beban: resultBebanOperasionalCount,
                loss: lossResult > 0 ? null : lossResult,
                gain: lossResult > 0 ? lossResult : null
            }
        })
    })
}