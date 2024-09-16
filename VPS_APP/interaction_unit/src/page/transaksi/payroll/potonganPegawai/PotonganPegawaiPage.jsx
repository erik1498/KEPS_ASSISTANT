import { useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"

const PotonganPegawaiPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    return <Wrap
        isLoading={isLoading}>
        <div>
            <PageTitle title="Potongan Pegawai" />
        </div>
    </Wrap>
}
export default PotonganPegawaiPage