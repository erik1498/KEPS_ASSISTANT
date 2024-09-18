import { useEffect, useState } from "react"
import { convertTo12HoursFormat, getBulanByIndex, getBulanList, getBulanListForFormSelect, getHariTanggalFull } from "../../../../../helper/date.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaSave, FaTrash } from "react-icons/fa"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiGajiCRUD, apiTunjanganUangCRUD } from "../../../../../service/endPointList.api"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import { useDataContext } from "../../../../../context/dataContext.context"
import { BPJSKaryawanPersentase, BPJSKesehatanPersentase, JHTKaryawanPersentase, JHTPersentase, JKKPersentase, JKMPersentase, JPKaryawanPersentase, JPPersentase } from "../../../../../config/objectList.config"

const TunjanganUangPegawaiForm = ({
    idPegawai,
    kodeAkunList = []
}) => {

    const { data } = useDataContext()

    const [periode, setPeriode] = useState()
    const [bonus, setBonus] = useState("0")
    const [insentif, setInsentif] = useState("0")
    const [thr, setTHR] = useState("0")
    const [kodeAkun, setKodeAkun] = useState()
    const [tanggal, setTanggal] = useState(getHariTanggalFull())
    const [buktiTransaksi, setBuktiTransaksi] = useState()
    const [gaji, setGaji] = useState()

    const [bpjsKesehatan, setBPJSKesehatan] = useState("0")
    const [jkk, setJKK] = useState("0")
    const [jkm, setJKM] = useState("0")
    const [jht, setJHT] = useState("0")
    const [jp, setJP] = useState("0")

    const [bpjsKaryawan, setBPJSKaryawan] = useState("0")
    const [jpKaryawan, setJPKaryawan] = useState("0")
    const [jhtKaryawan, setJHTKaryawan] = useState("0")
    const [kodeAkunBpjsKaryawan, setKodeAkunBPJSKaryawan] = useState("0")
    const [kodeAkunJPKaryawan, setKodeAkunJPKaryawan] = useState("0")
    const [kodeAkunJHTKaryawan, setKodeAkunJHTKaryawan] = useState("0")

    const [tunjanganUangList, setTunjanganUangList] = useState([])
    const [gajiList, setGajiList] = useState([])

    const _saveTunjanganUangPegawai = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiTunjanganUangCRUD.custom("", "POST", null, {
                data: {
                    pegawai: idPegawai,
                    periode: periode.value,
                    gaji: gaji.value,
                    kode_akun_perkiraan: kodeAkun.value,
                    tanggal: tanggal,
                    bukti_transaksi: buktiTransaksi,
                    bonus: bonus,
                    insentif: insentif,
                    thr: thr,
                    bpjs_kesehatan: bpjsKesehatan,
                    bpjs_kesehatan_persentase: BPJSKesehatanPersentase,
                    jkk: jkk,
                    jkk_persentase: JKKPersentase,
                    jkm: jkm,
                    jkm_persentase: JKMPersentase,
                    jht: jht,
                    jht_persentase: JHTPersentase,
                    jp: jp,
                    jp_persentase: JPPersentase,
                    bpjs_karyawan: bpjsKaryawan,
                    bpjs_karyawan_persentase: BPJSKaryawanPersentase,
                    kode_akun_perkiraan_bpjs_karyawan: kodeAkunBpjsKaryawan.value,
                    jp_karyawan: jpKaryawan,
                    jp_karyawan_persentase: JPKaryawanPersentase,
                    kode_akun_perkiraan_jp_karyawan: kodeAkunJPKaryawan.value,
                    jht_karyawan: jhtKaryawan,
                    jht_karyawan_persentase: JHTKaryawanPersentase,
                    kode_akun_perkiraan_jht_karyawan: kodeAkunJHTKaryawan.value
                }
            }).then(resData => {
                _getDaftarTunjanganUangPegawai()
            }).catch(err => showError(err))
        }
    }

    const _getDaftarTunjanganUangPegawai = () => {
        apiTunjanganUangCRUD
            .custom(`/${idPegawai}/${data.tahun}`, "GET")
            .then(resData => {
                setTunjanganUangList(resData.data)
            })
    }

    const _deleteTunjanganUang = (uuid) => {
        apiTunjanganUangCRUD
            .custom(`/${uuid}`, "DELETE")
            .then(() => {
                _getDaftarTunjanganUangPegawai()
            }).catch(err => showError(err))
    }

    const _getDaftarGajiPegawai = () => {
        apiGajiCRUD
            .custom(`/${idPegawai}/${data.tahun}`)
            .then(resData => {
                setGajiList(x => x = resData.data)
                if (gajiList.length > 0) {
                    setGaji(x => x = {
                        label: gajiList[0].bukti_transaksi,
                        value: gajiList[0].uuid
                    })
                }
            })
    }

    const _hitungTunjangan = () => {
        const gajiGet = gajiList.filter(x => x.uuid == gaji.value).at(0)

        if (gajiGet) {

            setPeriode(x => x = {
                label: getBulanByIndex(gajiGet.periode - 1),
                value: gajiGet.periode
            })

            setBPJSKesehatan(x => x = (gajiGet.nilai * BPJSKesehatanPersentase).toFixed(0))
            setJKK(x => x = (gajiGet.nilai * JKKPersentase).toFixed(0))
            setJKM(x => x = (gajiGet.nilai * JKMPersentase).toFixed(0))
            setJHT(x => x = (gajiGet.nilai * JHTPersentase).toFixed(0))
            setJP(x => x = (gajiGet.nilai * JPPersentase).toFixed(0))

            setBPJSKaryawan(x => x = (gajiGet.nilai * BPJSKaryawanPersentase).toFixed(0))
            setJPKaryawan(x => x = (gajiGet.nilai * JPKaryawanPersentase).toFixed(0))
            setJHTKaryawan(x => x = (gajiGet.nilai * JHTKaryawanPersentase).toFixed(0))
        }
    }

    useEffect(() => {
        if (gaji) {
            _hitungTunjangan()
        }
    }, [gaji])

    useEffect(() => {
        _getDaftarTunjanganUangPegawai()
        _getDaftarGajiPegawai()
    }, [idPegawai])

    return <div className="my-5">
        <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Tunjangan Uang Pegawai</h1>
        <form onSubmit={e => _saveTunjanganUangPegawai(e)}>
            <div className="flex items-end gap-x-2">
                <FormSelectWithLabel
                    label={"Pilih Periode"}
                    optionsDataList={getBulanListForFormSelect()}
                    optionsLabel={"label"}
                    optionsValue={"value"}
                    selectValue={periode}
                    disabled={true}
                    selectName={`periode`}
                />
                <FormSelectWithLabel
                    label={"Pilih Sumber Nilai Gaji"}
                    optionsDataList={gajiList}
                    optionsLabel={"bukti_transaksi"}
                    optionsValue={"uuid"}
                    selectValue={gaji}
                    onchange={(e) => {
                        setGaji(e)
                    }}
                    selectName={`gaji`}
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
                    label={"Bonus"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyRupiah(e)
                        setBonus(e.target.value)
                    }}
                    others={
                        {
                            value: bonus,
                            name: "bonus"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Insentif"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyRupiah(e)
                        setInsentif(e.target.value)
                    }}
                    others={
                        {
                            value: insentif,
                            name: "insentif"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"THR"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyRupiah(e)
                        setTHR(e.target.value)
                    }}
                    others={
                        {
                            value: thr,
                            name: "thr"
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"BPJS Kesehatan"}
                    type={"text"}
                    disabled={true}
                    addClassInput="border-none"
                    others={
                        {
                            value: parseToRupiahText(bpjsKesehatan),
                            name: "bpjsKesehatan"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"JKK"}
                    type={"text"}
                    disabled={true}
                    addClassInput="border-none"
                    others={
                        {
                            value: parseToRupiahText(jkk),
                            name: "jkk"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"JKM"}
                    type={"text"}
                    disabled={true}
                    addClassInput="border-none"
                    others={
                        {
                            value: parseToRupiahText(jkm),
                            name: "jkm"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"JHT"}
                    type={"text"}
                    disabled={true}
                    addClassInput="border-none"
                    others={
                        {
                            value: parseToRupiahText(jht),
                            name: "jht"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"JP"}
                    type={"text"}
                    disabled={true}
                    addClassInput="border-none"
                    others={
                        {
                            value: parseToRupiahText(jp),
                            name: "jp"
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"BPJS Karyawan"}
                    type={"text"}
                    disabled={true}
                    addClassInput="border-none"
                    others={
                        {
                            value: parseToRupiahText(bpjsKaryawan),
                            name: "bpjsKaryawan"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Sumber Dana"}
                    optionsDataList={kodeAkunList}
                    optionsLabel={["code", "name"]}
                    optionsValue={"uuid"}
                    optionsLabelIsArray={true}
                    optionsDelimiter={"-"}
                    selectValue={kodeAkunBpjsKaryawan}
                    onchange={(e) => {
                        setKodeAkunBPJSKaryawan(e)
                    }}
                    selectName={`periode`}
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"JP Karyawan"}
                    type={"text"}
                    disabled={true}
                    addClassInput="border-none"
                    others={
                        {
                            value: parseToRupiahText(jpKaryawan),
                            name: "jpKaryawan"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Sumber Dana"}
                    optionsDataList={kodeAkunList}
                    optionsLabel={["code", "name"]}
                    optionsValue={"uuid"}
                    optionsLabelIsArray={true}
                    optionsDelimiter={"-"}
                    selectValue={kodeAkunJPKaryawan}
                    onchange={(e) => {
                        setKodeAkunJPKaryawan(e)
                    }}
                    selectName={`periode`}
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"JHT Karyawan"}
                    type={"text"}
                    disabled={true}
                    addClassInput="border-none"
                    others={
                        {
                            value: parseToRupiahText(jhtKaryawan),
                            name: "jhtKaryawan"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Sumber Dana"}
                    optionsDataList={kodeAkunList}
                    optionsLabel={["code", "name"]}
                    optionsValue={"uuid"}
                    optionsLabelIsArray={true}
                    optionsDelimiter={"-"}
                    selectValue={kodeAkunJHTKaryawan}
                    onchange={(e) => {
                        setKodeAkunJHTKaryawan(e)
                    }}
                    selectName={`periode`}
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
        </form>
        <table class="table table-sm my-6">
            <thead className="font-bold text-sm">
                <th>Periode</th>
                <th>Sumber Dana</th>
                <th>Tanggal</th>
                <th>Bukti Transaksi</th>
                <th></th>
            </thead>
            <tbody>
                {
                    tunjanganUangList.map((item) => {
                        return <>
                            <tr>
                                <td>
                                    {getBulanByIndex(item.periode - 1)}
                                    <FaTrash
                                        onClick={() => _deleteTunjanganUang(item.uuid)}
                                        className="text-red-600 hover:cursor-pointer mt-4" size={12}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td rowSpan={16}></td>
                                <td>{item.kode_akun_perkiraan_code} - {item.kode_akun_perkiraan_name}</td>
                                <td>{`${item.tanggal.split("T")[0]} ${convertTo12HoursFormat(item.tanggal.split("T")[1])}`}</td>
                                <td colSpan={2}>{item.bukti_transaksi}</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr className="text-gray-500">
                                <th>Bonus</th>
                                <th>Insentif</th>
                                <th>THR</th>
                            </tr>
                            <tr>
                                <td>{parseToRupiahText(item.bonus)}</td>
                                <td>{parseToRupiahText(item.insentif)}</td>
                                <td>{parseToRupiahText(item.thr)}</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr className="text-gray-500">
                                <th>BPJS Kesehatan</th>
                                <th>JKK</th>
                                <th>JKM</th>
                                <th>JHT</th>
                                <th>JP</th>
                            </tr>
                            <tr>
                                <td>{parseToRupiahText(item.bpjs_kesehatan)}</td>
                                <td>{parseToRupiahText(item.jkk)}</td>
                                <td>{parseToRupiahText(item.jkm)}</td>
                                <td>{parseToRupiahText(item.jht)}</td>
                                <td>{parseToRupiahText(item.jp)}</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr className="text-gray-500">
                                <th>BPJS Karyawan</th>
                                <th>Sumber Dana BPJS Karyawan</th>
                            </tr>
                            <tr>
                                <td>{parseToRupiahText(item.bpjs_karyawan)}</td>
                                <td>{item.kode_akun_perkiraan_code_bpjs_karyawan} - {item.kode_akun_perkiraan_name_bpjs_karyawan}</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr className="text-gray-500">
                                <th>JP Karyawan</th>
                                <th>Sumber Dana JP Karyawan</th>
                            </tr>
                            <tr>
                                <td>{parseToRupiahText(item.jp_karyawan)}</td>
                                <td>{item.kode_akun_perkiraan_code_jp_karyawan} - {item.kode_akun_perkiraan_name_jp_karyawan}</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr className="text-gray-500">
                                <th>JHT Karyawan</th>
                                <th>Sumber Dana JHT Karyawan</th>
                            </tr>
                            <tr>
                                <td>{parseToRupiahText(item.jht_karyawan)}</td>
                                <td>{item.kode_akun_perkiraan_code_jht_karyawan} - {item.kode_akun_perkiraan_name_jht_karyawan}</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                        </>
                    })
                }
            </tbody>
        </table>
    </div>
}
export default TunjanganUangPegawaiForm