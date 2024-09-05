import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formShowMessage, formValidation, showAlert } from "../../../../../helper/form.helper"
import { apiKategoriJasaCRUD } from "../../../../../service/endPointList.api"

const KategoriJasaForm = ({
    setAddKategoriJasaEvent = () => { },
    kategoriJasaEdit,
    getData = () => { }
}) => {
    const [namaKategoriJasa, setNamaKategoriJasa] = useState(kategoriJasaEdit?.name ? kategoriJasaEdit.name : ``)

    const _saveKategoriJasa = async () => {
        if (await formValidation()) {
            apiKategoriJasaCRUD
                .custom(`${kategoriJasaEdit?.uuid ? `/${kategoriJasaEdit.uuid}` : ``}`, kategoriJasaEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaKategoriJasa
                    }
                }).then(() => {
                    if (kategoriJasaEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddKategoriJasaEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{kategoriJasaEdit ? `Edit` : `Tambahkan`} Kategori Jasa</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddKategoriJasaEvent()}
                ><FaTimes /> Batalkan Kategori Jasa
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Kategori Jasa"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaKategoriJasa(e.target.value)
                    }}
                    others={
                        {
                            value: namaKategoriJasa,
                            name: "namaKategoriJasa"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveKategoriJasa()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default KategoriJasaForm