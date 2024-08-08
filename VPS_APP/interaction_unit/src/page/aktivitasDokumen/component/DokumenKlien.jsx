import { useEffect, useState } from "react"
import FormInputWithLabel from "../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../helper/actionEvent.helper"
import { getHariTanggalFull } from "../../../helper/date.helper"
import { FaPlus, FaTrash } from "react-icons/fa"
import { apiDokumenKlien } from "../../../service/endPointList.api"
import { formValidation } from "../../../helper/form.helper"
import LoadingPage from "../../../component/layout/LoadingPage"

const DokumenKlien = ({
    idAktivitasDokumen,
}) => {

    const [isLoading, setIsLoading] = useState(false)
    const [nomorDokumen, setNomorDokumen] = useState("")
    const [keteranganDokumen, setKeteranganDokumen] = useState("")

    const [dokumenKlienList, setDokumenKlienList] = useState([])

    const getAllDokumenKlien = () => {
        setIsLoading(x => x = true)
        apiDokumenKlien
            .custom(`/${idAktivitasDokumen}`, "GET", null)
            .then((res) => {
                setDokumenKlienList(x => x = res.data.entry)
                setIsLoading(x => x = false)
            })
    }

    const addDokumenKlien = async (e) => {
        e.preventDefault()
        setIsLoading(x => x = true)
        if (await formValidation(e.target)) {
            apiDokumenKlien.custom("", "POST", null, {
                data: {
                    aktivitas_dokumen: idAktivitasDokumen,
                    nomor_dokumen: nomorDokumen,
                    keterangan_dokumen: keteranganDokumen,
                }
            }).then((res) => {
                getAllDokumenKlien()
                setIsLoading(x => x = false)
            }).catch(err => {
                console.log(err)
            })
        }
    }

    const deleteDokumenKlien = (id_riwayat_pembayaran__dokumen) => {
        setIsLoading(x => x = true)
        apiDokumenKlien.custom(`/${id_riwayat_pembayaran__dokumen}`, "DELETE", null)
            .then(() => {
                getAllDokumenKlien()
            }).catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getAllDokumenKlien()
    }, [])

    return isLoading ?
        <LoadingPage />
        :
        <>
            <h1 className="text-lg font-bold mt-6">Daftar Dokumen Klien</h1>
            <form onSubmit={(e) => addDokumenKlien(e)}>
                <div className="flex bg-white py-3 w-full items-end gap-x-2 mb-3">
                    <FormInputWithLabel
                        label={"Nomor Dokumen"}
                        type={"text"}
                        onchange={(e) => {
                            setNomorDokumen(e.target.value)
                        }}
                        others={
                            {
                                name: "nomorDokumen"
                            }
                        }
                    />
                    <FormInputWithLabel
                        label={"Keterangan Dokumen"}
                        type={"text"}
                        onchange={(e) => {
                            setKeteranganDokumen(e.target.value)
                        }}
                        others={
                            {
                                name: "Keterangan"
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
            <table className="table table-zebra rounded-l mb-6">
                <tr className="font-bold bg-gray-900 text-white">
                    <td>Nomor Dokumen</td>
                    <td>Keterangan Dokumen</td>
                    <td>Aksi</td>
                </tr>
                <tbody>
                    {
                        dokumenKlienList.map((item, i) => {
                            return <tr>
                                <td>{item.nomor_dokumen}</td>
                                <td>{item.keterangan_dokumen}</td>
                                <td>
                                    <FaTrash
                                        onClick={() => {
                                            deleteDokumenKlien(item.uuid)
                                        }}
                                        className="text-red-600 cursor-pointer"
                                    />
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </>
}
export default DokumenKlien