import { useEffect, useState } from "react"
import { convertTo12HoursFormat, getBulanByIndex, getBulanList, getBulanListForFormSelect, getHariTanggalFull } from "../../../../../helper/date.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaSave, FaTrash } from "react-icons/fa"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiLemburCRUD } from "../../../../../service/endPointList.api"
import { parseRupiahToFloat, parseToRupiahText } from "../../../../../helper/number.helper"
import { useDataContext } from "../../../../../context/dataContext.context"

const LemburPegawaiForm = ({
    idPegawai,
    periode,
    kodeAkunList = []
}) => {
    const { data } = useDataContext()
    const [kodeAkun, setKodeAkun] = useState()
    const [tanggal, setTanggal] = useState(getHariTanggalFull())
    const [buktiTransaksi, setBuktiTransaksi] = useState()
    const [deskripsiKerja, setDekstripsiKerja] = useState()
    const [keteranganKerja, setKeteranganKerja] = useState()
    const [nilaiLemburPerMenit, setNilaiLemburPerMenit] = useState("0")
    const [waktuMulai, setWaktuMulai] = useState(getHariTanggalFull())
    const [waktuSelesai, setWaktuSelesai] = useState(getHariTanggalFull())

    const [totalJam, setTotalJam] = useState("0")
    const [totalMenit, setTotalMenit] = useState("0")
    const [totalBayaran, setTotalBayaran] = useState("0")

    const [lemburList, setLemburList] = useState([])

    const _saveLemburPegawai = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiLemburCRUD.custom("", "POST", null, {
                data: {
                    pegawai: idPegawai,
                    periode: periode,
                    kode_akun_perkiraan: kodeAkun.value,
                    tanggal: tanggal,
                    bukti_transaksi: buktiTransaksi,
                    deskripsi_kerja: deskripsiKerja,
                    keterangan_kerja: keteranganKerja,
                    nilai_lembur_per_menit: nilaiLemburPerMenit,
                    waktu_mulai: waktuMulai,
                    waktu_selesai: waktuSelesai,
                    total_jam: `${totalJam}`,
                    total_menit: `${totalMenit}`,
                    total_bayaran: `${totalBayaran}`
                }
            }).then(resData => {
                _getDaftarLemburPegawai()
            }).catch(err => showError(err))
        }
    }

    const _getDaftarLemburPegawai = () => {
        apiLemburCRUD
            .custom(`/${idPegawai}/${periode}/${data.tahun}`, "GET")
            .then(resData => {
                setLemburList(resData.data)
            })
    }

    const _deleteLembur = (uuid) => {
        apiLemburCRUD
            .custom(`/${uuid}`, "DELETE")
            .then(() => {
                _getDaftarLemburPegawai()
            }).catch(err => showError(err))
    }

    const _countTotalMenit = () => {

        const startTime = new Date(waktuMulai)
        const finishTime = new Date(waktuSelesai)
        const menitTotal = ((finishTime - startTime) / (1000 * 60))
        const jam = Math.floor(menitTotal / 60)
        const menit = Math.round(((menitTotal / 60) - jam) * 60)

        setTotalJam(x => x = parseToRupiahText(jam))
        setTotalMenit(x => x = parseToRupiahText(menit))

        const payPerMinute = parseRupiahToFloat(nilaiLemburPerMenit)

        setTotalBayaran(parseToRupiahText((payPerMinute * menit) + (payPerMinute * ((jam) * 60))))
    }

    useEffect(() => {
        _countTotalMenit()
    }, [nilaiLemburPerMenit, waktuMulai])

    useEffect(() => {
        if (waktuSelesai < waktuMulai) {
            setWaktuSelesai(x => x = waktuMulai)
        }
        _countTotalMenit()
    }, [waktuSelesai])

    useEffect(() => {
        _getDaftarLemburPegawai()
    }, [idPegawai])

    return <div className="my-5 bg-white py-5 px-6 rounded-md">
        <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Lembur Pegawai</h1>
        <form onSubmit={e => _saveLemburPegawai(e)}>
            <div className="flex items-end gap-x-2">
                <FormSelectWithLabel
                    label={"Sumber Dana"}
                    optionsDataList={kodeAkunList}
                    optionsLabel={["code", "name"]}
                    optionsValue={"uuid"}
                    optionsLabelIsArray={true}
                    optionsDelimiter={"-"}
                    selectValue={kodeAkun}
                    onchange={(e) => {
                        setKodeAkun(e)
                    }}
                    selectName={`periode`}
                />
                <FormInputWithLabel
                    label={"Tanggal"}
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
                    label={"Bukti Transaksi"}
                    type={"text"}
                    onchange={(e) => {
                        setBuktiTransaksi(e.target.value)
                    }}
                    others={
                        {
                            value: buktiTransaksi,
                            name: "buktiTransaksi"
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"Deskripsi Kerja"}
                    type={"text"}
                    onchange={(e) => {
                        setDekstripsiKerja(e.target.value)
                    }}
                    others={
                        {
                            value: deskripsiKerja,
                            name: "deskripsiKerja"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Keterangan"}
                    type={"text"}
                    onchange={(e) => {
                        setKeteranganKerja(e.target.value)
                    }}
                    others={
                        {
                            value: keteranganKerja,
                            name: "keteranganKerja"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Nilai Lembur Per Menit"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyRupiah(e)
                        setNilaiLemburPerMenit(e.target.value)
                    }}
                    others={
                        {
                            value: nilaiLemburPerMenit,
                            name: "nilaiLemburPerMenit"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Waktu Mulai"}
                    type={"datetime-local"}
                    onchange={(e) => {
                        waktuMulai(e.target.value)
                    }}
                    others={
                        {
                            value: waktuMulai,
                            name: "waktuMulai"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Waktu Selesai"}
                    type={"datetime-local"}
                    onchange={(e) => {
                        setWaktuSelesai(e.target.value)
                    }}
                    others={
                        {
                            value: waktuSelesai,
                            name: "waktuSelesai"
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"Total Jam"}
                    type={"text"}
                    addClassInput="border-none"
                    others={
                        {
                            value: totalJam,
                            name: "totalJam"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Total Menit"}
                    type={"text"}
                    addClassInput="border-none"
                    others={
                        {
                            value: totalMenit,
                            name: "totalMenit"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Total Bayaran"}
                    type={"text"}
                    addClassInput="border-none"
                    disabled={true}
                    others={
                        {
                            value: totalBayaran,
                            name: "totalBayaran"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
        </form>
        <table class="table table-sm table-zebra my-6">
            <tbody>
                {
                    lemburList.map((item) => {
                        return <>
                            <tr>
                                <td>
                                    <b>{item.deskripsi_kerja}</b>
                                </td>
                                <td
                                    colSpan={10}>
                                    <p>{item.keterangan_kerja}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>{item.kode_akun_perkiraan_code} - {item.kode_akun_perkiraan_name}</td>
                                <td>{`${item.tanggal.split("T")[0]} ${convertTo12HoursFormat(item.tanggal.split("T")[1])}`}</td>
                                <td>{item.bukti_transaksi}</td>
                                <td>{`${item.waktu_mulai.split("T")[0]} ${convertTo12HoursFormat(item.waktu_mulai.split("T")[1])}`}</td>
                                <td>{`${item.waktu_selesai.split("T")[0]} ${convertTo12HoursFormat(item.waktu_selesai.split("T")[1])}`}</td>
                                <td>{parseToRupiahText(item.nilai_lembur_per_menit)}</td>
                                <td>{parseToRupiahText(item.total_jam)}</td>
                                <td>{parseToRupiahText(item.total_menit)}</td>
                                <td>{parseToRupiahText(item.total_bayaran)}</td>
                                <td>
                                    <FaTrash
                                        onClick={() => _deleteLembur(item.uuid)}
                                        className="text-red-600 hover:cursor-pointer" size={12}
                                    />
                                </td>
                            </tr>
                        </>
                    })
                }
            </tbody>
        </table>
    </div>
}
export default LemburPegawaiForm