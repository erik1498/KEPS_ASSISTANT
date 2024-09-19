import { useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"
import PotonganPegawaiForm from "./component/PotonganPegawaiForm"
import { FaPlus } from "react-icons/fa"
import { getBulanByIndex } from "../../../../helper/date.helper"
import BulanSelectedListCard from "../../../../component/card/BulanSelectedListCard"

const PotonganPegawaiPage = () => {
    const [potonganPegawaiForm, setPotonganPegawaiForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [bulan, setBulan] = useState(new Date().getMonth())

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
                potonganPegawaiForm ?
                    <PotonganPegawaiForm
                        setPotonganPegawaiForm={
                            () => setPotonganPegawaiForm(!potonganPegawaiForm)
                        }
                        setIsLoadingEvent={setIsLoading}
                    /> :
                    <>
                        <PageTitle title="Potongan Pegawai" />
                        <div className="bg-white py-3 px-6 mb-3 rounded-md flex justify-end shadow-2xl">
                            <div>
                                <button className="btn btn-sm bg-blue-900 text-white border-none" onClick={() => {
                                    setPotonganPegawaiForm(true)
                                }}><FaPlus /> Tambah Transaksi</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-6">
                            <div className="col-span-1">
                                <BulanSelectedListCard
                                    bulan={bulan}
                                    setBulan={setBulan}
                                />
                            </div>
                        </div>
                    </>
            }
        </div>
    </Wrap>
}
export default PotonganPegawaiPage