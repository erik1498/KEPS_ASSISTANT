import { useEffect, useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"
import BulanSelectedListCard from "../../../../component/card/BulanSelectedListCard"
import DebetKreditStatusCard from "../../../../component/card/DebetKreditStatusCard"
import { useDataContext } from "../../../../context/dataContext.context"
import { apiHitunganPenyusutanCRUD } from "../../../../service/endPointList.api"
import { showError } from "../../../../helper/form.helper"
import { normalizeDataJurnalPerintahStokOpname, normalizeDataJurnalUmum } from "../../../../helper/jurnalUmum.helper"
import JurnalPenyusutanRow from "./component/JurnalPenyusutanRow"

const JurnalPenyusutanPage = () => {

    const dataContext = useDataContext()

    const { data } = dataContext

    const [isLoading, setIsLoading] = useState(false)
    const [bulan, setBulan] = useState(new Date().getMonth())

    const [balanceStatus, setBalanceStatus] = useState(true)

    const [debet, setDebet] = useState(0)
    const [kredit, setKredit] = useState(0)

    const [jurnal, setJurnal] = useState([])

    const _getData = () => {
        setIsLoading(true)
        apiHitunganPenyusutanCRUD
            .custom(`/jurnal/${bulan + 1}/${data.tahun}`, "GET")
            .then(async (resData) => {

                const fixedData = normalizeDataJurnalPerintahStokOpname(resData.data)
                
                const normalizedData = await normalizeDataJurnalUmum(fixedData)

                setJurnal(normalizedData.returnData)
                setDebet(normalizedData.totalDebet)
                setKredit(normalizedData.totalKredit)

                setIsLoading(false)

            }).catch(err => showError(err))
    }

    useEffect(() => {
        _getData()
    }, [bulan])

    return <Wrap
        isLoading={isLoading}>
        <div>
            <PageTitle title="Jurnal Penyusutan" />
            <div className="bg-white rounded-md shadow-2xl h-max px-6 py-5">
            </div>
            <div className="grid grid-cols-6 mt-5">
                <div className="col-span-1">
                    <BulanSelectedListCard
                        bulan={bulan}
                        setBulan={setBulan}
                    />
                    {
                        balanceStatus ?
                            <DebetKreditStatusCard
                                debet={debet}
                                kredit={kredit}
                            /> : <></>
                    }
                </div>
                <div className="col-span-5">
                    <div className="h-[65vh] pl-2">
                        <div className="flex flex-col h-full overflow-y-scroll no-scrollbar w-full rounded-md">
                            {
                                jurnal.map((item, i) => {
                                    return <JurnalPenyusutanRow
                                        item={item}
                                        forPrint={false}
                                    />
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Wrap>
}
export default JurnalPenyusutanPage