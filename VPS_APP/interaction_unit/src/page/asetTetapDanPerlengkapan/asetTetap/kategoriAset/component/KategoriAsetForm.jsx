import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formShowMessage, formValidation, showAlert } from "../../../../../helper/form.helper"
import { apiKategoriAsetCRUD } from "../../../../../service/endPointList.api"

const KategoriAsetForm = ({
    setAddKategoriAsetEvent = () => { },
    kategoriAsetEdit,
    getData = () => { }
}) => {
    const [namaKategoriAset, setNamaKategoriAset] = useState(kategoriAsetEdit?.name ? kategoriAsetEdit.name : ``)

    const _saveKategoriAset = async () => {
        if (await formValidation()) {
            apiKategoriAsetCRUD
                .custom(`${kategoriAsetEdit?.uuid ? `/${kategoriAsetEdit.uuid}` : ``}`, kategoriAsetEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaKategoriAset
                    }
                }).then(() => {
                    if (kategoriAsetEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddKategoriAsetEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{kategoriAsetEdit ? `Edit` : `Tambahkan`} Kategori Aset</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddKategoriAsetEvent()}
                ><FaTimes /> Batalkan Kategori Aset
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Kategori Aset"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaKategoriAset(e.target.value)
                    }}
                    others={
                        {
                            value: namaKategoriAset,
                            name: "namaKategoriAset"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveKategoriAset()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default KategoriAsetForm