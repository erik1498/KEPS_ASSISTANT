import { useEffect, useState } from "react"
import { convertTo12HoursFormat, getBulanByIndex, getBulanList, getBulanListForFormSelect, getHariTanggalFull } from "../../../../../helper/date.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaSave, FaTrash } from "react-icons/fa"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiLemburCRUD } from "../../../../../service/endPointList.api"
import { parseToRupiahText } from "../../../../../helper/number.helper"

const LemburPegawaiForm = ({
    idPegawai,
    kodeAkunList = []
}) => {
    const [periode, setPeriode] = useState()
    const [nilai, setNilai] = useState("0")
    const [kodeAkun, setKodeAkun] = useState()
    const [tanggal, setTanggal] = useState(getHariTanggalFull())
    const [buktiTransaksi, setBuktiTransaksi] = useState()

    const [lemburList, setLemburList] = useState([])

    const _saveLemburPegawai = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiLemburCRUD.custom("", "POST", null, {
                data: {
                    pegawai: idPegawai,
                    periode: periode.value,
                    kode_akun_perkiraan: kodeAkun.value,
                    tanggal: tanggal,
                    bukti_transaksi: buktiTransaksi,
                    nilai: nilai
                }
            }).then(resData => {
                _getDaftarLemburPegawai()
            }).catch(err => showError(err))
        }
    }

    const _getDaftarLemburPegawai = () => {
        apiLemburCRUD
            .custom(`/${idPegawai}`, "GET")
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

    useEffect(() => {
        _getDaftarLemburPegawai()
    }, [idPegawai])

    return <div className="my-5">
        <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Lembur Pegawai</h1>
        <form onSubmit={e => _saveLemburPegawai(e)}>
            <div className="flex items-end gap-x-2">
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
                        setBuktiTransaksi(e.target.value)
                    }}
                    others={
                        {
                            value: buktiTransaksi,
                            name: "buktiTransaksi"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Keterangan"}
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
                <FormInputWithLabel
                    label={"Nilai Lembur Per Menit"}
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
                <FormInputWithLabel
                    label={"Waktu Mulai"}
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
                <FormInputWithLabel
                    label={"Waktu Selesai"}
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
                    label={"Total Jam"}
                    type={"text"}
                    onchange={(e) => {
                        setBuktiTransaksi(e.target.value)
                    }}
                    addClassInput="border-none"
                    others={
                        {
                            value: buktiTransaksi,
                            name: "buktiTransaksi"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Total Menit"}
                    type={"text"}
                    onchange={(e) => {
                        setBuktiTransaksi(e.target.value)
                    }}
                    addClassInput="border-none"
                    others={
                        {
                            value: buktiTransaksi,
                            name: "buktiTransaksi"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Total Bayaran"}
                    type={"text"}
                    onchange={(e) => {
                        setBuktiTransaksi(e.target.value)
                    }}
                    addClassInput="border-none"
                    disabled={true}
                    others={
                        {
                            value: buktiTransaksi,
                            name: "buktiTransaksi"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
        </form>
        <table class="table table-sm table-zebra my-6">
            <thead className="font-bold text-md">
                <th>Periode</th>
                <th>Sumber Dana</th>
                <th>Tanggal</th>
                <th>Bukti Transaksi</th>
                <th>Nilai</th>
                <th>Aksi</th>
            </thead>
            <tbody>
                {
                    lemburList.map((item) => {
                        return <>
                            <tr>
                                <td>{getBulanByIndex(item.periode - 1)}</td>
                                <td>{item.kode_akun_perkiraan_code} - {item.kode_akun_perkiraan_name}</td>
                                <td>{`${item.tanggal.split("T")[0]} ${convertTo12HoursFormat(item.tanggal.split("T")[1])}`}</td>
                                <td>{item.bukti_transaksi}</td>
                                <td>{parseToRupiahText(item.nilai)}</td>
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