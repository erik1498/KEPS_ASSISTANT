import { useEffect, useRef, useState } from "react"
import { useDataContext } from "../../../../context/dataContext.context"
import { useReactToPrint } from "react-to-print"
import { apiPengirimanBarangCRUD } from "../../../../service/endPointList.api"
import { showAlert, showDialog, showError } from "../../../../helper/form.helper"
import Wrap from "../../../../component/layout/Wrap"
import PageTitle from "../../../../component/general/PageTitle"
import PengirimanBarangForm from "./component/PengirimanBarangForm"
import { FaPen, FaPlus, FaPrint, FaSearch, FaTimes, FaTrash } from "react-icons/fa"
import Pagination from "../../../../component/general/Pagination"
import { formatDate } from "../../../../helper/date.helper"

const PengirimanBarangPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [pengirimanBarang, setPengirimanBarang] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [addPengirimanBarang, setAddPengirimanBarang] = useState(false)
    const [pengirimanBarangEdit, setPengirimanBarangEdit] = useState({
        name: "",
    })

    const [searchStatus, setSearchStatus] = useState(false)
    const [search, setSearch] = useState("")

    const PengirimanBarangPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => PengirimanBarangPrintRef.current,
    });

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
        apiPengirimanBarangCRUD
            .custom(`?search=${searchParam}&page=${pagination.page}&size=${pagination.size}`, "GET")
            .then(resData => {

                setSearchStatus(searchParam.length < 1)
                setPengirimanBarang(resData?.data?.entry)
                setPagination(resData?.data?.pagination)
                setIsLoading(false)
            }).catch(err => {
                showError(err)
            })
    }

    const _editPengirimanBarang = (i) => {
        let pengirimanBarangSelected = pengirimanBarang[i]
        setPengirimanBarangEdit(pengirimanBarangSelected)
        setAddPengirimanBarang(!addPengirimanBarang)
    }

    const _deletePengirimanBarang = async (i) => {
        if (await showDialog("Hapus", "Yakin ingin hapus data ini ?")) {
            let pengirimanBarangSelected = pengirimanBarang[i]
            apiPengirimanBarangCRUD
                .custom(`/${pengirimanBarangSelected.uuid}`, "DELETE")
                .then(() => {
                    showAlert("Berhasil", "Data berhasil dihapus")
                    _getData()
                }).catch(err => {
                    showError(err)
                })
        }
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
            <PageTitle title="Pengiriman Barang" />
            {
                addPengirimanBarang ?
                    <PengirimanBarangForm
                        setAddPengirimanBarangEvent={() => setAddPengirimanBarang(false)}
                        getData={_getData}
                        pengirimanBarangEdit={pengirimanBarangEdit}
                    />
                    :
                    <>
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
                                <button className="btn btn-sm bg-blue-900 text-white border-none"
                                    onClick={() => {
                                        setPengirimanBarangEdit(null)
                                        setAddPengirimanBarang(!addPengirimanBarang)
                                    }}
                                ><FaPlus /> Tambah Pengiriman Barang</button>
                                <div className="hidden">
                                    {/* <PengirimanBarangPrint
                                        data={pengirimanBarang}
                                        ref={PengirimanBarangPrintRef}
                                        bulan={getBulanByIndex(new Date().getMonth())}
                                        tahun={data.tahun}
                                    /> */}
                                </div>
                                <button
                                    onClick={handlePrint}
                                    className="btn btn-sm bg-red-600 hover:bg-red-600 text-white border-red-600"
                                >
                                    <FaPrint /> Cetak Pengiriman Barang
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto bg-white shadow-xl rounded-md h-[50vh] no-scrollbar px-6 pb-4">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr className="sticky top-0 bg-white py-4 text-black">
                                        <th width={12}>No</th>
                                        <th>Tanggal</th>
                                        <th>Nomor Surat Jalan</th>
                                        <th>Nomor Faktur Penjualan Barang</th>
                                        <th>Pegawai Penanggung Jawab</th>
                                        <th>Pegawai Pelaksana</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        pengirimanBarang?.map((item, i) => {
                                            return <>
                                                <tr key={i}>
                                                    <td>{i + 1}.</td>
                                                    <td>{formatDate(item.tanggal, true)}</td>
                                                    <td>{item.nomor_surat_jalan}</td>
                                                    <td>{item.nomor_faktur_penjualan_barang}</td>
                                                    <td>{item.pegawai_penanggung_jawab_name}</td>
                                                    <td>{item.pegawai_pelaksana_name}</td>
                                                    <td className="flex gap-x-2">
                                                        <FaPen size={12} className="text-yellow-500 cursor-pointer"
                                                            onClick={() => {
                                                                _editPengirimanBarang(i)
                                                            }} />
                                                        <FaTrash size={12} className="text-red-500 cursor-pointer"
                                                            onClick={() => {
                                                                _deletePengirimanBarang(i)
                                                            }} />
                                                    </td>
                                                </tr>
                                            </>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <Pagination paginateUpdatePage={paginateUpdatePage} paginate={pagination} setSize={setSize} />
                    </>
            }
        </div>
    </Wrap>
}
export default PengirimanBarangPage