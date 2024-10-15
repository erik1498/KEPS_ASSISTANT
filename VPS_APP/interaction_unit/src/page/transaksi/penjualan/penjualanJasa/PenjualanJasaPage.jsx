import { useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa"
import PenjualanJasaForm from "./component/PenjualanJasaForm"

const PenjualanJasaPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [addPenjualanJasa, setAddPenjualanJasa] = useState(false)
    const [search, setSearch] = useState("")
    const [balanceStatus, setBalanceStatus] = useState(true)

    return <Wrap
        isLoading={isLoading}
    >
        <div>
            <PageTitle title="Penjualan Jasa" />
            <PenjualanJasaForm
                setAddPenjualanJasa={setAddPenjualanJasa}
            />
            {/* {
                !addPenjualanJasa ?
                    <>
                        
                    </> :
                    <>
                        <div className="bg-white py-3 px-6 mb-3 rounded-md flex justify-between shadow-2xl">
                            <label className="input input-sm input-bordered flex items-center gap-2 bg-white">
                                <input type="text" className="grow bg-transparent" placeholder="Cari" value={search} onChange={(e) => setSearch(e.target.value)} />
                                {
                                    !balanceStatus ?
                                        <FaTimes className="cursor-pointer" onClick={() => {
                                            // _getData("")
                                        }} /> :
                                        <FaSearch className="cursor-pointer" onClick={() => {
                                            // _getData(search)
                                        }} />
                                }
                            </label>
                            <div>
                                <button className="btn btn-sm bg-blue-900 text-white border-none" onClick={() => {
                                    // setBuktiTransaksiEdit(null)
                                    setAddPenjualanJasa(true)
                                }}><FaPlus /> Tambah Transaksi</button>
                            </div>
                        </div>
                    </>
            } */}
        </div>
    </Wrap>
}
export default PenjualanJasaPage