import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiKategoriGudangCRUD } from "../../../../../service/endPointList.api"

const KategoriGudangForm = ({
    setAddKategoriGudangEvent = () => { },
    kategoriGudangEdit,
    getData = () => { }
}) => {
    const [namaKategoriGudang, setNamaKategoriGudang] = useState(kategoriGudangEdit?.name ? kategoriGudangEdit.name : ``)

    const _saveKategoriGudang = async () => {
        if (await formValidation()) {
            apiKategoriGudangCRUD
                .custom(`${kategoriGudangEdit?.uuid ? `/${kategoriGudangEdit.uuid}` : ``}`, kategoriGudangEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaKategoriGudang
                    }
                }).then(() => {
                    if (kategoriGudangEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddKategoriGudangEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{kategoriGudangEdit ? `Edit` : `Tambahkan`} Kategori Gudang</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddKategoriGudangEvent()}
                ><FaTimes /> Batalkan Kategori Gudang
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Kategori Gudang"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaKategoriGudang(e.target.value)
                    }}
                    others={
                        {
                            value: namaKategoriGudang,
                            name: "namaKategoriGudang"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveKategoriGudang()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default KategoriGudangForm