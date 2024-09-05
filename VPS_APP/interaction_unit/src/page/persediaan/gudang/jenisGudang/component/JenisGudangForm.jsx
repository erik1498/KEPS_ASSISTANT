import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formShowMessage, formValidation, showAlert } from "../../../../../helper/form.helper"
import { apiJenisGudangCRUD } from "../../../../../service/endPointList.api"

const JenisGudangForm = ({
    setAddJenisGudangEvent = () => { },
    jenisGudangEdit,
    getData = () => { }
}) => {
    const [namaJenisGudang, setNamaJenisGudang] = useState(jenisGudangEdit?.name ? jenisGudangEdit.name : ``)
    const [kodeJenisGudang, setKodeJenisGudang] = useState(jenisGudangEdit?.code ? jenisGudangEdit.code : ``)

    const _saveJenisGudang = async () => {
        if (await formValidation()) {
            apiJenisGudangCRUD
                .custom(`${jenisGudangEdit?.uuid ? `/${jenisGudangEdit.uuid}` : ``}`, jenisGudangEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaJenisGudang,
                        code: kodeJenisGudang
                    }
                }).then(() => {
                    if (jenisGudangEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddJenisGudangEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{jenisGudangEdit ? `Edit` : `Tambahkan`} Jenis Gudang</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddJenisGudangEvent()}
                ><FaTimes /> Batalkan Jenis Gudang
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Jenis Gudang"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaJenisGudang(e.target.value)
                    }}
                    others={
                        {
                            value: namaJenisGudang,
                            name: "namaJenisGudang"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Kode Jenis Gudang"}
                    type={"text"}
                    onchange={(e) => {
                        setKodeJenisGudang(e.target.value)
                    }}
                    others={
                        {
                            value: kodeJenisGudang,
                            name: "kodeJenisGudang"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveJenisGudang()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default JenisGudangForm