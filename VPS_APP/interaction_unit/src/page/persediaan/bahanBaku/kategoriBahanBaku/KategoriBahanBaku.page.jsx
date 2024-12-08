import { FaPen, FaPlus, FaPrint, FaSearch, FaTimes, FaTrash } from "react-icons/fa"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"
import { useDataContext } from "../../../../context/dataContext.context"
import { useState } from "react"
import { apiKategoriBahanBakuCRUD } from "../../../../service/endPointList.api"
import { useEffect } from "react"
import Pagination from "../../../../component/general/Pagination"
import KategoriBahanBakuForm from "./component/KategoriBahanBakuForm"
import { showAlert, showDialog, showError } from "../../../../helper/form.helper"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { KategoriBahanBakuPrint } from "./component/KategoriBahanBakuPrint"
import { getBulanByIndex } from "../../../../helper/date.helper"

const KategoriBahanBakuPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [kategoriBahanBaku, setKategoriBahanBaku] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [addKategoriBahanBaku, setAddKategoriBahanBaku] = useState(false)
    const [kategoriBahanBakuEdit, setKategoriBahanBakuEdit] = useState({
        name: ""
    })

    const [searchStatus, setSearchStatus] = useState(false)
    const [search, setSearch] = useState("")

    const KategoriBahanBakuPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => KategoriBahanBakuPrintRef.current,
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
        apiKategoriBahanBakuCRUD
            .custom(`?search=${searchParam}&page=${pagination.page}&size=${pagination.size}`, "GET")
            .then(resData => {

                setSearchStatus(searchParam.length < 1)
                setKategoriBahanBaku(resData?.data?.entry)
                setPagination(resData?.data?.pagination)
                setIsLoading(false)
            }).catch(err => {
                showError(err)
            })
    }

    const _editKategoriBahanBaku = (i) => {
        let kategoriBahanBakuSelected = kategoriBahanBaku[i]
        setKategoriBahanBakuEdit(kategoriBahanBakuSelected)
        setAddKategoriBahanBaku(!addKategoriBahanBaku)
    }

    const _deleteKategoriBahanBaku = async (i) => {
        if (await showDialog("Hapus", "Yakin ingin hapus data ini ?")) {
            let kategoriBahanBakuSelected = kategoriBahanBaku[i]
            apiKategoriBahanBakuCRUD
                .custom(`/${kategoriBahanBakuSelected.uuid}`, "DELETE")
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
            <PageTitle title="Kategori Bahan Baku" />
            {
                addKategoriBahanBaku ?
                    <KategoriBahanBakuForm
                        setAddKategoriBahanBakuEvent={() => setAddKategoriBahanBaku(false)}
                        getData={_getData}
                        kategoriBahanBakuEdit={kategoriBahanBakuEdit}
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
                                        setKategoriBahanBakuEdit(null)
                                        setAddKategoriBahanBaku(!addKategoriBahanBaku)
                                    }}
                                ><FaPlus /> Tambah Kategori Bahan Baku</button>
                                <div className="hidden">
                                    <KategoriBahanBakuPrint
                                        data={kategoriBahanBaku}
                                        ref={KategoriBahanBakuPrintRef}
                                        bulan={getBulanByIndex(new Date().getMonth())}
                                        tahun={data.tahun}
                                    />
                                </div>
                                <button
                                    onClick={handlePrint}
                                    className="btn btn-sm bg-red-600 hover:bg-red-600 text-white border-red-600"
                                >
                                    <FaPrint /> Cetak Kategori Bahan Baku
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto bg-white shadow-xl rounded-md h-[50vh] no-scrollbar px-6 pb-4">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr className="sticky top-0 bg-white py-4 text-black">
                                        <th width={12}>No</th>
                                        <th>Nama Kategori Bahan Baku</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        kategoriBahanBaku?.map((item, i) => {
                                            return <>
                                                <tr key={i}>
                                                    <td>{i + 1}.</td>
                                                    <td>{item.name}</td>
                                                    <td className="flex gap-x-2">
                                                        <FaPen size={12} className="text-yellow-500 cursor-pointer"
                                                            onClick={() => {
                                                                _editKategoriBahanBaku(i)
                                                            }} />
                                                        <FaTrash size={12} className="text-red-500 cursor-pointer"
                                                            onClick={() => {
                                                                _deleteKategoriBahanBaku(i)
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
export default KategoriBahanBakuPage