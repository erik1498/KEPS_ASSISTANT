import { useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"

const SlipGajiPegawaiPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    return <Wrap
        isLoading={isLoading}>
        <div>
            <PageTitle title="Slip Gaji Pegawai" />
        </div>
    </Wrap>
}
export default SlipGajiPegawaiPage