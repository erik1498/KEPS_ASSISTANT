import { HARGA_POKOK_PENJUALAN_TYPE, ASET_TETAP_TYPE, EKUITAS_TYPE, KEWAJIBAN_LANCAR_TYPE, ASET_LANCAR_TYPE, ASET_LAIN_LAIN_TYPE, KEWAJIBAN_JANGKA_PANJANG_TYPE, KEWAJIBAN_LAIN_LAIN_TYPE } from "../constant/labaRugiConstant.js"
import { getBulanText, getSumMinusOfStringValue, getSumOfStringValue } from "./mathUtil.js"
import { generateReportValue, generateReportValueByMinusValue, convertByPlusMinusValue, minusTypeCode } from "./validateKreditDebetTypeUtil.js"

export const getNeracaReport = (data, laba_rugi_data_berjalan, bulan, tahun, validate) => {
    return new Promise(async (res, rej) => {

        let labaTahunBerjalan = null

        if (laba_rugi_data_berjalan.laba_rugi.gain) {
            labaTahunBerjalan = {
                kode_akun_perkiraan_code: "003.099",
                kode_akun_perkiraan_name: "LABA/RUGI PERIODE BERJALAN",
                kode_akun_perkiraan_type: EKUITAS_TYPE,
                debet: 0,
                kredit: laba_rugi_data_berjalan.laba_rugi.gain
            }
            labaTahunBerjalan.uraian = getBulanText(bulan - 1).toUpperCase() + " " + tahun
            data.push(labaTahunBerjalan)
        }
        if (laba_rugi_data_berjalan.laba_rugi.loss != null) {
            labaTahunBerjalan = {
                kode_akun_perkiraan_code: "003.099",
                kode_akun_perkiraan_name: "LABA/RUGI PERIODE BERJALAN",
                kode_akun_perkiraan_type: EKUITAS_TYPE,
                debet: Math.abs(laba_rugi_data_berjalan.laba_rugi.loss),
                kredit: 0
            }
            labaTahunBerjalan.uraian = getBulanText(bulan - 1).toUpperCase() + " " + tahun
            data.push(labaTahunBerjalan)
        }

        if (validate) {
            const getPersediaanBarangDagang = data.filter(x => x.kode_akun_perkiraan_code == "001.008")

            if (getPersediaanBarangDagang.length > 0) {
                if (getPersediaanBarangDagang[getPersediaanBarangDagang.length - 1].debet > 0) {
                    data.push({
                        kode_akun_perkiraan_name: 'PERSEDIAAN BARANG DAGANG',
                        kode_akun_perkiraan_code: '001.008',
                        kode_akun_perkiraan_type: ASET_LANCAR_TYPE,
                        debet: 0,
                        kredit: getPersediaanBarangDagang[getPersediaanBarangDagang.length - 1].debet
                    })
                    data.push({
                        kode_akun_perkiraan_name: 'PERSEDIAAN BARANG DAGANG AWAL',
                        kode_akun_perkiraan_code: '007.001',
                        kode_akun_perkiraan_type: HARGA_POKOK_PENJUALAN_TYPE,
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

        let resultKewajibanJangkaPanjang = []
        let resultKewajibanJangkaPanjangCount = 0.0

        let resultKewajibanLainLain = []
        let resultKewajibanLainLainCount = 0.0

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
            if (data[i].kode_akun_perkiraan_type == KEWAJIBAN_JANGKA_PANJANG_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultKewajibanJangkaPanjang.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
            if (data[i].kode_akun_perkiraan_type == KEWAJIBAN_LAIN_LAIN_TYPE) {
                data[i] = convertByPlusMinusValue(data[i])
                resultKewajibanLainLain.push({
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
        resultKewajibanJangkaPanjangCount = getSumMinusOfStringValue([getSumOfStringValue(resultKewajibanJangkaPanjang.map(i => i.debet)), getSumOfStringValue(resultKewajibanJangkaPanjang.map(i => i.kredit))])
        resultKewajibanLainLainCount = getSumMinusOfStringValue([getSumOfStringValue(resultKewajibanLainLain.map(i => i.debet)), getSumOfStringValue(resultKewajibanLainLain.map(i => i.kredit))])
        resultEkuitasCount = getSumMinusOfStringValue([getSumOfStringValue(resultEkuitas.map(i => i.debet)), getSumOfStringValue(resultEkuitas.map(i => i.kredit))])
        resultHargaPokokPenjualanCount = getSumMinusOfStringValue([getSumOfStringValue(resultHargaPokokPenjualan.map(i => i.debet)), getSumOfStringValue(resultHargaPokokPenjualan.map(i => i.kredit))])

        const aktiva = (resultAsetTetapCount + resultAsetLancarCount + resultAsetLainLainCount).toFixed(2)
        const pasiva = (resultKewajibanLancarCount + resultKewajibanJangkaPanjangCount + resultKewajibanLainLainCount + resultEkuitasCount + resultHargaPokokPenjualanCount).toFixed(2)

        res({
            aset_tetap: {
                data: resultAsetTetap,
                count: generateReportValueByMinusValue(resultAsetTetapCount)
            },
            aset_lancar: {
                data: resultAsetLancar,
                count: generateReportValueByMinusValue(resultAsetLancarCount)
            },
            aset_lain_lain: {
                data: resultAsetLainLain,
                count: generateReportValueByMinusValue(resultAsetLainLainCount)
            },
            kewajiban_lancar: {
                data: resultKewajibanLancar,
                count: generateReportValueByMinusValue(resultKewajibanLancarCount)
            },
            kewajiban_jangka_panjang: {
                data: resultKewajibanJangkaPanjang,
                count: generateReportValueByMinusValue(resultKewajibanJangkaPanjangCount)
            },
            kewajiban_lain_lain: {
                data: resultKewajibanLainLain,
                count: generateReportValueByMinusValue(resultKewajibanLainLainCount)
            },
            ekuitas: {
                data: resultEkuitas,
                count: generateReportValueByMinusValue(resultEkuitasCount)
            },
            harga_pokok_penjualan: {
                data: resultHargaPokokPenjualan,
                count: generateReportValueByMinusValue(resultHargaPokokPenjualanCount)
            },
            neraca: {
                aktiva,
                pasiva,
                difference: Math.abs(aktiva) - Math.abs(pasiva)
            }
        })
    })
}