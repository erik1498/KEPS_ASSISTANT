import { useEffect, useState } from "react"
import JurnalStokOpnameUraian from "../../../persediaan/opname/jurnalStokOpname/component/JurnalStokOpnameUraian"

const PerintahStokOpnameUraian = ({ item }) => {
    const [data, setData] = useState(null)

    useEffect(() => {
        item.detail_data = JSON.parse(JSON.parse(item.uraian).detail)
        setData(x => x = item)
    }, [])

    return <>
        <JurnalStokOpnameUraian
            data={data}
        />
    </>
}
export default PerintahStokOpnameUraian