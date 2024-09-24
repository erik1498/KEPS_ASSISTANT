import { useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"

const PembelianBarangPage = () => {
    const [isLoading, setIsLoading] = useState(false)

    return <Wrap
        isLoading={isLoading}
    >
        <div>
            <PageTitle title="Pembelian Barang" />
        </div>
    </Wrap>
}
export default PembelianBarangPage