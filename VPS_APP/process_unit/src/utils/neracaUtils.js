import { HARGA_POKOK_PENJUALAN_TYPE, ASET_TETAP_TYPE, EKUITAS_TYPE, KEWAJIBAN_LANCAR_TYPE, ASET_LANCAR_TYPE, ASET_LAIN_LAIN_TYPE } from "../constant/labaRugiConstant.js"
import { getBulanText, getSumMinusOfStringValue, getSumOfStringValue } from "./mathUtil.js"
import { generateReportValue, generateReportValueByMinusValue, convertByPlusMinusValue, minusTypeCode } from "./validateKreditDebetTypeUtil.js"

export const getNeracaReport = (data, laba_rugi_data_berjalan, bulan, tahun, validate) => {
    return new Promise(async (res, rej) => {

        let labaTahunBerjalan = null

        if (laba_rugi_data_berjalan.laba_rugi.gain) {
            labaTahunBerjalan = {
                kode_akun_perkiraan_code: "399",
                kode_akun_perkiraan_name: "Laba/Rugi Periode Berjalan",
                kode_akun_perkiraan_type: EKUITAS_TYPE,
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
                kode_akun_perkiraan_type: EKUITAS_TYPE,
                debet: Math.abs(laba_rugi_data_berjalan.laba_rugi.loss),
                kredit: 0
            }
            labaTahunBerjalan.uraian = getBulanText(bulan - 1).toUpperCase() + " " + tahun
            data.push(labaTahunBerjalan)
        }

        let indexPersediaanBarangDagang = 0

        if (validate) {
            const getPersediaanBarangDagang = data.filter(x => x.kode_akun_perkiraan_code == "108")


            if (getPersediaanBarangDagang.length > 0) {
                indexPersediaanBarangDagang = data.indexOf(getPersediaanBarangDagang[getPersediaanBarangDagang.length - 1])

                if (getPersediaanBarangDagang[getPersediaanBarangDagang.length - 1].debet > 0) {
                    data.push({
                        kode_akun_perkiraan_name: 'Persediaan Barang Dagang',
                        kode_akun_perkiraan_code: '108',
                        kode_akun_perkiraan_type: 'Harta',
                        debet: 0,
                        kredit: getPersediaanBarangDagang[getPersediaanBarangDagang.length - 1].debet
                    })
                    data.push({
                        kode_akun_perkiraan_name: 'Persediaan Barang Dagang Awal',
                        kode_akun_perkiraan_code: '701',
                        kode_akun_perkiraan_type: 'Harga Pokok Penjualan',
                        debet: getPersediaanBarangDagang[getPersediaanBarangDagang.length - 1].debet,
                        kredit: 0
                    })
                }
            }
        }


        let resultAsetTetap = []
        let resultAsetTetapCount = 0.0

        let resultAsetLancar = []
        let resultAsetLancarCount = 0.0

        let resultAsetLainLain = []
        let resultAsetLainLainCount = 0.0

        let resultKewajibanLancar = []
        let resultKewajibanLancarCount = 0.0

        let resultEkuitas = []
        let resultEkuitasCount = 0.0

        let resultHargaPokokPenjualan = []
        let resultHargaPokokPenjualanCount = 0.0

        for (let i = 0; i < data.length; i++) {
            data[i] = minusTypeCode(data[i])
            if (data[i].kode_akun_perkiraan_type == ASET_TETAP_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultAsetTetap.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
            if (data[i].kode_akun_perkiraan_type == ASET_LANCAR_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultAsetLancar.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
            if (data[i].kode_akun_perkiraan_type == ASET_LAIN_LAIN_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultAsetLainLain.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
            if (data[i].kode_akun_perkiraan_type == KEWAJIBAN_LANCAR_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultKewajibanLancar.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
            if (data[i].kode_akun_perkiraan_type == EKUITAS_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultEkuitas.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
            if (data[i].kode_akun_perkiraan_type == HARGA_POKOK_PENJUALAN_TYPE && i == data.length - 1) {
                data[i] = convertByPlusMinusValue(data[i])
                resultHargaPokokPenjualan.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
        }

        resultAsetTetapCount = getSumMinusOfStringValue([getSumOfStringValue(resultAsetTetap.map(i => i.debet)), getSumOfStringValue(resultAsetTetap.map(i => i.kredit))])
        resultAsetLancarCount = getSumMinusOfStringValue([getSumOfStringValue(resultAsetLancar.map(i => i.debet)), getSumOfStringValue(resultAsetLancar.map(i => i.kredit))])
        resultAsetLainLainCount = getSumMinusOfStringValue([getSumOfStringValue(resultAsetLainLain.map(i => i.debet)), getSumOfStringValue(resultAsetLainLain.map(i => i.kredit))])
        resultKewajibanLancarCount = getSumMinusOfStringValue([getSumOfStringValue(resultKewajibanLancar.map(i => i.debet)), getSumOfStringValue(resultKewajibanLancar.map(i => i.kredit))])
        resultEkuitasCount = getSumMinusOfStringValue([getSumOfStringValue(resultEkuitas.map(i => i.debet)), getSumOfStringValue(resultEkuitas.map(i => i.kredit))])
        resultHargaPokokPenjualanCount = getSumMinusOfStringValue([getSumOfStringValue(resultHargaPokokPenjualan.map(i => i.debet)), getSumOfStringValue(resultHargaPokokPenjualan.map(i => i.kredit))])



        res({
            harta: {
                data: resultAsetTetap,
                count: generateReportValueByMinusValue(resultAsetTetapCount)
            },
            utang: {
                data: resultKewajibanLancar,
                count: generateReportValueByMinusValue(resultKewajibanLancarCount)
            },
            modal: {
                data: resultEkuitas,
                count: generateReportValueByMinusValue(resultEkuitasCount)
            },
            harga_pokok_penjualan: {
                data: resultHargaPokokPenjualan,
                count: generateReportValueByMinusValue(resultHargaPokokPenjualanCount)
            },
            neraca: {
                aktiva: resultAsetTetapCount,
                pasiva: getSumOfStringValue([resultKewajibanLancarCount, resultEkuitasCount]),
                difference: Math.abs(resultAsetTetapCount) - Math.abs(getSumOfStringValue([resultKewajibanLancarCount, resultEkuitasCount]))
            }
        })
    })
}