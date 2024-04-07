import { parseToRupiahText } from "./numberParsingUtil.js"

export const renderDataNeracaSaldo = (data) => {
    return new Promise((res, rej) => {
        let dataReturn = []
        if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                dataReturn.push({
                    html: `
                        <td style="padding: 10px;">${data[index].kode_akun_perkiraan_name}</td>
                        <td style="padding: 10px;">${data[index].kode_akun_perkiraan_code}</td>
                        <td style="padding: 10px;">${parseToRupiahText(data[index].debet)}</td>
                        <td style="padding: 10px;">${parseToRupiahText(data[index].kredit)}</td>
                    `
                })
            }
        }
        res({
            table_content: dataReturn
        })
    })
}

export const convertJurnalUmumToNeracaSaldo = (data) => {
    return new Promise((resolve) => {
        let returnData = []
        for (let i = 0; i < data.length; i++) {
            returnData.push(
                {
                    kode_akun_perkiraan_code: data[i].kode_akun,
                    kode_akun_perkiraan_name: data[i].nama_akun,
                    kode_akun_perkiraan_type: data[i].type_akun,
                    sum_result: parseFloat(data[i].debet) - parseFloat(data[i].kredit)
                }
            )
        }
        resolve(returnData)
    })
}

export const getNeracaSaldoReport = (data) => {
    return new Promise((res, rej) => {
        let result = []
        for (let i = 0; i < data.length; i++) {
            result.push({
                kode_akun_perkiraan_name: data[i].kode_akun_perkiraan_name,
                kode_akun_perkiraan_code: data[i].kode_akun_perkiraan_code,
                kode_akun_perkiraan_type: data[i].kode_akun_perkiraan_type,
                debet: data[i].sum_result >= 0 ? data[i].sum_result : 0,
                kredit: data[i].sum_result < 0 ? Math.abs(data[i].sum_result) : 0,
            })
        }
        res(result)
    })
}

const getListKodePerkiraanPelunasanPenjualan = (data) => {
    let arrKodeAkun = []
    for (let i = 0; i < data.length; i++) {
        if (arrKodeAkun.filter((item) => item.kode_akun_perkiraan_code == data[i].kode_akun)) {
            arrKodeAkun.push(
                {
                    sum_result: 0,
                    kode_akun_perkiraan_name: data[i].nama_akun,
                    kode_akun_perkiraan_code: data[i].kode_akun,
                    kode_akun_perkiraan_type: data[i].type_akun
                }
            )
        }
    }
    return arrKodeAkun
}


export const getFakturPelunasanAndReturPenjualanJasaToNeracaSaldo = (data) => {
    return new Promise((res, rej) => {
        let piutangUsaha = {
            sum_result: 0,
            kode_akun_perkiraan_name: 'Piutang Usaha',
            kode_akun_perkiraan_code: '110',
            kode_akun_perkiraan_type: 'Harta'
        }

        let penjualanJasa = {
            sum_result: 0,
            kode_akun_perkiraan_name: 'Penjualan Jasa',
            kode_akun_perkiraan_code: '405',
            kode_akun_perkiraan_type: 'Pendapatan'
        }


        let returPenjualan = {
            sum_result: 0,
            kode_akun_perkiraan_name: 'Retur Penjualan Jasa',
            kode_akun_perkiraan_code: '406',
            kode_akun_perkiraan_type: 'Pendapatan'
        }

        for (let i = 0; i < data.fakturPenjualanJasa.length; i++) {
            piutangUsaha.sum_result += data.fakturPenjualanJasa[i].hutang
            penjualanJasa.sum_result -= data.fakturPenjualanJasa[i].hutang
        }


        for (let i = 0; i < data.pembatalanPenjualanJasa.length; i++) {
            piutangUsaha.sum_result -= data.pembatalanPenjualanJasa[i].nilai
            returPenjualan.sum_result += data.pembatalanPenjualanJasa[i].nilai
        }

        res([
            piutangUsaha,
            penjualanJasa,
            returPenjualan
        ])
    })
}
export const getFakturPelunasanAndReturPenjualanBarangToNeracaSaldo = (data) => {
    return new Promise((res, rej) => {
        let piutangUsaha = {
            sum_result: 0,
            kode_akun_perkiraan_name: 'Piutang Usaha',
            kode_akun_perkiraan_code: '110',
            kode_akun_perkiraan_type: 'Harta'
        }

        let kasBesar = {
            sum_result: 0,
            kode_akun_perkiraan_name: 'Kas Besar',
            kode_akun_perkiraan_code: '101',
            kode_akun_perkiraan_type: 'Harta'
        }

        let ppnKeluaran = {
            sum_result: 0,
            kode_akun_perkiraan_name: 'PPN Keluaran',
            kode_akun_perkiraan_code: '205',
            kode_akun_perkiraan_type: 'Utang'
        }

        let penjualanBarang = {
            sum_result: 0,
            kode_akun_perkiraan_name: 'Penjualan Barang',
            kode_akun_perkiraan_code: '401',
            kode_akun_perkiraan_type: 'Pendapatan'
        }

        let returPenjualan = {
            sum_result: 0,
            kode_akun_perkiraan_name: 'Retur Penjualan Barang',
            kode_akun_perkiraan_code: '403',
            kode_akun_perkiraan_type: 'Pendapatan'
        }

        for (let i = 0; i < data.fakturPenjualanBarang.length; i++) {
            // if (data.fakturPenjualanBarang[i].tipe_pembayaran == "Kredit") {
            piutangUsaha.sum_result += data.fakturPenjualanBarang[i].total
            // }else{
            // console.log(data.fakturPenjualanBarang[i])
            // kasBesar.sum_result += data.fakturPenjualanBarang[i].total
            // }
            ppnKeluaran.sum_result -= data.fakturPenjualanBarang[i].ppn
            penjualanBarang.sum_result -= data.fakturPenjualanBarang[i].dpp
        }

        const arrKodeAkun = getListKodePerkiraanPelunasanPenjualan(data.pelunasanPenjualanBarang)


        for (let i = 0; i < data.pelunasanPenjualanBarang.length; i++) {
            piutangUsaha.sum_result -= data.pelunasanPenjualanBarang[i].sudah_dibayar
            const arrKodeAkunGet = arrKodeAkun.filter((item) => item.kode_akun_perkiraan_code == data.pelunasanPenjualanBarang[i].kode_akun)
            arrKodeAkun[arrKodeAkun.indexOf(arrKodeAkunGet[0])].sum_result += data.pelunasanPenjualanBarang[i].sudah_dibayar
        }

        for (let i = 0; i < data.returPenjualanBarang.length; i++) {
            const arrKodeAkunGet = arrKodeAkun.filter((item) => item.kode_akun_perkiraan_code == data.returPenjualanBarang[i].kode_akun)
            if (arrKodeAkunGet.length > 0) {
                arrKodeAkun[arrKodeAkun.indexOf(arrKodeAkunGet[0])].sum_result -= data.returPenjualanBarang[i].total
            }
            // if (data.returPenjualanBarang[i].tipe_pembayaran == "Kredit") {
            // piutangUsaha.sum_result -= data.returPenjualanBarang[i].total
            // } else {
            // kasBesar.sum_result -= data.returPenjualanBarang[i].total
            // }
            ppnKeluaran.sum_result += data.returPenjualanBarang[i].ppn
            returPenjualan.sum_result += data.returPenjualanBarang[i].dpp
        }

        res([
            piutangUsaha,
            kasBesar,
            ppnKeluaran,
            penjualanBarang,
            returPenjualan
        ].concat(...arrKodeAkun))
    })
}