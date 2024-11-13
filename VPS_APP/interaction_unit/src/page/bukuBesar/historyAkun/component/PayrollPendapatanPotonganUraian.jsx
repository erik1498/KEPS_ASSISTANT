import { useEffect, useState } from "react"
import PendapatanRowUraian from "../../../transaksi/payroll/pendapatanPegawai/component/PendapatanRowUraian"

const PayrollPendapatanPotonganUraian = ({ item }) => {
    const [data, setData] = useState(null)

    useEffect(() => {
        let { uraian, ...dataState } = item

        const data = JSON.parse(uraian)

        const keys = Object.keys(data)

        for (let i = 0; i < keys.length; i++) {
            const element = keys[i];
            dataState[element] = data[element]
        }

        setData(x => x = dataState)

    }, [])

    return <>
        <PendapatanRowUraian
            data={data}
        />
    </>
}
export default PayrollPendapatanPotonganUraian