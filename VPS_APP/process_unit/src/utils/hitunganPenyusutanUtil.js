import { getTanggalTerakhirPadaBulan } from "./jurnalUmumUtil.js"
import { getBulanText } from "./mathUtil.js"

export const GARIS_LURUS = "Garis Lurus"
export const SALDO_MENURUN = "Saldo Menurun"


export const getDataFromTanggal = (tanggal, delimiter, index) => {
    tanggal = String(tanggal).length > 10 ? String(tanggal).split("T")[0] : tanggal
    return String(tanggal).split(delimiter)[index]
}

export const normalizedNumber = (number) => {
    let split = String(number).split(".")
    if (split.length > 1) {
        if (parseFloat(split[1].charAt(0)) > 5.0) {
            return parseFloat(split[0]) + 1
        } else {
            return parseFloat(split[0])
        }
    }
    return number
}

export const hitungPenyusutanGarisLurus = (asetData) => {
    let penyusutanResult = [
        {
            tahun_perolehan: getBulanText(getDataFromTanggal(asetData.tanggal_beli, "-", 1) - 1) + " " + getDataFromTanggal(asetData.tanggal_beli, "-", 0),
            tanggal: getDataFromTanggal(asetData.tanggal_beli, "-", 2),
            bulan: 12,
            tahun: getDataFromTanggal(asetData.tanggal_beli, "-", 0),
            masa_awal: null,
            masa_akhir: null,
            harga_beli: null,
            persentase: null,
            nilai_penyusutan: null,
            nilai_buku: asetData.harga_satuan
        }
    ]

    const isDecember = parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 1)) == 12

    for (let i = 1; i < parseFloat(asetData.masa_penyusutan) + 2; i++) {
        if (i == 1) {
            let masa = parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 1)) > 11 ? 1 : parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 1))
            masa += (isDecember ? 0 : 1);
            penyusutanResult.push(
                {
                    tahun_perolehan: getBulanText(masa - 1) + " " + (parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 0)) + (isDecember ? i : i - 1)),
                    tanggal: getTanggalTerakhirPadaBulan((parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 0)) + (isDecember ? i : i - 1)), 12),
                    bulan: 12,
                    tahun: (parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 0)) + (isDecember ? i : i - 1)),
                    masa_awal: masa,
                    masa_akhir: 12,
                    harga_beli: parseFloat(asetData.harga_satuan),
                    persentase: parseFloat(asetData.nilai),
                    nilai_penyusutan: normalizedNumber((masa) / 12 * parseFloat(asetData.harga_satuan) * (parseFloat(asetData.nilai) / 100)),
                    nilai_buku: normalizedNumber(parseFloat(penyusutanResult[i - 1].nilai_buku) - (masa) / 12 * parseFloat(asetData.harga_satuan) * (parseFloat(asetData.nilai) / 100))
                }
            )
        } else if (i == parseFloat(asetData.masa_penyusutan) + 1) {
            let masa = parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 1)) > 11 ? 1 : parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 1))
            masa += (isDecember ? 0 : 1);
            penyusutanResult.push(
                {
                    tahun_perolehan: parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 0)) + i - (isDecember ? 0 : 1),
                    tanggal: getTanggalTerakhirPadaBulan((parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 0)) + (isDecember ? i : i - 1)), 12),
                    bulan: 12,
                    tahun: (parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 0)) + (isDecember ? i : i - 1)),
                    masa_awal: 12 - masa,
                    masa_akhir: 12,
                    harga_beli: parseFloat(asetData.harga_satuan),
                    persentase: parseFloat(asetData.nilai),
                    nilai_penyusutan: normalizedNumber(((12 - (masa))) / 12 * parseFloat(asetData.harga_satuan) * (parseFloat(asetData.nilai) / 100)),
                    nilai_buku: normalizedNumber(parseFloat(penyusutanResult[i - 1].nilai_buku) - ((12 - (masa))) / 12 * parseFloat(asetData.harga_satuan) * (parseFloat(asetData.nilai) / 100))
                }
            )
        } else {
            penyusutanResult.push(
                {
                    tahun_perolehan: parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 0)) + i - (isDecember ? 0 : 1),
                    tanggal: getTanggalTerakhirPadaBulan((parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 0)) + (isDecember ? i : i - 1)), 12),
                    bulan: 12,
                    tahun: (parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 0)) + (isDecember ? i : i - 1)),
                    masa_awal: null,
                    masa_akhir: null,
                    harga_beli: parseFloat(asetData.harga_satuan),
                    persentase: parseFloat(asetData.nilai),
                    nilai_penyusutan: normalizedNumber(parseFloat(asetData.harga_satuan) * (parseFloat(asetData.nilai) / 100)),
                    nilai_buku: normalizedNumber(parseFloat(penyusutanResult[i - 1].nilai_buku) - parseFloat(asetData.harga_satuan) * (parseFloat(asetData.nilai) / 100))
                }
            )
        }
    }
    return penyusutanResult
}

export const hitungPenyusutanSaldoMenurun = (asetData) => {
    let penyusutanResult = [
        {
            tahun_perolehan: getDataFromTanggal(asetData.tanggal_beli, "-", 0),
            tanggal: getTanggalTerakhirPadaBulan(parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 0)), 12),
            bulan: 12,
            tahun: getDataFromTanggal(asetData.tanggal_beli, "-", 0),
            harga_beli: parseFloat(asetData.harga_satuan),
            akumulasi_penyusutan_awal_tahun: null,
            nilai_buku_awal_tahun: parseFloat(asetData.harga_satuan),
            persentase_penyusutan: parseFloat(asetData.nilai),
            nilai_penyusutan: normalizedNumber((parseFloat(asetData.harga_satuan) * (parseFloat(asetData.nilai) / 100))),
            nilai_buku_akhir_tahun: normalizedNumber(parseFloat(asetData.harga_satuan) - ((parseFloat(asetData.harga_satuan) * (parseFloat(asetData.nilai) / 100)))),
        }
    ]
    for (let i = 1; i < parseFloat(asetData.masa_penyusutan) + 1; i++) {
        penyusutanResult.push(
            {
                tahun_perolehan: parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 0)) + i,
                tanggal: getTanggalTerakhirPadaBulan(parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 0)) + i, 12),
                bulan: 12,
                tahun: parseFloat(getDataFromTanggal(asetData.tanggal_beli, "-", 0)) + i,
                harga_beli: parseFloat(asetData.harga_satuan),
                akumulasi_penyusutan_awal_tahun: parseFloat(penyusutanResult[i - 1].harga_beli) - penyusutanResult[i - 1].nilai_buku_akhir_tahun,
                nilai_buku_awal_tahun: parseFloat(penyusutanResult[i - 1].nilai_buku_akhir_tahun),
                persentase_penyusutan: parseFloat(asetData.nilai),
                nilai_penyusutan: normalizedNumber((parseFloat(penyusutanResult[i - 1].nilai_buku_akhir_tahun) * (parseFloat(asetData.nilai) / 100))),
                nilai_buku_akhir_tahun: normalizedNumber(parseFloat(penyusutanResult[i - 1].nilai_buku_akhir_tahun) - ((parseFloat(penyusutanResult[i - 1].nilai_buku_akhir_tahun) * (parseFloat(asetData.nilai) / 100)))),
            }
        )
    }
    return penyusutanResult
}