import { FaPen, FaPlus, FaPrint, FaSearch, FaTimes, FaTrash } from "react-icons/fa"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"
import { useDataContext } from "../../../../context/dataContext.context"
import { useState } from "react"
import { apiDaftarPerlengkapanCRUD } from "../../../../service/endPointList.api"
import { useEffect } from "react"
import Pagination from "../../../../component/general/Pagination"
import DaftarPerlengkapanForm from "./component/DaftarPerlengkapanForm"
import { showAlert, showDialog, showError } from "../../../../helper/form.helper"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { DaftarPerlengkapanPrint } from "./component/DaftarPerlengkapanPrint"
import { convertTo12HoursFormat, getBulanByIndex } from "../../../../helper/date.helper"
import { parseToRupiahText } from "../../../../helper/number.helper"

const DaftarPerlengkapanPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [daftarPerlengkapan, setDaftarPerlengkapan] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [addDaftarPerlengkapan, setAddDaftarPerlengkapan] = useState(false)
    const [daftarPerlengkapanEdit, setDaftarPerlengkapanEdit] = useState({
        name: ""
    })

    const [searchStatus, setSearchStatus] = useState(false)
    const [search, setSearch] = useState("")

    const DaftarPerlengkapanPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => DaftarPerlengkapanPrintRef.current,
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
        apiDaftarPerlengkapanCRUD
            .custom(`?search=${searchParam}&page=${pagination.page}&size=${pagination.size}`, "GET")
            .then(resData => {

                setSearchStatus(searchParam.length < 1)
                setDaftarPerlengkapan(resData?.data?.entry)
                setPagination(resData?.data?.pagination)
                setIsLoading(false)
            }).catch(err => {
                showError(err)
            })
    }

    const _editDaftarPerlengkapan = (i) => {
        let daftarPerlengkapanSelected = daftarPerlengkapan[i]
        setDaftarPerlengkapanEdit(daftarPerlengkapanSelected)
        setAddDaftarPerlengkapan(!addDaftarPerlengkapan)
    }

    const _deleteDaftarPerlengkapan = async (i) => {
        if (await showDialog("Hapus", "Yakin ingin hapus data ini ?")) {
            let daftarPerlengkapanSelected = daftarPerlengkapan[i]
            apiDaftarPerlengkapanCRUD
                .custom(`/${daftarPerlengkapanSelected.uuid}`, "DELETE")
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
            <PageTitle title="Daftar Perlengkapan" />
            {
                addDaftarPerlengkapan ?
                    <DaftarPerlengkapanForm
                        setAddDaftarPerlengkapanEvent={() => setAddDaftarPerlengkapan(false)}
                        getData={_getData}
                        daftarPerlengkapanEdit={daftarPerlengkapanEdit}
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
                                        setDaftarPerlengkapanEdit(null)
                                        setAddDaftarPerlengkapan(!addDaftarPerlengkapan)
                                    }}
                                ><FaPlus /> Tambah Daftar Perlengkapan</button>
                                <div className="hidden">
                                    <DaftarPerlengkapanPrint
                                        data={daftarPerlengkapan}
                                        ref={DaftarPerlengkapanPrintRef}
                                        bulan={getBulanByIndex(new Date().getMonth())}
                                        tahun={data.tahun}
                                    />
                                </div>
                                <button
                                    onClick={handlePrint}
                                    className="btn btn-sm bg-red-600 hover:bg-red-600 text-white border-red-600"
                                >
                                    <FaPrint /> Cetak Daftar Perlengkapan
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto bg-white shadow-xl rounded-md h-[50vh] no-scrollbar px-6 pb-4">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr className="sticky top-0 bg-white py-4 text-black">
                                        <th width={12}>No</th>
                                        <th>Nama Daftar Perlengkapan</th>
                                        <th>Nomor Invoice</th>
                                        <th>Tanggal Beli</th>
                                        <th>Kategori Perlengkapan</th>
                                        <th>Total Beli</th>
                                        <th>DPP</th>
                                        <th>PPN</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        daftarPerlengkapan?.map((item, i) => {
                                            return <>
                                                <tr key={i}>
                                                    <td>{i + 1}.</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.nomor_invoice}</td>
                                                    <td>{`${item.tanggal_beli.split("T")[0]} ${convertTo12HoursFormat(item.tanggal_beli.split("T")[1])}`}</td>
                                                    <td>{item.kategori_perlengkapan_name}</td>
                                                    <td>{parseToRupiahText(item.harga_satuan * item.kuantitas)}</td>
                                                    <td>{parseToRupiahText(item.dpp)}</td>
                                                    <td>{parseToRupiahText(item.ppn)}</td>
                                                    <td className="flex gap-x-2">
                                                        <FaPen size={12} className="text-yellow-500 cursor-pointer"
                                                            onClick={() => {
                                                                _editDaftarPerlengkapan(i)
                                                            }} />
                                                        <FaTrash size={12} className="text-red-500 cursor-pointer"
                                                            onClick={() => {
                                                                _deleteDaftarPerlengkapan(i)
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
export default DaftarPerlengkapanPage