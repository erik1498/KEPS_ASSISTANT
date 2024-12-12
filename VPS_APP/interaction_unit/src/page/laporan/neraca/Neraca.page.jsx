import { useState } from "react"
import { useDataContext } from "../../../context/dataContext.context"
import { apiNeracaCRUD } from "../../../service/endPointList.api"
import Wrap from "../../../component/layout/Wrap"
import PageTitle from "../../../component/general/PageTitle"
import { FaPrint, FaSearch } from "react-icons/fa"
import BulanSelectedListCard from "../../../component/card/BulanSelectedListCard"
import { useEffect } from "react"
import RowCard from "../../../component/card/RowCard"
import AktivaPasivaStatusCard from "../../../component/card/AktivaPasivaStatusCard"
import { showError } from "../../../helper/form.helper"
import { NeracaPrint } from "./component/NeracaPrint"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { getBulanByIndex } from "../../../helper/date.helper"

const NeracaPage = () => {

    const dataContext = useDataContext()
    const { data, setData } = dataContext

    const [isLoading, setIsLoading] = useState(false)
    const [bulan, setBulan] = useState(new Date().getMonth())
    const [neraca, setNeraca] = useState([])
    const [validasiStatus, setValidasiStatus] = useState(false)

    const labaRugiPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => labaRugiPrintRef.current,
    });

    const _getData = () => {
        setIsLoading(true)
        apiNeracaCRUD
            .custom(`/${bulan + 1}/${data.tahun}`, "GET")
            .then((resData) => {

                let dataCopy = data
                dataCopy.dashboard.overview[bulan].neraca = resData?.data
                dataCopy.dashboard.overview[bulan].perubahanModal = null
                setData(dataCopy)

                setNeraca(resData?.data)
                setIsLoading(false)
            }).catch(err => {
                showError(err)
            })
    }

    const _getValidasiStatus = () => {
        setIsLoading(true)
        apiNeracaCRUD
            .custom(`/validasi_status/${bulan + 1}/${data.tahun}`, "GET")
            .then((resData) => {
                setValidasiStatus(resData)
                setIsLoading(false)

                let dataCopy = data
                dataCopy.dashboard.overview[bulan].perubahanModal = null
                setData(dataCopy)

            }).catch(err => {
                showError(err)
            })
    }

    const _validasiOrUnvalidasiNeraca = () => {
        setIsLoading(true)
        apiNeracaCRUD
            .custom(`/validasi`, validasiStatus.validasi ? "DELETE" : "POST", null, {
                data: {
                    bulan: bulan + 1,
                    tahun: data.tahun
                }
            })
            .then((resData) => {

                let dataCopy = data
                dataCopy.dashboard.overview[bulan].perubahanModal = null
                setData(dataCopy)

                _getValidasiStatus()
            }).catch(err => {
                showError(err)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        _getData()
        _getValidasiStatus()
    }, [bulan])

    return <Wrap
        isLoading={isLoading}>
        <div>
            <PageTitle title={"neraca"} />
            <div className="grid grid-cols-6">
                <div className="col-span-1">
                    <BulanSelectedListCard
                        bulan={bulan}
                        setBulan={setBulan}
                    />
                    {
                        Object.keys(neraca).length > 0 ?
                            <AktivaPasivaStatusCard
                                aktiva={neraca.neraca.aktiva}
                                pasiva={neraca.neraca.pasiva}
                            /> : <></>
                    }

                    <div className={`${validasiStatus.validasi ? "bg-blue-900" : "bg-red-900"} text-white mt-4 rounded-md p-5 shadow-2xl`}>
                        <h1 className="text-md font-bold">Neraca {validasiStatus.validasi ? `Telah Di Validasi` : `Belum Di Validasi`}</h1>
                        <button onClick={_validasiOrUnvalidasiNeraca} className="btn btn-sm mt-2">{validasiStatus.validasi ? `Batalkan Validasi` : `Validasi`}</button>
                    </div>

                    <div className="hidden">
                        <NeracaPrint
                            data={neraca}
                            ref={labaRugiPrintRef}
                            bulan={getBulanByIndex(bulan)}
                            tahun={data.tahun}
                        />
                    </div>
                    <button
                        onClick={handlePrint}
                        className="btn btn-sm bg-red-600 hover:bg-red-600 mt-2 text-white border-red-600"
                    >
                        <FaPrint /> Cetak Neraca
                    </button>
                </div>
                <div className="col-span-5">
                    <div className="h-[65vh] pl-2">
                        <div className="flex flex-col h-full overflow-y-scroll no-scrollbar w-full rounded-md">
                            {
                                Object.keys(neraca).length > 0 ?
                                    <>
                                        <RowCard
                                            dataList={neraca.aset_lancar}
                                            title={"Aset Lancar"}
                                            totalTitle={"Total Aset Lancar"}
                                        />
                                        <RowCard
                                            dataList={neraca.aset_tetap}
                                            title={"Aset Tetap"}
                                            totalTitle={"Total Aset Tetap"}
                                        />
                                        <RowCard
                                            dataList={neraca.aset_lain_lain}
                                            title={"Aset Lain - Lain"}
                                            totalTitle={"Total Aset Lain - Lain"}
                                        />
                                        <RowCard
                                            dataList={neraca.kewajiban_lancar}
                                            title={"Kewajiban Lancar"}
                                            totalTitle={"Total Kewajiban Lancar"}
                                        />
                                        <RowCard
                                            dataList={neraca.kewajiban_jangka_panjang}
                                            title={"Kewajiban Lancar"}
                                            totalTitle={"Total Kewajiban Lancar"}
                                        />
                                        <RowCard
                                            dataList={neraca.kewajiban_lain_lain}
                                            title={"Kewajiban Lain - Lain"}
                                            totalTitle={"Total Kewajiban Lain - Lain"}
                                        />
                                        <RowCard
                                            dataList={neraca.ekuitas}
                                            title={"Ekuitas"}
                                            totalTitle={"Total Ekuitas"}
                                        />
                                    </>
                                    :
                                    <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Wrap>
}

export default NeracaPage;