import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiDaftarBahanBakuCRUD, apiJenisBahanBakuCRUD, apiJenisPenjualanBahanBakuCRUD, apiKategoriBahanBakuCRUD } from "../../../../../service/endPointList.api"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { PPNList } from "../../../../../config/objectList.config"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import KategoriHargaForm from "./KategoriHargaForm"

const DaftarBahanBakuForm = ({
    setAddDaftarBahanBakuEvent = () => { },
    daftarBahanBakuEdit,
    getData = () => { }
}) => {
    const [kategoriHargaForm, setKategoriHargaForm] = useState(false)
    const [uuidDaftarBahanBaku, setUuidDaftarBahanBaku] = useState(daftarBahanBakuEdit?.uuid ? daftarBahanBakuEdit.uuid : null)

    const [kategoriBahanBakuList, setKategoriBahanBakuList] = useState([])
    const [jenisBahanBakuList, setJenisBahanBakuList] = useState([])
    const [jenisPenjualanBahanBakuList, setJenisPenjualanBahanBakuList] = useState([])

    const [namaDaftarBahanBaku, setNamaDaftarBahanBaku] = useState(daftarBahanBakuEdit?.name ? daftarBahanBakuEdit.name : ``)
    const [kategoriDaftarBahanBaku, setKategoriDaftarBahanBaku] = useState(daftarBahanBakuEdit?.kategori_bahan_baku ? daftarBahanBakuEdit.kategori_bahan_baku : ``)
    const [jenisDaftarBahanBaku, setJenisDaftarBahanBaku] = useState(daftarBahanBakuEdit?.jenis_bahan_baku ? daftarBahanBakuEdit.jenis_bahan_baku : ``)
    const [jenisPenjualanDaftarBahanBaku, setJenisPenjualanDaftarBahanBaku] = useState(daftarBahanBakuEdit?.jenis_penjualan_bahan_baku ? daftarBahanBakuEdit.jenis_penjualan_bahan_baku : ``)
    const [ppnDaftarBahanBaku, setppnDaftarBahanBaku] = useState(daftarBahanBakuEdit?.ppn == 0 ? {
        label: PPNList.filter(x => x.value == daftarBahanBakuEdit.ppn).at(0).label,
        value: PPNList.filter(x => x.value == daftarBahanBakuEdit.ppn).at(0).value,
    } : {
        label: PPNList[0].label,
        value: PPNList[0].value,
    })

    const _saveDaftarBahanBaku = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiDaftarBahanBakuCRUD
                .custom(`${daftarBahanBakuEdit?.uuid ? `/${daftarBahanBakuEdit.uuid}` : ``}`, daftarBahanBakuEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaDaftarBahanBaku,
                        kategori_bahan_baku: kategoriDaftarBahanBaku.value,
                        jenis_bahan_baku: jenisDaftarBahanBaku.value,
                        jenis_penjualan_bahan_baku: jenisPenjualanDaftarBahanBaku.value,
                        ppn: ppnDaftarBahanBaku.value,
                        status: 1
                    }
                }).then((resData) => {
                    if (daftarBahanBakuEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        setUuidDaftarBahanBaku(x => x = resData.data.uuid)
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setKategoriHargaForm(x => x = true)
                }).catch(err => {
                    showError(err)
                    setUuidDaftarBahanBaku(daftarBahanBakuEdit.uuid)
                    setKategoriHargaForm(x => x = true)
                })
        }
    }

    const _getDataKategoriBahanBaku = () => {
        apiKategoriBahanBakuCRUD
            .custom(``, "GET")
            .then(resData => {
                setKategoriBahanBakuList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarBahanBakuEdit) {
                        initialDataFromEditObject({
                            editObject: daftarBahanBakuEdit.kategori_bahan_baku,
                            dataList: resData.data.entry,
                            setState: setKategoriDaftarBahanBaku,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setKategoriDaftarBahanBaku({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataJenisBahanBaku = () => {
        apiJenisBahanBakuCRUD
            .custom(``, "GET")
            .then(resData => {
                setJenisBahanBakuList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarBahanBakuEdit) {
                        initialDataFromEditObject({
                            editObject: daftarBahanBakuEdit.jenis_bahan_baku,
                            dataList: resData.data.entry,
                            setState: setJenisDaftarBahanBaku,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setJenisDaftarBahanBaku({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataJenisPenjualanBahanBaku = () => {
        apiJenisPenjualanBahanBakuCRUD
            .custom(``, "GET")
            .then(resData => {
                setJenisPenjualanBahanBakuList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarBahanBakuEdit) {
                        initialDataFromEditObject({
                            editObject: daftarBahanBakuEdit.jenis_penjualan_bahan_baku,
                            dataList: resData.data.entry,
                            setState: setJenisPenjualanDaftarBahanBaku,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setJenisPenjualanDaftarBahanBaku({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    useEffect(() => {
        _getDataKategoriBahanBaku()
        _getDataJenisBahanBaku()
        _getDataJenisPenjualanBahanBaku()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{daftarBahanBakuEdit ? `Edit` : `Tambahkan`} Daftar Bahan Baku</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddDaftarBahanBakuEvent()}
                ><FaTimes /> Batalkan Daftar Bahan Baku
                </button>
            </div>
            <form onSubmit={e => _saveDaftarBahanBaku(e)}>
                <div className="flex gap-x-2">
                    <FormInputWithLabel
                        label={"Nama Daftar Bahan Baku"}
                        type={"text"}
                        onchange={(e) => {
                            setNamaDaftarBahanBaku(e.target.value)
                        }}
                        others={
                            {
                                value: namaDaftarBahanBaku,
                                name: "namaDaftarBahanBaku",
                                disabled: kategoriHargaForm
                            }
                        }
                    />
                </div>
                <div className="mt-5 flex gap-x-2">
                    <FormSelectWithLabel
                        label={"Kategori Bahan Baku"}
                        optionsDataList={kategoriBahanBakuList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        disabled={kategoriHargaForm}
                        selectValue={kategoriDaftarBahanBaku}
                        onchange={(e) => {
                            setKategoriDaftarBahanBaku(e)
                        }}
                        selectName={`kategoriDaftarBahanBaku`}
                    />
                    <FormSelectWithLabel
                        label={"Jenis Bahan Baku"}
                        optionsDataList={jenisBahanBakuList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        disabled={kategoriHargaForm}
                        selectValue={jenisDaftarBahanBaku}
                        onchange={(e) => {
                            setJenisDaftarBahanBaku(e)
                        }}
                        selectName={`JenisDaftarBahanBaku`}
                    />
                    <FormSelectWithLabel
                        label={"Jenis Penjualan Bahan Baku"}
                        optionsDataList={jenisPenjualanBahanBakuList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        disabled={kategoriHargaForm}
                        selectValue={jenisPenjualanDaftarBahanBaku}
                        onchange={(e) => {
                            setJenisPenjualanDaftarBahanBaku(e)
                        }}
                        selectName={`jenisPenjualanDaftarBahanBaku`}
                    />
                </div>
                <div className="mt-5 flex -gap-x-2">
                    <FormSelectWithLabel
                        label={"PPN"}
                        optionsDataList={PPNList}
                        optionsLabel={"label"}
                        optionsValue={"value"}
                        disabled={kategoriHargaForm}
                        selectValue={ppnDaftarBahanBaku}
                        onchange={(e) => {
                            setppnDaftarBahanBaku(e)
                        }}
                        selectName={`ppnDaftarBahanBaku`}
                    />
                </div>
                {
                    kategoriHargaForm ? <></> : <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
                }
            </form>
            {
                kategoriHargaForm ?
                    <KategoriHargaForm
                        idDaftarBahanBaku={uuidDaftarBahanBaku}
                    />
                    : <></>
            }
        </div>
    </>
}
export default DaftarBahanBakuForm