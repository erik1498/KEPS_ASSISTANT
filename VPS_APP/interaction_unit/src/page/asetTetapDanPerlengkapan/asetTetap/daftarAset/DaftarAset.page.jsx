import { FaPen, FaPlus, FaPrint, FaSearch, FaTimes, FaTrash } from "react-icons/fa"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"
import { useDataContext } from "../../../../context/dataContext.context"
import { useState } from "react"
import { apiDaftarAsetCRUD } from "../../../../service/endPointList.api"
import { useEffect } from "react"
import Pagination from "../../../../component/general/Pagination"
import DaftarAsetForm from "./component/DaftarAsetForm"
import { showAlert, showDialog, showError } from "../../../../helper/form.helper"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { DaftarAsetPrint } from "./component/DaftarAsetPrint"
import { convertTo12HoursFormat, getBulanByIndex } from "../../../../helper/date.helper"
import { parseToRupiahText } from "../../../../helper/number.helper"

const DaftarAsetPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [daftarAset, setDaftarAset] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [addDaftarAset, setAddDaftarAset] = useState(false)
    const [daftarAsetEdit, setDaftarAsetEdit] = useState({
        name: ""
    })

    const [searchStatus, setSearchStatus] = useState(false)
    const [search, setSearch] = useState("")

    const DaftarAsetPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => DaftarAsetPrintRef.current,
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
        apiDaftarAsetCRUD
            .custom(`?search=${searchParam}&page=${pagination.page}&size=${pagination.size}`, "GET")
            .then(resData => {

                setSearchStatus(searchParam.length < 1)
                setDaftarAset(resData?.data?.entry)
                setPagination(resData?.data?.pagination)
                setIsLoading(false)
            }).catch(err => {
                showError(err)
            })
    }

    const _editDaftarAset = (i) => {
        let daftarAsetSelected = daftarAset[i]
        setDaftarAsetEdit(daftarAsetSelected)
        setAddDaftarAset(!addDaftarAset)
    }

    const _deleteDaftarAset = async (i) => {
        if (await showDialog("Hapus", "Yakin ingin hapus data ini ?")) {
            let daftarAsetSelected = daftarAset[i]
            apiDaftarAsetCRUD
                .custom(`/${daftarAsetSelected.uuid}`, "DELETE")
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
            <PageTitle title="Daftar Aset" />
            {
                addDaftarAset ?
                    <DaftarAsetForm
                        setAddDaftarAsetEvent={() => setAddDaftarAset(false)}
                        getData={_getData}
                        daftarAsetEdit={daftarAsetEdit}
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
                                        setDaftarAsetEdit(null)
                                        setAddDaftarAset(!addDaftarAset)
                                    }}
                                ><FaPlus /> Tambah Daftar Aset</button>
                                <div className="hidden">
                                    <DaftarAsetPrint
                                        data={daftarAset}
                                        ref={DaftarAsetPrintRef}
                                        bulan={getBulanByIndex(new Date().getMonth())}
                                        tahun={data.tahun}
                                    />
                                </div>
                                <button
                                    onClick={handlePrint}
                                    className="btn btn-sm bg-red-600 hover:bg-red-600 text-white border-red-600"
                                >
                                    <FaPrint /> Cetak Daftar Aset
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto bg-white shadow-xl rounded-md h-[50vh] no-scrollbar px-6 pb-4">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr className="sticky top-0 bg-white py-4 text-black">
                                        <th width={12}>No</th>
                                        <th>Nama Daftar Aset</th>
                                        <th>Nomor Invoice</th>
                                        <th>Tanggal Beli</th>
                                        <th>Metode Penyusutan</th>
                                        <th>Kelompok Aset</th>
                                        <th>Total Beli</th>
                                        <th>DPP</th>
                                        <th>PPN</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        daftarAset?.map((item, i) => {
                                            return <>
                                                <tr key={i}>
                                                    <td>{i + 1}.</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.nomor_invoice}</td>
                                                    <td>{`${item.tanggal_beli.split("T")[0]} ${convertTo12HoursFormat(item.tanggal_beli.split("T")[1])}`}</td>
                                                    <td>{item.metode_penyusutan_name}</td>
                                                    <td>{item.kelompok_aset_name}</td>
                                                    <td>{parseToRupiahText(item.harga_satuan * item.kuantitas)}</td>
                                                    <td>{parseToRupiahText(item.dpp)}</td>
                                                    <td>{parseToRupiahText(item.ppn)}</td>
                                                    <td className="flex gap-x-2">
                                                        <FaPen size={12} className="text-yellow-500 cursor-pointer"
                                                            onClick={() => {
                                                                _editDaftarAset(i)
                                                            }} />
                                                        <FaTrash size={12} className="text-red-500 cursor-pointer"
                                                            onClick={() => {
                                                                _deleteDaftarAset(i)
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
export default DaftarAsetPage