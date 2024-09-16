import { useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"
import PendapatanPegawaiForm from "./component/PendapatanPegawaiForm"
import { FaPlus } from "react-icons/fa"

const PendapatanPegawaiPage = () => {
    const [pendapatanPegawaiForm, setPendapatanPegawaiForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const _getData = (searchParam = "") => {
        setIsLoading(true)
        if (searchParam == "") {
            setSearch(searchParam)
        }
    };

    return <Wrap
        isLoading={isLoading}>
        <div>
            {
                pendapatanPegawaiForm ?
                    <PendapatanPegawaiForm
                        setPendapatanPegawaiForm={
                            () => setPendapatanPegawaiForm(!pendapatanPegawaiForm)
                        }
                        setIsLoadingEvent={setIsLoading}
                    /> :
                    <>
                        <PageTitle title="Pendapatan Pegawai" />
                        <div className="bg-white py-3 px-6 mb-3 rounded-md flex justify-end shadow-2xl">
                            <div>
                                <button className="btn btn-sm bg-blue-900 text-white border-none" onClick={() => {
                                    setPendapatanPegawaiForm(true)
                                }}><FaPlus /> Tambah Transaksi</button>
                            </div>
                        </div>
                    </>
            }
        </div>
    </Wrap>
}
export default PendapatanPegawaiPage