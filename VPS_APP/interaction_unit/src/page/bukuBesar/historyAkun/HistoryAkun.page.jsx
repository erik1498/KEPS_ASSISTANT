import { useState } from "react"
import Wrap from "../../../component/layout/Wrap"
import { getBulanByIndex, getBulanList } from "../../../helper/date.helper"
import { FaPrint, FaSearch, FaTimes } from "react-icons/fa"
import { useDataContext } from "../../../context/dataContext.context"
import FormSelect from "../../../component/form/FormSelect"
import { apiHistoryAkunR } from "../../../service/endPointList.api"
import { useEffect } from "react"
import { normalizeDataHistoryAkun } from "../../../helper/historyAkun.helper"
import BulanSelectedListCard from "../../../component/card/BulanSelectedListCard"
import HistoryAkunRow from "./component/HistoryAkunRow"
import { initialKodeAkunValue } from "../../../helper/select.helper"
import PageTitle from "../../../component/general/PageTitle"
import { HistoryAkunPrint } from "./component/HistoryAkunPrint"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"

const HistoryAkunPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [bulan, setBulan] = useState(new Date().getMonth())
    const [search, setSearch] = useState("")
    const [balanceStatus, setBalanceStatus] = useState(true)
    const [historyAkun, setHistoryAkun] = useState([])
    const [kodeAkun, setKodeAkun] = useState(initialKodeAkunValue())

    const historyAkunPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => historyAkunPrintRef.current,
    });

    const [isLoading, setIsLoading] = useState(false)

    const _getData = (searchParam = "") => {
        if (searchParam == "") {
            setSearch(searchParam)
        }
        setIsLoading(true)
        apiHistoryAkunR
            .custom(`/${kodeAkun.value}/${bulan + 1}/${data.tahun}?search=${searchParam}`, "GET")
            .then(async (resData) => {
                let normalizedData = await normalizeDataHistoryAkun(resData?.data)

                setBalanceStatus(searchParam.length < 1)
                setHistoryAkun(normalizedData.returnData)

                setIsLoading(false)

            })
            .catch(err => {
                showError(err)
            })
    };

    useEffect(() => {
        if (kodeAkun.value != "") {
            _getData()
        }
    }, [bulan, kodeAkun])

    return <>
        <Wrap
            isLoading={isLoading}>
            <div>
                <PageTitle title={"History Akun"} />
                <div className="bg-white py-3 px-6 mb-3 rounded-md flex justify-between shadow-2xl">
                    <label className="input input-sm input-bordered flex items-center gap-2 bg-white">
                        <input type="text" className="grow bg-transparent" placeholder="Cari" value={search} onChange={e => setSearch(e.target.value)} />
                        {
                            !balanceStatus ?
                                <FaTimes className="cursor-pointer" onClick={() => {
                                    _getData("")
                                }} /> :
                                <FaSearch className="cursor-pointer" onClick={() => _getData(search)} />
                        }
                    </label>
                    <div className="w-[400px]">
                        <FormSelect
                            optionsDataList={data.kodeAkun}
                            optionsLabel={["code", "name"]}
                            optionsValue={"uuid"}
                            optionsLabelIsArray={true}
                            optionsDelimiter={"-"}
                            selectValue={kodeAkun}
                            onchange={(e) => setKodeAkun(e)}
                            selectName={`kodeAkun`}
                            addClass={"w-full"}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-6">
                    <div className="col-span-1">
                        <BulanSelectedListCard
                            bulan={bulan}
                            setBulan={setBulan}
                        />
                        <div className="hidden">
                            <HistoryAkunPrint
                                data={historyAkun}
                                balanceStatus={balanceStatus}
                                ref={historyAkunPrintRef}
                                tahun={data.tahun}
                                bulan={getBulanByIndex(bulan)}
                                kode_akun_perkiraan={kodeAkun.label}
                            />
                        </div>
                        <button
                            onClick={handlePrint}
                            className="btn btn-sm bg-red-600 hover:bg-red-600 text-white border-red-600"
                        >
                            <FaPrint /> Cetak History Akun
                        </button>
                    </div>
                    <div className="col-span-5">
                        <div className="h-[65vh] pl-2">
                            <div className="flex flex-col h-full overflow-y-scroll no-scrollbar w-full rounded-md">
                                {
                                    historyAkun.map((item, i) => {
                                        return <HistoryAkunRow item={item} balanceStatus={balanceStatus} key={i} />
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrap>
    </>
}

export default HistoryAkunPage