import { getSumOfStringValue } from "./number.helper";

export const normalizeDataNeracaSaldo = (data) => {
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

        res({
            totalDebet,
            totalKredit,
            data
        })
    })
}

export const generateNeracaSaldoDataChart = (dataNeracaSaldo) => {
    let labels = dataNeracaSaldo.map(item => {
        return `${item.kode_akun_perkiraan_code} - ${item.kode_akun_perkiraan_name}`
    })

    let labelsPie = []
    let dataPie = []

    dataNeracaSaldo.forEach(item => {
        if (labelsPie.indexOf(item.kode_akun_perkiraan_type) < 0) {
            labelsPie.push(item.kode_akun_perkiraan_type)
        }
    })

    labelsPie.forEach(item => {
        dataPie.push(dataNeracaSaldo.filter(jtem => jtem.kode_akun_perkiraan_type == item).reduce((accumulator, currentValue) => {
            return accumulator + (currentValue.debet - currentValue.kredit)
        }, 0))
    })


    let data = dataNeracaSaldo.map(item => {
        return item.debet - item.kredit
    })

    let bgColor = dataNeracaSaldo.map(item => {
        return item.debet - item.kredit <= 0 ? `rgba(127, 29, 29, 1)` : `rgba(30, 58, 138, 1)`
    })

    return {
        horizontalBarChart: {
            labels,
            datasets: [
                {
                    label: 'Saldo',
                    data,
                    backgroundColor: bgColor
                },
            ],
        },
        pieChart: {
            labels: labelsPie,
            datasets: [
                {
                    label: 'Total Saldo',
                    data: dataPie,
                    backgroundColor: [
                        'rgba(30, 49, 199, 1)',
                        'rgba(33, 112, 227, 1)',
                        'rgba(238, 236, 35, 1)',
                        'rgba(238, 35, 35, 1)',
                        'rgba(255, 35, 255, 1)',
                        'rgba(0, 0, 0, 1)',
                    ],
                    borderWidth: 0,
                },
            ],
        }
    }
}