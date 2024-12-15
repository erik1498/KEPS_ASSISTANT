import { ASET_LAIN_LAIN_TYPE, ASET_LANCAR_TYPE, ASET_TETAP_TYPE, EKUITAS_TYPE, HARGA_POKOK_PENJUALAN_TYPE, KEWAJIBAN_JANGKA_PANJANG_TYPE, KEWAJIBAN_LAIN_LAIN_TYPE, KEWAJIBAN_LANCAR_TYPE } from "../constant/labaRugiConstant.js";
import { parseToRupiahText } from "./numberParsingUtil.js"
import { convertByPlusMinusValue } from "./validateKreditDebetTypeUtil.js"

export const getTanggalTerakhirPadaBulan = (tahun, bulan) => {
    return new Date(tahun, bulan, 0).getDate();
}

export const formatDate = (dateString, withHours = true) => {
    if (!dateString) {
        return ""
    }

    let date = new Date(dateString);

    // Mendapatkan komponen tanggal
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() dimulai dari 0
    let year = date.getFullYear();

    let formattedDate = day + '/' + month + '/' + year;

    if (withHours) {

        // Mendapatkan komponen waktu
        let hours = date.getHours();
        let minutes = date.getMinutes().toString().padStart(2, '0');
        let seconds = date.getSeconds().toString().padStart(2, '0');

        // Mengatur format 12 jam
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Ubah 0 jam menjadi 12
        let formattedTime = hours.toString().padStart(2, '0') + ':' + minutes + ':' + seconds + ' ' + ampm;
        return formattedDate + ' ' + formattedTime;

    }

    return formattedDate;
}

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
        const keys = Object.keys(data)

        let arrData = []
        for (let index = 0; index < keys.length; index++) {
            if (data[keys[index]]?.data?.length > 0) {
                arrData.push(...data[keys[index]].data)
            }
        }
        let jurnalUmum = []
        for (let i = 0; i < arrData.length; i++) {
            arrData[i] = convertByPlusMinusValue(arrData[i])
            let dataPush = {
                uuid: "NERACA",
                bukti_transaksi: "NRC" + (parseFloat(bulan) - 1) + "" + tahun,
                transaksi: 0,
                tanggal: "01",
                bulan: bulan,
                tahun: tahun,
                waktu: "00:00:00",
                debet: arrData[i].debet,
                kredit: arrData[i].kredit,
                kode_akun: arrData[i].kode_akun_perkiraan_code,
                nama_akun: arrData[i].kode_akun_perkiraan_name,
                type_akun: arrData[i].kode_akun_perkiraan_type,
                uraian: arrData[i].uraian,
                sumber: "NERACA BULAN SEBELUMNYA"
            }
            if (dataPush.type_akun == EKUITAS_TYPE) {
                if (dataPush.kode_akun == "003.099") {
                    dataPush.kode_akun = "003.098"
                    dataPush.nama_akun = "Laba/Rugi Periode Sebelumnya"
                }
                jurnalUmum.push(dataPush)
                continue;
            }
            if (
                ASET_TETAP_TYPE
                .concat(ASET_LANCAR_TYPE)
                .concat(ASET_LAIN_LAIN_TYPE)
                .concat(KEWAJIBAN_LANCAR_TYPE)
                .concat(KEWAJIBAN_JANGKA_PANJANG_TYPE)
                .concat(KEWAJIBAN_LAIN_LAIN_TYPE)
                .concat(HARGA_POKOK_PENJUALAN_TYPE)
                .includes(dataPush.type_akun)
            ) {
                jurnalUmum.push(dataPush)
            }
        }
        jurnalUmum.sort((a, b) => parseInt(a.kode_akun) - parseInt(b.kode_akun))

        console.log("JURNAL UMUM", jurnalUmum)
        res(jurnalUmum)
    })
}