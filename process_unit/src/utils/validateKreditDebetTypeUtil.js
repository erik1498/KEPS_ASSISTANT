import { AKUN_DEBET_PLUS, ASSET_MINUS_KODE_AKUN, BEBAN_LAINNYA_MINUS_KODE_AKUN, BEBAN_OPERASIONAL_MINUS_KODE_AKUN, HARGA_POKOK_PENJUALAN_MINUS_KODE_AKUN, MODAL_MINUS_KODE_AKUN, PENDAPATAN_LAIN_LAIN_MINUS_KODE_AKUN, PENDAPATAN_MINUS_KODE_AKUN, UTANG_MINUS_KODE_AKUN } from "../constant/akuntansiConstant.js";
import { parseToRupiahText } from "./numberParsingUtil.js"

export const minusTypeCode = (data) => {
    if (
        PENDAPATAN_MINUS_KODE_AKUN
        .concat(
            HARGA_POKOK_PENJUALAN_MINUS_KODE_AKUN,
            BEBAN_OPERASIONAL_MINUS_KODE_AKUN,
            PENDAPATAN_LAIN_LAIN_MINUS_KODE_AKUN,
            BEBAN_LAINNYA_MINUS_KODE_AKUN,
            ASSET_MINUS_KODE_AKUN,
            UTANG_MINUS_KODE_AKUN,
            MODAL_MINUS_KODE_AKUN
        )
        .indexOf(data.kode_akun_perkiraan_code) >= 0) {
        let debet = data.debet
        data.debet = data.kredit
        data.kredit = debet
    }
    return data
}

export const generateReportValue = (data) => {
    return data.kredit > 0 ? "( " + parseToRupiahText(data.kredit) + " )" : parseToRupiahText(data.debet)
}

export const generateCountValue = (data) => {
    return data.kredit > 0 ? data.kredit * -1 : data.debet
}

export const generateReportValueByMinusValue = (value) => {
    return value < 0 ? "( " + parseToRupiahText(value.toString().replaceAll("-", "")) + " )" : parseToRupiahText(value)
}

export const convertByPlusMinusValue = (data) => {
    if (AKUN_DEBET_PLUS.indexOf(data.kode_akun_perkiraan_type) < 0) {
        let kredit = data.kredit
        data.kredit = data.debet
        data.debet = kredit
    }
    return data
}