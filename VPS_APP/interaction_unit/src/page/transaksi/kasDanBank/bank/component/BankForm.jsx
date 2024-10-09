import { useEffect } from "react";
import { useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel";
import { getHariTanggalFull } from "../../../../../helper/date.helper";
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper";
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel";
import { apiKodeAkunCRUD, apiTransaksiBankCRUD } from "../../../../../service/endPointList.api";
import { formValidation, showError } from "../../../../../helper/form.helper";
import { TipeTransaksi } from "../../../../../config/objectList.config";
import BankTransaksiList from "./BankTransaksiList";
import { parseToRupiahText } from "../../../../../helper/number.helper";

const BankForm = ({
    setAddTransaksiEvent,
    transaksiSelected,
}) => {

    const [loadingSave, setIsLoadingSave] = useState(false)
    const [tipeTransaksi, setTipeTransaksi] = useState({
        label: TipeTransaksi[0].label,
        value: TipeTransaksi[0].value
    })
    const [idTransaksiBank, setIdTransaksiBank] = useState(null)
    const [kodeAkun, setKodeAkun] = useState(null)
    const [hariTanggal, setHariTanggal] = useState(getHariTanggalFull())
    const [buktiTransaksi, setBuktiTransaksi] = useState("")
    const [uraian, setUraian] = useState("")
    const [nilai, setNilai] = useState("0")

    const [kodeAkunList, setKodeAkunList] = useState([])

    const _getDataKodeAkun = (uuid) => {
        apiKodeAkunCRUD
            .custom("/bank", "GET")
            .then(resData => {
                setKodeAkunList(resData.data)
                if (resData.data.length > 0) {
                    if (uuid) {
                        const kodeAkunGet = resData.data.filter(x => x.uuid == uuid)
                        if (kodeAkunGet.length > 0) {
                            setKodeAkun({
                                label: `${kodeAkunGet[0].code} - ${kodeAkunGet[0].name}`,
                                value: kodeAkunGet[0].uuid
                            })
                        }
                    } else {
                        setKodeAkun({
                            label: `${resData.data[0].code} - ${resData.data[0].name}`,
                            value: resData.data[0].uuid
                        })
                    }
                }
            })
    }

    const _saveTransaksiBank = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            setIsLoadingSave(x => x = true)
            apiTransaksiBankCRUD
                .custom(`${transaksiSelected ? "/" + transaksiSelected : ""}`, transaksiSelected ? "PUT" : "POST", null, {
                    data: {
                        tanggal: hariTanggal,
                        bukti_transaksi: buktiTransaksi,
                        kode_akun_perkiraan: kodeAkun.value,
                        uraian: uraian,
                        nilai: nilai,
                        type: tipeTransaksi.value
                    }
                }).then((resData) => {
                    if (transaksiSelected) {
                        setIdTransaksiBank(transaksiSelected)
                    } else {
                        setIdTransaksiBank(resData.data.uuid)
                    }
                    setIsLoadingSave(x => x = false)
                }).catch(err => {
                    showError(err)
                    setIsLoadingSave(x => x = false)
                })
        }
    }

    const _getDetailTransaksi = () => {
        apiTransaksiBankCRUD
            .custom(`/${transaksiSelected}`)
            .then(resData => {
                setHariTanggal(x => x = resData.data.tanggal)
                setBuktiTransaksi(x => x = resData.data.bukti_transaksi)
                setUraian(x => x = resData.data.uraian)
                setNilai(x => x = parseToRupiahText(resData.data.nilai))
                setTipeTransaksi({
                    label: TipeTransaksi.filter(x => x.value == resData.data.type).at(0).label,
                    value: resData.data.type
                })
                _getDataKodeAkun(resData.data.kode_akun_perkiraan)
            }).catch(err => {
                showError(err)
            })
    }

    useEffect(() => {
        if (transaksiSelected) {
            _getDetailTransaksi()
        }
    }, [transaksiSelected])

    useEffect(() => {
        _getDataKodeAkun()
    }, [])

    return <>
        <div className="bg-white rounded-md shadow-2xl h-[70vh] overflow-scroll no-scrollbar relative">
            <div className="sticky top-0 pt-3 px-6 h-max bg-white w-full z-10">
                <div className="mb-3 flex justify-between items-center">
                    <h1 className="uppercase text-gray-600 font-bold">{transaksiSelected != null ? "Edit " : "Tambah "} Transaksi</h1>
                    <button
                        className="btn btn-sm bg-red-900 text-white border-none"
                        onClick={() => setAddTransaksiEvent()}
                    ><FaTimes /> Batalkan Transaksi
                    </button>
                </div>
                <form onSubmit={e => _saveTransaksiBank(e)}>
                    <div className="flex gap-x-2">
                        <FormInputWithLabel
                            label={"Hari/Tanggal"}
                            type={"datetime-local"}
                            onchange={(e) => {
                                setHariTanggal(e.target.value)
                            }}
                            disabled={idTransaksiBank}
                            others={
                                {
                                    value: hariTanggal,
                                    name: "hariTanggal"
                                }
                            }
                        />
                        <FormInputWithLabel
                            label={"Bukti Transaksi"}
                            type={"text"}
                            disabled={idTransaksiBank}
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
                        <FormSelectWithLabel
                            label={"Tipe Transaksi"}
                            optionsDataList={TipeTransaksi}
                            optionsLabel={"label"}
                            disabled={idTransaksiBank}
                            optionsValue={"value"}
                            selectValue={tipeTransaksi}
                            onchange={(e) => {
                                setTipeTransaksi(e)
                            }}
                            selectName={`tipeTransaksi`}
                        />
                        <FormSelectWithLabel
                            label={"Kode Akun"}
                            optionsDataList={kodeAkunList}
                            optionsLabel={["code", "name"]}
                            optionsValue={"uuid"}
                            optionsLabelIsArray={true}
                            optionsDelimiter={"-"}
                            disabled={idTransaksiBank}
                            selectValue={kodeAkun}
                            onchange={(e) => {
                                setKodeAkun(e)
                            }}
                            selectName={`kodeAkun`}
                        />
                        <FormInputWithLabel
                            label={"Uraian"}
                            type={"text"}
                            disabled={idTransaksiBank}
                            onchange={(e) => {
                                setUraian(e.target.value)
                            }}
                            others={
                                {
                                    value: uraian,
                                    name: "uraian"
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
                            disabled={idTransaksiBank}
                            others={
                                {
                                    value: nilai,
                                    name: "nilai"
                                }
                            }
                        />
                    </div>
                    {
                        !idTransaksiBank ? <button disabled={loadingSave} className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> {loadingSave ? "Sedang Menyimpan" : "Simpan"}</button> : <></>
                    }
                </form>
            </div>
            {
                idTransaksiBank ? <>
                    <BankTransaksiList
                        kodeAkunList={kodeAkunList}
                        idTransaksiBank={idTransaksiBank}
                        nilaiTransaksi={nilai}
                        type={tipeTransaksi.value}
                    />
                </> : <></>
            }
        </div>
    </>
};

export default BankForm;