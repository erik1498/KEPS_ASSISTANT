import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formShowMessage, formValidation, showAlert } from "../../../../../helper/form.helper"
import { apiKategoriBarangCRUD } from "../../../../../service/endPointList.api"

const KategoriBarangForm = ({
    setAddKategoriBarangEvent = () => { },
    kategoriBarangEdit,
    getData = () => { }
}) => {
    const [namaKategoriBarang, setNamaKategoriBarang] = useState(kategoriBarangEdit?.name ? kategoriBarangEdit.name : ``)

    const _saveKategoriBarang = async () => {
        if (await formValidation()) {
            apiKategoriBarangCRUD
                .custom(`${kategoriBarangEdit?.uuid ? `/${kategoriBarangEdit.uuid}` : ``}`, kategoriBarangEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaKategoriBarang
                    }
                }).then(() => {
                    if (kategoriBarangEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddKategoriBarangEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{kategoriBarangEdit ? `Edit` : `Tambahkan`} Kategori Barang</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddKategoriBarangEvent()}
                ><FaTimes /> Batalkan Kategori Barang
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Kategori Barang"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaKategoriBarang(e.target.value)
                    }}
                    others={
                        {
                            value: namaKategoriBarang,
                            name: "namaKategoriBarang"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveKategoriBarang()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default KategoriBarangForm