import { useEffect, useState } from "react"
import { convertTo12HoursFormat, getBulanByIndex, getBulanList, getBulanListForFormSelect, getHariTanggalFull } from "../../../../../helper/date.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaSave, FaTrash } from "react-icons/fa"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiHadiahCRUD } from "../../../../../service/endPointList.api"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import { useDataContext } from "../../../../../context/dataContext.context"

const HadiahPegawaiForm = ({
    idPegawai,
    periode,
    kodeAkunList = []
}) => {
    const { data } = useDataContext()
    const [nilai, setNilai] = useState("0")
    const [kodeAkun, setKodeAkun] = useState()
    const [tanggal, setTanggal] = useState(getHariTanggalFull())
    const [buktiTransaksi, setBuktiTransaksi] = useState()
    const [hadiah, setHadiah] = useState()

    const [hadiahList, setHadiahList] = useState([])

    const _saveHadiahPegawai = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiHadiahCRUD.custom("", "POST", null, {
                data: {
                    pegawai: idPegawai,
                    periode: periode,
                    kode_akun_perkiraan: kodeAkun.value,
                    tanggal: tanggal,
                    bukti_transaksi: buktiTransaksi,
                    hadiah: hadiah,
                    nilai: nilai
                }
            }).then(resData => {
                _getDaftarHadiahPegawai()
            }).catch(err => showError(err))
        }
    }

    const _getDaftarHadiahPegawai = () => {
        apiHadiahCRUD
            .custom(`/${idPegawai}/${periode}/${data.tahun}`, "GET")
            .then(resData => {
                setHadiahList(resData.data)
            })
    }

    const _deleteHadiah = (uuid) => {
        apiHadiahCRUD
            .custom(`/${uuid}`, "DELETE")
            .then(() => {
                _getDaftarHadiahPegawai()
            }).catch(err => showError(err))
    }

    useEffect(() => {
        _getDaftarHadiahPegawai()
    }, [idPegawai])

    return <div className="my-5 bg-white py-5 px-6 rounded-md">
        <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Hadiah Pegawai</h1>
        <form onSubmit={e => _saveHadiahPegawai(e)}>
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
                <FormInputWithLabel
                    label={"Hadiah"}
                    type={"text"}
                    onchange={(e) => {
                        setHadiah(e.target.value)
                    }}
                    others={
                        {
                            value: hadiah,
                            name: "hadiah"
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
                <th>Sumber Dana</th>
                <th>Tanggal</th>
                <th>Bukti Transaksi</th>
                <th>Hadiah</th>
                <th>Nilai</th>
                <th>Aksi</th>
            </thead>
            <tbody>
                {
                    hadiahList.map((item) => {
                        return <>
                            <tr>
                                <td>{item.kode_akun_perkiraan_code} - {item.kode_akun_perkiraan_name}</td>
                                <td>{`${item.tanggal.split("T")[0]} ${convertTo12HoursFormat(item.tanggal.split("T")[1])}`}</td>
                                <td>{item.bukti_transaksi}</td>
                                <td>{item.hadiah}</td>
                                <td>{parseToRupiahText(item.nilai)}</td>
                                <td>
                                    <FaTrash
                                        onClick={() => _deleteHadiah(item.uuid)}
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
export default HadiahPegawaiForm