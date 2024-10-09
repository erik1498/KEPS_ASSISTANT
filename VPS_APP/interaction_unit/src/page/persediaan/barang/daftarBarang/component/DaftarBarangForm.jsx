import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiDaftarBarangCRUD, apiJenisBarangCRUD, apiJenisPenjualanBarangCRUD, apiKategoriBarangCRUD } from "../../../../../service/endPointList.api"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { PPNList } from "../../../../../config/objectList.config"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import KategoriHargaForm from "./KategoriHargaForm"

const DaftarBarangForm = ({
    setAddDaftarBarangEvent = () => { },
    daftarBarangEdit,
    getData = () => { }
}) => {
    const [kategoriHargaForm, setKategoriHargaForm] = useState(false)
    const [uuidDaftarBarang, setUuidDaftarBarang] = useState(daftarBarangEdit?.uuid ? daftarBarangEdit.uuid : null)

    const [kategoriBarangList, setKategoriBarangList] = useState([])
    const [jenisBarangList, setJenisBarangList] = useState([])
    const [jenisPenjualanBarangList, setJenisPenjualanBarangList] = useState([])

    const [namaDaftarBarang, setNamaDaftarBarang] = useState(daftarBarangEdit?.name ? daftarBarangEdit.name : ``)
    const [kategoriDaftarBarang, setKategoriDaftarBarang] = useState(daftarBarangEdit?.kategori_barang ? daftarBarangEdit.kategori_barang : ``)
    const [jenisDaftarBarang, setJenisDaftarBarang] = useState(daftarBarangEdit?.jenis_barang ? daftarBarangEdit.jenis_barang : ``)
    const [jenisPenjualanDaftarBarang, setJenisPenjualanDaftarBarang] = useState(daftarBarangEdit?.jenis_penjualan_barang ? daftarBarangEdit.jenis_penjualan_barang : ``)
    const [ppnDaftarBarang, setppnDaftarBarang] = useState(daftarBarangEdit?.ppn == 0 ? {
        label: PPNList.filter(x => x.value == daftarBarangEdit.ppn).at(0).label,
        value: PPNList.filter(x => x.value == daftarBarangEdit.ppn).at(0).value,
    } : {
        label: PPNList[0].label,
        value: PPNList[0].value,
    })

    const _saveDaftarBarang = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiDaftarBarangCRUD
                .custom(`${daftarBarangEdit?.uuid ? `/${daftarBarangEdit.uuid}` : ``}`, daftarBarangEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaDaftarBarang,
                        kategori_barang: kategoriDaftarBarang.value,
                        jenis_barang: jenisDaftarBarang.value,
                        jenis_penjualan_barang: jenisPenjualanDaftarBarang.value,
                        ppn: ppnDaftarBarang.value,
                        status: 1
                    }
                }).then((resData) => {
                    if (daftarBarangEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        setUuidDaftarBarang(x => x = resData.data.uuid)
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setKategoriHargaForm(x => x = true)
                }).catch(err => {
                    showError(err)
                })
        }
    }

    const _getDataKategoriBarang = () => {
        apiKategoriBarangCRUD
            .custom(``, "GET")
            .then(resData => {
                setKategoriBarangList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarBarangEdit) {
                        initialDataFromEditObject({
                            editObject: daftarBarangEdit.kategori_barang,
                            dataList: resData.data.entry,
                            setState: setKategoriDaftarBarang,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setKategoriDaftarBarang({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataJenisBarang = () => {
        apiJenisBarangCRUD
            .custom(``, "GET")
            .then(resData => {
                setJenisBarangList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarBarangEdit) {
                        initialDataFromEditObject({
                            editObject: daftarBarangEdit.jenis_barang,
                            dataList: resData.data.entry,
                            setState: setJenisDaftarBarang,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setJenisDaftarBarang({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataJenisPenjualanBarang = () => {
        apiJenisPenjualanBarangCRUD
            .custom(``, "GET")
            .then(resData => {
                setJenisPenjualanBarangList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarBarangEdit) {
                        initialDataFromEditObject({
                            editObject: daftarBarangEdit.jenis_penjualan_barang,
                            dataList: resData.data.entry,
                            setState: setJenisPenjualanDaftarBarang,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setJenisPenjualanDaftarBarang({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    useEffect(() => {
        _getDataKategoriBarang()
        _getDataJenisBarang()
        _getDataJenisPenjualanBarang()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{daftarBarangEdit ? `Edit` : `Tambahkan`} Daftar Barang</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddDaftarBarangEvent()}
                ><FaTimes /> Batalkan Daftar Barang
                </button>
            </div>
            <form onSubmit={e => _saveDaftarBarang(e)}>
                <div className="flex gap-x-2">
                    <FormInputWithLabel
                        label={"Nama Daftar Barang"}
                        type={"text"}
                        onchange={(e) => {
                            setNamaDaftarBarang(e.target.value)
                        }}
                        others={
                            {
                                value: namaDaftarBarang,
                                name: "namaDaftarBarang",
                                disabled: kategoriHargaForm
                            }
                        }
                    />
                </div>
                <div className="mt-5 flex gap-x-2">
                    <FormSelectWithLabel
                        label={"Kategori Barang"}
                        optionsDataList={kategoriBarangList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        disabled={kategoriHargaForm}
                        selectValue={kategoriDaftarBarang}
                        onchange={(e) => {
                            setKategoriDaftarBarang(e)
                        }}
                        selectName={`kategoriDaftarBarang`}
                    />
                    <FormSelectWithLabel
                        label={"Jenis Barang"}
                        optionsDataList={jenisBarangList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        disabled={kategoriHargaForm}
                        selectValue={jenisDaftarBarang}
                        onchange={(e) => {
                            setJenisDaftarBarang(e)
                        }}
                        selectName={`JenisDaftarBarang`}
                    />
                    <FormSelectWithLabel
                        label={"Jenis Penjualan Barang"}
                        optionsDataList={jenisPenjualanBarangList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        disabled={kategoriHargaForm}
                        selectValue={jenisPenjualanDaftarBarang}
                        onchange={(e) => {
                            setJenisPenjualanDaftarBarang(e)
                        }}
                        selectName={`jenisPenjualanDaftarBarang`}
                    />
                </div>
                <div className="mt-5 flex -gap-x-2">
                    <FormSelectWithLabel
                        label={"PPN"}
                        optionsDataList={PPNList}
                        optionsLabel={"label"}
                        optionsValue={"value"}
                        disabled={kategoriHargaForm}
                        selectValue={ppnDaftarBarang}
                        onchange={(e) => {
                            setppnDaftarBarang(e)
                        }}
                        selectName={`ppnDaftarBarang`}
                    />
                </div>
                {
                    kategoriHargaForm ? <></> : <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
                }
            </form>
            {
                kategoriHargaForm ?
                    <KategoriHargaForm
                        idDaftarbarang={uuidDaftarBarang}
                    />
                    : <></>
            }
        </div>
    </>
}
export default DaftarBarangForm