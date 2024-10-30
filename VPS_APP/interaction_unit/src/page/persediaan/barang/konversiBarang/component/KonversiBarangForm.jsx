import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiDaftarGudangCRUD, apiKonversiBarangCRUD, apiSatuanBarangCRUD } from "../../../../../service/endPointList.api"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import KonversiBarangList from "./KonversiBarangList"

const KonversiBarangForm = ({
    setAddKonversiBarangEvent = () => { },
    konversiBarangEdit,
    getData = () => { }
}) => {
    const [tanggalKonversiBarang, setTanggalKonversiBarang] = useState(konversiBarangEdit?.tanggal ? konversiBarangEdit.tanggal : getHariTanggalFull())
    const [kodeKonversiBarang, setKodeKonversiBarang] = useState(konversiBarangEdit?.kode_konversi_barang ? konversiBarangEdit.kode_konversi_barang : ``)
    const [gudangKonversiBarang, setGudangKonversiBarang] = useState(konversiBarangEdit?.daftar_gudang ? konversiBarangEdit.daftar_gudang : ``)
    const [satuanBarangKonversiBarang, setSatuanBarangKonversiBarang] = useState(konversiBarangEdit?.satuan_barang ? konversiBarangEdit.satuan_barang : ``)

    const [gudangList, setGudangList] = useState([])
    const [satuanBarangList, setSatuanBarangList] = useState([])

    const [konversiBarang, setKonversiBarang] = useState()

    const _saveKonversiBarang = async () => {
        if (await formValidation()) {
            apiKonversiBarangCRUD
                .custom(`${konversiBarangEdit?.uuid ? `/${konversiBarangEdit.uuid}` : ``}`, konversiBarangEdit ? "PUT" : "POST", null, {
                    data: {
                        tanggal: tanggalKonversiBarang,
                        kode_konversi_barang: kodeKonversiBarang,
                        daftar_gudang: gudangKonversiBarang.value,
                        satuan_barang: satuanBarangKonversiBarang.value,
                    }
                }).then((resData) => {
                    if (konversiBarangEdit) {
                        setKonversiBarang(x => x = konversiBarangEdit)
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        setKonversiBarang(x => x = resData.data)
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
                    if (konversiBarangEdit) {
                        initialDataFromEditObject({
                            editObject: konversiBarangEdit.daftar_gudang,
                            dataList: resData.data.entry,
                            setState: setGudangKonversiBarang,
                            labelKey: "name",
                            valueKey: "uuid",
                        })

                        return
                    }
                    setGudangKonversiBarang({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            })
    }

    const _getDataSatuanBarang = () => {
        apiSatuanBarangCRUD
            .custom("", "GET")
            .then(resData => {
                setSatuanBarangList(x => x = resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (konversiBarangEdit) {
                        initialDataFromEditObject({
                            editObject: konversiBarangEdit.satuan_barang,
                            dataList: resData.data.entry,
                            setState: setSatuanBarangKonversiBarang,
                            labelKey: "name",
                            valueKey: "uuid",
                        })

                        return
                    }
                    setSatuanBarangKonversiBarang({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            })
    }

    useEffect(() => {
        _getDataGudang()
        _getDataSatuanBarang()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{konversiBarangEdit ? `Edit` : `Tambahkan`} Konversi Barang</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => {
                        getData()
                        setAddKonversiBarangEvent()
                    }}
                ><FaTimes /> Batalkan Konversi Barang
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Tanggal Konversi Barang"}
                    type={"datetime-local"}
                    onchange={(e) => {
                        setTanggalKonversiBarang(e.target.value)
                    }}
                    others={
                        {
                            value: tanggalKonversiBarang,
                            disabled: konversiBarang,
                            tanggal: "tanggalKonversiBarang"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Kode Konversi Barang"}
                    type={"text"}
                    onchange={(e) => {
                        setKodeKonversiBarang(e.target.value)
                    }}
                    others={
                        {
                            value: kodeKonversiBarang,
                            disabled: konversiBarang,
                            tanggal: "kodeKonversiBarang"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Gudang"}
                    optionsDataList={gudangList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={gudangKonversiBarang}
                    disabled={konversiBarang}
                    onchange={(e) => {
                        setGudangKonversiBarang(e)
                    }}
                    selectName={`gudangKonversiBarang`}
                />
                <FormSelectWithLabel
                    label={"Satuan Barang"}
                    optionsDataList={satuanBarangList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={satuanBarangKonversiBarang}
                    disabled={konversiBarang}
                    onchange={(e) => {
                        setSatuanBarangKonversiBarang(e)
                    }}
                    selectName={`satuanBarangKonversiBarang`}
                />
            </div>
            {
                konversiBarang ? <>
                    <KonversiBarangList
                        konversiBarang={konversiBarang}
                        satuanBarangKonversiBarang={satuanBarangKonversiBarang}
                    />
                </> : <>
                    <button className="btn btn-sm bg-green-800 mt-4 text-white"
                        onClick={() => {
                            _saveKonversiBarang()
                        }}
                    ><FaSave /> Simpan</button>
                </>
            }
            {
                konversiBarangEdit && !konversiBarang ? <>
                    <KonversiBarangList
                        konversiBarang={konversiBarangEdit}
                        satuanBarangKonversiBarang={{ value: konversiBarangEdit.satuan_barang }}
                        preview={true}
                    />
                </> : <></>
            }
        </div>
    </>
}
export default KonversiBarangForm