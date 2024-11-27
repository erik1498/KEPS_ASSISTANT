import { FaSearch, FaTimes } from "react-icons/fa"
import { useState, useEffect } from "react"
import { useDataContext } from "../../../context/dataContext.context"
import { apiFakturPenjualanBarangCRUD } from "../../../service/endPointList.api"
import Wrap from "../../../component/layout/Wrap"
import PageTitle from "../../../component/general/PageTitle"
import Pagination from "../../../component/general/Pagination"
import { showError } from "../../../helper/form.helper"
import { parseToRupiahText } from "../../../helper/number.helper"
import { formatDate } from "../../../helper/date.helper"
import { getNormalizedCustomKey, getNormalizedFaktur } from "../../../helper/jurnalUmum.helper"

const LaporanFakturPenjualanBarangPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [search, setSearch] = useState("")
    const [searchStatus, setSearchStatus] = useState(true)

    const [laporanFakturPenjualanBarang, setLaporanFakturPenjualanBarang] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const _getData = (searchParam = "") => {
        if (searchParam == "") {
            setSearch(searchParam)
            setSearchStatus(true)
        }
        setIsLoading(true)
        apiFakturPenjualanBarangCRUD
            .custom(`/faktur_report?search=${searchParam}`, "GET")
            .then(resData => {

                let data = getNormalizedCustomKey(resData.data.entry, "customer_name")

                data = getNormalizedFaktur(data, ["total_retur", "total_pelunasan", "total_beli", "piutang"])
                setLaporanFakturPenjualanBarang(data)
                setIsLoading(false)
            }).catch(err => {
                showError(err)
            })
    }

    useEffect(() => {
        _getData()
    }, [])

    return <Wrap
        isLoading={isLoading}>
        <div>
            <PageTitle title="Laporan Faktur Penjualan Barang" />
            <div className="bg-white py-3 px-6 mb-3 rounded-md flex justify-between shadow-2xl">
                <label className="input input-sm input-bordered flex items-center gap-2 bg-white">
                    <input type="text" className="grow bg-transparent" placeholder="Cari" value={search} onChange={(e) => setSearch(e.target.value)} />
                    {
                        searchStatus ?
                            <FaSearch onClick={() => { _getData(search) }} className="cursor-pointer" />
                            :
                            <FaTimes onClick={() => _getData("")} className="cursor-pointer" />
                    }
                </label>
                <div className="flex gap-x-2 items-center">
                    {/* <div className="hidden">
                        <DaftarAsetPrint
                            data={laporanFakturPenjualanBarang}
                            ref={DaftarAsetPrintRef}
                            bulan={getBulanByIndex(new Date().getMonth())}
                            tahun={data.tahun}
                        />
                    </div>
                    <button
                        onClick={handlePrint}
                        className="btn btn-sm bg-red-600 hover:bg-red-600 text-white border-red-600"
                    >
                        <FaPrint /> Cetak Daftar Aset
                    </button> */}
                </div>
            </div>
            <div className="text-xs bg-white rounded-md px-6 py-3">
                {
                    laporanFakturPenjualanBarang.map((x, i) => {
                        return <>
                            <p className="font-bold sticky top-0 z-20 mt-4">{x.parent}</p>
                            <div className="flex flex-col">
                                <div className="font-medium px-10 my-4">
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-3">
                                            <p className="border-b-2 py-2 border-black mx-4">No. Faktur Penjualan Barang</p>
                                        </div>
                                        <div className="col-span-3">
                                            <p className="border-b-2 py-2 border-black mx-4">Tanggal Faktur</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="border-b-2 py-2 border-black mx-4">Total Penjualan</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="border-b-2 py-2 border-black mx-4">Sudah Dibayar</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="border-b-2 py-2 border-black mx-4">Piutang</p>
                                        </div>
                                    </div>
                                    {
                                        x.data.map((y, j) => {
                                            return <>
                                                <div className="grid grid-cols-12 my-4">
                                                    <div className="col-span-3">
                                                        <p className="mx-4">{y.nomor_faktur_penjualan_barang}</p>
                                                    </div>
                                                    <div className="col-span-3">
                                                        <p className="mx-4">{formatDate(y.tanggal)}</p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <p className="mx-4">{parseToRupiahText(y.total_beli.toFixed(2))}</p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <p className="mx-4">{parseToRupiahText(y.total_pelunasan.toFixed(2))}</p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <p className="mx-4">{parseToRupiahText(y.piutang.toFixed(2))}</p>
                                                    </div>
                                                </div>
                                            </>
                                        })
                                    }
                                    <div className="grid grid-cols-12 my-3">
                                        <div className="col-span-3">
                                            <p className="mx-4"></p>
                                        </div>
                                        <div className="col-span-3">
                                            <p className="mx-4"></p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="border-t-2 py-2 border-black mx-4">{parseToRupiahText(x.total_beli.toFixed(2))}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="border-t-2 py-2 border-black mx-4">{parseToRupiahText(x.total_pelunasan.toFixed(2))}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="border-t-2 py-2 border-black mx-4">{parseToRupiahText(x.piutang.toFixed(2))}</p>
                                        </div>
                                    </div>
                                </div>
                            </div >
                        </>
                    })
                }
            </div >
        </div>
    </Wrap >
}
export default LaporanFakturPenjualanBarangPage