import { FaPlus, FaTrash } from "react-icons/fa"
import FormInputWithLabel from "../../../component/form/FormInputWithLabel"
import FormSelectWithLabel from "../../../component/form/FormSelectWithLabel"
import { useEffect, useState } from "react"
import { getHariTanggal, getHariTanggalFull } from "../../../helper/date.helper"
import { apiRiwayatAktivitasDokumen } from "../../../service/endPointList.api"
import { formValidation } from "../../../helper/form.helper"
import StatusRiwayatAktivitasDokumen from "./StatusRiwayatAktivitasDokumen"
import LoadingPage from "../../../component/layout/LoadingPage"

const RiwayatAktivitasDokumen = ({
    idAktivitasDokumen
}) => {

    const [isLoading, setIsLoading] = useState(false)
    const [riwayatAktivitasList, setRiwayatAktivitasList] = useState([])

    const [judulAktivitas, setJudulAktivitas] = useState("")
    const [tanggalJudulAktivitas, setTanggalJudulAktivitas] = useState(getHariTanggalFull())

    const addTransaksi = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            setIsLoading(x => x = true)
            apiRiwayatAktivitasDokumen
                .custom("", "POST", null, {
                    data: {
                        aktivitas_dokumen: idAktivitasDokumen,
                        judul_aktivitas: judulAktivitas,
                        tanggal: tanggalJudulAktivitas,
                    }
                }).then(() => {
                    getAllRiwayatAktivitasDokumen()
                })
        }
    }

    const hapusRiwayat = async (idRiwayatAktivitas) => {
        setIsLoading(x => x = true)
        apiRiwayatAktivitasDokumen.custom(`/${idRiwayatAktivitas}`, "DELETE")
            .then(res => {
                getAllRiwayatAktivitasDokumen()
            }).catch(err => {
                console.log(err)
            })
    }

    const getAllRiwayatAktivitasDokumen = () => {
        setIsLoading(x => x = true)
        apiRiwayatAktivitasDokumen
            .custom(`/${idAktivitasDokumen}`, "GET")
            .then((res) => {
                setRiwayatAktivitasList(res.data.entry)
                setIsLoading(x => x = false)
            }).catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getAllRiwayatAktivitasDokumen()
    }, [])

    return isLoading ? <LoadingPage />
        :
        <>
            <h1 className="text-lg font-bold mt-6">Aktivitas</h1>
            <form onSubmit={e => addTransaksi(e)}>
                <div className="flex bg-white py-3 w-full items-end gap-x-2">
                    <FormInputWithLabel
                        label={"Judul Aktivitas"}
                        type={"text"}
                        onchange={(e) => {
                            setJudulAktivitas(e.target.value)
                        }}
                        others={
                            {
                                value: judulAktivitas,
                                name: "judulAktivitas"
                            }
                        }
                    />
                    <FormInputWithLabel
                        label={"Hari/Tanggal Judul Aktivitas"}
                        type={"datetime-local"}
                        onchange={(e) => {
                            setTanggalJudulAktivitas(e.target.value)
                        }}
                        others={
                            {
                                value: tanggalJudulAktivitas,
                                name: "tanggalJudulAktivitas"
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
            <div className="flex flex-col mt-6 w-full">
                {
                    riwayatAktivitasList.map((riwayat, i) => {
                        return <div className="mb-7 pb-5 border-l-8 border-gray-900">
                            <div className="w-full flex items-start justify-between mb-3 bg-gray-900 text-white px-5 py-3 rounded-r" key={i}>
                                <div className="flex flex-col">
                                    <p className="text-sm">{riwayat.tanggal}</p>
                                    <p className="text-xl font-bold mt-4">{riwayat.judul_aktivitas}</p>
                                </div>
                                <div className="bg-red-700 flex gap-x-2 font-bold items-center rounded px-6 py-2 cursor-pointer"
                                    onClick={() => hapusRiwayat(riwayat.uuid)}>
                                    <p className="text-sm">Hapus</p>
                                    <FaTrash size={12} />
                                </div>
                            </div>
                            <div className="pl-3">
                                <StatusRiwayatAktivitasDokumen
                                    idStatusAktivitasDokumen={riwayat.uuid}
                                    setIsLoading={setIsLoading}
                                />
                            </div>
                        </div>
                    })
                }
            </div>
        </>
}
export default RiwayatAktivitasDokumen;