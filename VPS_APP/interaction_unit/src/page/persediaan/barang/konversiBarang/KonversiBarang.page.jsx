import { FaPen, FaPlus, FaPrint, FaSearch, FaTimes, FaTrash } from "react-icons/fa"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"
import { useDataContext } from "../../../../context/dataContext.context"
import { useState } from "react"
import { apiKonversiBarangCRUD } from "../../../../service/endPointList.api"
import { useEffect } from "react"
import Pagination from "../../../../component/general/Pagination"
import KonversiBarangForm from "./component/KonversiBarangForm"
import { showAlert, showDialog, showError } from "../../../../helper/form.helper"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { KonversiBarangPrint } from "./component/KonversiBarangPrint"
import { getBulanByIndex } from "../../../../helper/date.helper"

const KonversiBarangPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [KonversiBarang, setKonversiBarang] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [addKonversiBarang, setAddKonversiBarang] = useState(false)
    const [konversiBarangEdit, setKonversiBarangEdit] = useState({
        name: ""
    })

    const [searchStatus, setSearchStatus] = useState(false)
    const [search, setSearch] = useState("")

    const KonversiBarangPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => KonversiBarangPrintRef.current,
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
        apiKonversiBarangCRUD
            .custom(`?search=${searchParam}&page=${pagination.page}&size=${pagination.size}&tahun=${data.tahun}`, "GET")
            .then(resData => {

                setSearchStatus(searchParam.length < 1)
                setKonversiBarang(resData?.data?.entry)
                setPagination(resData?.data?.pagination)
                setIsLoading(false)
            }).catch(err => {
                showError(err)
            })
    }

    const _editKonversiBarang = (i) => {
        let konversiBarangSelected = KonversiBarang[i]
        setKonversiBarangEdit(konversiBarangSelected)
        setAddKonversiBarang(!addKonversiBarang)
    }

    const _deleteKonversiBarang = async (i) => {
        if (await showDialog("Hapus", "Yakin ingin hapus data ini ?")) {
            let konversiBarangSelected = KonversiBarang[i]
            apiKonversiBarangCRUD
                .custom(`/${konversiBarangSelected.uuid}`, "DELETE")
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
            <PageTitle title="Konversi Barang" />
            {
                addKonversiBarang ?
                    <KonversiBarangForm
                        setAddKonversiBarangEvent={() => setAddKonversiBarang(false)}
                        getData={_getData}
                        konversiBarangEdit={konversiBarangEdit}
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
                                        setKonversiBarangEdit(null)
                                        setAddKonversiBarang(!addKonversiBarang)
                                    }}
                                ><FaPlus /> Tambah Konversi Barang</button>
                                <div className="hidden">
                                    <KonversiBarangPrint
                                        data={KonversiBarang}
                                        ref={KonversiBarangPrintRef}
                                        bulan={getBulanByIndex(new Date().getMonth())}
                                        tahun={data.tahun}
                                    />
                                </div>
                                <button
                                    onClick={handlePrint}
                                    className="btn btn-sm bg-red-600 hover:bg-red-600 text-white border-red-600"
                                >
                                    <FaPrint /> Cetak Konversi Barang
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
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        KonversiBarang?.map((item, i) => {
                                            return <>
                                                <tr key={i}>
                                                    <td>{i + 1}.</td>
                                                    <td>{item.tanggal}</td>
                                                    <td>{item.kode_konversi_barang}</td>
                                                    <td className="flex gap-x-2">
                                                        <FaPen size={12} className="text-yellow-500 cursor-pointer"
                                                            onClick={() => {
                                                                _editKonversiBarang(i)
                                                            }} />
                                                        <FaTrash size={12} className="text-red-500 cursor-pointer"
                                                            onClick={() => {
                                                                _deleteKonversiBarang(i)
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
export default KonversiBarangPage