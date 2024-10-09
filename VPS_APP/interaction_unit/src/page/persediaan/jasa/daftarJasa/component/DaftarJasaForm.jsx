import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiDaftarJasaCRUD, apiJenisJasaCRUD, apiJenisPenjualanJasaCRUD, apiKategoriJasaCRUD } from "../../../../../service/endPointList.api"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { PPNList } from "../../../../../config/objectList.config"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import KategoriHargaForm from "./KategoriHargaForm"

const DaftarJasaForm = ({
    setAddDaftarJasaEvent = () => { },
    daftarJasaEdit,
    getData = () => { }
}) => {

    const [kategoriHargaForm, setKategoriHargaForm] = useState(false)
    const [uuidDaftarJasa, setUuidDaftarJasa] = useState(daftarJasaEdit?.uuid ? daftarJasaEdit.uuid : null)

    const [kategoriJasaList, setKategoriJasaList] = useState([])
    const [jenisJasaList, setJenisJasaList] = useState([])
    const [jenisPenjualanJasaList, setJenisPenjualanJasaList] = useState([])

    const [namaDaftarJasa, setNamaDaftarJasa] = useState(daftarJasaEdit?.name ? daftarJasaEdit.name : ``)
    const [kategoriDaftarJasa, setKategoriDaftarJasa] = useState(daftarJasaEdit?.kategori_jasa ? daftarJasaEdit.kategori_jasa : ``)
    const [jenisDaftarJasa, setJenisDaftarJasa] = useState(daftarJasaEdit?.jenis_jasa ? daftarJasaEdit.jenis_jasa : ``)
    const [jenisPenjualanDaftarJasa, setJenisPenjualanDaftarJasa] = useState(daftarJasaEdit?.jenis_penjualan_jasa ? daftarJasaEdit.jenis_penjualan_jasa : ``)
    const [ppnDaftarJasa, setppnDaftarJasa] = useState(daftarJasaEdit?.ppn ? {
        label: PPNList.filter(x => x.value == daftarJasaEdit.ppn).at(0).label,
        value: PPNList.filter(x => x.value == daftarJasaEdit.ppn).at(0).value,
    } : {
        label: PPNList[0].label,
        value: PPNList[0].value,
    })

    const _saveDaftarJasa = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiDaftarJasaCRUD
                .custom(`${daftarJasaEdit?.uuid ? `/${daftarJasaEdit.uuid}` : ``}`, daftarJasaEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaDaftarJasa,
                        kategori_jasa: kategoriDaftarJasa.value,
                        jenis_jasa: jenisDaftarJasa.value,
                        jenis_penjualan_jasa: jenisPenjualanDaftarJasa.value,
                        ppn: ppnDaftarJasa.value,
                        status: 1
                    }
                }).then((resData) => {
                    if (daftarJasaEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        setUuidDaftarJasa(x => x = resData.data.uuid)
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setKategoriHargaForm(x => x = true)
                }).catch(err => {
                    showError(err)
                })
        }
    }

    const _getDataKategoriJasa = () => {
        apiKategoriJasaCRUD
            .custom(``, "GET")
            .then(resData => {
                setKategoriJasaList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarJasaEdit) {
                        initialDataFromEditObject({
                            editObject: daftarJasaEdit.kategori_jasa,
                            dataList: resData.data.entry,
                            setState: setKategoriDaftarJasa,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setKategoriDaftarJasa({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataJenisJasa = () => {
        apiJenisJasaCRUD
            .custom(``, "GET")
            .then(resData => {
                setJenisJasaList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarJasaEdit) {
                        initialDataFromEditObject({
                            editObject: daftarJasaEdit.jenis_jasa,
                            dataList: resData.data.entry,
                            setState: setJenisDaftarJasa,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setJenisDaftarJasa({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataJenisPenjualanJasa = () => {
        apiJenisPenjualanJasaCRUD
            .custom(``, "GET")
            .then(resData => {
                setJenisPenjualanJasaList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarJasaEdit) {
                        initialDataFromEditObject({
                            editObject: daftarJasaEdit.jenis_penjualan_jasa,
                            dataList: resData.data.entry,
                            setState: setJenisPenjualanDaftarJasa,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setJenisPenjualanDaftarJasa({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    useEffect(() => {
        _getDataKategoriJasa()
        _getDataJenisJasa()
        _getDataJenisPenjualanJasa()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{daftarJasaEdit ? `Edit` : `Tambahkan`} Daftar Jasa</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddDaftarJasaEvent()}
                ><FaTimes /> Batalkan Daftar Jasa
                </button>
            </div>
            <form onSubmit={e => _saveDaftarJasa(e)}>
                <div className="flex gap-x-2">
                    <FormInputWithLabel
                        label={"Nama Daftar Jasa"}
                        type={"text"}
                        onchange={(e) => {
                            setNamaDaftarJasa(e.target.value)
                        }}
                        others={
                            {
                                value: namaDaftarJasa,
                                name: "namaDaftarJasa",
                                disabled: kategoriHargaForm
                            }
                        }
                    />
                </div>
                <div className="mt-5 flex gap-x-2">
                    <FormSelectWithLabel
                        label={"Kategori Jasa"}
                        optionsDataList={kategoriJasaList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        disabled={kategoriHargaForm}
                        selectValue={kategoriDaftarJasa}
                        onchange={(e) => {
                            setKategoriDaftarJasa(e)
                        }}
                        selectName={`kategoriDaftarJasa`}
                    />
                    <FormSelectWithLabel
                        label={"Jenis Jasa"}
                        optionsDataList={jenisJasaList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        disabled={kategoriHargaForm}
                        selectValue={jenisDaftarJasa}
                        onchange={(e) => {
                            setJenisDaftarJasa(e)
                        }}
                        selectName={`JenisDaftarJasa`}
                    />
                    <FormSelectWithLabel
                        label={"Jenis Penjualan Jasa"}
                        optionsDataList={jenisPenjualanJasaList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        disabled={kategoriHargaForm}
                        selectValue={jenisPenjualanDaftarJasa}
                        onchange={(e) => {
                            setJenisPenjualanDaftarJasa(e)
                        }}
                        selectName={`jenisPenjualanDaftarJasa`}
                    />
                </div>
                <div className="mt-5 flex -gap-x-2">
                    <FormSelectWithLabel
                        label={"PPN"}
                        optionsDataList={PPNList}
                        optionsLabel={"label"}
                        optionsValue={"value"}
                        disabled={kategoriHargaForm}
                        selectValue={ppnDaftarJasa}
                        onchange={(e) => {
                            setppnDaftarJasa(e)
                        }}
                        selectName={`ppnDaftarJasa`}
                    />
                </div>
                {
                    kategoriHargaForm ? <></> : <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
                }
            </form>
            {
                kategoriHargaForm ?
                    <KategoriHargaForm
                        idDaftarJasa={uuidDaftarJasa}
                    />
                    : <></>
            }
        </div>
    </>
}
export default DaftarJasaForm