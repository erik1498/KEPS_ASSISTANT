import { useEffect, useState } from "react"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaSave } from "react-icons/fa"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiPPH2126CRUD } from "../../../../../service/endPointList.api"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import { useDataContext } from "../../../../../context/dataContext.context"

const PPH2126PegawaiForm = ({
    idPegawai,
    periode,
    kodeAkunList = []
}) => {
    const { data } = useDataContext()

    const [nilai, setNilai] = useState("0")
    const [kodeAkun, setKodeAkun] = useState(kodeAkunList.length > 0 ? {
        label: `${kodeAkunList[0].code} - ${kodeAkunList[0].name}`,
        value: kodeAkunList[0].uuid
    } : null)
    const [pph2126, setPPH2126] = useState(null)
    const [tanggal, setTanggal] = useState(getHariTanggalFull())
    const [buktiTransaksi, setBuktiTransaksi] = useState()

    const _savePPH2126Pegawai = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiPPH2126CRUD.custom(pph2126 ? `/${pph2126.uuid}` : ``, pph2126 ? "PUT" : "POST", null, {
                data: {
                    pegawai: idPegawai,
                    periode: periode,
                    kode_akun_perkiraan: kodeAkun.value,
                    tanggal: tanggal,
                    bukti_transaksi: buktiTransaksi,
                    nilai: nilai
                }
            }).then(resData => {
                if (!pph2126) {
                    setPPH2126(x => x = resData.data)
                }
            }).catch(err => showError(err))
        }
    }

    const _getPPH2126Pegawai = () => {
        apiPPH2126CRUD
            .custom(`/${idPegawai}/${periode}/${data.tahun}`, "GET")
            .then(resData => {
                if (resData.data?.nilai) {
                    setNilai(parseToRupiahText(resData.data.nilai))
                    setBuktiTransaksi(resData.data.bukti_transaksi)
                    setTanggal(resData.data.tanggal)
                    setPPH2126(resData.data)
                    const kodeAkunGet = kodeAkunList.filter(x => x.uuid == resData.data.kode_akun_perkiraan)
                    if (kodeAkunGet) {
                        setKodeAkun(x => x = {
                            label: `${kodeAkunGet[0].code} - ${kodeAkunGet[0].name}`,
                            value: kodeAkunGet[0].uuid
                        })
                    }
                }
            })
    }

    useEffect(() => {
        _getPPH2126Pegawai()
    }, [idPegawai])

    return <div className="my-5 bg-white py-5 px-6 rounded-md">
        <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">PPH 21/26 Pegawai</h1>
        <form onSubmit={e => _savePPH2126Pegawai(e)}>
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
    </div>
}
export default PPH2126PegawaiForm