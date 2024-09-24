import { useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"

const PenjualanBarangPage = () => {
    const [isLoading, setIsLoading] = useState(false)

    return <Wrap
        isLoading={isLoading}
    >
        <div>
            <PageTitle title="Penjualan Barang" />
        </div>
    </Wrap>
}
export default PenjualanBarangPage