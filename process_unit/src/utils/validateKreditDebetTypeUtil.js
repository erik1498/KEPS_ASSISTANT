import { parseToRupiahText } from "./numberParsingUtil.js"

export const DEBET_POSITIF_TYPE = ["Harta", "Beban Operasional", "Beban Lainnya"]

export const PENDAPATAN_MINUS_KODE_AKUN = [];

export const HARGA_POKOK_PENJUALAN_MINUS_KODE_AKUN = [];

export const BEBAN_OPERASIONAL_MINUS_KODE_AKUN = [];

export const PENDAPATAN_LAIN_LAIN_MINUS_KODE_AKUN = [];

export const BEBAN_LAINNYA_MINUS_KODE_AKUN = []

export const ASSET_MINUS_KODE_AKUN = []

export const UTANG_MINUS_KODE_AKUN = []

export let MODAL_MINUS_KODE_AKUN = ["302"]

export const generateReportValue = (data, type) => {
    if (type.indexOf(data.kode_akun_perkiraan_code) >= 0) {
        return data.kredit > 0 ? "( " + parseToRupiahText(data.kredit) + " )" : "( " + parseToRupiahText(data.debet) + " )"
    }
    if (DEBET_POSITIF_TYPE.indexOf(data.kode_akun_perkiraan_type) >= 0) {
        return data.kredit > 0 ? `( ${parseToRupiahText(data.kredit)} )` : parseToRupiahText(data.debet)
    }else{
        return data.kredit > 0 ? parseToRupiahText(data.kredit) : parseToRupiahText(data.debet)
    }
}

export const generateCountValue = (data, type) => {
    if (type.indexOf(data.kode_akun_perkiraan_code) > -1) {
        return data.kredit > 0 ? data.kredit * -1 : data.debet * -1;
    } else {
        return data.kredit > 0 ? data.kredit * -1 : data.debet
    }
}

export const generateReportValueByMinusValue = (value) => {
    return value < 0 ? "( " + parseToRupiahText(Math.abs(value)) + " )" : parseToRupiahText(value)
}