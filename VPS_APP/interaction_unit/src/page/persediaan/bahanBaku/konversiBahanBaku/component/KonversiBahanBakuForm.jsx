import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiDaftarGudangCRUD, apiKonversiBahanBakuCRUD, apiSatuanBahanBakuCRUD } from "../../../../../service/endPointList.api"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import KonversiBahanBakuList from "./KonversiBahanBakuList"

const KonversiBahanBakuForm = ({
    setAddKonversiBahanBakuEvent = () => { },
    konversiBahanBakuEdit,
    getData = () => { }
}) => {
    const [tanggalKonversiBahanBaku, setTanggalKonversiBahanBaku] = useState(konversiBahanBakuEdit?.tanggal ? konversiBahanBakuEdit.tanggal : getHariTanggalFull())
    const [kodeKonversiBahanBaku, setKodeKonversiBahanBaku] = useState(konversiBahanBakuEdit?.kode_konversi_bahan_baku ? konversiBahanBakuEdit.kode_konversi_bahan_baku : ``)
    const [gudangKonversiBahanBaku, setGudangKonversiBahanBaku] = useState(konversiBahanBakuEdit?.daftar_gudang ? konversiBahanBakuEdit.daftar_gudang : ``)
    const [satuanBahanBakuKonversiBahanBaku, setSatuanBahanBakuKonversiBahanBaku] = useState(konversiBahanBakuEdit?.satuan_bahan_baku ? konversiBahanBakuEdit.satuan_bahan_baku : ``)

    const [gudangList, setGudangList] = useState([])
    const [satuanBahanBakuList, setSatuanBahanBakuList] = useState([])

    const [konversiBahanBaku, setKonversiBahanBaku] = useState()

    const _saveKonversiBahanBaku = async () => {
        if (await formValidation()) {
            apiKonversiBahanBakuCRUD
                .custom(`${konversiBahanBakuEdit?.uuid ? `/${konversiBahanBakuEdit.uuid}` : ``}`, konversiBahanBakuEdit ? "PUT" : "POST", null, {
                    data: {
                        tanggal: tanggalKonversiBahanBaku,
                        kode_konversi_bahan_baku: kodeKonversiBahanBaku,
                        daftar_gudang: gudangKonversiBahanBaku.value,
                        satuan_bahan_baku: satuanBahanBakuKonversiBahanBaku.value,
                    }
                }).then((resData) => {
                    if (konversiBahanBakuEdit) {
                        setKonversiBahanBaku(x => x = konversiBahanBakuEdit)
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        setKonversiBahanBaku(x => x = resData.data)
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                }).catch(err => {
                    showError(err)
                })
        }
    }

    const _getDataGudang = () => {
        apiDaftarGudangCRUD
            .custom("", "GET")
            .then(resData => {
                setGudangList(x => x = resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (konversiBahanBakuEdit) {
                        initialDataFromEditObject({
                            editObject: konversiBahanBakuEdit.daftar_gudang,
                            dataList: resData.data.entry,
                            setState: setGudangKonversiBahanBaku,
                            labelKey: "name",
                            valueKey: "uuid",
                        })

                        return
                    }
                    setGudangKonversiBahanBaku({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            })
    }

    const _getDataSatuanBahanBaku = () => {
        apiSatuanBahanBakuCRUD
            .custom("", "GET")
            .then(resData => {
                setSatuanBahanBakuList(x => x = resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (konversiBahanBakuEdit) {
                        initialDataFromEditObject({
                            editObject: konversiBahanBakuEdit.satuan_bahan_baku,
                            dataList: resData.data.entry,
                            setState: setSatuanBahanBakuKonversiBahanBaku,
                            labelKey: "name",
                            valueKey: "uuid",
                        })

                        return
                    }
                    setSatuanBahanBakuKonversiBahanBaku({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            })
    }

    useEffect(() => {
        _getDataGudang()
        _getDataSatuanBahanBaku()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{konversiBahanBakuEdit ? `Edit` : `Tambahkan`} Konversi Bahan Baku</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => {
                        getData()
                        setAddKonversiBahanBakuEvent()
                    }}
                ><FaTimes /> Batalkan Konversi Bahan Baku
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Tanggal Konversi Bahan Baku"}
                    type={"datetime-local"}
                    onchange={(e) => {
                        setTanggalKonversiBahanBaku(e.target.value)
                    }}
                    others={
                        {
                            value: tanggalKonversiBahanBaku,
                            disabled: konversiBahanBaku,
                            tanggal: "tanggalKonversiBahanBaku"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Kode Konversi Bahan Baku"}
                    type={"text"}
                    onchange={(e) => {
                        setKodeKonversiBahanBaku(e.target.value)
                    }}
                    others={
                        {
                            value: kodeKonversiBahanBaku,
                            disabled: konversiBahanBaku,
                            tanggal: "kodeKonversiBahanBaku"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Gudang"}
                    optionsDataList={gudangList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={gudangKonversiBahanBaku}
                    disabled={konversiBahanBaku}
                    onchange={(e) => {
                        setGudangKonversiBahanBaku(e)
                    }}
                    selectName={`gudangKonversiBahanBaku`}
                />
                <FormSelectWithLabel
                    label={"Satuan Bahan Baku"}
                    optionsDataList={satuanBahanBakuList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={satuanBahanBakuKonversiBahanBaku}
                    disabled={konversiBahanBaku}
                    onchange={(e) => {
                        setSatuanBahanBakuKonversiBahanBaku(e)
                    }}
                    selectName={`satuanBahanBakuKonversiBahanBaku`}
                />
            </div>
            {
                konversiBahanBaku ? <>
                    <KonversiBahanBakuList
                        konversiBahanBaku={konversiBahanBaku}
                        satuanBahanBakuKonversiBahanBaku={satuanBahanBakuKonversiBahanBaku}
                    />
                </> : <>
                    <button className="btn btn-sm bg-green-800 mt-4 text-white"
                        onClick={() => {
                            _saveKonversiBahanBaku()
                        }}
                    ><FaSave /> Simpan</button>
                </>
            }
            {
                konversiBahanBakuEdit && !konversiBahanBaku ? <>
                    <KonversiBahanBakuList
                        konversiBahanBaku={konversiBahanBakuEdit}
                        satuanBahanBakuKonversiBahanBaku={{ value: konversiBahanBakuEdit.satuan_bahan_baku }}
                        preview={true}
                    />
                </> : <></>
            }
        </div>
    </>
}
export default KonversiBahanBakuForm