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
            <div className="overflow-x-auto bg-white shadow-xl rounded-md h-[50vh] no-scrollbar">
                <table className="table table-sm">
                    <tbody>
                        {
                            laporanFakturPembelianBarang?.map((item, i) => {
                                return <>
                                    <tr key={i} className="bg-gray-200 uppercase font-bold">
                                        <td>{item.parent}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>FAKTUR PEMBELIAN</td>
                                        <td>TANGGAL FAKTUR</td>
                                        <td>PEMBELIAN</td>
                                        <td>PELUNASAN</td>
                                        <td>HUTANG</td>
                                    </tr>
                                    {
                                        item.data.map(x => {
                                            return <tr key={i}>
                                                <td></td>
                                                <td>{x.nomor_faktur_pembelian_barang}</td>
                                                <td>{formatDate(x.tanggal)}</td>
                                                <td>{parseToRupiahText(x.total_beli.toFixed(2))}</td>
                                                <td>{parseToRupiahText(x.total_pelunasan.toFixed(2))}</td>
                                                <td>{parseToRupiahText(x.piutang.toFixed(2))}</td>
                                            </tr>
                                        })
                                    }
                                    <tr className="font-bold">
                                        <td></td>
                                        <td>TOTAL</td>
                                        <td></td>
                                        <td>{parseToRupiahText(item.total_beli.toFixed(2))}</td>
                                        <td>{parseToRupiahText(item.total_pelunasan.toFixed(2))}</td>
                                        <td>{parseToRupiahText(item.piutang.toFixed(2))}</td>
                                    </tr>
                                </>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </Wrap >
}
export default LaporanFakturPembelianBarangPage