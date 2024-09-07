import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formShowMessage, formValidation, showAlert } from "../../../../../helper/form.helper"
import { apiDaftarGudangCRUD, apiJenisGudangCRUD, apiKategoriGudangCRUD } from "../../../../../service/endPointList.api"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"

const DaftarGudangForm = ({
    setAddDaftarGudangEvent = () => { },
    daftarGudangEdit,
    getData = () => { }
}) => {
    const [namaDaftarGudang, setNamaDaftarGudang] = useState(daftarGudangEdit?.name ? daftarGudangEdit.name : ``)
    const [kategoriDaftarGudang, setKategoriDaftarGudang] = useState(daftarGudangEdit?.kategori_gudang ? daftarGudangEdit.kategori_gudang : ``)
    const [jenisDaftarGudang, setJenisDaftarGudang] = useState(daftarGudangEdit?.jenis_gudang ? daftarGudangEdit.jenis_gudang : ``)

    const [kategoriGudangList, setKategoriGudangList] = useState([])
    const [jenisGudangList, setJenisGudangList] = useState([])

    const _getKategoriGudang = () => {
        apiKategoriGudangCRUD
            .custom(``, "GET")
            .then(resData => {
                setKategoriGudangList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarGudangEdit) {
                        initialDataFromEditObject({
                            editObject: daftarGudangEdit.kategori_gudang,
                            dataList: resData.data.entry,
                            setState: setKategoriDaftarGudang,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setKategoriDaftarGudang({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showAlert(err)
            })
    }

    const _getJenisGudang = () => {
        apiJenisGudangCRUD
            .custom(``, "GET")
            .then(resData => {
                setJenisGudangList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarGudangEdit) {
                        initialDataFromEditObject({
                            editObject: daftarGudangEdit.jenis_gudang,
                            dataList: resData.data.entry,
                            setState: setJenisDaftarGudang,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setJenisDaftarGudang({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showAlert(err)
            })
    }

    useEffect(() => {
        _getKategoriGudang()
        _getJenisGudang()
    }, [])

    const _saveDaftarGudang = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiDaftarGudangCRUD
                .custom(`${daftarGudangEdit?.uuid ? `/${daftarGudangEdit.uuid}` : ``}`, daftarGudangEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaDaftarGudang,
                        kategori_gudang: kategoriDaftarGudang.value,
                        jenis_gudang: jenisDaftarGudang.value
                    }
                }).then(() => {
                    if (daftarGudangEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddDaftarGudangEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{daftarGudangEdit ? `Edit` : `Tambahkan`} Daftar Gudang</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddDaftarGudangEvent()}
                ><FaTimes /> Batalkan Daftar Gudang
                </button>
            </div>
            <form onSubmit={e => _saveDaftarGudang(e)}>
                <div className="flex gap-x-2">
                    <FormInputWithLabel
                        label={"Nama Daftar Gudang"}
                        type={"text"}
                        onchange={(e) => {
                            setNamaDaftarGudang(e.target.value)
                        }}
                        others={
                            {
                                value: namaDaftarGudang,
                                name: "namaDaftarGudang"
                            }
                        }
                    />
                    <FormSelectWithLabel
                        label={"Kategori Gudang"}
                        optionsDataList={kategoriGudangList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        selectValue={kategoriDaftarGudang}
                        onchange={(e) => {
                            setKategoriDaftarGudang(e)
                        }}
                        selectName={`kategoriDaftarGudang`}
                    />
                    <FormSelectWithLabel
                        label={"Jenis Gudang"}
                        optionsDataList={jenisGudangList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        selectValue={jenisDaftarGudang}
                        onchange={(e) => {
                            setJenisDaftarGudang(e)
                        }}
                        selectName={`jenisDaftarGudang`}
                    />
                </div>
                <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
            </form>
        </div>
    </>
}
export default DaftarGudangForm