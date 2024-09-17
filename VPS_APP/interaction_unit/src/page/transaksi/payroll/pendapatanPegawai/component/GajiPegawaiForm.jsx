import { useEffect, useState } from "react"
import { convertTo12HoursFormat, getBulanByIndex, getBulanList, getBulanListForFormSelect, getHariTanggalFull } from "../../../../../helper/date.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaSave, FaTrash } from "react-icons/fa"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiGajiCRUD } from "../../../../../service/endPointList.api"
import { parseToRupiahText } from "../../../../../helper/number.helper"

const GajiPegawaiForm = ({
    idPegawai,
    kodeAkunList = []
}) => {
    const [periode, setPeriode] = useState()
    const [nilai, setNilai] = useState("0")
    const [kodeAkun, setKodeAkun] = useState()
    const [tanggal, setTanggal] = useState(getHariTanggalFull())
    const [buktiTransaksi, setBuktiTransaksi] = useState()

    const [gajiList, setGajiList] = useState([])

    const _saveGajiPegawai = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiGajiCRUD.custom("", "POST", null, {
                data: {
                    pegawai: idPegawai,
                    periode: periode.value,
                    kode_akun_perkiraan: kodeAkun.value,
                    tanggal: tanggal,
                    bukti_transaksi: buktiTransaksi,
                    nilai: nilai
                }
            }).then(resData => {
                _getDaftarGajiPegawai()
            }).catch(err => showError(err))
        }
    }

    const _getDaftarGajiPegawai = () => {
        apiGajiCRUD
            .custom(`/${idPegawai}`, "GET")
            .then(resData => {
                setGajiList(resData.data)
            })
    }

    const _deleteGaji = (uuid) => {
        apiGajiCRUD
            .custom(`/${uuid}`, "DELETE")
            .then(() => {
                _getDaftarGajiPegawai()
            }).catch(err => showError(err))
    }

    useEffect(() => {
        _getDaftarGajiPegawai()
    }, [idPegawai])

    return <div className="my-5">
        <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Gaji Pegawai</h1>
        <form onSubmit={e => _saveGajiPegawai(e)}>
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
                <FormInputWithLabel
                    label={"Nilai"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyRupiah(e)
                        setNilai(e.target.value)
                    }}
                    others={
                        {
                            value: nilai,
                            name: "nilai"
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
                    gajiList.map((item) => {
                        return <>
                            <tr>
                                <td>{getBulanByIndex(item.periode - 1)}</td>
                                <td>{item.kode_akun_perkiraan_code} - {item.kode_akun_perkiraan_name}</td>
                                <td>{`${item.tanggal.split("T")[0]} ${convertTo12HoursFormat(item.tanggal.split("T")[1])}`}</td>
                                <td>{item.bukti_transaksi}</td>
                                <td>{parseToRupiahText(item.nilai)}</td>
                                <td>
                                    <FaTrash
                                        onClick={() => _deleteGaji(item.uuid)}
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
export default GajiPegawaiForm