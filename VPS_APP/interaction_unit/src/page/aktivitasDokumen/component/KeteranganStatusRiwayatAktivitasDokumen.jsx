import { useEffect, useState } from "react"
import FormInputWithLabel from "../../../component/form/FormInputWithLabel"
import { getHariTanggalFull } from "../../../helper/date.helper"
import { FaPlus, FaTimes, FaTrash } from "react-icons/fa"
import { formValidation } from "../../../helper/form.helper"
import { apiStatusRiwayatAktivitasDokumenKeterangan } from "../../../service/endPointList.api"
import LoadingMiniPage from "../../../component/layout/LoadingMiniPage"

const KeteranganStatusRiwayatAktivitasDokumen = ({
    idStatusRiwayatAktivitasDokumen,
    viewMode
}) => {

    const [isLoading, setIsLoading] = useState(false)
    const [keteranganStatusRiwayatAktivitasDokumenList, setKeteranganStatusRiwayatAktivitasDokumenList] = useState([])

    const [keterangan, setKeterangan] = useState("")
    const [tanggalKeterangan, setTanggalKeterangan] = useState(getHariTanggalFull())

    const simpanKeteranganStatusRiwayatAktivitasDokumen = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            setIsLoading(x => x = true)
            apiStatusRiwayatAktivitasDokumenKeterangan
                .custom("", "POST", null, {
                    data: {
                        status_riwayat_aktivitas_dokumen: idStatusRiwayatAktivitasDokumen,
                        keterangan: keterangan,
                        tanggal: tanggalKeterangan
                    }
                }).then(res => {
                    getAllKeteranganStatusRiwayatAktivitasDokumen()
                })
        }
    }

    const getAllKeteranganStatusRiwayatAktivitasDokumen = () => {
        setIsLoading(x => x = true)
        apiStatusRiwayatAktivitasDokumenKeterangan.custom(`/${idStatusRiwayatAktivitasDokumen}`, "GET")
            .then(res => {
                setKeteranganStatusRiwayatAktivitasDokumenList(res.data.entry)
                setTanggalKeterangan(getHariTanggalFull())
                setIsLoading(x => x = false)
            }).catch(err => {
                console.log(err)
            })
    }

    const hapusKeterangan = (uuid) => {
        setIsLoading(x => x = true)
        apiStatusRiwayatAktivitasDokumenKeterangan.custom(`/${uuid}`, "DELETE")
            .then((res) => {
                getAllKeteranganStatusRiwayatAktivitasDokumen()
            }).catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getAllKeteranganStatusRiwayatAktivitasDokumen()
    }, [])

    return isLoading ?
        <LoadingMiniPage />
        :
        <>
            {
                viewMode ? <></>
                    :
                    <>
                        <form onSubmit={(e) => simpanKeteranganStatusRiwayatAktivitasDokumen(e)}>
                            <div className="flex items-end gap-x-2 w-full mt-5">
                                <FormInputWithLabel
                                    label={"Hari/Tanggal Keterangan"}
                                    type={"datetime-local"}
                                    addClassParent={"flex-1"}
                                    onchange={(e) => {
                                        setTanggalKeterangan(e.target.value)
                                    }}
                                    others={
                                        {
                                            value: tanggalKeterangan,
                                            name: "tanggalKeterangan"
                                        }
                                    }
                                />
                                <FormInputWithLabel
                                    label={"Keterangan"}
                                    type={"text"}
                                    addClassParent={"flex-3"}
                                    onchange={(e) => {
                                        setKeterangan(e.target.value)
                                    }}
                                    others={
                                        {
                                            value: keterangan,
                                            name: "keterangan"
                                        }
                                    }
                                />
                                <button
                                    className="btn btn-sm bg-blue-800 mt-4 text-white"
                                >
                                    <FaPlus /> Tambah Keterangan
                                </button>
                            </div>
                        </form>
                    </>
            }

            {
                keteranganStatusRiwayatAktivitasDokumenList.length > 0 ? <p className="text-sm font-bold mt-5">Keterangan</p> : <></>
            }

            {
                keteranganStatusRiwayatAktivitasDokumenList.map((iteml, l) => {
                    return <div className="flex flex-col gap-x-3 mt-2">
                        <div className="flex gap-x-3 items-start">
                            {
                                viewMode ? <></> : <>
                                    <FaTimes
                                        onClick={() => hapusKeterangan(iteml.uuid)}
                                        className="text-red-500 cursor-pointer"
                                        size={15}
                                    />
                                </>
                            }
                            <div>
                                <p className={`text-xs`}>{iteml.keterangan}</p>
                                <p className="text-[9px]">{iteml.tanggal}</p>
                            </div>
                        </div>
                    </div>
                })
            }
        </>
}
export default KeteranganStatusRiwayatAktivitasDokumen;