import { useState } from "react"
import { useDataContext } from "../../../context/dataContext.context"
import Wrap from "../../../component/layout/Wrap"
import PageTitle from "../../../component/general/PageTitle"
import { useEffect } from "react"
import BulanSelectedListCard from "../../../component/card/BulanSelectedListCard"
import { apiNeracaSaldoR } from "../../../service/endPointList.api"
import DebetKreditStatusCard from "../../../component/card/DebetKreditStatusCard"
import { normalizeDataNeracaSaldo } from "../../../helper/neracaSaldo.helper"
import NeracaSaldoRow from "./component/NeracaSaldoRow"
import { NeracaSaldoPrint } from "./component/NeracaSaldoPrint"
import { useReactToPrint } from "react-to-print"
import { useRef } from "react"
import { FaPrint } from "react-icons/fa"

const NeracaSaldoPage = () => {

    const dataContext = useDataContext()
    const { data, setData } = dataContext

    const [bulan, setBulan] = useState(new Date().getMonth())
    const [neracaSaldo, setNeracaSaldo] = useState([])
    const [debet, setDebet] = useState(0)
    const [kredit, setKredit] = useState(0)

    const [isLoading, setIsLoading] = useState(false)

    const neracaSaldoPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => neracaSaldoPrintRef.current,
    });

    const _getData = () => {
        setIsLoading(true)
        apiNeracaSaldoR
            .custom(`/${bulan + 1}/${data.tahun}`, "GET")
            .then(async (resData) => {

                let dataCopy = data
                dataCopy.dashboard.overview[bulan].neracaSaldo = resData?.data
                setData(dataCopy)

                let normalizeData = await normalizeDataNeracaSaldo(resData.data)
                setNeracaSaldo(normalizeData.data)
                setDebet(normalizeData.totalDebet)
                setKredit(normalizeData.totalKredit)
                setIsLoading(false)
            })
            .catch(err => {
                showError(err)
            })
    };

    useEffect(() => {
        _getData()
    }, [bulan])

    return <Wrap
        isLoading={isLoading}>
        <div>
            <PageTitle title={"Neraca Saldo"} />
            <div className="grid grid-cols-6">
                <div className="col-span-1">
                    <BulanSelectedListCard
                        bulan={bulan}
                        setBulan={setBulan}
                    />
                    <DebetKreditStatusCard
                        debet={debet}
                        kredit={kredit}
                    />
                    <div className="hidden">
                        <NeracaSaldoPrint
                            data={neracaSaldo}
                            ref={neracaSaldoPrintRef}
                        />
                    </div>
                    <button
                        onClick={handlePrint}
                        className="btn btn-sm bg-red-600 hover:bg-red-600 mt-2 text-white border-red-600"
                    >
                        <FaPrint /> Cetak Neraca Saldo
                    </button>
                </div>
                <div className="col-span-5">
                    <div className="h-[65vh] pl-2">
                        <div className="flex flex-col h-full overflow-y-scroll no-scrollbar w-full rounded-md">
                            {
                                neracaSaldo.length > 0 ? <div className="flex flex-col w-full bg-white text-[13px] px-3 pb-3 shadow-md">
                                    {
                                        neracaSaldo.length > 0 ? <div className="grid grid-cols-12 bg-white col-span-12 items-end py-4 sticky top-0">
                                            <div className="col-span-4 text-gray-900 font-bold flex flex-col px-2">
                                                <h1 className="text-2xl">Kode Akun Perkiraan</h1>
                                            </div>
                                            <div className="px-2 col-span-4 text-gray-900 font-bold">
                                                <h1 className="text-2xl">Debet</h1>
                                            </div>
                                            <div className="px-2 col-span-4 text-gray-900 font-bold">
                                                <h1 className="text-2xl">Kredit</h1>
                                            </div>
                                        </div> : <></>
                                    }
                                    {
                                        neracaSaldo.length > 0 ? neracaSaldo.map((item, i) => {
                                            return <NeracaSaldoRow item={item} />
                                        }) : <></>
                                    }
                                </div> : <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Wrap>
}

export default NeracaSaldoPage