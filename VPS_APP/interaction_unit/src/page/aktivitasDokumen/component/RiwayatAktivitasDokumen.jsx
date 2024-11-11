import { FaPlus, FaTrash } from "react-icons/fa"
import FormInputWithLabel from "../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formatDate, getHariTanggalFull } from "../../../helper/date.helper"
import { apiRiwayatAktivitasDokumen } from "../../../service/endPointList.api"
import { formValidation } from "../../../helper/form.helper"
import StatusRiwayatAktivitasDokumen from "./StatusRiwayatAktivitasDokumen"
import LoadingMiniPage from "../../../component/layout/LoadingMiniPage"

const RiwayatAktivitasDokumen = ({
    idAktivitasDokumen,
    pegawaiList,
    viewMode
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
                setTanggalJudulAktivitas(getHariTanggalFull())
            }).catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getAllRiwayatAktivitasDokumen()
    }, [])

    return isLoading ? <LoadingMiniPage />
        :
        <>
            <h1 className={`${viewMode ? "text-sm mt-4 mb-2" : "text-lg mt-6"} font-bold`}>Aktivitas</h1>
            {
                viewMode ? <></>
                    :
                    <>
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
                    </>
            }
            <div className="flex flex-col mt-6 w-full">
                {
                    riwayatAktivitasList.map((riwayat, i) => {
                        return <div className="mb-7 pb-5 grid grid-cols-12 gap-x-2">
                            <div className="col-span-5 flex flex-col">
                                <div className="bg-blue-800 w-3/12 h-6 rounded-full mb-2"></div>
                                <p className="text-xl font-bold mt-2 ml-2">{riwayat.judul_aktivitas}</p>
                                <p className="text-xs ml-2">{formatDate(riwayat.tanggal)}</p>
                                {
                                    viewMode ? <></> : <>
                                        <button
                                            className="btn btn-xs w-max bg-red-800 text-white mt-4"
                                            onClick={() => hapusRiwayat(riwayat.uuid)}
                                        >
                                            <FaTrash size={10} />
                                            Hapus
                                        </button>
                                    </>
                                }
                            </div>
                            <div className="col-span-5">
                                <StatusRiwayatAktivitasDokumen
                                    pegawaiList={pegawaiList}
                                    idStatusAktivitasDokumen={riwayat.uuid}
                                    setIsLoading={setIsLoading}
                                    viewMode={viewMode}
                                />
                            </div>
                        </div>
                    })
                }
            </div>
        </>
}
export default RiwayatAktivitasDokumen;