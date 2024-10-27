import { FaPen, FaPlus, FaPrint, FaSearch, FaTimes, FaTrash } from "react-icons/fa"
import Wrap from "../../../../component/layout/Wrap"
import { useDataContext } from "../../../../context/dataContext.context"
import { useState } from "react"
import { apiPenyesuaianPersediaanCRUD } from "../../../../service/endPointList.api"
import { useEffect } from "react"
import Pagination from "../../../../component/general/Pagination"
import PenyesuaianPersediaanForm from "./component/PenyesuaianPersediaanForm"
import { showAlert, showDialog, showError } from "../../../../helper/form.helper"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { PenyesuaianPersediaanPrint } from "./component/PenyesuaianPersediaanPrint"
import { getBulanByIndex } from "../../../../helper/date.helper"
import PageTitle from "../../../../component/general/PageTitle"

const PenyesuaianPersediaanPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [penyesuaianPersediaan, setPenyesuaianPersediaan] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [addPenyesuaianPersediaan, setAddPenyesuaianPersediaan] = useState(false)
    const [penyesuaianPersediaanEdit, setPenyesuaianPersediaanEdit] = useState({
        name: ""
    })

    const [searchStatus, setSearchStatus] = useState(false)
    const [search, setSearch] = useState("")

    const PenyesuaianPersediaanPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => PenyesuaianPersediaanPrintRef.current,
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
        apiPenyesuaianPersediaanCRUD
            .custom(`?search=${searchParam}&page=${pagination.page}&size=${pagination.size}`, "GET")
            .then(resData => {

                setSearchStatus(searchParam.length < 1)
                setPenyesuaianPersediaan(resData?.data?.entry)
                setPagination(resData?.data?.pagination)
                setIsLoading(false)
            }).catch(err => {
                showError(err)
            })
    }

    const _editPenyesuaianPersediaan = (i) => {
        let PenyesuaianPersediaanSelected = penyesuaianPersediaan[i]
        setPenyesuaianPersediaanEdit(PenyesuaianPersediaanSelected)
        setAddPenyesuaianPersediaan(!addPenyesuaianPersediaan)
    }

    const _deletePenyesuaianPersediaan = async (i) => {
        if (await showDialog("Hapus", "Yakin ingin hapus data ini ?")) {
            let PenyesuaianPersediaanSelected = penyesuaianPersediaan[i]
            apiPenyesuaianPersediaanCRUD
                .custom(`/${PenyesuaianPersediaanSelected.uuid}`, "DELETE")
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
            <PageTitle title="Penyesuaian Persediaan" />
            {
                addPenyesuaianPersediaan ?
                    <PenyesuaianPersediaanForm
                        setAddPenyesuaianPersediaanEvent={() => setAddPenyesuaianPersediaan(false)}
                        getData={_getData}
                        penyesuaianPersediaanEdit={penyesuaianPersediaanEdit}
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
                                        setPenyesuaianPersediaanEdit(null)
                                        setAddPenyesuaianPersediaan(!addPenyesuaianPersediaan)
                                    }}
                                ><FaPlus /> Tambah Penyesuaian Persediaan</button>
                                <div className="hidden">
                                    <PenyesuaianPersediaanPrint
                                        data={penyesuaianPersediaan}
                                        ref={PenyesuaianPersediaanPrintRef}
                                        bulan={getBulanByIndex(new Date().getMonth())}
                                        tahun={data.tahun}
                                    />
                                </div>
                                <button
                                    onClick={handlePrint}
                                    className="btn btn-sm bg-red-600 hover:bg-red-600 text-white border-red-600"
                                >
                                    <FaPrint /> Cetak Penyesuaian Persediaan
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto bg-white shadow-xl rounded-md h-[50vh] no-scrollbar px-6 pb-4">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr className="sticky top-0 bg-white py-4 text-black">
                                        <th width={12}>No</th>
                                        <th>Nomor Penyesuaian Persediaan</th>
                                        <th>Pegawai Penanggung Jawab</th>
                                        <th>Pegawai Pelaksana</th>
                                        <th>Kategori Barang</th>
                                        <th>Gudang Asal</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        penyesuaianPersediaan?.map((item, i) => {
                                            return <>
                                                <tr key={i}>
                                                    <td>{i + 1}.</td>
                                                    <td>{item.nomor_surat_Hasil}</td>
                                                    <td>{item.pegawai_penanggung_jawab_name}</td>
                                                    <td>{item.pegawai_pelaksana_name}</td>
                                                    <td>{item.kategori_barang_name}</td>
                                                    <td>{item.daftar_gudang_name}</td>
                                                    <td className="flex gap-x-2">
                                                        <FaPen size={12} className="text-yellow-500 cursor-pointer"
                                                            onClick={() => {
                                                                _editPenyesuaianPersediaan(i)
                                                            }} />
                                                        <FaTrash size={12} className="text-red-500 cursor-pointer"
                                                            onClick={() => {
                                                                _deletePenyesuaianPersediaan(i)
                                                            }}
                                                        />
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
export default PenyesuaianPersediaanPage