import { BEBAN_LAINNYA_TYPE, BEBAN_OPERASIONAL_TYPE, HARGA_POKOK_PENJUALAN_TYPE, PENDAPATAN_LAIN_LAIN_TYPE, PENDAPATAN_TYPE } from "../constant/labaRugiConstant.js"
import { getSumMinusOfStringValue, getSumOfStringValue } from "./mathUtil.js"
import { parseToRupiahText } from "./numberParsingUtil.js"
import { BEBAN_LAINNYA_MINUS_KODE_AKUN, BEBAN_OPERASIONAL_MINUS_KODE_AKUN, PENDAPATAN_LAIN_LAIN_MINUS_KODE_AKUN, convertByPlusMinusValue, generateCountValue, generateReportValue, generateReportValueByMinusValue } from "./validateKreditDebetTypeUtil.js"

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
                data[i] = convertByPlusMinusValue(data[i])
                resultPendapatan.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
            if (data[i].kode_akun_perkiraan_type == HARGA_POKOK_PENJUALAN_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultHargaPokokPenjualan.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
            if (data[i].kode_akun_perkiraan_type == BEBAN_OPERASIONAL_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultBebanOperasional.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
            if (data[i].kode_akun_perkiraan_type == PENDAPATAN_LAIN_LAIN_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultPendapatanLainLain.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
            if (data[i].kode_akun_perkiraan_type == BEBAN_LAINNYA_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultBebanLainnya.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
        }

        resultPendapatanCount = getSumMinusOfStringValue([getSumOfStringValue(resultPendapatan.map(i => i.debet)), getSumOfStringValue(resultPendapatan.map(i => i.kredit))])
        resultHargaPokokPenjualanCount = getSumMinusOfStringValue([getSumOfStringValue(resultHargaPokokPenjualan.map(i => i.debet)), getSumOfStringValue(resultHargaPokokPenjualan.map(i => i.kredit))])
        resultPendapatanLainLainCount = getSumMinusOfStringValue([getSumOfStringValue(resultPendapatanLainLain.map(i => i.debet)), getSumOfStringValue(resultPendapatanLainLain.map(i => i.kredit))])

        resultBebanOperasionalCount = getSumMinusOfStringValue([getSumOfStringValue(resultBebanOperasional.map(i => i.debet)), getSumOfStringValue(resultBebanOperasional.map(i => i.kredit))])
        resultBebanLainnyaCount = getSumMinusOfStringValue([getSumOfStringValue(resultBebanLainnya.map(i => i.debet)), getSumOfStringValue(resultBebanLainnya.map(i => i.kredit))])

        let lossResult = getSumMinusOfStringValue([getSumOfStringValue([resultHargaPokokPenjualanCount, resultPendapatanCount, resultPendapatanLainLainCount]), getSumOfStringValue([resultBebanOperasionalCount, resultBebanLainnyaCount])])

        // let lossResult = (resultHargaPokokPenjualanCount + resultPendapatanCount + resultPendapatanLainLainCount) - (resultBebanOperasionalCount + resultBebanLainnyaCount)

        res({
            pendapatanLainLain: {
                data: resultPendapatanLainLain,
                count: generateReportValueByMinusValue(resultPendapatanLainLainCount)
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
                // laba_kotor: getSumMinusOfStringValue([resultPendapatanCount, resultHargaPokokPenjualanCount]) < 0 ? "( " + parseToRupiahText(Math.abs(getSumMinusOfStringValue([resultPendapatanCount, resultHargaPokokPenjualanCount]))) + " )" : parseToRupiahText(getSumMinusOfStringValue([resultPendapatanCount, resultHargaPokokPenjualanCount])),
                beban: resultBebanOperasionalCount,
                loss: lossResult > 0 ? null : lossResult,
                gain: lossResult > 0 ? lossResult : null
            }
        })
    })
}