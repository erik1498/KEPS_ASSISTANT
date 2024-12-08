import { FaSearch, FaTimes } from "react-icons/fa"
import { useState, useEffect } from "react"
import { useDataContext } from "../../../context/dataContext.context"
import { apiFakturPembelianBarangCRUD } from "../../../service/endPointList.api"
import Wrap from "../../../component/layout/Wrap"
import PageTitle from "../../../component/general/PageTitle"
import Pagination from "../../../component/general/Pagination"
import { showError } from "../../../helper/form.helper"
import { parseToRupiahText } from "../../../helper/number.helper"
import { formatDate } from "../../../helper/date.helper"
import { getNormalizedCustomKey, getNormalizedFaktur } from "../../../helper/jurnalUmum.helper"

const LaporanFakturPembelianBarangPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [search, setSearch] = useState("")
    const [searchStatus, setSearchStatus] = useState(true)

    const [laporanFakturPembelianBarang, setLaporanFakturPembelianBarang] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const _getData = (searchParam = "") => {
        if (searchParam == "") {
            setSearch(searchParam)
            setSearchStatus(true)
        }
        setIsLoading(true)
        apiFakturPembelianBarangCRUD
            .custom(`/faktur_report?search=${searchParam}`, "GET")
            .then(resData => {

                let data = getNormalizedCustomKey(resData.data.entry, "supplier_name")

                data = getNormalizedFaktur(data, ["total_retur", "total_pelunasan", "total_beli", "piutang"])
                setLaporanFakturPembelianBarang(data)
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
            <PageTitle title="Laporan Faktur Pembelian Barang" />
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
                            data={laporanFakturPembelianBarang}
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
            {
                laporanFakturPembelianBarang?.map((item, i) => {
                    return <>
                        <div className="flex justify-between my-2 gap-x-2 px-6 py-2 items-start bg-white shadow-xl rounded-md ">
                            <div className="w-full flex flex-col gap-y-2 py-4">
                                <p className="text-md font-bold">{item.parent}</p>
                                <div className="flex flex-col rounded-md overflow-hidden gap-y-2">
                                    <div className="w-full flex font-medium bg-gray-100 p-2 border-t-2">
                                        <p className="flex-1 text-sm">Faktur Pembelian</p>
                                        <p className="flex-1 text-sm">Tanggal Faktur</p>
                                        <p className="flex-1 text-sm">Pembelian</p>
                                        <p className="flex-1 text-sm">Pelunasan</p>
                                        <p className="flex-1 text-sm">Piutang</p>
                                    </div>
                                    {
                                        item.data.map(x => {
                                            return <>
                                                <div className="w-full flex px-2 my-2">
                                                    <p className="flex-1 text-xs">{x.nomor_faktur_pembelian_barang}</p>
                                                    <p className="flex-1 text-xs">{formatDate(x.tanggal)}</p>
                                                    <p className="flex-1 text-xs">{parseToRupiahText(x.total_beli.toFixed(2))}</p>
                                                    <p className="flex-1 text-xs">{parseToRupiahText(x.total_pelunasan.toFixed(2))}</p>
                                                    <p className="flex-1 text-xs">{parseToRupiahText(x.piutang.toFixed(2))}</p>
                                                </div>
                                            </>
                                        })
                                    }
                                    <div className="w-full flex font-medium bg-gray-100 p-2 border-t-2">
                                        <p className="flex-1 font-bold text-xs">Total</p>
                                        <p className="flex-1 text-xs">&nbsp;</p>
                                        <p className="flex-1 text-xs">{parseToRupiahText(item.total_beli.toFixed(2))}</p>
                                        <p className="flex-1 text-xs">{parseToRupiahText(item.total_pelunasan.toFixed(2))}</p>
                                        <p className="flex-1 text-xs">{parseToRupiahText(item.piutang.toFixed(2))}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                })
            }
        </div>
    </Wrap >
}
export default LaporanFakturPembelianBarangPage