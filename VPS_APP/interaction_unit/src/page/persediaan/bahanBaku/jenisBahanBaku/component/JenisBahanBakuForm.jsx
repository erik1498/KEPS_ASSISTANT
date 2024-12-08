import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiJenisBahanBakuCRUD } from "../../../../../service/endPointList.api"

const JenisBahanBakuForm = ({
    setAddJenisBahanBakuEvent = () => { },
    jenisBahanBakuEdit,
    getData = () => { }
}) => {
    const [namaJenisBahanBaku, setNamaJenisBahanBaku] = useState(jenisBahanBakuEdit?.name ? jenisBahanBakuEdit.name : ``)
    const [kodeJenisBahanBaku, setKodeJenisBahanBaku] = useState(jenisBahanBakuEdit?.code ? jenisBahanBakuEdit.code : ``)

    const _saveJenisBahanBaku = async () => {
        if (await formValidation()) {
            apiJenisBahanBakuCRUD
                .custom(`${jenisBahanBakuEdit?.uuid ? `/${jenisBahanBakuEdit.uuid}` : ``}`, jenisBahanBakuEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaJenisBahanBaku,
                        code: kodeJenisBahanBaku
                    }
                }).then(() => {
                    if (jenisBahanBakuEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddJenisBahanBakuEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{jenisBahanBakuEdit ? `Edit` : `Tambahkan`} Jenis Bahan Baku</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddJenisBahanBakuEvent()}
                ><FaTimes /> Batalkan Jenis Bahan Baku
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Jenis Bahan Baku"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaJenisBahanBaku(e.target.value)
                    }}
                    others={
                        {
                            value: namaJenisBahanBaku,
                            name: "namaJenisBahanBaku"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Kode Jenis Bahan Baku"}
                    type={"text"}
                    onchange={(e) => {
                        setKodeJenisBahanBaku(e.target.value)
                    }}
                    others={
                        {
                            value: kodeJenisBahanBaku,
                            name: "kodeJenisBahanBaku"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveJenisBahanBaku()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default JenisBahanBakuForm