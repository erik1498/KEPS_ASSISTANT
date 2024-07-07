import { getBulanText } from "./mathUtil.js"

export const GARIS_LURUS = "Garis Lurus"
export const SALDO_MENURUN = "Saldo Menurun"


export const getDataFromTanggal = (tanggal, delimiter, index) => {
    return String(tanggal).split(delimiter)[index]
}

export const normalizedNumber = (number) => {
    let split = String(number).split(".")
    if (split.length > 1) {
        if (parseFloat(split[1].charAt(0)) > 5.0) {
            return parseFloat(split[0]) + 1
        }else{
            return parseFloat(split[0])
        }
    }
    return number
}

export const hitungPenyusutanGarisLurus = (asetData) => {
    let penyusutanResult = [
        {
            tahunPerolehan: getBulanText(getDataFromTanggal(asetData.tgl_beli, "-", 1) - 1) + " " + getDataFromTanggal(asetData.tgl_beli, "-", 0),
            masa: [
                null,
                null
            ],
            hargaBeli: null,
            persentase: null,
            nilaiPenyusutan: null,
            nilaiBuku: asetData.harga_satuan
        }
    ]
    console.log(asetData.tgl_beli)
    for (let i = 1; i < parseFloat(asetData.masa_penyusutan) + 2; i++) {
        if (i == 1) {
            penyusutanResult.push(
                {
                    tahunPerolehan: parseFloat(getDataFromTanggal(asetData.tgl_beli, "-", 0)) + i,
                    masa: [
                        parseFloat(getDataFromTanggal(asetData.tgl_beli, "-", 1)) + 1,
                        12
                    ],
                    hargaBeli: parseFloat(asetData.harga_satuan),
                    persentase: parseFloat(asetData.nilai),
                    nilaiPenyusutan: normalizedNumber((parseFloat(getDataFromTanggal(asetData.tgl_beli, "-", 1)) + 1) / 12 * parseFloat(asetData.harga_satuan) * (parseFloat(asetData.nilai) / 100)),
                    nilaiBuku: normalizedNumber(parseFloat(penyusutanResult[i - 1].nilaiBuku) - (parseFloat(getDataFromTanggal(asetData.tgl_beli, "-", 1)) + 1) / 12 * parseFloat(asetData.harga_satuan) * (parseFloat(asetData.nilai) / 100))
                }
            )
        } else if (i == parseFloat(asetData.masa_penyusutan) + 1) {
            penyusutanResult.push(
                {
                    tahunPerolehan: parseFloat(getDataFromTanggal(asetData.tgl_beli, "-", 0)) + i,
                    masa: [
                        12 - (parseFloat(getDataFromTanggal(asetData.tgl_beli, "-", 1)) + 1),
                        12
                    ],
                    hargaBeli: parseFloat(asetData.harga_satuan),
                    persentase: parseFloat(asetData.nilai),
                    nilaiPenyusutan: normalizedNumber(((12 - (parseFloat(getDataFromTanggal(asetData.tgl_beli, "-", 1)) + 1))) / 12 * parseFloat(asetData.harga_satuan) * (parseFloat(asetData.nilai) / 100)),
                    nilaiBuku: normalizedNumber(parseFloat(penyusutanResult[i - 1].nilaiBuku) - ((12 - (parseFloat(getDataFromTanggal(asetData.tgl_beli, "-", 1)) + 1))) / 12 * parseFloat(asetData.harga_satuan) * (parseFloat(asetData.nilai) / 100))
                }
            )
        } else {
            penyusutanResult.push(
                {
                    tahunPerolehan: parseFloat(getDataFromTanggal(asetData.tgl_beli, "-", 0)) + i,
                    masa: [
                        null,
                        null
                    ],
                    hargaBeli: parseFloat(asetData.harga_satuan),
                    persentase: parseFloat(asetData.nilai),
                    nilaiPenyusutan: normalizedNumber(parseFloat(asetData.harga_satuan) * (parseFloat(asetData.nilai) / 100)),
                    nilaiBuku: normalizedNumber(parseFloat(penyusutanResult[i - 1].nilaiBuku) - parseFloat(asetData.harga_satuan) * (parseFloat(asetData.nilai) / 100))
                }
            )
        }
    }
    return penyusutanResult
}

export const hitungPenyusutanSaldoMenurun = (asetData) => {
    let penyusutanResult = [
        {
            tahunPerolehan: getDataFromTanggal(asetData.tgl_beli, "-", 0),
            hargaBeli: parseFloat(asetData.harga_satuan),
            akumulasiPenyusutanAwalTahun: null,
            nilaiBukuAwalTahun: parseFloat(asetData.harga_satuan),
            persentasePenyusutan: parseFloat(asetData.nilai),
            nilaiPenyusutan: normalizedNumber((parseFloat(asetData.harga_satuan) * (parseFloat(asetData.nilai) / 100))),
            nilaiBukuAkhirTahun: normalizedNumber(parseFloat(asetData.harga_satuan) - ((parseFloat(asetData.harga_satuan) * (parseFloat(asetData.nilai) / 100)))),
        }
    ]
    for (let i = 1; i < parseFloat(asetData.masa_penyusutan) + 1; i++) {
        penyusutanResult.push(
            {
                tahunPerolehan: parseFloat(getDataFromTanggal(asetData.tgl_beli, "-", 0)) + i,
                hargaBeli: parseFloat(asetData.harga_satuan),
                akumulasiPenyusutanAwalTahun: parseFloat(penyusutanResult[i-1].hargaBeli) - penyusutanResult[i-1].nilaiBukuAkhirTahun,
                nilaiBukuAwalTahun: parseFloat(penyusutanResult[i-1].nilaiBukuAkhirTahun),
                persentasePenyusutan: parseFloat(asetData.nilai),
                nilaiPenyusutan: normalizedNumber((parseFloat(penyusutanResult[i-1].nilaiBukuAkhirTahun) * (parseFloat(asetData.nilai) / 100))),
                nilaiBukuAkhirTahun: normalizedNumber(parseFloat(penyusutanResult[i-1].nilaiBukuAkhirTahun) - ((parseFloat(penyusutanResult[i-1].nilaiBukuAkhirTahun) * (parseFloat(asetData.nilai) / 100)))),
            }
        )
    }
    return penyusutanResult
}