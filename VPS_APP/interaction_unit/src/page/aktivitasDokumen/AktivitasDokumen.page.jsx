import { useEffect, useState } from "react"
import PageTitle from "../../component/general/PageTitle"
import Wrap from "../../component/layout/Wrap"
import { FaEye, FaPen, FaPlus, FaSearch, FaTimes, FaTrash } from "react-icons/fa"
import AktivitasDokumenForm from "./component/AktivitasDokumenForm"
import { apiAktivitasDokumen } from "../../service/endPointList.api"
import { parseToRupiahText } from "../../../../process_unit/src/utils/numberParsingUtil"
import { useDataContext } from "../../context/dataContext.context"
import Pagination from "../../component/general/Pagination"
import DetailDokumen from "./component/DetailDokumen"

const AktivitasDokumenPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [isViewDokumen, setIsViewDokumen] = useState(null)
    const [idAktivitasDokumen, setIdAktivitasDokumen] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const [addAktivitasDokumen, setAddAktivitasDokumen] = useState(false)

    const [searchStatus, setSearchStatus] = useState(true)
    const [search, setSearch] = useState("")

    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        count: 118,
        lastPage: 12
    })

    const [aktivitasDokumenList, setAktivitasDokumenList] = useState([])

    const getAllDokumenKlien = (searchParam = "") => {
        if (searchParam == "") {
            setSearch(searchParam)
        }
        setIsLoading(x => x = true)
        apiAktivitasDokumen.custom(`/tahun/${data.tahun}?search=${searchParam}&page=${pagination.page}&size=${pagination.size}`, "GET")
            .then(res => {
                setIsLoading(x => x = false)
                setSearchStatus(searchParam.length < 1)
                setPagination(res?.data?.pagination)
                setAktivitasDokumenList(res.data.entry)
            }).catch(err => {
                console.log(err)
            })
    }

    const hapusDokumenKlien = (uuid) => {
        setIsLoading(x => x = true)
        apiAktivitasDokumen.custom(`/${uuid}`, "DELETE")
            .then(() => {
                getAllDokumenKlien()
            }).catch(err => {
                console.log(err)
            })
    }


    const paginateUpdatePage = ({ selected }) => {
        let paginateCopy = pagination
        paginateCopy.page = selected + 1
        setPagination(paginateCopy)
        getAllDokumenKlien()
    }

    const setSize = (sizeSelected) => {
        let paginateCopy = pagination
        paginateCopy.size = sizeSelected
        paginateCopy.page = 1
        setPagination(paginateCopy)
        getAllDokumenKlien()
    }

    useEffect(() => {
        getAllDokumenKlien("")
    }, [addAktivitasDokumen])

    return <Wrap
        isLoading={isLoading}>
        <PageTitle title="Aktivitas Dokumen" />
        {
            isViewDokumen ? <>
                <DetailDokumen
                    item={isViewDokumen}
                    setIsViewDokumen={setIsViewDokumen}
                />
            </> :
                <>
                    {
                        addAktivitasDokumen ?
                            <AktivitasDokumenForm
                                setAddAktivitasDokumenEvent={() => setAddAktivitasDokumen(false)}
                                idAktivitasDokumen={idAktivitasDokumen}
                                setIdAktivitasDokumen={setIdAktivitasDokumen}
                            />
                            :
                            <>
                                <div className="bg-white py-3 px-6 mb-3 rounded-md flex justify-between shadow-2xl">
                                    <label className="input input-sm input-bordered flex items-center gap-2 bg-white">
                                        <input type="text" className="grow bg-transparent" placeholder="Cari" disabled={!searchStatus} value={search} onChange={(e) => setSearch(e.target.value)} />
                                        {
                                            searchStatus ?
                                                <FaSearch onClick={() => { getAllDokumenKlien(search) }} className="cursor-pointer" />
                                                :
                                                <FaTimes onClick={() => getAllDokumenKlien("")} className="cursor-pointer" />
                                        }
                                    </label>
                                    <div className="flex gap-x-2 items-center">
                                        <button className="btn btn-sm bg-blue-900 text-white border-none"
                                            onClick={() => {
                                                setIdAktivitasDokumen(null)
                                                setAddAktivitasDokumen(!addAktivitasDokumen)
                                            }}
                                        ><FaPlus /> Tambah Dokumen</button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto bg-white shadow-xl rounded-md h-[50vh] no-scrollbar px-6 pb-4">
                                    <table className="table">
                                        <tbody>
                                            {
                                                aktivitasDokumenList.map((item, i) => {
                                                    return <div className="mt-4 border-b-2 pb-4 border-gray-500">
                                                        <div className="flex justify-between">
                                                            <p className="text-sm">Tanggal {item.tanggal} | {item.penanggung_jawab}</p>
                                                            <div className="flex items-center">
                                                                <button
                                                                    className="btn btn-xs bg-transparent shadow-none border-0 text-green-400"
                                                                    onClick={() => {
                                                                        setIsViewDokumen(item)
                                                                    }}
                                                                >
                                                                    <FaEye size={10} />
                                                                    Lihat
                                                                </button>
                                                                <button
                                                                    className="btn btn-xs bg-transparent shadow-none border-0 text-yellow-400"
                                                                    onClick={() => {
                                                                        setIdAktivitasDokumen(x => x = item.uuid)
                                                                        setAddAktivitasDokumen(x => x = true)
                                                                    }}
                                                                >
                                                                    <FaPen size={10} />
                                                                    Edit
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm mb-4">Status Dokumen ( {item.status} )</p>
                                                        <p className="py-1 w-max rounded font-bold">No. Surat : {item.no_surat}</p>
                                                        <p className="text-sm">{item.klien}</p>
                                                        <p className="text-sm w-max mt-2">{item.jumlah_dokumen} Dokumen Klien</p>

                                                        <div className="flex justify-between">
                                                            <div className="flex gap-x-2 bg-gray-500 text-white font-bold rounded-lg w-max mt-2">
                                                                <p className="text-sm w-max pl-2">{item.tipe_dokumen}</p>
                                                                <p className={`text-sm w-max border-l-2 px-2 border-white ${item.jenis_dokumen == "EMPTY" ? "" : "border-r-2"}`}>{item.kategori_dokumen}</p>
                                                                {
                                                                    item.jenis_dokumen != "EMPTY" ? <>
                                                                        <p className="text-sm w-max pr-2">{item.jenis_dokumen}</p>
                                                                    </> : <></>
                                                                }
                                                            </div>
                                                            {
                                                                item.hutang == 0 ? <div className="flex gap-x-2 bg-green-700 text-white font-bold rounded-lg w-max mt-2">
                                                                    <p className="text-sm px-2">Lunas</p>
                                                                </div> : <div className="flex gap-x-2 bg-red-500 text-white font-bold rounded-lg w-max mt-2">
                                                                    <p className="text-sm px-2">Hutang Rp. {parseToRupiahText(item.hutang)}</p>
                                                                </div>
                                                            }
                                                        </div>

                                                        {
                                                            item.tanggal_riwayat_aktivitas_uuid ? <>
                                                                <div className="border-l-2 border-blue-800">
                                                                    <p className="text-sm bg-blue-800 w-max px-3 rounded-r-lg text-white mt-4 font-bold">Aktivitas Terakhir</p>
                                                                    <div className="pl-2">
                                                                        <p className="text-xs font-bold mt-2">{item.tanggal_riwayat_aktivitas_uuid}</p>
                                                                        <p className="text-sm mt-1 text-gray-700">{item.judul_riwayat_aktivitas_uuid}</p>
                                                                        <p className="text-sm bg-blue-600 w-max px-3 rounded text-white mt-4 font-bold">Status Terakhir</p>
                                                                        <p className="text-xs font-bold mt-2">{item.tanggal_status_riwayat_aktivitas_terakhir}</p>
                                                                        <p className="text-sm mt-1 text-gray-700">{item.judul_status_riwayat_aktivitas_terakhir}</p>
                                                                    </div>
                                                                </div>
                                                            </> : <></>
                                                        }



                                                    </div>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination paginateUpdatePage={paginateUpdatePage} paginate={pagination} setSize={setSize} />
                            </>
                    }
                </>
        }
    </Wrap>
}
export default AktivitasDokumenPage