import { FaSearch, FaTimes } from "react-icons/fa"
import { useState } from "react"
import { useEffect } from "react"
import { useDataContext } from "../../../context/dataContext.context"
import { apiStokAwalBarangCRUD } from "../../../service/endPointList.api"
import { showError } from "../../../helper/form.helper"
import Wrap from "../../../component/layout/Wrap"
import PageTitle from "../../../component/general/PageTitle"
import Pagination from "../../../component/general/Pagination"
import BulanSelectedListCard from "../../../component/card/BulanSelectedListCard"

const LaporanStokBarangPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext
    const [bulan, setBulan] = useState(new Date().getMonth())

    const [stokAwalBarang, setStokAwalBarang] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [searchStatus, setSearchStatus] = useState(false)
    const [search, setSearch] = useState("")

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
        apiStokAwalBarangCRUD
            .custom(`/report/${(bulan + 1).toString().padStart(2, "0")}/${data.tahun}?search=${searchParam}&page=${pagination.page}&size=${pagination.size}`, "GET")
            .then(resData => {
                setSearchStatus(searchParam.length < 1)
                setStokAwalBarang(resData?.data?.entry)
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
    }, [bulan])

    return <Wrap
        isLoading={isLoading}>
        <div>
            <PageTitle title="Laporan Stok Barang" />
            <div className="grid grid-cols-12 gap-x-4">
                <div className="col-span-2">
                    <BulanSelectedListCard
                        bulan={bulan}
                        setBulan={setBulan}
                    />
                </div>
                <div className="col-span-10">
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
                    </div>
                    <div className="overflow-x-auto bg-white shadow-xl rounded-md h-[50vh] no-scrollbar px-6 pb-4">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr className="sticky top-0 bg-white py-4 text-black">
                                    <th width={12}>No</th>
                                    <th>Nama Daftar Barang</th>
                                    <th>Kode Barang</th>
                                    <th>Satuan Barang</th>
                                    <th>Gudang</th>
                                    <th>Stok Penyesuaian Persediaan Bulan Lalu</th>
                                    <th>Konversi Keluar</th>
                                    <th>Konversi Masuk</th>
                                    <th>Transfer Keluar</th>
                                    <th>Transfer Masuk</th>
                                    <th>Pembelian</th>
                                    <th>Retur Pembelian</th>
                                    <th>Penjualan</th>
                                    <th>Retur Penjualan</th>
                                    <th>Stok Sistem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    stokAwalBarang?.map((item, i) => {
                                        return <>
                                            <tr key={i}>
                                                <td>{i + 1}.</td>
                                                <td>{item.daftar_barang_name}</td>
                                                <td>{item.kategori_harga_barang_kode_barang}</td>
                                                <td>{item.satuan_barang_name}</td>
                                                <td>{item.daftar_gudang_name}</td>
                                                <td>{item.stok_penyesuaian_persediaan_bulan_lalu}</td>
                                                <td>{item.konversi_keluar}</td>
                                                <td>{item.konversi_masuk}</td>
                                                <td>{item.transfer_keluar}</td>
                                                <td>{item.transfer_masuk}</td>
                                                <td>{item.pembelian}</td>
                                                <td>{item.retur_pembelian}</td>
                                                <td>{item.penjualan}</td>
                                                <td>{item.retur_penjualan}</td>
                                                <td>{item.stok_sistem}</td>
                                            </tr>
                                        </>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <Pagination paginateUpdatePage={paginateUpdatePage} paginate={pagination} setSize={setSize} />
                </div>
            </div>
        </div>
    </Wrap>
}
export default LaporanStokBarangPage