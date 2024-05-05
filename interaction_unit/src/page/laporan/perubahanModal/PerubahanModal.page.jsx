import { useState } from "react"
import Wrap from "../../../component/layout/Wrap"
import PageTitle from "../../../component/general/PageTitle"
import { useEffect } from "react"
import { apiPerubahanModal } from "../../../service/endPointList.api"
import { useDataContext } from "../../../context/dataContext.context"
import PerubahanModalRow from "./component/PerubahanModalRow"

const PerubahanModalPage = () => {
    const dataContext = useDataContext()
    const { data } = dataContext

    const [isLoading, setIsLoading] = useState(false)
    const [perubahanModal, setPerubahanModal] = useState([])

    const _getData = () => {
        setIsLoading(true)
        apiPerubahanModal
            .custom(`/${data.tahun}`, "GET")
            .then((resData) => {
                setIsLoading(false)
                // console.log(resData)
                // let generatedChartData = generatePerubahanModalDataChart(resData?.data)
                setPerubahanModal(resData.data)
            }).catch(err => {
                showError(err)
            })
    }

    useEffect(() => {
        _getData()
    }, [])
    return <Wrap
        isLoading={isLoading}
    >
        <div>
            <PageTitle title="Perubahan Modal" />
            <div className="h-[65vh] pl-2">
                <div className="flex flex-col h-full overflow-y-scroll no-scrollbar w-full rounded-md">
                    {
                        perubahanModal.map((item) => {
                            return <PerubahanModalRow
                                dataList={item}
                                title={item.bulan}
                                totalTitle={"Total Ekuitas"}
                            />
                        })
                    }
                </div>
            </div>
        </div>
    </Wrap>
}
export default PerubahanModalPage