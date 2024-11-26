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

const LaporanFakturPembelianBarangPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [laporanFakturPembelianBarang, setLaporanFakturPembelianBarang] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [searchStatus, setSearchStatus] = useState(false)
    const [search, setSearch] = useState("")

    // const DaftarAsetPrintRef = useRef();
    // const handlePrint = useReactToPrint({
    //     content: () => DaftarAsetPrintRef.current,
    // });

    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        count: 118,
        lastPage: 12
    })

    const _getData = (searchParam = "") => {
        if (searchParam == "") {
            setSearch(searchParam)
        }
        setIsLoading(true)
        apiFakturPembelianBarangCRUD
            .custom(`/faktur_report?search=${searchParam}&page=${pagination.page}&size=${pagination.size}`, "GET")
            .then(resData => {
                setSearchStatus(searchParam.length < 1)
                setLaporanFakturPembelianBarang(resData?.data?.entry)
                setPagination(resData?.data?.pagination)
                setIsLoading(false)
            }).catch(err => {
                showError(err)
            })
    }

    const paginateUpdatePage = ({ selected }) => {
        let paginateCopy = pagination
        paginateCopy.page = selected + 1
        setPagination(paginateCopy)
        _getData()
    }

    const setSize = (sizeSelected) => {
        let paginateCopy = pagination
        paginateCopy.size = sizeSelected
        paginateCopy.page = 1
        setPagination(paginateCopy)
        _getData()
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
            <div className="overflow-x-auto bg-white shadow-xl rounded-md h-[50vh] no-scrollbar px-6 pb-4">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className="sticky top-0 bg-white py-4 text-black">
                            <th width={12}>No</th>
                            <th>Tanggal Faktur</th>
                            <th>Bukti Transaksi Faktur</th>
                            <th>Nomor Faktur Pembelian Barang</th>
                            <th>Nomor Pesanan Pembelian Barang</th>
                            <th>Supplier</th>
                            <th>Total Pembelian</th>
                            <th>Total Pelunasan</th>
                            <th>Total Retur</th>
                            <th>Piutang</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            laporanFakturPembelianBarang?.map((item, i) => {
                                return <>
                                    <tr key={i}>
                                        <td>{i + 1}.</td>
                                        <td>{formatDate(item.tanggal)}</td>
                                        <td>{item.bukti_transaksi_faktur}</td>
                                        <td>{item.nomor_faktur_pembelian_barang}</td>
                                        <td>{item.nomor_pesanan_pembelian_barang}</td>
                                        <td>{item.supplier_name} <br /> {item.supplier_code}</td>
                                        <td>Rp. {parseToRupiahText(item.total_beli)}</td>
                                        <td>Rp. {parseToRupiahText(item.total_pelunasan)}</td>
                                        <td>Rp. {parseToRupiahText(item.total_retur)}</td>
                                        <td>Rp. {parseToRupiahText(item.piutang)}</td>
                                    </tr>
                                </>
                            })
                        }
                    </tbody>
                </table>
            </div>
            <Pagination paginateUpdatePage={paginateUpdatePage} paginate={pagination} setSize={setSize} />
        </div>
    </Wrap>
}
export default LaporanFakturPembelianBarangPage