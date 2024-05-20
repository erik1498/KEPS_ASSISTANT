import { myDays } from "./date.helper";
import { getSumOfStringValue } from "./number.helper";


const getDiffByTransaksi = (data) => {
    let jumlahTransaksi = Math.max(...data.map(i => i.transaksi))
    let arrData = []
    for (let index = 0; index <= jumlahTransaksi; index++) {
        arrData.push([...data.filter(i => i.transaksi == index)])
    }
    return arrData
}

export const AKUN_TIDAK_BOLEH_DIUPDATE = ["101", "102", "301", "302", "303", "304", "305", "401", "405", "701", "702", "799"]

export const normalizeDataJurnalUmum = (data) => {
    return new Promise((res, rej) => {
        let totalDebet = 0;
        let totalKredit = 0;
        try {
            totalDebet = getSumOfStringValue(data.map(i => i.debet));
            totalKredit = getSumOfStringValue(data.map(i => i.kredit));
        } catch (error) {
            totalDebet = 0;
            totalKredit = 0;
        }
        let returnData = []

        let tanggal = "00";

        let totalDebetTanggal = 0;
        let totalKreditTanggal = 0;

        data.map(i => {

            if (i.tanggal != tanggal) {
                tanggal = i.tanggal
                returnData[`${parseInt(tanggal)}`] = {
                    total: {
                        kredit: 0,
                        debet: 0
                    },
                    tanggal: i.tanggal,
                    bulan: i.bulan,
                    tahun: i.tahun,
                    hari: myDays[new Date(`${i.tahun}-${i.bulan}-${tanggal}`).getDay()]
                }

                totalDebetTanggal = 0
                totalKreditTanggal = 0
            }

            totalDebetTanggal = getSumOfStringValue([totalDebetTanggal, parseFloat(i.debet)])
            totalKreditTanggal = getSumOfStringValue([totalKreditTanggal, parseFloat(i.kredit)])

            returnData[`${parseInt(tanggal)}`].total = {
                debet: totalDebetTanggal,
                kredit: totalKreditTanggal
            }

            let dataPadaTanggal = data.filter(j => j.tanggal == tanggal)

            let listBuktiTransaksi = []
            let listBuktiTransaksiDanDaftarData = []

            dataPadaTanggal.map((item) => {
                if (listBuktiTransaksi.indexOf(item.bukti_transaksi) < 0) {
                    listBuktiTransaksi.push(item.bukti_transaksi)
                    listBuktiTransaksiDanDaftarData.push({
                        bukti_transaksi: item.bukti_transaksi,
                        data: getDiffByTransaksi(dataPadaTanggal.filter((k) => k.bukti_transaksi == item.bukti_transaksi)),
                        debet: getSumOfStringValue(dataPadaTanggal
                            .filter((k) => k.bukti_transaksi == item.bukti_transaksi)
                            .map(k => k.debet)),
                        kredit: getSumOfStringValue(dataPadaTanggal
                            .filter((k) => k.bukti_transaksi == item.bukti_transaksi)
                            .map(k => k.kredit)),
                        tanggal: item.tanggal,
                        bulan: item.bulan,
                        tahun: item.tahun,
                        sumber: item.sumber
                    })
                }
            })

            returnData[`${parseInt(tanggal)}`].buktiTransaksi = listBuktiTransaksiDanDaftarData

        })

        res({
            totalDebet, totalKredit, returnData
        })
    })
}

export const normalizeDataJurnalUmumSubmit = (data, buktiTransaksiEdit, transaksiListDeleted) => {
    return new Promise((res, rej) => {
        let transaksiList = []

        if (buktiTransaksiEdit != null) {
            buktiTransaksiEdit.transaksiList.forEach((transaksi, idx) => {
                transaksi.concat(transaksiListDeleted).map(item => {
                    let status = "DELETE"
                    let dataValue = data.transaksiList[idx] != undefined ? data.transaksiList[idx].filter(dVItem => dVItem.uuid == item.uuid) : []
                    if (dataValue.length > 0) {
                        status = "PUT"
                        item = dataValue[0]
                    }

                    if (item.uuid) {
                        transaksiList.push({
                            tanggal: new Date(data.hariTanggal).getDate().toString(),
                            bulan: (new Date(data.hariTanggal).getMonth() + 1).toString(),
                            tahun: new Date(data.hariTanggal).getFullYear().toString(),
                            waktu: item.waktu,
                            uraian: item.uraian,
                            debet: item.debet.toString(),
                            kredit: item.kredit.toString(),
                            kode_akun_uuid: item.kodeAkun.value,
                            bukti_transaksi: data.buktiTransaksi,
                            transaksi: idx,
                            uuid: item.uuid,
                            status
                        })
                    }
                })
            });
        }

        data.transaksiList.forEach((transaksi, idx) => {
            transaksi.forEach(item => {
                if (!item.uuid) {
                    transaksiList.push({
                        tanggal: new Date(data.hariTanggal).getDate().toString(),
                        bulan: (new Date(data.hariTanggal).getMonth() + 1).toString(),
                        tahun: new Date(data.hariTanggal).getFullYear().toString(),
                        waktu: item.waktu,
                        uraian: item.uraian,
                        debet: item.debet.toString(),
                        kredit: item.kredit.toString(),
                        kode_akun_uuid: item.kodeAkun.value,
                        bukti_transaksi: data.buktiTransaksi,
                        status: "POST",
                        transaksi: idx
                    })
                }
            })
        })

        let transaksiListFix = []
        let uuidList = []
        transaksiList.map((i) => {
            if (i.status != "POST" && uuidList.indexOf(i.uuid) < 0) {
                transaksiListFix.push(i)
                uuidList.push(i.uuid)
            }
        })

        transaksiListFix = transaksiListFix.concat(transaksiList.filter(i => i.status == "POST"))

        res(transaksiListFix)
    })
}

export const normalizeDataJurnalUmumEdit = (data, kodeAkun) => {
    return new Promise((res, rej) => {
        let dataReturn = []
        data.forEach((transaksi, i) => {
            dataReturn[i] = []
            transaksi.forEach(item => {
                dataReturn[i].push({
                    waktu: item.waktu,
                    kodeAkun: {
                        label: `${item.kode_akun} - ${item.nama_akun}`,
                        value: kodeAkun.filter(j => j.code == item.kode_akun)[0].uuid
                    },
                    uraian: item.uraian,
                    debet: item.debet,
                    kredit: item.kredit,
                    uuid: item.uuid,
                })
            })
        })
        res(dataReturn)
    })
}