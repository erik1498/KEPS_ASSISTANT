import { myDays } from "./date.helper";
import { getSumOfStringValue } from "./number.helper";

export const normalizeDataHistoryAkun = (data) => {
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

        let totalDebetTanggal = [];
        let totalKreditTanggal = [];

        data.map(i => {

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

                totalDebetTanggal = []
                totalKreditTanggal = []
            }

            // totalDebetTanggal += parseFloat(i.debet)
            totalDebetTanggal.push(i.debet)
            totalKreditTanggal.push(i.kredit)

            returnData[`${parseInt(tanggal)}`].total = {
                debet: getSumOfStringValue(totalDebetTanggal),
                kredit: getSumOfStringValue(totalKreditTanggal)
            }

        })

        res({
            totalDebet, totalKredit, returnData
        })
    })
}