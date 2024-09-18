import { FaCheck, FaSave, FaTimes } from "react-icons/fa"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { useEffect, useState } from "react"
import { apiKodeAkunCRUD, apiPegawaiCRUD } from "../../../../../service/endPointList.api"
import { showError } from "../../../../../helper/form.helper"
import GajiPegawaiForm from "./GajiPegawaiForm"
import LemburPegawaiForm from "./LemburPegawaiForm"
import TunjanganUangPegawaiForm from "./TunjanganUangPegawaiForm"
import TunjanganBarangPegawaiForm from "./TunjanganBarangPegawaiForm"
import HadiahPegawaiForm from "./HadiahPegawaiForm"
import ToggleBox from "../../../../../component/general/ToggleBox"

const PendapatanPegawaiForm = ({
    pendapatanPegawaiSelected,
    setPendapatanPegawaiForm = () => { }
}) => {
    const [pegawai, setPegawai] = useState()
    const [pegawaiList, setPegawaiList] = useState([])
    const [idPegawai, setIdPegawai] = useState()

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
                    <h1 className="uppercase text-gray-600 font-bold">{pendapatanPegawaiSelected != null ? "Edit " : "Tambah "} Pendapatan Pegawai</h1>
                    <button
                        className="btn btn-sm bg-red-900 text-white border-none"
                        onClick={() => setPendapatanPegawaiForm()}
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

                            </>
                    }
                </div>
                {
                    idPegawai ? <>
                        <ToggleBox
                            addClass={"mt-5"}
                            label="Tipe Pendapatan"
                            setToggleBox={setToggle}
                            toggleBox={toggle}
                            textSize="text-sm"
                            toggleBoxList={[
                                {
                                    label: "Gaji Pegawai",
                                    value: "Gaji"
                                },
                                {
                                    label: "Lembur Pegawai",
                                    value: "Lembur"
                                },
                                {
                                    label: "Tunjangan Uang Pegawai",
                                    value: "TunjanganUang"
                                },
                                {
                                    label: "Tunjangan Barang Pegawai",
                                    value: "TunjanganBarang"
                                },
                                {
                                    label: "Hadiah Pegawai",
                                    value: "Hadiah"
                                },
                            ]}
                        />
                        {
                            toggle == "Gaji" ? <>
                                <GajiPegawaiForm
                                    kodeAkunList={kodeAkunList}
                                    idPegawai={pegawai.value}
                                />
                            </> : <></>
                        }
                        {
                            toggle == "Lembur" ? <>
                                <LemburPegawaiForm
                                    kodeAkunList={kodeAkunList}
                                    idPegawai={pegawai.value}
                                />
                            </> : <></>
                        }
                        {
                            toggle == "TunjanganUang" ? <>
                                <TunjanganUangPegawaiForm
                                    kodeAkunList={kodeAkunList}
                                    idPegawai={pegawai.value}
                                />
                            </> : <></>
                        }
                        {
                            toggle == "TunjanganBarang" ? <>
                                <TunjanganBarangPegawaiForm
                                    kodeAkunList={kodeAkunList}
                                    idPegawai={pegawai.value}
                                />
                            </> : <></>
                        }
                        {
                            toggle == "Hadiah" ? <>
                                <HadiahPegawaiForm
                                    kodeAkunList={kodeAkunList}
                                    idPegawai={pegawai.value}
                                />
                            </> : <></>
                        }
                    </> : <></>
                }
            </div>
        </div>
    </>
}
export default PendapatanPegawaiForm