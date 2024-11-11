import { useEffect, useState } from "react"
import FormInputWithLabel from "../../../component/form/FormInputWithLabel"
import { formatDate, getHariTanggal, getHariTanggalFull } from "../../../helper/date.helper"
import FormSelectWithLabel from "../../../component/form/FormSelectWithLabel"
import { FaPlus, FaTrash } from "react-icons/fa"
import { formValidation } from "../../../helper/form.helper"
import { apiStatusRiwayatAktivitasDokumen } from "../../../service/endPointList.api"
import PegawaiPelaksana from "./PegawaiPelaksana"
import KeteranganStatusRiwayatAktivitasDokumen from "./KeteranganStatusRiwayatAktivitasDokumen"
import LoadingMiniPage from "../../../component/layout/LoadingMiniPage"

const StatusRiwayatAktivitasDokumen = ({
    idStatusAktivitasDokumen,
    pegawaiList,
    viewMode
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [statusAktivitasList, setStatusAktivitasList] = useState([])
    const [statusAktivitas, setStatusAktivitas] = useState("")
    const [tanggalStatusAktivitas, setTanggalStatusAktivitas] = useState(getHariTanggalFull())

    const addStatusAktivitas = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            setIsLoading(x => x = true)
            apiStatusRiwayatAktivitasDokumen.custom(``, "POST", null, {
                data: {
                    riwayat_aktivitas_dokumen: idStatusAktivitasDokumen,
                    judul_status: statusAktivitas,
                    tanggal: tanggalStatusAktivitas
                }
            }).then((res) => {
                getAllStatusRiwayatDokumen()
            }).catch(err => {
                console.log(err)
            })
        }
    }

    const hapusStatus = (uuid) => {
        setIsLoading(x => x = true)
        apiStatusRiwayatAktivitasDokumen.custom(`/${uuid}`, "DELETE").then(res => {
            getAllStatusRiwayatDokumen()
        }).catch(err => {
            console.log(err)
        })
    }

    const getAllStatusRiwayatDokumen = () => {
        setIsLoading(x => x = true)
        apiStatusRiwayatAktivitasDokumen.custom(`/${idStatusAktivitasDokumen}`, "GET")
            .then(res => {
                setStatusAktivitasList(res.data.entry)
                setIsLoading(x => x = false)
                setTanggalStatusAktivitas(getHariTanggalFull())
            }).catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getAllStatusRiwayatDokumen()
        setStatusAktivitasList(x => x = [])
        setStatusAktivitas(x => x = "")
        setTanggalStatusAktivitas(x => x = getHariTanggalFull())
    }, [idStatusAktivitasDokumen])

    return isLoading ?
        <LoadingMiniPage /> :
        <>
            {
                viewMode ? <></> : <>
                    <form onSubmit={e => addStatusAktivitas(e)}>
                        <div className="flex sticky bottom-0 bg-white pb-3 w-full items-end gap-x-2">
                            <FormInputWithLabel
                                label={"Status Aktivitas"}
                                type={"text"}
                                onchange={(e) => {
                                    setStatusAktivitas(e.target.value)
                                }}
                                others={
                                    {
                                        value: statusAktivitas,
                                        name: "statusAktivitas"
                                    }
                                }
                            />
                            <FormInputWithLabel
                                label={"Hari/Tanggal Status Aktivitas"}
                                type={"datetime-local"}
                                onchange={(e) => {
                                    setTanggalStatusAktivitas(e.target.value)
                                }}
                                others={
                                    {
                                        value: tanggalStatusAktivitas,
                                        name: "tanggalStatusAktivitas"
                                    }
                                }
                            />
                            <button
                                className="btn btn-sm bg-blue-800 mt-4 text-white"
                                type="submit"
                            >
                                <FaPlus /> Tambah
                            </button>
                        </div>
                    </form>
                </>
            }

            {
                statusAktivitasList.length > 0 ? <p className={`${viewMode ? "text-sm mt-4 mb-2" : "text-md mt-6"} font-bold mb-4`}>Riwayat Status Aktivitas </p> : <></>
            }

            {
                statusAktivitasList.map((itemj, j) => {
                    return <>
                        <div className="px-2">
                            <div className="relative border-l-2 border-blue-800 pl-4 pb-6">
                                <div className="absolute -left-2 top-0 h-3 w-3 rounded-full bg-blue-800"></div>
                                <p className="text-md font-bold">{itemj.judul_status}</p>
                                <p className="text-[11px]">{formatDate(itemj.tanggal)}</p>

                                {
                                    viewMode ? <></>
                                        : <>
                                            <button
                                                className="btn btn-xs w-max bg-red-800 text-white mt-4"
                                                onClick={() => hapusStatus(itemj.uuid)}
                                            >
                                                <FaTrash size={10} />
                                                Hapus
                                            </button>
                                        </>
                                }

                                <PegawaiPelaksana
                                    idStatusRiwayatAktivitasDokumen={itemj.uuid}
                                    viewMode={viewMode}
                                    pegawaiList={pegawaiList}
                                />
                                <KeteranganStatusRiwayatAktivitasDokumen
                                    idStatusRiwayatAktivitasDokumen={itemj.uuid}
                                    viewMode={viewMode}
                                />
                            </div>
                        </div>
                    </>
                })
            }
        </>
}
export default StatusRiwayatAktivitasDokumen