import { getSumMinusOfStringValue, getSumOfStringValue } from "./mathUtil.js";

export const getHistoryAkunReport = async (data) => {
    return new Promise(async (resolve) => {
        let saldoDebet = 0.0
        let result = []
        for (let i = 0; i < data.length; i++) {
            saldoDebet = getSumOfStringValue([saldoDebet, getSumMinusOfStringValue([data[i].debet, data[i].kredit])])
            result.push({
                ...data[i],
                saldoDebet
            })
        }
        let history = []
        for (let i = 0; i < result.length; i++) {
            history.push({
                ...result[i],
                saldoDebet: result[i].saldoDebet >= 0 ? result[i].saldoDebet : 0,
                saldoKredit: result[i].saldoDebet < 0 ? Math.abs(result[i].saldoDebet) : 0,
            })
        }
        resolve(history);
    });
}


export const selectedJurnalUmumByKodeAkunCode = async (data, code) => {
    return new Promise(async (resolve) => {
        let jurnalUmumSelected = data.filter((item) => {
            return item.kode_akun == code
        })
        resolve(jurnalUmumSelected)
    })
}