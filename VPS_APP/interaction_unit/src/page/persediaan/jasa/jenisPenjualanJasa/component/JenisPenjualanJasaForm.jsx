import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formShowMessage, formValidation, showAlert } from "../../../../../helper/form.helper"
import { apiJenisPenjualanJasaCRUD } from "../../../../../service/endPointList.api"

const JenisPenjualanJasaForm = ({
    setAddJenisPenjualanJasaEvent = () => { },
    jenisPenjualanJasaEdit,
    getData = () => { }
}) => {
    const [namaJenisPenjualanJasa, setNamaJenisPenjualanJasa] = useState(jenisPenjualanJasaEdit?.name ? jenisPenjualanJasaEdit.name : ``)
    const [kodeJenisPenjualanJasa, setKodeJenisPenjualanJasa] = useState(jenisPenjualanJasaEdit?.code ? jenisPenjualanJasaEdit.code : ``)

    const _saveJenisPenjualanJasa = async () => {
        if (await formValidation()) {
            apiJenisPenjualanJasaCRUD
                .custom(`${jenisPenjualanJasaEdit?.uuid ? `/${jenisPenjualanJasaEdit.uuid}` : ``}`, jenisPenjualanJasaEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaJenisPenjualanJasa,
                        code: kodeJenisPenjualanJasa
                    }
                }).then(() => {
                    if (jenisPenjualanJasaEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddJenisPenjualanJasaEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{jenisPenjualanJasaEdit ? `Edit` : `Tambahkan`} Jenis Penjualan Jasa</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddJenisPenjualanJasaEvent()}
                ><FaTimes /> Batalkan Jenis Penjualan Jasa
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Jenis Penjualan Jasa"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaJenisPenjualanJasa(e.target.value)
                    }}
                    others={
                        {
                            value: namaJenisPenjualanJasa,
                            name: "namaJenisPenjualanJasa"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Kode Jenis Penjualan Jasa"}
                    type={"text"}
                    onchange={(e) => {
                        setKodeJenisPenjualanJasa(e.target.value)
                    }}
                    others={
                        {
                            value: kodeJenisPenjualanJasa,
                            name: "kodeJenisPenjualanJasa"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveJenisPenjualanJasa()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default JenisPenjualanJasaForm