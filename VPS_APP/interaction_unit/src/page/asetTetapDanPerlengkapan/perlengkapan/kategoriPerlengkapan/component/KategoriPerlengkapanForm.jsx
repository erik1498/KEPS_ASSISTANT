import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formShowMessage, formValidation, showAlert } from "../../../../../helper/form.helper"
import { apiKategoriPerlengkapanCRUD } from "../../../../../service/endPointList.api"

const KategoriPerlengkapanForm = ({
    setAddKategoriPerlengkapanEvent = () => { },
    kategoriPerlengkapanEdit,
    getData = () => { }
}) => {
    const [namaKategoriPerlengkapan, setNamaKategoriPerlengkapan] = useState(kategoriPerlengkapanEdit?.name ? kategoriPerlengkapanEdit.name : ``)

    const _saveKategoriPerlengkapan = async () => {
        if (await formValidation()) {
            apiKategoriPerlengkapanCRUD
                .custom(`${kategoriPerlengkapanEdit?.uuid ? `/${kategoriPerlengkapanEdit.uuid}` : ``}`, kategoriPerlengkapanEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaKategoriPerlengkapan
                    }
                }).then(() => {
                    if (kategoriPerlengkapanEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddKategoriPerlengkapanEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{kategoriPerlengkapanEdit ? `Edit` : `Tambahkan`} Kategori Perlengkapan</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddKategoriPerlengkapanEvent()}
                ><FaTimes /> Batalkan Kategori Perlengkapan
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Kategori Perlengkapan"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaKategoriPerlengkapan(e.target.value)
                    }}
                    others={
                        {
                            value: namaKategoriPerlengkapan,
                            name: "namaKategoriPerlengkapan"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveKategoriPerlengkapan()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default KategoriPerlengkapanForm