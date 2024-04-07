import { parseToRupiahText } from "./numberParsingUtil.js"

export const renderDataJurnalUmum = (data) => {
    return new Promise((res, rej) => {
        let dataReturn = []
        if (data.length > 0) {
            let code = data[0].bukti_transaksi
            for (let index = 0; index < data.length; index++) {
                if (code != data[index].bukti_transaksi) {
                    code = data[index].bukti_transaksi
                    dataReturn.push({
                        html: `
                            <td colspan="8" style="text-align:center; padding: 15px;">---------------------------------------------------------</td>
                        `
                    })
                }
                dataReturn.push({
                    html: `
                        <td style="padding: 10px;">${data[index].tanggal}</td>
                        <td style="padding: 10px;">${data[index].uraian}</td>
                        <td style="padding: 10px;">${data[index].kode_akun}</td>
                        <td style="padding: 10px;">${data[index].nama_akun}</td>
                        <td style="padding: 10px;">${data[index].type_akun}</td>
                        <td style="padding: 10px;">${parseToRupiahText(data[index].debet)}</td>
                        <td style="padding: 10px;">${parseToRupiahText(data[index].kredit)}</td>
                        <td style="padding: 10px;">${data[index].bukti_transaksi}</td>
                    `
                })
            }
        }
        res({
            table_content: dataReturn
        })
    })
}


export const convertNeracaToJurnalUmum = (data, bulan, tahun) => {
    return new Promise((res, rej) => {
        let jurnalUmum = []
        for (let i = 0; i < data.length; i++) {
            // LOGIC SEARCH JURNAL UMUM DAN HISTORY AKUN DISINI
            let dataPush = {
                uuid: "NERACA",
                bukti_transaksi: "NRC" + (parseFloat(bulan) - 1) + "" + tahun,
                transaksi: 0,
                tanggal: "01",
                bulan: bulan,
                tahun: tahun,
                waktu: "00:00:00",
                debet: data[i].debet,
                kredit: data[i].kredit,
                kode_akun: data[i].kode_akun_perkiraan_code,
                nama_akun: data[i].kode_akun_perkiraan_name,
                type_akun: data[i].kode_akun_perkiraan_type,
                uraian: data[i].uraian,
                sumber: "NERACA BULAN SEBELUMNYA"
            }
            if (dataPush.type_akun == "Modal") {
                if (dataPush.kode_akun == "304") {
                    dataPush.kode_akun = "303"
                    // if (dataPush.debet > 0) {
                    //     dataPush.kredit = dataPush.debet
                    //     dataPush.debet = 0
                    // }
                    // if (dataPush.kredit > 0) {
                    //     dataPush.kredit = 0
                    //     dataPush.debet = dataPush.kredit
                    // }
                    dataPush.nama_akun = "Laba/Rugi Periode Sebelumnya"
                }
                jurnalUmum.push(dataPush)
            }
            if (dataPush.type_akun == "Harta") {
                jurnalUmum.push(dataPush)
            }
            if (dataPush.type_akun == "Utang") {
                jurnalUmum.push(dataPush)
            }
        }
        res(jurnalUmum)
    })
}