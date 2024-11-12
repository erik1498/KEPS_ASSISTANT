import { myDays } from "./date.helper";
import { getSumOfStringValue, parseRupiahToFloat } from "./number.helper";

export const getNormalizedByDate = (data) => {
    let keys = []
    data = data.map(x => {
        x.parent = x.tanggal.split("T")[0]

        if (!keys.includes(x.parent)) {
            keys.push(x.parent)
        }

        return x
    })

    let fixedData = keys.map(x => {
        let selected = data.filter(y => y.parent == x)
        return {
            parent: x,
            data: selected
        }
    })
    return fixedData
}

export const normalizeDataJurnalPerintahStokOpname = (data) => {
    let listDaftarData = []

    let transaksiPerintahStokOpname = []

    for (let i = 0; i < data.length; i++) {
        const x = data[i];
        if (x.sumber == "PERINTAH STOK OPNAME" && !transaksiPerintahStokOpname.includes(x.transaksi)) {
            transaksiPerintahStokOpname.push(x.transaksi)
        }
    }

    data.map((x, i) => {

        const detail_data = JSON.parse(x.detail_data)

        let dataInput = {
            uuid: x.uuid,
            bukti_transaksi: x.bukti_transaksi,
            sumber: x.sumber,
            tahun: x.tahun,
            bulan: x.bulan,
            tanggal: x.tanggal,
            waktu: x.waktu ? x.waktu : x.tanggal.split("T")[1].replace(".000", ""),
            transaksi: x.transaksi,
            uraian: x.uraian,
            kode_akun: x.kode_akun,
            type_akun: x.type_akun,
            nama_akun: x.nama_akun,
            debet: x.debet,
            kredit: x.kredit,
            detail_data: detail_data
        }

        if (x.sumber == "PERINTAH STOK OPNAME") {
            if (transaksiPerintahStokOpname.includes(x.transaksi)) {

                transaksiPerintahStokOpname[transaksiPerintahStokOpname.indexOf(x.transaksi)] = -1

                dataInput["satuan_barang_name"] = detail_data.satuan_barang_name
                dataInput["faktur_penjualan_barang"] = detail_data.faktur_penjualan_barang
                dataInput["kategori_harga_barang_kode_barang"] = detail_data.kategori_harga_barang_kode_barang
                dataInput["pesanan_penjualan_barang"] = detail_data.pesanan_penjualan_barang
                dataInput["customer_name"] = detail_data.customer_name
                dataInput["customer_code"] = detail_data.customer_code
                dataInput["daftar_gudang_name"] = detail_data.daftar_gudang_name
                dataInput["daftar_barang_name"] = detail_data.daftar_barang_name
                dataInput["jumlah"] = detail_data.jumlah
                dataInput["harga"] = detail_data.harga
                dataInput["ppn"] = detail_data.ppn
                dataInput["diskon_persentase"] = detail_data.diskon_persentase
                dataInput["waktu_show"] = true
            }
        } else {
            if (x.transaksi == 0) {
                dataInput["satuan_barang_name"] = detail_data.satuan_barang_name
                dataInput["faktur_penjualan_barang"] = detail_data.faktur_penjualan_barang
                dataInput["kategori_harga_barang_kode_barang"] = detail_data.kategori_harga_barang_kode_barang
                dataInput["pesanan_penjualan_barang"] = detail_data.pesanan_penjualan_barang
                dataInput["customer_name"] = detail_data.customer_name
                dataInput["customer_code"] = detail_data.customer_code
                dataInput["daftar_gudang_name"] = detail_data.daftar_gudang_name
                dataInput["daftar_barang_name"] = detail_data.daftar_barang_name
                dataInput["jumlah"] = detail_data.jumlah
                dataInput["harga"] = detail_data.harga
                dataInput["ppn"] = detail_data.ppn
                dataInput["diskon_persentase"] = detail_data.diskon_persentase
                dataInput["waktu_show"] = true
            }
        }

        listDaftarData.push(dataInput)
    })

    return listDaftarData.filter(x => x.debet > 0 || x.kredit > 0).map(x => {
        x.tanggal = `${x.tanggal.length}` > 2 ? new Date(`${x.tanggal}`).getDate() : x.tanggal
        x.waktu = x.waktu == x.tanggal ? x.waktu.split("T")[1].replace(".000", "") : x.waktu
        return x
    })
}

const getDiffByTransaksi = (data) => {
    let jumlahTransaksi = Math.max(...data.map(i => i.transaksi))
    let arrData = []
    for (let index = 0; index <= jumlahTransaksi; index++) {
        arrData.push([...data.filter(i => i.transaksi == index)])
    }
    return arrData
}

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

            let dataPadaTanggal = data.filter(j => j.tanggal == tanggal)

            returnData[`${parseInt(tanggal)}`].total = {
                debet: dataPadaTanggal.reduce((sum, current) => { return sum + parseRupiahToFloat(current.debet) }, 0),
                kredit: dataPadaTanggal.reduce((sum, current) => { return sum + parseRupiahToFloat(current.kredit) }, 0)
            }

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