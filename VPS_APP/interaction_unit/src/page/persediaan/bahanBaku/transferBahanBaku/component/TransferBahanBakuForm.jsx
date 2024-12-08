import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiDaftarGudangCRUD, apiTransferBahanBakuCRUD } from "../../../../../service/endPointList.api"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import TransferBahanBakuList from "./TransferBahanBakuList"

const TransferBahanBakuForm = ({
    setAddTransferBahanBakuEvent = () => { },
    transferBahanBakuEdit,
    getData = () => { }
}) => {
    const [tanggalTransferBahanBaku, setTanggalTransferBahanBaku] = useState(transferBahanBakuEdit?.tanggal ? transferBahanBakuEdit.tanggal : getHariTanggalFull())
    const [kodeTransferBahanBaku, setKodeTransferBahanBaku] = useState(transferBahanBakuEdit?.kode_transfer_bahan_baku ? transferBahanBakuEdit.kode_transfer_bahan_baku : ``)
    const [gudangAsalTransferBahanBaku, setGudangAsalTransferBahanBaku] = useState(transferBahanBakuEdit?.daftar_gudang_asal ? transferBahanBakuEdit.daftar_gudang_asal : ``)
    const [gudangAkhirTransferBahanBaku, setGudangAkhirTransferBahanBaku] = useState(transferBahanBakuEdit?.daftar_gudang_akhir ? transferBahanBakuEdit.daftar_gudang_akhir : ``)

    const [gudangListAll, setGudangListAll] = useState([])
    const [gudangList, setGudangList] = useState([])

    const [transferBahanBaku, setTransferBahanBaku] = useState()

    const _saveTransferBahanBaku = async () => {
        if (await formValidation()) {
            apiTransferBahanBakuCRUD
                .custom(`${transferBahanBakuEdit?.uuid ? `/${transferBahanBakuEdit.uuid}` : ``}`, transferBahanBakuEdit ? "PUT" : "POST", null, {
                    data: {
                        tanggal: tanggalTransferBahanBaku,
                        kode_transfer_bahan_baku: kodeTransferBahanBaku,
                        daftar_gudang_asal: gudangAsalTransferBahanBaku.value,
                        daftar_gudang_akhir: gudangAkhirTransferBahanBaku.value
                    }
                }).then((resData) => {
                    if (transferBahanBakuEdit) {
                        setTransferBahanBaku(x => x = transferBahanBakuEdit)
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        setTransferBahanBaku(x => x = resData.data)
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                }).catch(err => {
                    showError(err)
                })
        }
    }

    useEffect(() => {
        const gudangListCopy = gudangListAll.filter(x => x.uuid != gudangAsalTransferBahanBaku.value)
        setGudangList(gudangListCopy)
        if (gudangListCopy.length > 0) {
            setGudangAkhirTransferBahanBaku({
                label: gudangListCopy[0].name,
                value: gudangListCopy[0].uuid,
            })
        }
    }, [gudangAsalTransferBahanBaku])

    const _getDataGudang = () => {
        apiDaftarGudangCRUD
            .custom("", "GET")
            .then(resData => {
                setGudangListAll(x => x = resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (transferBahanBakuEdit) {
                        initialDataFromEditObject({
                            editObject: transferBahanBakuEdit.daftar_gudang_asal,
                            dataList: resData.data.entry,
                            setState: setGudangAsalTransferBahanBaku,
                            labelKey: "name",
                            valueKey: "uuid",
                        })

                        initialDataFromEditObject({
                            editObject: transferBahanBakuEdit.daftar_gudang_akhir,
                            dataList: resData.data.entry,
                            setState: setGudangAkhirTransferBahanBaku,
                            labelKey: "name",
                            valueKey: "uuid",
                        })

                        return
                    }
                    setGudangAsalTransferBahanBaku({
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
                <h1 className="uppercase text-gray-600 font-bold">{transferBahanBakuEdit ? `Edit` : `Tambahkan`} Transfer Bahan Baku</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => {
                        getData()
                        setAddTransferBahanBakuEvent()
                    }}
                ><FaTimes /> Batalkan Transfer Bahan Baku
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Tanggal Transfer Bahan Baku"}
                    type={"datetime-local"}
                    onchange={(e) => {
                        setTanggalTransferBahanBaku(e.target.value)
                    }}
                    others={
                        {
                            value: tanggalTransferBahanBaku,
                            disabled: transferBahanBaku,
                            tanggal: "tanggalTransferBahanBaku"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Kode Transfer Bahan Baku"}
                    type={"text"}
                    onchange={(e) => {
                        setKodeTransferBahanBaku(e.target.value)
                    }}
                    others={
                        {
                            value: kodeTransferBahanBaku,
                            disabled: transferBahanBaku,
                            tanggal: "kodeTransferBahanBaku"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Gudang Asal"}
                    optionsDataList={gudangList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={gudangAsalTransferBahanBaku}
                    disabled={transferBahanBaku}
                    onchange={(e) => {
                        setGudangAsalTransferBahanBaku(e)
                    }}
                    selectName={`gudangAsalTransferBahanBaku`}
                />
                <FormSelectWithLabel
                    label={"Gudang Akhir"}
                    optionsDataList={gudangList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={gudangAkhirTransferBahanBaku}
                    disabled={transferBahanBaku}
                    onchange={(e) => {
                        setGudangAkhirTransferBahanBaku(e)
                    }}
                    selectName={`gudangAkhirTransferBahanBaku`}
                />
            </div>
            {
                transferBahanBaku ? <>
                    <TransferBahanBakuList
                        transferBahanBaku={transferBahanBaku}
                    />
                </> : <>
                    <button className="btn btn-sm bg-green-800 mt-4 text-white"
                        onClick={() => {
                            _saveTransferBahanBaku()
                        }}
                    ><FaSave /> Simpan</button>
                </>
            }
            {
                transferBahanBakuEdit && !transferBahanBaku ? <>
                    <TransferBahanBakuList
                        transferBahanBaku={transferBahanBakuEdit}
                        preview={true}
                    />
                </>
                    : <></>
            }
        </div>
    </>
}
export default TransferBahanBakuForm