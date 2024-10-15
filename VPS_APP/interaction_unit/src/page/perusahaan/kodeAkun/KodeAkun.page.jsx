import { FaPen, FaPlus, FaPrint, FaSearch, FaTimes, FaTrash } from "react-icons/fa"
import PageTitle from "../../../component/general/PageTitle"
import Wrap from "../../../component/layout/Wrap"
import { useDataContext } from "../../../context/dataContext.context"
import { useState } from "react"
import { apiKodeAkunCRUD } from "../../../service/endPointList.api"
import { useEffect } from "react"
import Pagination from "../../../component/general/Pagination"
import KodeAkunForm from "./component/KodeAkunForm"
import { showAlert, showDialog, showError } from "../../../helper/form.helper"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { KodeAkunPrint } from "./component/KodeAkunPrint"
import { getBulanByIndex } from "../../../helper/date.helper"
import { AKUN_TIDAK_BOLEH_DIUPDATE, TipeTransaksiKasBankKodeAkunForm, TipeTransaksiPayrollKodeAkunForm } from "../../../config/objectList.config"

const KodeAkunPage = () => {

    const dataContext = useDataContext()
    const { _getDataKodeAkun, data } = dataContext

    const [kodeAkun, setKodeAkun] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [addKodeAkun, setAddKodeAkun] = useState(false)
    const [kodeAkunEdit, setKodeAkunEdit] = useState({
        name: "",
        code: "",
        type: "",
        uuid: ""
    })

    const [searchStatus, setSearchStatus] = useState(false)
    const [search, setSearch] = useState("")

    const kodeAkunPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => kodeAkunPrintRef.current,
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
        apiKodeAkunCRUD
            .custom(`?search=${searchParam}&page=${pagination.page}&size=${pagination.size}`, "GET")
            .then(resData => {

                setSearchStatus(searchParam.length < 1)
                setKodeAkun(resData?.data?.entry)
                setPagination(resData?.data?.pagination)
                setIsLoading(false)
                _getDataKodeAkun()
            }).catch(err => {
                showError(err)
            })
    }

    const _editKodeAkun = (i) => {
        let kodeAkunSelected = kodeAkun[i]
        setKodeAkunEdit(kodeAkunSelected)
        setAddKodeAkun(!addKodeAkun)
    }

    const _deleteKodeAkun = async (i) => {
        if (await showDialog("Hapus", "Yakin ingin hapus data ini ?")) {
            let kodeAkunSelected = kodeAkun[i]
            apiKodeAkunCRUD
                .custom(`/${kodeAkunSelected.uuid}`, "DELETE")
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
            <PageTitle title="Kode Akun" />
            {
                addKodeAkun ?
                    <KodeAkunForm
                        setAddKodeAkunEvent={() => setAddKodeAkun(false)}
                        getData={_getData}
                        kodeAkunEdit={kodeAkunEdit}
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
                                        setKodeAkunEdit(null)
                                        setAddKodeAkun(!addKodeAkun)
                                    }}
                                ><FaPlus /> Tambah Kode Akun</button>
                                <div className="hidden">
                                    <KodeAkunPrint
                                        data={data?.kodeAkun}
                                        ref={kodeAkunPrintRef}
                                        bulan={getBulanByIndex(new Date().getMonth())}
                                        tahun={data.tahun}
                                    />
                                </div>
                                <button
                                    onClick={handlePrint}
                                    className="btn btn-sm bg-red-600 hover:bg-red-600 text-white border-red-600"
                                >
                                    <FaPrint /> Cetak Kode Akun
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto bg-white shadow-xl rounded-md h-[50vh] no-scrollbar px-6 pb-4">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr className="sticky top-0 bg-white py-4 text-black">
                                        <th width={12}>No</th>
                                        <th>Kode Akun</th>
                                        <th>Tipe Akun</th>
                                        <th>Nama Akun</th>
                                        <th>Tipe Untuk Transaksi Kas Dan Bank</th>
                                        <th>Tipe Untuk Transaksi Payroll</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        kodeAkun?.map((item, i) => {
                                            return <>
                                                <tr key={i}>
                                                    <td>{i + 1}.</td>
                                                    <td>{item.code}</td>
                                                    <td>{item.type}</td>
                                                    <td>{item.name}</td>
                                                    <td>{TipeTransaksiKasBankKodeAkunForm.filter(x => x.value == item.type_transaksi_kas_bank).at(0).label}</td>
                                                    <td>{TipeTransaksiPayrollKodeAkunForm.filter(x => x.value == item.type_transaksi_payroll).at(0).label}</td>
                                                    <td className="flex gap-x-2">
                                                        {
                                                            item.update_permission ? <>
                                                                <FaPen size={12} className="text-yellow-500 cursor-pointer"
                                                                    onClick={() => {
                                                                        _editKodeAkun(i)
                                                                    }} />
                                                                <FaTrash size={12} className="text-red-500 cursor-pointer"
                                                                    onClick={() => {
                                                                        _deleteKodeAkun(i)
                                                                    }}
                                                                />
                                                            </> : <></>
                                                        }
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
export default KodeAkunPage