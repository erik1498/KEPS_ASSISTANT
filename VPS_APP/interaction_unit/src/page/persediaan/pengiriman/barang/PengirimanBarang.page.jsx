import { useEffect, useRef, useState } from "react"
import { useDataContext } from "../../../../context/dataContext.context"
import { useReactToPrint } from "react-to-print"
import { apiPengirimanBarangCRUD } from "../../../../service/endPointList.api"
import { showAlert, showDialog, showError } from "../../../../helper/form.helper"
import Wrap from "../../../../component/layout/Wrap"
import PageTitle from "../../../../component/general/PageTitle"
import PengirimanBarangForm from "./component/PengirimanBarangForm"
import { FaEdit, FaEye, FaPen, FaPlus, FaPrint, FaSearch, FaTimes, FaTrash } from "react-icons/fa"
import Pagination from "../../../../component/general/Pagination"
import { formatDate } from "../../../../helper/date.helper"
import { getNormalizedCustomKey } from "../../../../helper/jurnalUmum.helper"

const PengirimanBarangPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [pengirimanBarang, setPengirimanBarang] = useState([])
    const [pengirimanBarangFix, setPengirimanBarangFix] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [addPengirimanBarang, setAddPengirimanBarang] = useState(false)
    const [pengirimanBarangEdit, setPengirimanBarangEdit] = useState({
        name: "",
    })

    const [searchStatus, setSearchStatus] = useState(false)
    const [search, setSearch] = useState("")

    const pengirimanBarangPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => pengirimanBarangPrintRef.current,
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
                let data = getNormalizedCustomKey(resData.data.entry, "nomor_faktur_penjualan_barang")
                setSearchStatus(searchParam.length < 1)
                setPengirimanBarangFix(data)
                setPengirimanBarang(resData?.data?.entry)
                setPagination(resData?.data?.pagination)
                setIsLoading(false)
            }).catch(err => {
                showError(err)
            })
    }

    const _editPengirimanBarang = (x) => {
        setPengirimanBarangEdit(x)
        setAddPengirimanBarang(!addPengirimanBarang)
    }

    const _deletePengirimanBarang = async (x) => {
        if (await showDialog("Hapus", "Yakin ingin hapus data ini ?")) {
            apiPengirimanBarangCRUD
                .custom(`/${x.uuid}`, "DELETE")
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
                                        ref={pengirimanBarangPrintRef}
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
                        <div className="overflow-x-auto bg-white shadow-xl rounded-md">
                            {
                                pengirimanBarangFix?.map((item, i) => {
                                    return <>
                                        <div className="bg-gray-200 p-3">
                                            <p className="text-xs text-gray-500 font-bold">Nomor Faktur Penjualan</p>
                                            <p className="font-bold">{item.parent}</p>
                                        </div>
                                        {
                                            item.data.map((x, i) => {
                                                return <>
                                                    <div className="px-6 py-4 flex justify-between">
                                                        <div>
                                                            <p className="text-xs text-gray-500 font-bold">Nomor Surat Jalan</p>
                                                            <p className="font-bold text-md">{x?.nomor_surat_jalan}</p>
                                                            <p className="text-xs text-gray-500 font-bold">Tanggal : {formatDate(x?.tanggal)}</p>
                                                            <div className="flex gap-x-2">
                                                                <p className="text-xs font-bold mt-3 bg-gray-400 px-2 py-1 rounded-md text-white">Penanggung Jawab : {x.pegawai_penanggung_jawab_name}</p>
                                                                <p className="text-xs font-bold mt-3 bg-gray-400 px-2 py-1 rounded-md text-white">Pelaksana : {x.pegawai_pelaksana_name}</p>
                                                            </div>
                                                        </div>
                                                        {
                                                            i == 0 ? <>
                                                                <div>
                                                                    <div className="flex items-center">
                                                                        <button
                                                                            className="btn btn-xs bg-transparent shadow-none border-0 text-yellow-400"
                                                                            onClick={() => {
                                                                                _editPengirimanBarang(x)
                                                                            }}
                                                                        >
                                                                            <FaPen size={10} />
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-xs bg-transparent shadow-none border-0 text-red-600"
                                                                            onClick={() => {
                                                                                _deletePengirimanBarang(x)
                                                                            }}
                                                                        >
                                                                            <FaTrash size={10} />
                                                                            Hapus
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </> : <></>
                                                        }
                                                    </div>
                                                </>
                                            })
                                        }
                                    </>
                                })
                            }
                        </div>
                        {/* <div className="overflow-x-auto bg-white shadow-xl rounded-md h-[50vh] no-scrollbar">
                            <table className="table table-sm">
                                <tbody>
                                    {
                                        pengirimanBarangFix?.map((item, i) => {
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
                                                    <td>NOMOR SURAT JALAN</td>
                                                    <td>TANGGAL PENGIRIMAN</td>
                                                    <td>PEGAWAI PENANGGUNG JAWAB</td>
                                                    <td>PEGAWAI PELAKSANA</td>
                                                    <td>AKSI</td>
                                                </tr>
                                                {
                                                    item.data.map((x, i) => {
                                                        return <>
                                                            <tr key={i}>
                                                                <td></td>
                                                                <td>{x.nomor_surat_jalan}</td>
                                                                <td>{formatDate(x.tanggal)}</td>
                                                                <td>{x.pegawai_penanggung_jawab_name}</td>
                                                                <td>{x.pegawai_pelaksana_name}</td>
                                                                <td className="flex gap-x-2">
                                                                    {
                                                                        i == 0 ? <>
                                                                            <FaPen size={12} className="text-yellow-500 cursor-pointer"
                                                                                onClick={() => {
                                                                                    _editPengirimanBarang(x)
                                                                                }} />
                                                                            <FaTrash size={12} className="text-red-500 cursor-pointer"
                                                                                onClick={() => {
                                                                                    _deletePengirimanBarang(x)
                                                                                }} />
                                                                        </> : <></>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        </>
                                                    })
                                                }
                                            </>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div> */}
                    </>
            }
        </div>
    </Wrap>
}
export default PengirimanBarangPage