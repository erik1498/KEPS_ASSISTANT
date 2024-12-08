import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiSatuanBahanBakuCRUD } from "../../../../../service/endPointList.api"

const SatuanBahanBakuForm = ({
    setAddSatuanBahanBakuEvent = () => { },
    satuanBahanBakuEdit,
    getData = () => { }
}) => {
    const [namaSatuanBahanBaku, setNamaSatuanBahanBaku] = useState(satuanBahanBakuEdit?.name ? satuanBahanBakuEdit.name : ``)

    const _saveSatuanBahanBaku = async () => {
        if (await formValidation()) {
            apiSatuanBahanBakuCRUD
                .custom(`${satuanBahanBakuEdit?.uuid ? `/${satuanBahanBakuEdit.uuid}` : ``}`, satuanBahanBakuEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaSatuanBahanBaku
                    }
                }).then(() => {
                    if (satuanBahanBakuEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddSatuanBahanBakuEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{satuanBahanBakuEdit ? `Edit` : `Tambahkan`} Satuan Bahan Baku</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddSatuanBahanBakuEvent()}
                ><FaTimes /> Batalkan Satuan Bahan Baku
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Satuan Bahan Baku"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaSatuanBahanBaku(e.target.value)
                    }}
                    others={
                        {
                            value: namaSatuanBahanBaku,
                            name: "namaSatuanBahanBaku"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveSatuanBahanBaku()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default SatuanBahanBakuForm