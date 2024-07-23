import { useState } from "react"
import PageTitle from "../../component/general/PageTitle"
import Wrap from "../../component/layout/Wrap"
import { FaPen, FaPlus, FaSearch, FaTimes, FaTrash } from "react-icons/fa"
import AktivitasDokumenForm from "./component/AktivitasDokumenForm"

const AktivitasDokumenPage = () => {
    const [isLoading, setIsLoading] = useState(false)

    const [addAktivitasDokumen, setAddAktivitasDokumen] = useState(false)

    const [searchStatus, setSearchStatus] = useState(true)
    const [search, setSearch] = useState("")

    return <Wrap
        isLoading={isLoading}>
        <PageTitle title="Aktivitas Dokumen" />
        {
            addAktivitasDokumen ?
                <AktivitasDokumenForm
                    setAddAktivitasDokumenEvent={() => setAddAktivitasDokumen(false)}
                />
                :
                <>
                    <div className="bg-white py-3 px-6 mb-3 rounded-md flex justify-between shadow-2xl">
                        <label className="input input-sm input-bordered flex items-center gap-2 bg-white">
                            <input type="text" className="grow bg-transparent" placeholder="Cari" value={search} onChange={(e) => setSearch(e.target.value)} />
                            {
                                searchStatus ?
                                    <FaSearch onClick={() => { }} className="cursor-pointer" />
                                    :
                                    <FaTimes onClick={() => { }} className="cursor-pointer" />
                            }
                        </label>
                        <div className="flex gap-x-2 items-center">
                            <button className="btn btn-sm bg-blue-900 text-white border-none"
                                onClick={() => {
                                    // setAktivitasDokumenEdit(null)
                                    setAddAktivitasDokumen(!addAktivitasDokumen)
                                }}
                            ><FaPlus /> Tambah Dokumen</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto bg-white shadow-xl rounded-md h-[50vh] no-scrollbar px-6 pb-4">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr className="sticky top-0 bg-white py-4 text-black">
                                    <th width={12}>No</th>
                                    <th>Tanggal</th>
                                    <th>Nomor Dokumen</th>
                                    <th>Tipe Akun</th>
                                    <th>Nama Akun</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    []?.map((item, i) => {
                                        return <>

                                        </>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    {/* <Pagination paginateUpdatePage={paginateUpdatePage} paginate={pagination} setSize={setSize} /> */}
                </>
        }
    </Wrap>
}
export default AktivitasDokumenPage