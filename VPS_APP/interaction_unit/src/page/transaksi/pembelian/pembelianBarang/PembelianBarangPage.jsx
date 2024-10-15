import { useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"
import PembelianBarangForm from "./component/PembelianBarangForm"

const PembelianBarangPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [addPembelianBarang, setAddPembelianBarang] = useState(false)
    const [search, setSearch] = useState("")
    const [balanceStatus, setBalanceStatus] = useState(true)

    return <Wrap
        isLoading={isLoading}
    >
        <div>
            <PageTitle title="Pembelian Barang" />
            <PembelianBarangForm
                setAddPembelianBarang={setAddPembelianBarang}
            />
            {/* {
                !addPembelianBarang ?
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
                                    setAddPembelianBarang(true)
                                }}><FaPlus /> Tambah Transaksi</button>
                            </div>
                        </div>
                    </>
            } */}
        </div>
    </Wrap>
}
export default PembelianBarangPage