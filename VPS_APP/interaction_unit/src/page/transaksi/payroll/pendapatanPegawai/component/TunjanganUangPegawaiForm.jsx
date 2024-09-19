import { useEffect, useState } from "react"
import { convertTo12HoursFormat, getBulanByIndex, getBulanList, getBulanListForFormSelect, getHariTanggalFull } from "../../../../../helper/date.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaSave, FaTrash } from "react-icons/fa"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiTunjanganUangCRUD } from "../../../../../service/endPointList.api"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import { useDataContext } from "../../../../../context/dataContext.context"
import { BPJSKaryawanPersentase, BPJSKesehatanPersentase, JHTKaryawanPersentase, JHTPersentase, JKKPersentase, JKMPersentase, JPKaryawanPersentase, JPPersentase } from "../../../../../config/objectList.config"

const TunjanganUangPegawaiForm = ({
    idPegawai,
    gaji,
    periode,
    kodeAkunList = []
}) => {

    const { data } = useDataContext()

    const [bonus, setBonus] = useState("0")
    const [insentif, setInsentif] = useState("0")
    const [thr, setTHR] = useState("0")
    const [kodeAkun, setKodeAkun] = useState()
    const [tanggal, setTanggal] = useState(getHariTanggalFull())
    const [buktiTransaksi, setBuktiTransaksi] = useState()

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

    const [tunjanganUang, setTunjanganUang] = useState()

    const _saveTunjanganUangPegawai = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiTunjanganUangCRUD.custom(tunjanganUang ? `/${tunjanganUang.uuid}` : ``, tunjanganUang ? "PUT" : "POST", null, {
                data: {
                    pegawai: idPegawai,
                    periode: periode.value,
                    gaji: gaji.uuid,
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
                _getTunjanganUangPegawai()
            }).catch(err => showError(err))
        }
    }

    const _getTunjanganUangPegawai = () => {
        apiTunjanganUangCRUD
            .custom(`/${idPegawai}/${periode.value}/${data.tahun}`, "GET")
            .then(resData => {
                if (resData.data?.bonus) {
                    setBonus(parseToRupiahText(resData.data.bonus))
                    setInsentif(parseToRupiahText(resData.data.insentif))
                    setTHR(parseToRupiahText(resData.data.thr))
                    setBuktiTransaksi(resData.data.bukti_transaksi)
                    setTanggal(resData.data.tanggal)

                    setBPJSKesehatan(resData.data.bpjs_kesehatan)
                    setJKK(resData.data.jkk)
                    setJKM(resData.data.jkm)
                    setJP(resData.data.jp)

                    setBPJSKaryawan(resData.data.bpjs_karyawan)
                    setKodeAkunBPJSKaryawan({
                        label: `${resData.data.kode_akun_perkiraan_code_bpjs_karyawan} - ${resData.data.kode_akun_perkiraan_name_bpjs_karyawan}`,
                        value: resData.data.kode_akun_perkiraan_bpjs_karyawan,
                    })
                    setJPKaryawan(resData.data.jp_karyawan)
                    setKodeAkunJPKaryawan({
                        label: `${resData.data.kode_akun_perkiraan_code_jp_karyawan} - ${resData.data.kode_akun_perkiraan_name_jp_karyawan}`,
                        value: resData.data.kode_akun_perkiraan_jp_karyawan,
                    })
                    setJHTKaryawan(resData.data.jht_karyawan)
                    setKodeAkunJHTKaryawan({
                        label: `${resData.data.kode_akun_perkiraan_code_jht_karyawan} - ${resData.data.kode_akun_perkiraan_name_jht_karyawan}`,
                        value: resData.data.kode_akun_perkiraan_jht_karyawan,
                    })

                    setTunjanganUang(resData.data)
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

    const _hitungTunjangan = () => {
        if (gaji) {
            setBPJSKesehatan(x => x = (gaji.nilai * BPJSKesehatanPersentase).toFixed(0))
            setJKK(x => x = (gaji.nilai * JKKPersentase).toFixed(0))
            setJKM(x => x = (gaji.nilai * JKMPersentase).toFixed(0))
            setJHT(x => x = (gaji.nilai * JHTPersentase).toFixed(0))
            setJP(x => x = (gaji.nilai * JPPersentase).toFixed(0))

            setBPJSKaryawan(x => x = (gaji.nilai * BPJSKaryawanPersentase).toFixed(0))
            setJPKaryawan(x => x = (gaji.nilai * JPKaryawanPersentase).toFixed(0))
            setJHTKaryawan(x => x = (gaji.nilai * JHTKaryawanPersentase).toFixed(0))

            _getTunjanganUangPegawai()
        }
    }

    useEffect(() => {
        if (gaji) {
            _hitungTunjangan()
        }
    }, [gaji])

    return gaji ? <>
        <div className="my-5">
            <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Tunjangan Uang Pegawai</h1>
            <form onSubmit={e => _saveTunjanganUangPegawai(e)}>
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
        </div>
    </> : <></>
}
export default TunjanganUangPegawaiForm