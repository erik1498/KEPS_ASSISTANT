import { useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"

const PenjualanJasaPage = () => {
    const [isLoading, setIsLoading] = useState(false)

    return <Wrap
        isLoading={isLoading}
    >
        <div>
            <PageTitle title="Penjualan Jasa" />
        </div>
    </Wrap>
}
export default PenjualanJasaPage