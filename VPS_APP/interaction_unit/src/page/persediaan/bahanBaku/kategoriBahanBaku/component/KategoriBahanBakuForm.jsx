import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiKategoriBahanBakuCRUD } from "../../../../../service/endPointList.api"

const KategoriBahanBakuForm = ({
    setAddKategoriBahanBakuEvent = () => { },
    kategoriBahanBakuEdit,
    getData = () => { }
}) => {
    const [namaKategoriBahanBaku, setNamaKategoriBahanBaku] = useState(kategoriBahanBakuEdit?.name ? kategoriBahanBakuEdit.name : ``)

    const _saveKategoriBahanBaku = async () => {
        if (await formValidation()) {
            apiKategoriBahanBakuCRUD
                .custom(`${kategoriBahanBakuEdit?.uuid ? `/${kategoriBahanBakuEdit.uuid}` : ``}`, kategoriBahanBakuEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaKategoriBahanBaku
                    }
                }).then(() => {
                    if (kategoriBahanBakuEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddKategoriBahanBakuEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{kategoriBahanBakuEdit ? `Edit` : `Tambahkan`} Kategori Bahan Baku</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddKategoriBahanBakuEvent()}
                ><FaTimes /> Batalkan Kategori Bahan Baku
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Kategori Bahan Baku"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaKategoriBahanBaku(e.target.value)
                    }}
                    others={
                        {
                            value: namaKategoriBahanBaku,
                            name: "namaKategoriBahanBaku"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveKategoriBahanBaku()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default KategoriBahanBakuForm