import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formShowMessage, formValidation, showAlert } from "../../../../../helper/form.helper"
import { apiJenisPenjualanBarangCRUD } from "../../../../../service/endPointList.api"

const JenisPenjualanBarangForm = ({
    setAddJenisPenjualanBarangEvent = () => { },
    jenisPenjualanBarangEdit,
    getData = () => { }
}) => {
    const [namaJenisPenjualanBarang, setNamaJenisPenjualanBarang] = useState(jenisPenjualanBarangEdit?.name ? jenisPenjualanBarangEdit.name : ``)
    const [kodeJenisPenjualanBarang, setKodeJenisPenjualanBarang] = useState(jenisPenjualanBarangEdit?.name ? jenisPenjualanBarangEdit.code : ``)

    const _saveJenisPenjualanBarang = async () => {
        if (await formValidation()) {
            apiJenisPenjualanBarangCRUD
                .custom(`${jenisPenjualanBarangEdit?.uuid ? `/${jenisPenjualanBarangEdit.uuid}` : ``}`, jenisPenjualanBarangEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaJenisPenjualanBarang,
                        code: kodeJenisPenjualanBarang
                    }
                }).then(() => {
                    if (jenisPenjualanBarangEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddJenisPenjualanBarangEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{jenisPenjualanBarangEdit ? `Edit` : `Tambahkan`} Jenis Penjualan Barang</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddJenisPenjualanBarangEvent()}
                ><FaTimes /> Batalkan Jenis Penjualan Barang
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Jenis Penjualan Barang"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaJenisPenjualanBarang(e.target.value)
                    }}
                    others={
                        {
                            value: namaJenisPenjualanBarang,
                            name: "namaJenisPenjualanBarang"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Kode Jenis Penjualan Barang"}
                    type={"text"}
                    onchange={(e) => {
                        setKodeJenisPenjualanBarang(e.target.value)
                    }}
                    others={
                        {
                            value: kodeJenisPenjualanBarang,
                            name: "kodeJenisPenjualanBarang"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveJenisPenjualanBarang()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default JenisPenjualanBarangForm