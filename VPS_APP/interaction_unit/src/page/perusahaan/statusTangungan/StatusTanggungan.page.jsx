import { FaPen, FaPlus, FaPrint, FaSearch, FaTimes, FaTrash } from "react-icons/fa"
import PageTitle from "../../../component/general/PageTitle"
import Wrap from "../../../component/layout/Wrap"
import { useDataContext } from "../../../context/dataContext.context"
import { useState } from "react"
import { apiStatusTanggunganCRUD } from "../../../service/endPointList.api"
import { useEffect } from "react"
import Pagination from "../../../component/general/Pagination"
import StatusTanggunganForm from "./component/StatusTanggunganForm"
import { showAlert, showDialog, showError } from "../../../helper/form.helper"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { StatusTanggunganPrint } from "./component/StatusTanggunganPrint"
import { getBulanByIndex } from "../../../helper/date.helper"

const StatusTanggunganPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [statusTanggungan, setStatusTanggungan] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [addStatusTanggungan, setAddStatusTanggungan] = useState(false)
    const [statusTanggunganEdit, setStatusTanggunganEdit] = useState({
        name: ""
    })

    const [searchStatus, setSearchStatus] = useState(false)
    const [search, setSearch] = useState("")

    const StatusTanggunganPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => StatusTanggunganPrintRef.current,
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
        apiStatusTanggunganCRUD
            .custom(`?search=${searchParam}&page=${pagination.page}&size=${pagination.size}`, "GET")
            .then(resData => {

                setSearchStatus(searchParam.length < 1)
                setStatusTanggungan(resData?.data?.entry)
                setPagination(resData?.data?.pagination)
                setIsLoading(false)
            }).catch(err => {
                showError(err)
            })
    }

    const _editStatusTanggungan = (i) => {
        let statusTanggunganSelected = statusTanggungan[i]
        setStatusTanggunganEdit(statusTanggunganSelected)
        setAddStatusTanggungan(!addStatusTanggungan)
    }

    const _deleteStatusTanggungan = async (i) => {
        if (await showDialog("Hapus", "Yakin ingin hapus data ini ?")) {
            let statusTanggunganSelected = statusTanggungan[i]
            apiStatusTanggunganCRUD
                .custom(`/${statusTanggunganSelected.uuid}`, "DELETE")
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
            <PageTitle title="Status Tanggungan" />
            {
                addStatusTanggungan ?
                    <StatusTanggunganForm
                        setAddStatusTanggunganEvent={() => setAddStatusTanggungan(false)}
                        getData={_getData}
                        statusTanggunganEdit={statusTanggunganEdit}
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
                                        setStatusTanggunganEdit(null)
                                        setAddStatusTanggungan(!addStatusTanggungan)
                                    }}
                                ><FaPlus /> Tambah Status Tanggungan</button>
                                <div className="hidden">
                                    <StatusTanggunganPrint
                                        data={statusTanggungan}
                                        ref={StatusTanggunganPrintRef}
                                        bulan={getBulanByIndex(new Date().getMonth())}
                                        tahun={data.tahun}
                                    />
                                </div>
                                <button
                                    onClick={handlePrint}
                                    className="btn btn-sm bg-red-600 hover:bg-red-600 text-white border-red-600"
                                >
                                    <FaPrint /> Cetak Status Tanggungan
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto bg-white shadow-xl rounded-md h-[50vh] no-scrollbar px-6 pb-4">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr className="sticky top-0 bg-white py-4 text-black">
                                        <th width={12}>No</th>
                                        <th>Nama Status Tanggungan</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        statusTanggungan?.map((item, i) => {
                                            return <>
                                                <tr key={i}>
                                                    <td>{i + 1}.</td>
                                                    <td>{item.name}</td>
                                                    <td className="flex gap-x-2">
                                                        <FaPen size={12} className="text-yellow-500 cursor-pointer"
                                                            onClick={() => {
                                                                _editStatusTanggungan(i)
                                                            }} />
                                                        <FaTrash size={12} className="text-red-500 cursor-pointer"
                                                            onClick={() => {
                                                                _deleteStatusTanggungan(i)
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
export default StatusTanggunganPage