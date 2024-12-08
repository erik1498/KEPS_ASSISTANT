import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiJenisPenjualanBahanBakuCRUD } from "../../../../../service/endPointList.api"

const JenisPenjualanBahanBakuForm = ({
    setAddJenisPenjualanBahanBakuEvent = () => { },
    jenisPenjualanBahanBakuEdit,
    getData = () => { }
}) => {
    const [namaJenisPenjualanBahanBaku, setNamaJenisPenjualanBahanBaku] = useState(jenisPenjualanBahanBakuEdit?.name ? jenisPenjualanBahanBakuEdit.name : ``)
    const [kodeJenisPenjualanBahanBaku, setKodeJenisPenjualanBahanBaku] = useState(jenisPenjualanBahanBakuEdit?.name ? jenisPenjualanBahanBakuEdit.code : ``)

    const _saveJenisPenjualanBahanBaku = async () => {
        if (await formValidation()) {
            apiJenisPenjualanBahanBakuCRUD
                .custom(`${jenisPenjualanBahanBakuEdit?.uuid ? `/${jenisPenjualanBahanBakuEdit.uuid}` : ``}`, jenisPenjualanBahanBakuEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaJenisPenjualanBahanBaku,
                        code: kodeJenisPenjualanBahanBaku
                    }
                }).then(() => {
                    if (jenisPenjualanBahanBakuEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddJenisPenjualanBahanBakuEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{jenisPenjualanBahanBakuEdit ? `Edit` : `Tambahkan`} Jenis Penjualan Bahan Baku</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddJenisPenjualanBahanBakuEvent()}
                ><FaTimes /> Batalkan Jenis Penjualan Bahan Baku
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Jenis Penjualan Bahan Baku"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaJenisPenjualanBahanBaku(e.target.value)
                    }}
                    others={
                        {
                            value: namaJenisPenjualanBahanBaku,
                            name: "namaJenisPenjualanBahanBaku"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Kode Jenis Penjualan Bahan Baku"}
                    type={"text"}
                    onchange={(e) => {
                        setKodeJenisPenjualanBahanBaku(e.target.value)
                    }}
                    others={
                        {
                            value: kodeJenisPenjualanBahanBaku,
                            name: "kodeJenisPenjualanBahanBaku"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveJenisPenjualanBahanBaku()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default JenisPenjualanBahanBakuForm