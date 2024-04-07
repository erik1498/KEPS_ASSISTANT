import { myDays } from "./date.helper";

export const normalizeDataHistoryAkun = (data) => {
    return new Promise((res, rej) => {
        let totalDebet = 0;
        let totalKredit = 0;
        let returnData = []

        let tanggal = "00";

        let totalDebetTanggal = 0;
        let totalKreditTanggal = 0;

        data.map(i => {

            totalDebet += parseFloat(i.debet)
            totalKredit += parseFloat(i.kredit)

            if (i.tanggal != tanggal) {
                tanggal = i.tanggal
                returnData[`${parseInt(tanggal)}`] = {
                    total: {
                        kredit: 0,
                        debet: 0
                    },
                    dataList: data.filter(j => j.tanggal == tanggal),
                    tanggal: i.tanggal,
                    bulan: i.bulan,
                    tahun: i.tahun,
                    hari: myDays[new Date(`${i.tahun}-${i.bulan}-${tanggal}`).getDay()]
                }

                totalDebetTanggal = 0
                totalKreditTanggal = 0
            }

            totalDebetTanggal += parseFloat(i.debet)
            totalKreditTanggal += parseFloat(i.kredit)

            returnData[`${parseInt(tanggal)}`].total = {
                debet: totalDebetTanggal,
                kredit: totalKreditTanggal
            }

        })

        res({
            totalDebet, totalKredit, returnData
        })
    })
}