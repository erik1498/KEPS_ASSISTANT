import { useState } from "react"
import { useDataContext } from "../../../context/dataContext.context"
import { apiNeracaCRUD } from "../../../service/endPointList.api"
import Wrap from "../../../component/layout/Wrap"
import PageTitle from "../../../component/general/PageTitle"
import { FaSearch } from "react-icons/fa"
import BulanSelectedListCard from "../../../component/card/BulanSelectedListCard"
import { useEffect } from "react"
import RowCard from "../../../component/card/RowCard"
import AktivaPasivaStatusCard from "../../../component/card/AktivaPasivaStatusCard"

const NeracaPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [isLoading, setIsLoading] = useState(false)
    const [bulan, setBulan] = useState(new Date().getMonth())
    const [neraca, setNeraca] = useState([])
    const [validasiStatus, setValidasiStatus] = useState(false)

    const _getData = () => {
        setIsLoading(true)
        apiNeracaCRUD
            .custom(`/${bulan + 1}/${data.tahun}`, "GET")
            .then((resData) => {
                setNeraca(resData?.data)
                setIsLoading(false)
            }).catch(err => {
                console.log(err)
            })
    }

    const _getValidasiStatus = () => {
        setIsLoading(true)
        apiNeracaCRUD
            .custom(`/validasi_status/${bulan + 1}/${data.tahun}`, "GET")
            .then((resData) => {
                setValidasiStatus(resData)
                setIsLoading(false)
            }).catch(err => {
                console.log(err)
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
            .then((data) => {
                console.log(data)
                _getValidasiStatus()
            }).catch(err => {
                console.log(err)
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
                </div>
                <div className="col-span-5">
                    <div className="h-[65vh] pl-2">
                        <div className="flex flex-col h-full overflow-y-scroll no-scrollbar w-full rounded-md">
                            {
                                Object.keys(neraca).length > 0 ?
                                    <>
                                        <RowCard
                                            dataList={neraca.harta}
                                            title={"Aset"}
                                            totalTitle={"Total Asset"}
                                        />
                                        <RowCard
                                            dataList={neraca.utang}
                                            title={"Kewajiban"}
                                            totalTitle={"Total Kewajiban"}
                                        />
                                        <RowCard
                                            dataList={neraca.modal}
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