import { parseToRupiahText } from "./numberParsingUtil.js"

export const renderDataNeracaSaldo = (data) => {
    return new Promise((res, rej) => {
        let dataReturn = []
        if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                dataReturn.push({
                    html: `
                        <td style="padding: 10px;">${data[index].kode_akun_perkiraan_name}</td>
                        <td style="padding: 10px;">${data[index].kode_akun_perkiraan_code}</td>
                        <td style="padding: 10px;">${parseToRupiahText(data[index].debet)}</td>
                        <td style="padding: 10px;">${parseToRupiahText(data[index].kredit)}</td>
                    `
                })
            }
        }
        res({
            table_content: dataReturn
        })
    })
}

export const convertJurnalUmumToNeracaSaldo = (data) => {
    return new Promise((resolve) => {
        let returnData = []
        for (let i = 0; i < data.length; i++) {
            returnData.push(
                {
                    kode_akun_perkiraan_code: data[i].kode_akun,
                    kode_akun_perkiraan_name: data[i].nama_akun,
                    kode_akun_perkiraan_type: data[i].type_akun,
                    sum_result: parseFloat(data[i].debet) - parseFloat(data[i].kredit)
                }
            )
        }
        resolve(returnData)
    })
}

export const getNeracaSaldoReport = (data) => {
    return new Promise((res, rej) => {
        let result = []
        for (let i = 0; i < data.length; i++) {
            result.push({
                kode_akun_perkiraan_name: data[i].kode_akun_perkiraan_name,
                kode_akun_perkiraan_code: data[i].kode_akun_perkiraan_code,
                kode_akun_perkiraan_type: data[i].kode_akun_perkiraan_type,
                debet: parseFloat(data[i].sum_result) >= 0 ? data[i].sum_result : 0,
                kredit: parseFloat(data[i].sum_result) < 0 ? Math.abs(data[i].sum_result).toFixed(2).toString().split(".")[1] == "00" ? Math.abs(data[i].sum_result) : Math.abs(data[i].sum_result).toFixed(2) : 0,
            })
        }
        res(result.sort((a, b) => {
            const key = "kode_akun_perkiraan_code";
            const x = a[key]; const y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }))
    })
}