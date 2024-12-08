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
import ToggleBox from "../../../component/general/ToggleBox"
import { getBulanListForFormSelect } from "../../../helper/date.helper"

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
            <div className="bg-white py-4 px-6 mb-3 flex-col rounded-md justify-between shadow-2xl">
                <ToggleBox
                    label="Bulan"
                    labelTextSize="text-sm"
                    toggleBox={bulan}
                    textSize="text-xs"
                    setToggleBox={setBulan}
                    toggleBoxList={getBulanListForFormSelect()}
                />
                <label className="input input-sm w-max input-bordered flex items-center gap-2 bg-white">
                    <input type="text" className="grow bg-transparent" placeholder="Cari" value={search} onChange={(e) => setSearch(e.target.value)} />
                    {
                        searchStatus ?
                            <FaSearch onClick={() => { _getData(search) }} className="cursor-pointer" />
                            :
                            <FaTimes onClick={() => _getData("")} className="cursor-pointer" />
                    }
                </label>
            </div>
            <div className="overflow-x-auto h-[50vh] no-scrollbar pb-4">
                {
                    stokAwalBarang.map((item) => {
                        return <>
                            <div className="flex  justify-between gap-x-2 px-6 py-2 items-start bg-white shadow-xl rounded-md ">
                                <div className="w-full flex flex-col gap-y-5 py-4">
                                    <div className="flex justify-between">
                                        <div className="flex items-start flex-col gap-y-2">
                                            <p className="text-md font-bold">{item.daftar_barang_name}</p>
                                            <p className="text-sm">{item.kategori_harga_barang_kode_barang}</p>
                                        </div>
                                        <div className="flex items-end flex-col gap-y-2">
                                            <p className="text-md font-bold">{item.daftar_gudang_name}</p>
                                            <p className="text-xs bg-blue-800 font-bold text-white px-4 py-1 w-max rounded-md">{item.satuan_barang_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex font-medium bg-gray-100 p-2 border-t-2">
                                        <p className="text-sm pr-6 py-1">{item.stok_sistem} Stok Tersedia</p>
                                        <p className="text-sm px-6 py-1">{item.stok_penyesuaian_persediaan_bulan_lalu} Stok Penyesuaian Bulan Lalu</p>
                                        <p className="text-sm px-6 py-1">{item.konversi_masuk} Konversi Masuk</p>
                                        <p className="text-sm px-6 py-1">{item.konversi_keluar} Konversi Keluar</p>
                                        <p className="text-sm px-6 py-1">{item.transfer_masuk} Transfer Masuk</p>
                                        <p className="text-sm px-6 py-1">{item.transfer_keluar} Transfer Keluar</p>
                                        <p className="text-sm px-6 py-1">{item.pembelian} Pembelian</p>
                                        <p className="text-sm px-6 py-1">{item.retur_pembelian} Retur Pembelian</p>
                                        <p className="text-sm px-6 py-1">{item.penjualan} Penjualan</p>
                                        <p className="text-sm px-6 py-1">{item.retur_penjualan} Retur Penjualan</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    })
                }
            </div>
            <Pagination paginateUpdatePage={paginateUpdatePage} paginate={pagination} setSize={setSize} />
        </div>
    </Wrap>
}
export default LaporanStokBarangPage