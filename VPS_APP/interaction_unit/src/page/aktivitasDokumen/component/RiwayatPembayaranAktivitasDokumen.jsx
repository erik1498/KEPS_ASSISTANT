import { useEffect, useState } from "react"
import FormInputWithLabel from "../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../helper/actionEvent.helper"
import { formatDate, getHariTanggal, getHariTanggalFull } from "../../../helper/date.helper"
import FormSelectWithLabel from "../../../component/form/FormSelectWithLabel"
import { FaPlus, FaTrash } from "react-icons/fa"
import { apiRiwayatPembayaranAktivitasDokumen } from "../../../service/endPointList.api"
import { parseToRupiahText } from "../../../helper/number.helper"
import { formValidation } from "../../../helper/form.helper"
import LoadingMiniPage from "../../../component/layout/LoadingMiniPage"
import { pegawaiList } from "../../../config/objectList.config"

const RiwayatPembayaranAktivitasDokumen = ({
    idAktivitasDokumen,
    viewMode
}) => {

    const [isLoading, setIsLoading] = useState(false)
    const [nilaiPembayaran, setNilaiPembayaran] = useState("0")
    const [tanggal, setTanggal] = useState(getHariTanggalFull())
    const [pegawaiPenerima, setPegawaiPenerima] = useState()
    const [nomorKwitansi, setNomorKwitansi] = useState("")

    const [riwayatPembayaran, setRiwayatPembayaran] = useState([])

    const getAllRiwayatPembayaran = () => {
        setIsLoading(x => x = true)
        apiRiwayatPembayaranAktivitasDokumen
            .custom(`/${idAktivitasDokumen}`, "GET", null)
            .then((res) => {
                setIsLoading(x => x = false)
                setRiwayatPembayaran(x => x = res.data.entry)
            })
    }

    const addRiwayatPembayaran = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            setIsLoading(x => x = true)
            apiRiwayatPembayaranAktivitasDokumen.custom("", "POST", null, {
                data: {
                    aktivitas_dokumen: idAktivitasDokumen,
                    tanggal: tanggal,
                    nilai_pembayaran: nilaiPembayaran,
                    pegawai_penerima: pegawaiPenerima.value,
                    nomor_kwitansi_tanda_terima: nomorKwitansi
                }
            }).then((res) => {
                getAllRiwayatPembayaran()
            }).catch(err => {
                console.log(err)
            })
        }
    }

    const deleteRiwayatPembayaran = (id_riwayat_pembayaran_aktivitas_dokumen) => {
        setIsLoading(x => x = true)
        apiRiwayatPembayaranAktivitasDokumen.custom(`/${id_riwayat_pembayaran_aktivitas_dokumen}`, "DELETE", null)
            .then(() => {
                getAllRiwayatPembayaran()
            }).catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getAllRiwayatPembayaran()
    }, [])

    return isLoading ?
        <LoadingMiniPage />
        : <>
            <h1 className={`${viewMode ? "text-md mt-4 mb-1" : "text-lg mt-6"} font-bold`}>Riwayat Pembayaran</h1>
            {
                viewMode ? <></> : <>
                    <form onSubmit={(e) => addRiwayatPembayaran(e)}>
                        <div className="flex bg-white py-3 w-full items-end gap-x-2 mb-3">
                            <FormInputWithLabel
                                label={"Hari/Tanggal Pembayaran"}
                                type={"datetime-local"}
                                onchange={(e) => {
                                    setTanggal(e.target.value)
                                }}
                                others={
                                    {
                                        value: tanggal,
                                        name: "tanggal"
                                    }
                                }
                            />
                            <FormInputWithLabel
                                label={"Jumlah Pembayaran"}
                                type={"text"}
                                onchange={(e) => {
                                    inputOnlyRupiah(e)
                                    setNilaiPembayaran(e.target.value)
                                }}
                                others={
                                    {
                                        value: nilaiPembayaran,
                                        name: "nilaiPembayaran"
                                    }
                                }
                            />
                            <FormSelectWithLabel
                                label={"Staf Penerima Pembayaran"}
                                onchange={(e) => {
                                    setPegawaiPenerima(e)
                                }}
                                optionsDataList={pegawaiList}
                                optionsLabel={"nama"}
                                optionsValue={"nama"}
                                selectValue={pegawaiPenerima}
                                selectName={"kodeAkunType"}
                            />
                            <FormInputWithLabel
                                label={"Nomor Kwitansi / Tanda Terima"}
                                type={"text"}
                                onchange={(e) => {
                                    setNomorKwitansi(e.target.value)
                                }}
                                others={
                                    {
                                        value: nomorKwitansi,
                                        name: "nomorKwitansi"
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
            <table className={`table ${viewMode ? "table-sm" : ""} table-zebra mb-6`}>
                {
                    viewMode ? <></> : <>
                        <tr className="font-bold bg-gray-900 text-white">
                            <td>Jumlah Pembayaran</td>
                            <td>Hari/Tanggal Pembayaran</td>
                            <td>Staf Penerima Pembayaran</td>
                            <td>Nomor Kwitansi</td>
                            <td>Aksi</td>
                        </tr>
                    </>
                }
                <tbody>
                    {
                        riwayatPembayaran.map((item, i) => {
                            return <tr>
                                <td>{formatDate(item.tanggal)}</td>
                                <td>Rp. {parseToRupiahText(item.nilai_pembayaran)}</td>
                                <td>{item.pegawai_penerima}</td>
                                <td>{item.nomor_kwitansi_tanda_terima}</td>
                                {
                                    viewMode ? <></> :
                                        <td>
                                            <FaTrash
                                                onClick={() => {
                                                    deleteRiwayatPembayaran(item.uuid)
                                                }}
                                                className="text-red-600 cursor-pointer"
                                            />
                                        </td>
                                }
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </>
}
export default RiwayatPembayaranAktivitasDokumen