import { useEffect, useState } from "react"
import { convertTo12HoursFormat, formatDate, getHariTanggalFull } from "../../../../../helper/date.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaSave, FaTrash } from "react-icons/fa"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiPiutangKaryawanCRUD } from "../../../../../service/endPointList.api"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import { useDataContext } from "../../../../../context/dataContext.context"
import { TipePiutangKaryawan } from "../../../../../config/objectList.config"

const PiutangKaryawanPegawaiForm = ({
    idPegawai,
    periode,
    kodeAkunList = []
}) => {
    const { data } = useDataContext()

    const [type, setType] = useState(TipePiutangKaryawan[0])
    const [totalUtangPegawai, setTotalUtangPegawai] = useState(0)
    const [nilai, setNilai] = useState("0")
    const [kodeAkun, setKodeAkun] = useState(kodeAkunList.length > 0 ? {
        label: `${kodeAkunList[0].code} - ${kodeAkunList[0].name}`,
        value: kodeAkunList[0].uuid
    } : null)
    const [piutangKaryawan, setPiutangKaryawan] = useState([])
    const [keterangan, setKeterangan] = useState()
    const [tanggal, setTanggal] = useState(getHariTanggalFull())
    const [buktiTransaksi, setBuktiTransaksi] = useState()

    const _savePiutangKaryawanPegawai = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiPiutangKaryawanCRUD.custom("", "POST", null, {
                data: {
                    pegawai: idPegawai,
                    periode: periode,
                    type: type.value,
                    kode_akun_perkiraan: kodeAkun.value,
                    tanggal: tanggal,
                    bukti_transaksi: buktiTransaksi,
                    keterangan: keterangan,
                    nilai: nilai
                }
            }).then(resData => {
                _getPiutangKaryawanPegawai()
            }).catch(err => showError(err))
        }
    }

    const _deletePiutangKaryawan = (uuid) => {
        apiPiutangKaryawanCRUD
            .custom(`/${uuid}`, "DELETE")
            .then(() => {
                _getPiutangKaryawanPegawai()
            }).catch(err => showError(err))
    }

    const _getPiutangKaryawanPegawai = () => {
        apiPiutangKaryawanCRUD
            .custom(`/${idPegawai}/${periode}/${data.tahun}`, "GET")
            .then(resData => {
                setPiutangKaryawan(resData.data)
            })
        apiPiutangKaryawanCRUD
            .custom(`/total_piutang/${idPegawai}`, "GET")
            .then(resData => {
                setTotalUtangPegawai(x => x = 0)
                if (resData.data.total) {
                    setTotalUtangPegawai(x => x = resData.data.total)
                }
            })
    }

    useEffect(() => {
        _getPiutangKaryawanPegawai()
    }, [idPegawai])

    return <div className="my-5 bg-white py-5 px-6 rounded-md">
        <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Piutang Pegawai</h1>
        <form onSubmit={e => _savePiutangKaryawanPegawai(e)}>
            <p className="my-3 mx-1 font-bold text-sm">Total Piutang</p>
            <p className="my-3 mx-1 font-bold text-xl">Rp. {parseToRupiahText(totalUtangPegawai)}</p>
            <div className="flex items-end gap-x-2">
                <FormSelectWithLabel
                    label={"Kode Akun"}
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
                <FormSelectWithLabel
                    label={"Tipe Piutang Karyawan"}
                    optionsDataList={TipePiutangKaryawan}
                    optionsLabel={"label"}
                    optionsValue={"value"}
                    selectValue={type}
                    onchange={(e) => {
                        setType(e)
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
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"Keterangan"}
                    type={"text"}
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
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
        </form>
        <table class="table table-sm table-zebra my-6">
            <tbody>
                {
                    piutangKaryawan.map((item) => {
                        return <>
                            <tr>
                                <td
                                    colSpan={11}>
                                    <p>{item.keterangan}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>{item.kode_akun_perkiraan_code} - {item.kode_akun_perkiraan_name}</td>
                                <td>{`${formatDate(item.tanggal.split("T")[0], false)} ${convertTo12HoursFormat(item.tanggal.split("T")[1])}`}</td>
                                <td>{item.bukti_transaksi}</td>
                                <td>{parseToRupiahText(item.nilai)}</td>
                                <td>
                                    <FaTrash
                                        onClick={() => _deletePiutangKaryawan(item.uuid)}
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
export default PiutangKaryawanPegawaiForm