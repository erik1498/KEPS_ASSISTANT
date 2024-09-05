import { FaPen, FaPlus, FaPrint, FaSearch, FaTimes, FaTrash } from "react-icons/fa"
import PageTitle from "../../../component/general/PageTitle"
import Wrap from "../../../component/layout/Wrap"
import { useDataContext } from "../../../context/dataContext.context"
import { useState } from "react"
import { apiSyaratPembayaranCRUD, apiTipePembayaranCRUD } from "../../../service/endPointList.api"
import { useEffect } from "react"
import Pagination from "../../../component/general/Pagination"
import SyaratPembayaranForm from "./component/SyaratPembayaranForm"
import { showAlert, showDialog, showError } from "../../../helper/form.helper"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { SyaratPembayaranPrint } from "./component/SyaratPembayaranPrint"
import { getBulanByIndex } from "../../../helper/date.helper"

const SyaratPembayaranPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [tipePembayaranList, setTipePembayaranList] = useState([])
    const [syaratPembayaran, setSyaratPembayaran] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [addSyaratPembayaran, setAddSyaratPembayaran] = useState(false)
    const [syaratPembayaranEdit, setSyaratPembayaranEdit] = useState({
        name: ""
    })

    const [searchStatus, setSearchStatus] = useState(false)
    const [search, setSearch] = useState("")

    const SyaratPembayaranPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => SyaratPembayaranPrintRef.current,
    });

    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        count: 118,
        lastPage: 12
    })

    const _getTipePembayaran = () => {
        apiTipePembayaranCRUD
            .custom(``, `GET`)
            .then((res) => {
                setTipePembayaranList(res.data.entry)
            }).catch((err) => {
                showError(err)
            })
    }

    const _getData = (searchParam = "") => {
        if (searchParam == "") {
            setSearch(searchParam)
        }
        setIsLoading(true)
        apiSyaratPembayaranCRUD
            .custom(`?search=${searchParam}&page=${pagination.page}&size=${pagination.size}`, "GET")
            .then(resData => {

                setSearchStatus(searchParam.length < 1)
                setSyaratPembayaran(resData?.data?.entry)
                setPagination(resData?.data?.pagination)
                setIsLoading(false)
            }).catch(err => {
                showError(err)
            })
    }

    const _editSyaratPembayaran = (i) => {
        let syaratPembayaranSelected = syaratPembayaran[i]
        setSyaratPembayaranEdit(syaratPembayaranSelected)
        setAddSyaratPembayaran(!addSyaratPembayaran)
    }

    const _deleteSyaratPembayaran = async (i) => {
        if (await showDialog("Hapus", "Yakin ingin hapus data ini ?")) {
            let syaratPembayaranSelected = syaratPembayaran[i]
            apiSyaratPembayaranCRUD
                .custom(`/${syaratPembayaranSelected.uuid}`, "DELETE")
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
        _getTipePembayaran()
    }, [])

    return <Wrap
        isLoading={isLoading}>
        <div>
            <PageTitle title="Syarat Pembayaran" />
            {
                addSyaratPembayaran ?
                    <SyaratPembayaranForm
                        setAddSyaratPembayaranEvent={() => setAddSyaratPembayaran(false)}
                        getData={_getData}
                        syaratPembayaranEdit={syaratPembayaranEdit}
                        tipePembayaranList={tipePembayaranList}
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
                                        setSyaratPembayaranEdit(null)
                                        setAddSyaratPembayaran(!addSyaratPembayaran)
                                    }}
                                ><FaPlus /> Tambah Syarat Pembayaran</button>
                                <div className="hidden">
                                    <SyaratPembayaranPrint
                                        data={syaratPembayaran}
                                        ref={SyaratPembayaranPrintRef}
                                        bulan={getBulanByIndex(new Date().getMonth())}
                                        tahun={data.tahun}
                                    />
                                </div>
                                <button
                                    onClick={handlePrint}
                                    className="btn btn-sm bg-red-600 hover:bg-red-600 text-white border-red-600"
                                >
                                    <FaPrint /> Cetak Syarat Pembayaran
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto bg-white shadow-xl rounded-md h-[50vh] no-scrollbar px-6 pb-4">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr className="sticky top-0 bg-white py-4 text-black">
                                        <th width={12}>No</th>
                                        <th>Tipe Pembayaran</th>
                                        <th>Nama Syarat Pembayaran</th>
                                        <th>Hari Kadaluarsa</th>
                                        <th>Denda</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        syaratPembayaran?.map((item, i) => {
                                            return <>
                                                <tr key={i}>
                                                    <td>{i + 1}.</td>
                                                    <td>{item.tipe_pembayaran_name}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.hari_kadaluarsa}</td>
                                                    <td>{item.denda} %</td>
                                                    <td className="flex gap-x-2">
                                                        <FaPen size={12} className="text-yellow-500 cursor-pointer"
                                                            onClick={() => {
                                                                _editSyaratPembayaran(i)
                                                            }} />
                                                        <FaTrash size={12} className="text-red-500 cursor-pointer"
                                                            onClick={() => {
                                                                _deleteSyaratPembayaran(i)
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
export default SyaratPembayaranPage