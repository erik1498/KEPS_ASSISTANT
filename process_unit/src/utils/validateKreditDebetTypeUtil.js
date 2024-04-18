import { AKUN_DEBET_PLUS } from "../constant/akuntansiConstant.js";
import { parseToRupiahText } from "./numberParsingUtil.js"

export const PENDAPATAN_MINUS_KODE_AKUN = [];

export const HARGA_POKOK_PENJUALAN_MINUS_KODE_AKUN = [];

export const BEBAN_OPERASIONAL_MINUS_KODE_AKUN = [];

export const PENDAPATAN_LAIN_LAIN_MINUS_KODE_AKUN = [];

export const BEBAN_LAINNYA_MINUS_KODE_AKUN = []

export const ASSET_MINUS_KODE_AKUN = []

export const UTANG_MINUS_KODE_AKUN = []

export const MODAL_MINUS_KODE_AKUN = ["302"]

export const generateReportValue = (data) => {
    return data.kredit > 0 ? "( " + parseToRupiahText(data.kredit) + " )" : parseToRupiahText(data.debet)
}

export const generateCountValue = (data) => {
        return data.kredit > 0 ? data.kredit * -1 : data.debet
}

export const generateReportValueByMinusValue = (value) => {
    return value < 0 ? "( " + parseToRupiahText(Math.abs(value)) + " )" : parseToRupiahText(value)
}

export const convertByPlusMinusValue = (data) => {
    if (AKUN_DEBET_PLUS.indexOf(data.kode_akun_perkiraan_type) < 0) {
        let kredit = data.kredit
        data.kredit = data.debet
        data.debet = kredit
    }
    return data
}