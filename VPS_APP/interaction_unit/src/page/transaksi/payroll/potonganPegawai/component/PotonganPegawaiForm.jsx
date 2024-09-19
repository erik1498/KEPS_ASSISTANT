import { FaCheck, FaTimes } from "react-icons/fa"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { useEffect, useState } from "react"
import { apiKodeAkunCRUD, apiPegawaiCRUD } from "../../../../../service/endPointList.api"
import { showError } from "../../../../../helper/form.helper"
import { getBulanListForFormSelect } from "../../../../../helper/date.helper"
import PPH2126PegawaiForm from "./PPH2126PegawaiForm"
import LainLainPegawaiForm from "./LainLainPegawaiForm"
import KerugianPegawaiForm from "./KerugianPegawaiForm"
import PiutangKaryawanPegawaiForm from "./PiutangKaryawanPegawaiForm"

const PotonganPegawaiForm = ({
    potonganPegawaiSelected,
    setPotonganPegawaiForm = () => { }
}) => {
    const [pegawai, setPegawai] = useState()
    const [pegawaiList, setPegawaiList] = useState([])
    const [idPegawai, setIdPegawai] = useState()
    const [periode, setPeriode] = useState({
        label: getBulanListForFormSelect()[new Date().getMonth()].label,
        value: getBulanListForFormSelect()[new Date().getMonth()].value
    })

    const [toggle, setToggle] = useState("Gaji")

    const [kodeAkunList, setKodeAkunList] = useState([])

    const _getDataPegawai = () => {
        apiPegawaiCRUD
            .custom("", "GET")
            .then(resData => {
                setPegawaiList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    setPegawai({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => showError(err))
    }

    const _getDataKodeAkunBankDanKas = () => {
        apiKodeAkunCRUD
            .custom("/kas_bank")
            .then(resData => {
                setKodeAkunList(resData.data)
            }).catch(err => {
                showError(err)
            })
    }

    useEffect(() => {
        _getDataPegawai()
        _getDataKodeAkunBankDanKas()
    }, [])

    return <>
        <div className="bg-white rounded-md shadow-2xl h-[70vh] overflow-scroll no-scrollbar relative">
            <div className="sticky top-0 pt-3 px-6 h-max bg-white w-full z-10">
                <div className="mb-3 flex justify-between items-center">
                    <h1 className="uppercase text-gray-600 font-bold">{potonganPegawaiSelected != null ? "Edit " : "Tambah "} Potongan Pegawai</h1>
                    <button
                        className="btn btn-sm bg-red-900 text-white border-none"
                        onClick={() => setPotonganPegawaiForm()}
                    ><FaTimes /> Batalkan Transaksi
                    </button>
                </div>
                <div className="mt-5 flex items-end gap-x-2">
                    <FormSelectWithLabel
                        label={"Pilih Pegawai"}
                        optionsDataList={pegawaiList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        disabled={idPegawai}
                        selectValue={pegawai}
                        onchange={(e) => {
                            setPegawai(e)
                        }}
                        selectName={`pegawai`}
                    />
                    <FormSelectWithLabel
                        label={"Pilih Periode"}
                        optionsDataList={getBulanListForFormSelect()}
                        optionsLabel={"label"}
                        optionsValue={"value"}
                        selectValue={periode}
                        onchange={(e) => {
                            setPeriode(e)
                        }}
                        selectName={`periode`}
                    />
                </div>
                {
                    !idPegawai ? <>
                        <button
                            className="btn btn-sm bg-green-800 mt-4 text-white"
                            onClick={() => setIdPegawai(pegawai.value)}
                        >
                            <FaCheck /> Pilih Pegawai
                        </button>
                    </> :
                        <>
                            <PPH2126PegawaiForm
                                periode={periode}
                                idPegawai={idPegawai}
                                kodeAkunList={kodeAkunList}
                            />
                            <LainLainPegawaiForm 
                                periode={periode}
                                idPegawai={idPegawai}
                                kodeAkunList={kodeAkunList}
                            />
                            <KerugianPegawaiForm 
                                periode={periode}
                                idPegawai={idPegawai}
                                kodeAkunList={kodeAkunList}
                            />
                            <PiutangKaryawanPegawaiForm 
                                periode={periode}
                                idPegawai={idPegawai}
                                kodeAkunList={kodeAkunList}
                            />
                        </>
                }
            </div>
        </div>
    </>
}
export default PotonganPegawaiForm