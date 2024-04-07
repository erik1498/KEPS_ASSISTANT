import { useState } from "react"
import Wrap from "../../../component/layout/Wrap"
import PageTitle from "../../../component/general/PageTitle"
import PerubahanModalChart from "./component/PerubahanModalChart"
import { useEffect } from "react"
import { apiPerubahanModal } from "../../../service/endPointList.api"
import { useDataContext } from "../../../context/dataContext.context"
import { generatePerubahanModalDataChart } from "../../../helper/perubahanModal.helper"
import RowCard from "../../../component/card/RowCard"
import { getBulanByIndex } from "../../../helper/date.helper"
import { parseToRupiahText } from "../../../helper/number.helper"

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
                console.log(err)
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
            <div className="h-[50vh] w-full inline-block relative bg-white rounded-md py-2 px-3">
                <div className="flex flex-col h-full overflow-y-scroll no-scrollbar w-full rounded-md">
                    {
                        perubahanModal.length > 0 ? <div className="flex flex-col w-full bg-white text-[13px] px-3 pb-3">
                            {
                                perubahanModal.length > 0 ? <div className="grid grid-cols-12 bg-white col-span-12 items-end py-4 sticky top-0">
                                    <div className="col-span-6 text-gray-900 font-bold flex flex-col px-2">
                                        <h1 className="text-xl">Bulan</h1>
                                    </div>
                                    <div className="px-2 col-span-6 text-gray-900 font-bold">
                                        <h1 className="text-xl">Nilai</h1>
                                    </div>
                                </div> : <></>
                            }
                            {
                                perubahanModal.length > 0 ? perubahanModal.map((item, i) => {
                                    return <>
                                        <hr />
                                        <div className="grid grid-cols-12 items-start py-1">
                                            <div className="col-span-6 text-gray-900 px-2">
                                                <p>{getBulanByIndex(i)}</p>
                                            </div>
                                            <div className="col-span-6 px-2 font-bold">
                                                <p>{item != null ? item : "Belum Divalidasi"}</p>
                                            </div>
                                        </div>
                                    </>
                                }) : <></>
                            }
                        </div> : <></>
                    }
                </div>
            </div>
        </div>
    </Wrap>
}
export default PerubahanModalPage