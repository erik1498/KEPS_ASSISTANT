import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiDaftarGudangCRUD, apiTransferBarangCRUD } from "../../../../../service/endPointList.api"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"

const TransferBarangForm = ({
    setAddTransferBarangEvent = () => { },
    transferBarangEdit,
    getData = () => { }
}) => {
    const [tanggalTransferBarang, setTanggalTransferBarang] = useState(transferBarangEdit?.tanggal ? transferBarangEdit.tanggal : getHariTanggalFull())
    const [kodeTransferBarang, setKodeTransferBarang] = useState(transferBarangEdit?.kode_transfer_barang ? transferBarangEdit.kode_transfer_barang : ``)
    const [gudangAsalTransferBarang, setGudangAsalTransferBarang] = useState(transferBarangEdit?.daftar_gudang_asal ? transferBarangEdit.daftar_gudang_asal : ``)
    const [gudangAkhirTransferBarang, setGudangAkhirTransferBarang] = useState(transferBarangEdit?.daftar_gudang_akhir ? transferBarangEdit.daftar_gudang_akhir : ``)

    const [gudangListAll, setGudangListAll] = useState([])
    const [gudangList, setGudangList] = useState([])

    const [transferBarang, setTransferBarang] = useState()

    const _saveTransferBarang = async () => {
        if (await formValidation()) {
            apiTransferBarangCRUD
                .custom(`${transferBarangEdit?.uuid ? `/${transferBarangEdit.uuid}` : ``}`, transferBarangEdit ? "PUT" : "POST", null, {
                    data: {
                        tanggal: tanggalTransferBarang,
                        kode_transfer_barang: kodeTransferBarang,
                        gudang_asal: gudangAsalTransferBarang.value,
                        gudang_akhir: gudangAkhirTransferBarang.value

                    }
                }).then((resData) => {
                    if (transferBarangEdit) {
                        setTransferBarang(x => x = transferBarangEdit)
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        setTransferBarang(x => x = resData.data)
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                }).catch(err => {
                    showError(err)
                })
        }
    }

    useEffect(() => {
        const gudangListCopy = gudangListAll.filter(x => x.uuid != gudangAsalTransferBarang.value)
        setGudangList(gudangListCopy)
        if (gudangListCopy.length > 0) {
            setGudangAkhirTransferBarang({
                label: gudangListCopy[0].name,
                value: gudangListCopy[0].uuid,
            })
        }
    }, [gudangAsalTransferBarang])

    const _getDataGudang = () => {
        apiDaftarGudangCRUD
            .custom("", "GET")
            .then(resData => {
                setGudangListAll(x => x = resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (transferBarangEdit) {
                        initialDataFromEditObject({
                            editObject: transferBarangEdit.gudang_asal,
                            dataList: resData.data.entry,
                            setState: setGudangAsalTransferBarang,
                            labelKey: "name",
                            valueKey: "uuid",
                        })

                        initialDataFromEditObject({
                            editObject: transferBarangEdit.gudang_akhir,
                            dataList: resData.data.entry,
                            setState: setGudangAkhirTransferBarang,
                            labelKey: "name",
                            valueKey: "uuid",
                        })

                        return
                    }
                    setGudangAsalTransferBarang({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            })
    }

    useEffect(() => {
        _getDataGudang()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{transferBarangEdit ? `Edit` : `Tambahkan`} Transfer Barang</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddTransferBarangEvent()}
                ><FaTimes /> Batalkan Transfer Barang
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Tanggal Transfer Barang"}
                    type={"datetime-local"}
                    onchange={(e) => {
                        setTanggalTransferBarang(e.target.value)
                    }}
                    others={
                        {
                            value: tanggalTransferBarang,
                            disabled: { transferBarang },
                            tanggal: "tanggalTransferBarang"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Kode Transfer Barang"}
                    type={"text"}
                    onchange={(e) => {
                        setKodeTransferBarang(e.target.value)
                    }}
                    others={
                        {
                            value: kodeTransferBarang,
                            disabled: { transferBarang },
                            tanggal: "kodeTransferBarang"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Gudang Asal"}
                    optionsDataList={gudangList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={gudangAsalTransferBarang}
                    disabled={transferBarang}
                    onchange={(e) => {
                        setGudangAsalTransferBarang(e)
                    }}
                    selectName={`gudangAsalTransferBarang`}
                />
                <FormSelectWithLabel
                    label={"Gudang Akhir"}
                    optionsDataList={gudangList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={gudangAkhirTransferBarang}
                    disabled={transferBarang}
                    onchange={(e) => {
                        setGudangAkhirTransferBarang(e)
                    }}
                    selectName={`gudangAkhirTransferBarang`}
                />
            </div>
            {
                transferBarang ? <></> : <>
                    <button className="btn btn-sm bg-green-800 mt-4 text-white"
                        onClick={() => {
                            _saveTransferBarang()
                        }}
                    ><FaSave /> Simpan</button>
                </>
            }
        </div>
    </>
}
export default TransferBarangForm