import { useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"

const PendapatanPegawaiPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    return <Wrap
        isLoading={isLoading}>
        <div>
            <PageTitle title="Pendapatan Pegawai" />
        </div>
    </Wrap>
}
export default PendapatanPegawaiPage