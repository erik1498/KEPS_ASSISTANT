import { useEffect, useState } from "react"
import FormInputWithLabel from "../../../component/form/FormInputWithLabel"
import { getHariTanggal, getHariTanggalFull } from "../../../helper/date.helper"
import FormSelectWithLabel from "../../../component/form/FormSelectWithLabel"
import { FaPlus, FaTrash } from "react-icons/fa"
import { formValidation } from "../../../helper/form.helper"
import { apiStatusRiwayatAktivitasDokumen } from "../../../service/endPointList.api"
import PegawaiPelaksana from "./PegawaiPelaksana"
import KeteranganStatusRiwayatAktivitasDokumen from "./KeteranganStatusRiwayatAktivitasDokumen"
import LoadingPage from "../../../component/layout/LoadingPage"

const StatusRiwayatAktivitasDokumen = ({
    idStatusAktivitasDokumen
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
        <LoadingPage /> :
        <>
            <form onSubmit={e => addStatusAktivitas(e)}>
                <div className="flex sticky bottom-0 bg-white py-3 w-full items-end gap-x-2">
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

            {
                statusAktivitasList.length > 0 ? <p className="font-bold text-md my-5">Riwayat Status Aktivitas </p> : <></>
            }

            {
                statusAktivitasList.map((itemj, j) => {
                    return <>
                        <div className="border-l-4 border-blue-900 pb-12">
                            <div className="w-full flex items-start justify-between mb-3 bg-blue-900 text-white px-5 rounded-r-md py-3" key={j}>
                                <div className="flex flex-col">
                                    <p className="text-sm">{itemj.tanggal}</p>
                                    <p className="text-md font-bold mt-4">{itemj.judul_status}</p>
                                </div>
                                <div className="bg-red-700 flex gap-x-2 font-bold items-center rounded px-6 py-1 cursor-pointer"
                                    onClick={() => hapusStatus(itemj.uuid)}
                                >
                                    <p className="text-sm">Hapus</p>
                                    <FaTrash size={12} />
                                </div>
                            </div>

                            <div className="pl-3">
                                <PegawaiPelaksana
                                    idStatusRiwayatAktivitasDokumen={itemj.uuid}
                                />

                                <KeteranganStatusRiwayatAktivitasDokumen
                                    idStatusRiwayatAktivitasDokumen={itemj.uuid}
                                />
                            </div>
                        </div>
                    </>
                })
            }
        </>
}
export default StatusRiwayatAktivitasDokumen