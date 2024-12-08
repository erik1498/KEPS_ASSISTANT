import { FaPen, FaPlus, FaPrint, FaSearch, FaTimes, FaTrash } from "react-icons/fa"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"
import { useDataContext } from "../../../../context/dataContext.context"
import { useState } from "react"
import { apiTransferBahanBakuCRUD } from "../../../../service/endPointList.api"
import { useEffect } from "react"
import Pagination from "../../../../component/general/Pagination"
import TransferBahanBakuForm from "./component/TransferBahanBakuForm"
import { showAlert, showDialog, showError } from "../../../../helper/form.helper"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { TransferBahanBakuPrint } from "./component/TransferBahanBakuPrint"
import { getBulanByIndex } from "../../../../helper/date.helper"

const TransferBahanBakuPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [transferBahanBaku, setTransferBahanBaku] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [addTransferBahanBaku, setAddTransferBahanBaku] = useState(false)
    const [transferBahanBakuEdit, setTransferBahanBakuEdit] = useState({
        name: ""
    })

    const [searchStatus, setSearchStatus] = useState(false)
    const [search, setSearch] = useState("")

    const TransferBahanBakuPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => TransferBahanBakuPrintRef.current,
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
        apiTransferBahanBakuCRUD
            .custom(`?search=${searchParam}&page=${pagination.page}&size=${pagination.size}&tahun=${data.tahun}`, "GET")
            .then(resData => {

                setSearchStatus(searchParam.length < 1)
                setTransferBahanBaku(resData?.data?.entry)
                setPagination(resData?.data?.pagination)
                setIsLoading(false)
            }).catch(err => {
                showError(err)
            })
    }

    const _editTransferBahanBaku = (i) => {
        let TransferBahanBakuSelected = transferBahanBaku[i]
        setTransferBahanBakuEdit(TransferBahanBakuSelected)
        setAddTransferBahanBaku(!addTransferBahanBaku)
    }

    const _deleteTransferBahanBaku = async (i) => {
        if (await showDialog("Hapus", "Yakin ingin hapus data ini ?")) {
            let TransferBahanBakuSelected = transferBahanBaku[i]
            apiTransferBahanBakuCRUD
                .custom(`/${TransferBahanBakuSelected.uuid}`, "DELETE")
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
            <PageTitle title="Transfer Bahan Baku" />
            {
                addTransferBahanBaku ?
                    <TransferBahanBakuForm
                        setAddTransferBahanBakuEvent={() => setAddTransferBahanBaku(false)}
                        getData={_getData}
                        transferBahanBakuEdit={transferBahanBakuEdit}
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
                                        setTransferBahanBakuEdit(null)
                                        setAddTransferBahanBaku(!addTransferBahanBaku)
                                    }}
                                ><FaPlus /> Tambah Transfer Bahan Baku</button>
                                <div className="hidden">
                                    <TransferBahanBakuPrint
                                        data={transferBahanBaku}
                                        ref={TransferBahanBakuPrintRef}
                                        bulan={getBulanByIndex(new Date().getMonth())}
                                        tahun={data.tahun}
                                    />
                                </div>
                                <button
                                    onClick={handlePrint}
                                    className="btn btn-sm bg-red-600 hover:bg-red-600 text-white border-red-600"
                                >
                                    <FaPrint /> Cetak Transfer Bahan Baku
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
                                        <th>Kode</th>
                                        <th>Gudang Asal</th>
                                        <th>Gudang Akhir</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        transferBahanBaku?.map((item, i) => {
                                            return <>
                                                <tr key={i}>
                                                    <td>{i + 1}.</td>
                                                    <td>{item.tanggal}</td>
                                                    <td>{item.kode_transfer_bahan_baku}</td>
                                                    <td>{item.daftar_gudang_asal_name}</td>
                                                    <td>{item.daftar_gudang_akhir_name}</td>
                                                    <td className="flex gap-x-2">
                                                        <FaPen size={12} className="text-yellow-500 cursor-pointer"
                                                            onClick={() => {
                                                                _editTransferBahanBaku(i)
                                                            }} />
                                                        <FaTrash size={12} className="text-red-500 cursor-pointer"
                                                            onClick={() => {
                                                                _deleteTransferBahanBaku(i)
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
export default TransferBahanBakuPage