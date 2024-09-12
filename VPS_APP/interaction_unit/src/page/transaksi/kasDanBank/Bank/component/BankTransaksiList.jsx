import { useEffect, useState } from "react"
import FormInput from "../../../../../component/form/FormInput"
import { parseRupiahToFloat, parseToRupiahText } from "../../../../../helper/number.helper"
import FormSelect from "../../../../../component/form/FormSelect"
import { FaPlus, FaSave, FaTrash } from "react-icons/fa"
import { apiKodeAkunCRUD, apiRincianTransaksiBankCRUD } from "../../../../../service/endPointList.api"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { initialKodeAkunValue } from "../../../../../helper/select.helper"

const BankTransaksiList = ({
    idTransaksiBank,
    nilaiTransaksi = 0,
    type = 1
}) => {
    const [totalDebetKredit, setTotalDebetKredit] = useState({
        totalDebet: type == 1 ? nilaiTransaksi : 0,
        totalKredit: type == 0 ? nilaiTransaksi : 0
    })

    const [kodeAkunList, setKodeAkunList] = useState([])

    const [transaksiDeleted, setTransaksiDeleted] = useState([])

    const [transaksi, setTransaksi] = useState(
        [
            {
                waktu: `${new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours()}:${new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()}:${new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds()}`,
                kodeAkun: initialKodeAkunValue(),
                uraian: "",
                nilai: "0",
            }
        ],
    )

    const deleteTransaksiList = (i) => {
        let transaksiCopy = [...transaksi]
        let transaksiDelete = [...transaksiDeleted]
        if (transaksiCopy[i].uuid) {
            transaksiDelete.push(transaksiCopy[i])
        }
        setTransaksiDeleted(x => x = transaksiDelete)
        setTransaksi(x => x = [])
        transaksiCopy.splice(i, 1)
        setTransaksi(transaksiCopy)
    }

    const _saveTransaksi = async () => {
        if (await formValidation()) {
            postTransaksiFromArray(0)
            deleteTransaksiFromArray(0)
        }
    }

    const deleteTransaksiFromArray = async (index) => {
        if (transaksiDeleted[index]) {
            apiRincianTransaksiBankCRUD
                .custom(`/${transaksiDeleted[index].uuid}`, "DELETE")
                .then(() => {
                    deleteTransaksiFromArray(index += 1)
                }).catch(err => {
                    showError(err)
                })
        }
    }

    const postTransaksiFromArray = async (index) => {
        if (transaksi[index]) {
            apiRincianTransaksiBankCRUD
                .custom(transaksi[index].uuid ? `/${transaksi[index].uuid}` : ``, transaksi[index].uuid ? "PUT" : "POST", null, {
                    data: {
                        kode_akun_perkiraan: transaksi[index].kodeAkun.value,
                        waktu: transaksi[index].waktu,
                        transaksi_bank: idTransaksiBank,
                        uraian: transaksi[index].uraian,
                        nilai: transaksi[index].nilai,
                    }
                })
                .then(resData => {
                    if (!transaksi[index].uuid) {
                        transaksi[index].uuid = resData.data.uuid
                    }
                    postTransaksiFromArray(index += 1)
                }).catch(err => {
                    showError(err)
                })
        }
    }

    const addTransaksi = () => {
        let transaksiCopy = [...transaksi]
        transaksiCopy.push(
            {
                waktu: `${new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours()}:${new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()}:${new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds()}`,
                kodeAkun: initialKodeAkunValue(),
                uraian: "",
                nilai: "0",
            }
        )
        setTransaksi(x => x = transaksiCopy)
    }

    const sumNilaiTransaksi = () => {
        let nilai = 0
        transaksi.map((x) => {
            nilai += parseRupiahToFloat(x.nilai)
        })
        setTotalDebetKredit(x => x = {
            totalDebet: type == 0 ? nilai : nilaiTransaksi,
            totalKredit: type == 1 ? nilai : nilaiTransaksi
        })
    }

    const setTransaksiListItem = (e, i, name) => {
        let transaksiCopy = [...transaksi]
        setTransaksi(x => x = [])
        transaksiCopy[i][name] = e
        setTransaksi(x => x = transaksiCopy)
    }

    useEffect(() => {
        sumNilaiTransaksi()
    }, [transaksi])

    const _getDataKodeAkun = (uuid) => {
        apiKodeAkunCRUD
            .custom("/no_bank", "GET")
            .then(resData => {
                setKodeAkunList(x => x = resData.data.entry)
            })
    }

    const _getRincianTransaksiBank = () => {
        apiRincianTransaksiBankCRUD
            .custom(`/${idTransaksiBank}`, "GET")
            .then(resData => {
                setTransaksi(x => x = resData.data.map((item) => {
                    const kodeAkunSelected = kodeAkunList.filter(x => x.uuid == item.kode_akun_perkiraan).at(0)
                    if (kodeAkunSelected) {
                        return {
                            uuid: item.uuid,
                            nilai: parseToRupiahText(item.nilai),
                            waktu: item.waktu,
                            uraian: item.uraian,
                            kodeAkun: {
                                label: `${kodeAkunSelected.code} - ${kodeAkunSelected.name}`,
                                value: item.kode_akun_perkiraan
                            }
                        }
                    } else {
                        return {
                            uuid: item.uuid,
                            nilai: parseToRupiahText(item.nilai),
                            waktu: item.waktu,
                            uraian: item.uraian,
                            kodeAkun: initialKodeAkunValue()
                        }
                    }
                }))
            }).catch(err => {
                showError(err)
            })
    }

    useEffect(() => {
        _getRincianTransaksiBank()
    }, [kodeAkunList])

    useEffect(() => {
        _getDataKodeAkun()
    }, [])

    return <>
        <div className="flex flex-col px-6 mt-6 w-full">
            <div className="grid grid-cols-7 w-max gap-x-2 items-center">
                <div className="col-span-1">
                    <label className="form-control w-full bg-white">
                        <div className="label">
                            <span className="label-text font-bold">Debet</span>
                        </div>
                    </label>
                </div>
                <div className="col-span-3">
                    <label className="form-control w-full bg-white">
                        <div className="label">
                            <span className="label-text font-bold">Kredit</span>
                        </div>
                    </label>
                </div>
                <div className="col-span-3">
                    <label className="form-control w-full bg-white">
                        <div className="label">
                            <span className="label-text font-bold">Status</span>
                        </div>
                    </label>
                </div>
                <div className="col-span-1">
                    <label className="form-control w-full bg-white">
                        <div className="label">
                            <span className="label-text">{parseToRupiahText(totalDebetKredit.totalDebet)}</span>
                        </div>
                    </label>
                </div>
                <div className="col-span-3">
                    <label className="form-control w-full bg-white">
                        <div className="label">
                            <span className="label-text">{parseToRupiahText(totalDebetKredit.totalKredit)}</span>
                        </div>
                    </label>
                </div>
                <div className="col-span-3">
                    <label className="form-control w-full bg-white">
                        <div className="label">
                            <span className={`label-text font-bold text-white px-3 py-2 rounded-md ${parseRupiahToFloat(totalDebetKredit.totalDebet) == parseRupiahToFloat(totalDebetKredit.totalKredit) ? "bg-green-600" : "bg-red-600"}`}>{parseRupiahToFloat(totalDebetKredit.totalDebet) == parseRupiahToFloat(totalDebetKredit.totalKredit) ? "Seimbang" : "Tidak Seimbang"}</span>
                        </div>
                    </label>
                </div>
            </div>
            <label className="form-control w-full max-w-xs bg-white">
                <div className="label">
                    <span className="flex items-center gap-x-2 label-text text-gray-800 font-bold mt-4">
                        <p>Rincian Transaksi Bank</p>
                    </span>
                </div>
            </label>
            <div className="grid w-full grid-cols-12 gap-x-2 border-b-2">
                <div className="col-span-1">
                    <label className="form-control w-full max-w-xs bg-white">
                        <div className="label">
                            <span className="label-text text-gray-600">Waktu</span>
                        </div>
                    </label>
                </div>
                <div className="col-span-3">
                    <label className="form-control w-full max-w-xs bg-white">
                        <div className="label">
                            <span className="label-text text-gray-600">Kode Akun</span>
                        </div>
                    </label>
                </div>
                <div className="col-span-6">
                    <label className="form-control w-full max-w-xs bg-white">
                        <div className="label">
                            <span className="label-text text-gray-600">Uraian</span>
                        </div>
                    </label>
                </div>
                <div className="col-span-2">
                    <label className="form-control w-full max-w-xs bg-white">
                        <div className="label">
                            <span className="label-text text-gray-600">Nilai</span>
                        </div>
                    </label>
                </div>
            </div>
            <div className="grid w-full items-end grid-cols-12 gap-x-2">
                {
                    transaksi.map((item, i) => {
                        return <>
                            <div className="mb-5 col-span-1">
                                <FormInput
                                    name={`waktu_${i}`}
                                    type={"time"}
                                    value={item.waktu}
                                    addClass={"required"}
                                    onchange={(e) => setTransaksiListItem(e.target.value, i, `waktu`)}
                                    other={
                                        {
                                            autoComplete: false,
                                            step: 1
                                        }
                                    }
                                />
                            </div>
                            <div className="mb-5 col-span-3">
                                <FormSelect
                                    optionsDataList={kodeAkunList}
                                    optionsLabel={["code", "name"]}
                                    optionsValue={"uuid"}
                                    optionsLabelIsArray={true}
                                    optionsDelimiter={"-"}
                                    selectValue={item.kodeAkun}
                                    onchange={(e) => {
                                        setTransaksiListItem(e, i, 'kodeAkun')
                                    }}
                                    addClass={"required"}
                                    selectName={`kodeAkun_${i}`}
                                />
                            </div>
                            <div className="mb-5 col-span-6">
                                <FormInput
                                    name={`uraian_${i}`}
                                    type={"text"}
                                    value={item.uraian}
                                    addClass={"required"}
                                    onchange={(e) => setTransaksiListItem(e.target.value, i, `uraian`)}
                                    other={
                                        {
                                            autoComplete: false
                                        }
                                    }
                                />
                            </div>
                            <div className="mb-5 col-span-2">
                                <div className="w-full indicator">
                                    <span className="indicator-item indicator-bottom badge bg-red-800 text-white px-2 py-4 cursor-pointer" onClick={() => deleteTransaksiList(i)}><FaTrash /></span>
                                    <FormInput
                                        name={`nilai_${i}`}
                                        type={"text"}
                                        value={parseToRupiahText(item.nilai)}
                                        onchange={(e) => {
                                            inputOnlyRupiah(e)
                                            setTransaksiListItem(e.target.value, i, `nilai`)
                                        }}
                                        other={
                                            {
                                                autoComplete: false,
                                            }
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    })
                }
            </div>
            <div className="flex sticky bottom-0 bg-white py-3 w-full items-end gap-x-2">
                <button className="btn btn-sm bg-blue-800 mt-4 text-white" onClick={() => addTransaksi()}><FaPlus /> Tambah Transaksi</button>
                <button className="btn btn-sm bg-green-800 mt-4 text-white" onClick={() => _saveTransaksi()}><FaSave /> Simpan</button>
            </div>
        </div>
    </>
}
export default BankTransaksiList