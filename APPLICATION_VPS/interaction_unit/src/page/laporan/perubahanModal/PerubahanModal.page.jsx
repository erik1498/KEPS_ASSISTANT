import { useState } from "react"
import Wrap from "../../../component/layout/Wrap"
import PageTitle from "../../../component/general/PageTitle"
import { useEffect } from "react"
import { apiPerubahanModal } from "../../../service/endPointList.api"
import { useDataContext } from "../../../context/dataContext.context"
import PerubahanModalRow from "./component/PerubahanModalRow"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { PerubahanModalPrint } from "./component/PerubahanModalPrint"
import { FaPrint } from "react-icons/fa"

const PerubahanModalPage = () => {
    const dataContext = useDataContext()
    const { data } = dataContext

    const [isLoading, setIsLoading] = useState(false)
    const [perubahanModal, setPerubahanModal] = useState([])

    const perubahanModalRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => perubahanModalRef.current,
    });

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
            <div className="flex justify-between items-center">
                <PageTitle title="Perubahan Modal" />
                <div className="hidden">
                    <PerubahanModalPrint
                        data={perubahanModal}
                        ref={perubahanModalRef}
                        tahun={data.tahun}
                    />
                </div>
                <button
                    onClick={handlePrint}
                    className="btn btn-sm bg-red-600 hover:bg-red-600 mt-2 text-white border-red-600"
                >
                    <FaPrint /> Cetak Perubahan Modal
                </button>
            </div>
            <div className="h-[65vh]">
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