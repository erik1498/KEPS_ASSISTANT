import { BEBAN_LAIN_LAIN_TYPE, BEBAN_OPERASIONAL_DAN_ADMINISTRASI_TYPE, HARGA_POKOK_PENJUALAN_TYPE, PENDAPATAN_LAIN_LAIN_TYPE, PENDAPATAN_TYPE } from "../constant/labaRugiConstant.js"
import { getSumMinusOfStringValue, getSumOfStringValue } from "./mathUtil.js"
import { parseToRupiahText } from "./numberParsingUtil.js"
import { convertByPlusMinusValue, generateReportValue, generateReportValueByMinusValue, minusTypeCode } from "./validateKreditDebetTypeUtil.js"

export const getLabaRugiReport = (data) => {
    return new Promise((res, rej) => {
        let resultPendapatan = []
        let resultPendapatanCount = 0.0

        let resultHargaPokokPenjualan = []
        let resultHargaPokokPenjualanCount = 0.0

        let resultBebanOperasionalDanAdministrasi = []
        let resultBebanOperasionalDanAdministrasiCount = 0.0

        let resultPendapatanLainLain = []
        let resultPendapatanLainLainCount = 0.0

        let resultBebanLainLain = []
        let resultBebanLainLainCount = 0.0

        for (let i = 0; i < data.length; i++) {
            data[i] = minusTypeCode(data[i])
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
            if (data[i].kode_akun_perkiraan_type == BEBAN_OPERASIONAL_DAN_ADMINISTRASI_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultBebanOperasionalDanAdministrasi.push({
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
            if (data[i].kode_akun_perkiraan_type == BEBAN_LAIN_LAIN_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultBebanLainLain.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
        }

        resultPendapatanCount = getSumMinusOfStringValue([getSumOfStringValue(resultPendapatan.map(i => i.debet)), getSumOfStringValue(resultPendapatan.map(i => i.kredit))])
        resultHargaPokokPenjualanCount = getSumMinusOfStringValue([getSumOfStringValue(resultHargaPokokPenjualan.map(i => i.debet)), getSumOfStringValue(resultHargaPokokPenjualan.map(i => i.kredit))])
        resultPendapatanLainLainCount = getSumMinusOfStringValue([getSumOfStringValue(resultPendapatanLainLain.map(i => i.debet)), getSumOfStringValue(resultPendapatanLainLain.map(i => i.kredit))])

        resultBebanOperasionalDanAdministrasiCount = getSumMinusOfStringValue([getSumOfStringValue(resultBebanOperasionalDanAdministrasi.map(i => i.debet)), getSumOfStringValue(resultBebanOperasionalDanAdministrasi.map(i => i.kredit))])
        resultBebanLainLainCount = getSumMinusOfStringValue([getSumOfStringValue(resultBebanLainLain.map(i => i.debet)), getSumOfStringValue(resultBebanLainLain.map(i => i.kredit))])

        let lossResult = getSumOfStringValue([
            getSumMinusOfStringValue([
                getSumMinusOfStringValue([resultPendapatanCount, resultHargaPokokPenjualanCount]),
                getSumOfStringValue([resultBebanOperasionalDanAdministrasiCount, resultBebanLainLainCount])
            ]),
            resultPendapatanLainLainCount
        ])

        res({
            pendapatan_lain_lain: {
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
            beban_operasional_dan_administrasi: {
                data: resultBebanOperasionalDanAdministrasi,
                count: generateReportValueByMinusValue(resultBebanOperasionalDanAdministrasiCount)
            },
            beban_lain_lain: {
                data: resultBebanLainLain,
                count: generateReportValueByMinusValue(resultBebanLainLainCount)
            },
            laba_rugi: {
                laba_kotor: getSumMinusOfStringValue([resultPendapatanCount, resultHargaPokokPenjualanCount]) < 0 ? "( " + parseToRupiahText(Math.abs(getSumMinusOfStringValue([resultPendapatanCount, resultHargaPokokPenjualanCount]))) + " )" : parseToRupiahText(getSumMinusOfStringValue([resultPendapatanCount, resultHargaPokokPenjualanCount])),
                beban: getSumMinusOfStringValue([resultBebanOperasionalDanAdministrasiCount, resultBebanLainLainCount]),
                loss: lossResult > 0 ? null : lossResult,
                gain: lossResult > 0 ? lossResult : null
            }
        })
    })
}