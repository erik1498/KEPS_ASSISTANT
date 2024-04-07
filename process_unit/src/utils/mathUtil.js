import { generateToRupiahText } from "./numberParsingUtil.js"

export const sumNumberOnArray = (data, keys) => {
    let result = 0.0
    keys.map((item) => {
        result += parseFloat(data[item])
    })
    return result
}

export const getSlipGajiDetail = (gajis, pegawaiData, periode) => {
    let data = gajis[0]
    data.total_tunjangan_barang += data.ppn_tunjangan_barang
    data.total_rincian_pendapatan = sumNumberOnArray(data, [
        "gaji", "lembur", "bpjs", "jkk", "jkm", "jht", "jp", "bonus", "insentif", "thr", "total_tunjangan_barang", "ht"
    ])
    data.total_rincian_potongan = sumNumberOnArray(data, [
        "bpjs_karyawan", "jht_karyawan", "jp_karyawan", "pkt", "kt", "llt", "pph"
    ])
    data.take_home_pay = parseFloat(data.total_rincian_pendapatan) - parseFloat(data.total_rincian_potongan)
    data = generateToRupiahText(gajis[0], [
        "gaji", "lembur", "bpjs", "jkk", "jkm", "jht", "jp", "bonus", "insentif", "thr", "bpjs_karyawan", "jht_karyawan", "jp_karyawan", "total_tunjangan_barang", "ppn_tunjangan_barang", "pkt", "kt", "llt", "pph", "total_rincian_pendapatan", "total_rincian_potongan", "take_home_pay", "ht"
    ])
    data.periode = getBulanText(periode)
    data.pegawai = pegawaiData[0]
    data.tanggal = getTanggalHariIni()
    return data
}

const getTanggalHariIni = () => {
    let date = new Date()
    return date.getDate() + " " + getBulanText(date.getMonth()) + " " + date.getFullYear()
}

export const getBulanText = (periode) => {
    return ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][parseInt(periode)]
}