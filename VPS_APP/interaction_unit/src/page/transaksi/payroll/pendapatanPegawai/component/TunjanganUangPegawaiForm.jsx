import { useEffect, useState } from "react"
import { convertTo12HoursFormat, getBulanByIndex, getBulanList, getBulanListForFormSelect, getHariTanggalFull } from "../../../../../helper/date.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaSave, FaTrash } from "react-icons/fa"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiTunjanganUangCRUD } from "../../../../../service/endPointList.api"
import { parseRupiahToFloat, parseToRupiahText } from "../../../../../helper/number.helper"
import { useDataContext } from "../../../../../context/dataContext.context"
import { BPJSKaryawanPersentase, BPJSKesehatanPersentase, JHTKaryawanPersentase, JHTPersentase, JKKPersentase, JKMPersentase, JPKaryawanPersentase, JPPersentase } from "../../../../../config/objectList.config"
import { initialKodeAkunValue } from "../../../../../helper/select.helper"

const TunjanganUangPegawaiForm = ({
    idPegawai,
    gaji,
    gajiUpdated,
    setGajiDeleted = () => { },
    periode,
    kodeAkunList = []
}) => {

    const { data } = useDataContext()

    const [bonus, setBonus] = useState("0")
    const [insentif, setInsentif] = useState("0")
    const [thr, setTHR] = useState("0")
    const [kodeAkun, setKodeAkun] = useState(kodeAkunList.length > 0 ? {
        label: `${kodeAkunList[0].code} - ${kodeAkunList[0].name}`,
        value: kodeAkunList[0].uuid
    } : null)
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
    const [kodeAkunBpjsKaryawan, setKodeAkunBPJSKaryawan] = useState(kodeAkunList.length > 0 ? {
        label: `${kodeAkunList[0].code} - ${kodeAkunList[0].name}`,
        value: kodeAkunList[0].uuid
    } : null)
    const [kodeAkunJPKaryawan, setKodeAkunJPKaryawan] = useState(kodeAkunList.length > 0 ? {
        label: `${kodeAkunList[0].code} - ${kodeAkunList[0].name}`,
        value: kodeAkunList[0].uuid
    } : null)
    const [kodeAkunJHTKaryawan, setKodeAkunJHTKaryawan] = useState(kodeAkunList.length > 0 ? {
        label: `${kodeAkunList[0].code} - ${kodeAkunList[0].name}`,
        value: kodeAkunList[0].uuid
    } : null)

    const [tunjanganUang, setTunjanganUang] = useState()

    const _saveTunjanganUangPegawai = async (e, validationNeed = true) => {
        let validation = false
        if (validationNeed) {
            e.preventDefault()
        }
        validation = validationNeed ? await formValidation(e.target) : true
        if (validation) {
            apiTunjanganUangCRUD.custom(tunjanganUang ? `/${tunjanganUang.uuid}` : ``, tunjanganUang ? "PUT" : "POST", null, {
                data: {
                    pegawai: idPegawai,
                    periode: periode,
                    gaji: gaji.uuid,
                    kode_akun_perkiraan: kodeAkun?.value,
                    tanggal: tanggal,
                    bukti_transaksi: buktiTransaksi,
                    bonus: `${bonus}`,
                    insentif: `${insentif}`,
                    thr: `${thr}`,
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
                    kode_akun_perkiraan_bpjs_karyawan: kodeAkunBpjsKaryawan?.value,
                    jp_karyawan: jpKaryawan,
                    jp_karyawan_persentase: JPKaryawanPersentase,
                    kode_akun_perkiraan_jp_karyawan: kodeAkunJPKaryawan?.value,
                    jht_karyawan: jhtKaryawan,
                    jht_karyawan_persentase: JHTKaryawanPersentase,
                    kode_akun_perkiraan_jht_karyawan: kodeAkunJHTKaryawan?.value
                }
            }).then(resData => {
                setGajiDeleted(x => x = false)
                if (!tunjanganUang) {
                    setTunjanganUang(x => x = resData.data)
                }
                if (validationNeed) {
                    showAlert("Berhasil", "Data Tunjangan Uang Berhasil Disimpan")
                }
            }).catch(err => showError(err))
        }
    }


    const _deleteDataTunjanganUang = () => {
        apiTunjanganUangCRUD
            .custom(`/${tunjanganUang.uuid}`, "DELETE")
            .then(() => {
                setTanggal(getHariTanggalFull())
                setBuktiTransaksi(x => x = "")
                setBonus(x => x = 0)
                setInsentif(x => x = 0)
                setTHR(x => x = 0)
                setKodeAkun(kodeAkunList.length > 0 ? {
                    label: `${kodeAkunList[0].code} - ${kodeAkunList[0].name}`,
                    value: kodeAkunList[0].uuid
                } : null)
                setTunjanganUang(null)
                setBPJSKaryawan(0)
                setKodeAkunBPJSKaryawan(kodeAkunList.length > 0 ? {
                    label: `${kodeAkunList[0].code} - ${kodeAkunList[0].name}`,
                    value: kodeAkunList[0].uuid
                } : null)
                setJPKaryawan(0)
                setKodeAkunJPKaryawan(kodeAkunList.length > 0 ? {
                    label: `${kodeAkunList[0].code} - ${kodeAkunList[0].name}`,
                    value: kodeAkunList[0].uuid
                } : null)
                setJHTKaryawan(0)
                setKodeAkunJHTKaryawan(kodeAkunList.length > 0 ? {
                    label: `${kodeAkunList[0].code} - ${kodeAkunList[0].name}`,
                    value: kodeAkunList[0].uuid
                } : null)
                showAlert("Berhasil", "Data Tunjangan Uang Berhasil DiHapus")
                setGajiDeleted(x => x = true)
            }).catch(err => showError(err))
    }

    const _getTunjanganUangPegawai = () => {
        apiTunjanganUangCRUD
            .custom(`/${idPegawai}/${periode}/${data.tahun}`, "GET")
            .then(resData => {
                setBonus(x => x = 0)
                if (resData?.data?.bonus) {
                    setBonus(parseToRupiahText(resData?.data?.bonus))
                }
                setInsentif(x => x = 0)
                if (resData?.data?.insentif) {
                    setInsentif(parseToRupiahText(resData?.data?.insentif))
                }
                setTHR(x => x = 0)
                if (resData?.data?.thr) {
                    setTHR(parseToRupiahText(resData?.data?.thr))
                }
                setBuktiTransaksi(x => x = "")
                if (resData?.data?.bukti_transaksi) {
                    setBuktiTransaksi(resData?.data?.bukti_transaksi)
                }
                setTanggal(x => x = getHariTanggalFull())
                if (resData?.data?.tanggal) {
                    setTanggal(resData?.data?.tanggal)
                }

                if (resData?.data?.kode_akun_perkiraan_code_bpjs_karyawan) {
                    setKodeAkunBPJSKaryawan({
                        label: `${resData?.data?.kode_akun_perkiraan_code_bpjs_karyawan} - ${resData?.data?.kode_akun_perkiraan_name_bpjs_karyawan}`,
                        value: resData?.data?.kode_akun_perkiraan_bpjs_karyawan,
                    })
                }
                if (resData?.data?.kode_akun_perkiraan_code_jp_karyawan) {
                    setKodeAkunJPKaryawan({
                        label: `${resData?.data?.kode_akun_perkiraan_code_jp_karyawan} - ${resData?.data?.kode_akun_perkiraan_name_jp_karyawan}`,
                        value: resData?.data?.kode_akun_perkiraan_jp_karyawan,
                    })
                }
                if (resData?.data?.kode_akun_perkiraan_code_jht_karyawan) {
                    setKodeAkunJHTKaryawan({
                        label: `${resData?.data?.kode_akun_perkiraan_code_jht_karyawan} - ${resData?.data?.kode_akun_perkiraan_name_jht_karyawan}`,
                        value: resData?.data?.kode_akun_perkiraan_jht_karyawan,
                    })
                }

                setTunjanganUang(x => x = resData?.data)
                const kodeAkunGet = kodeAkunList.filter(x => x.uuid == resData?.data?.kode_akun_perkiraan)
                if (kodeAkunGet.length > 0) {
                    setKodeAkun(x => x = {
                        label: `${kodeAkunGet[0].code} - ${kodeAkunGet[0].name}`,
                        value: kodeAkunGet[0].uuid
                    })
                }

                if (resData?.data) {
                    console.log(resData.data)
                    setGajiDeleted(x => x = false)
                }

                if (resData?.data?.bpjs_karyawan != (parseRupiahToFloat(gaji?.nilai) * BPJSKesehatanPersentase).toFixed(0)) {
                    _saveTunjanganUangPegawai(null, false)
                }
            })
    }

    const _hitungTunjangan = () => {
        setBPJSKesehatan(x => x = 0)
        setJKK(x => x = 0)
        setJKM(x => x = 0)
        setJHT(x => x = 0)
        setJP(x => x = 0)

        setBPJSKaryawan(x => x = 0)
        setJPKaryawan(x => x = 0)
        setJHTKaryawan(x => x = 0)
        if (gaji) {
            setBPJSKesehatan(x => x = (parseRupiahToFloat(gaji.nilai) * BPJSKesehatanPersentase).toFixed(0))
            setJKK(x => x = (parseRupiahToFloat(gaji.nilai) * JKKPersentase).toFixed(0))
            setJKM(x => x = (parseRupiahToFloat(gaji.nilai) * JKMPersentase).toFixed(0))
            setJHT(x => x = (parseRupiahToFloat(gaji.nilai) * JHTPersentase).toFixed(0))
            setJP(x => x = (parseRupiahToFloat(gaji.nilai) * JPPersentase).toFixed(0))

            setBPJSKaryawan(x => x = (parseRupiahToFloat(gaji.nilai) * BPJSKaryawanPersentase).toFixed(0))
            setJPKaryawan(x => x = (parseRupiahToFloat(gaji.nilai) * JPKaryawanPersentase).toFixed(0))
            setJHTKaryawan(x => x = (parseRupiahToFloat(gaji.nilai) * JHTKaryawanPersentase).toFixed(0))

            _getTunjanganUangPegawai()
        }
    }

    useEffect(() => {
        if (gaji) {
            _hitungTunjangan()
        }
    }, [gajiUpdated, gaji])

    return <>
        <div className="my-5 bg-white py-5 px-6 rounded-md">
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
                {
                    tunjanganUang ? <>
                        <button type="button" onClick={() => _deleteDataTunjanganUang()} className="btn btn-sm bg-red-800 mt-4 text-white"><FaTrash /> Hapus Data</button>
                    </> : <></>
                }
            </form>
        </div>
    </>
}
export default TunjanganUangPegawaiForm