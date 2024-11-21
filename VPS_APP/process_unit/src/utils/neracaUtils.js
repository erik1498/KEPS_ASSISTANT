import { HARGA_POKOK_PENJUALAN_TYPE, HARTA_TYPE, MODAL_TYPE, UTANG_TYPE } from "../constant/labaRugiConstant.js"
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

        let indexPersediaanBarangDagang = 0

        if (validate) {
            const getPersediaanBarangDagang = data.filter(x => x.kode_akun_perkiraan_code == "108")


            if (getPersediaanBarangDagang.length > 0) {
                indexPersediaanBarangDagang = data.indexOf(getPersediaanBarangDagang[0])

                data.push({
                    kode_akun_perkiraan_name: 'Persediaan Barang Dagang',
                    kode_akun_perkiraan_code: '108',
                    kode_akun_perkiraan_type: 'Harta',
                    debet: 0,
                    kredit: getPersediaanBarangDagang[0].debet
                })
                data.push({
                    kode_akun_perkiraan_name: 'Persediaan Barang Dagang Awal',
                    kode_akun_perkiraan_code: '701',
                    kode_akun_perkiraan_type: 'Harga Pokok Penjualan',
                    debet: getPersediaanBarangDagang[0].debet,
                    kredit: 0
                })
            }
        }


        let resultAset = []
        let resultAsetCount = 0.0

        let resultUtang = []
        let resultUtangCount = 0.0

        let resultModal = []
        let resultModalCount = 0.0

        let resultHargaPokokPenjualan = []
        let resultHargaPokokPenjualanCount = 0.0

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
            if (data[i].kode_akun_perkiraan_type == HARGA_POKOK_PENJUALAN_TYPE && data[i].kode_akun_perkiraan_code == "701") {
                data[i] = convertByPlusMinusValue(data[i])
                resultHargaPokokPenjualan.push({
                    ...data[i],
                    value: generateReportValue(data[i])
                })
            }
        }

        resultAsetCount = getSumMinusOfStringValue([getSumOfStringValue(resultAset.map(i => i.debet)), getSumOfStringValue(resultAset.map(i => i.kredit))])
        resultUtangCount = getSumMinusOfStringValue([getSumOfStringValue(resultUtang.map(i => i.debet)), getSumOfStringValue(resultUtang.map(i => i.kredit))])
        resultModalCount = getSumMinusOfStringValue([getSumOfStringValue(resultModal.map(i => i.debet)), getSumOfStringValue(resultModal.map(i => i.kredit))])
        resultHargaPokokPenjualanCount = getSumMinusOfStringValue([getSumOfStringValue(resultHargaPokokPenjualan.map(i => i.debet)), getSumOfStringValue(resultHargaPokokPenjualan.map(i => i.kredit))])



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
            harga_pokok_penjualan: {
                data: resultHargaPokokPenjualan,
                count: generateReportValueByMinusValue(resultHargaPokokPenjualanCount)
            },
            neraca: {
                aktiva: resultAsetCount,
                pasiva: getSumOfStringValue([resultUtangCount, resultModalCount]),
                difference: Math.abs(resultAsetCount) - Math.abs(getSumOfStringValue([resultUtangCount, resultModalCount]))
            }
        })
    })
}