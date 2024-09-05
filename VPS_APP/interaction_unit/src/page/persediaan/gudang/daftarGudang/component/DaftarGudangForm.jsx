import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formShowMessage, formValidation, showAlert } from "../../../../../helper/form.helper"
import { apiDaftarGudangCRUD } from "../../../../../service/endPointList.api"

const DaftarGudangForm = ({
    setAddDaftarGudangEvent = () => { },
    daftarGudangEdit,
    getData = () => { }
}) => {
    const [namaDaftarGudang, setNamaDaftarGudang] = useState(daftarGudangEdit?.name ? daftarGudangEdit.name : ``)
    const [kodeDaftarGudang, setKodeDaftarGudang] = useState(daftarGudangEdit?.code ? daftarGudangEdit.code : ``)

    const _saveDaftarGudang = async () => {
        if (await formValidation()) {
            apiDaftarGudangCRUD
                .custom(`${daftarGudangEdit?.uuid ? `/${daftarGudangEdit.uuid}` : ``}`, daftarGudangEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaDaftarGudang,
                        code: kodeDaftarGudang
                    }
                }).then(() => {
                    if (daftarGudangEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddDaftarGudangEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{daftarGudangEdit ? `Edit` : `Tambahkan`} Daftar Gudang</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddDaftarGudangEvent()}
                ><FaTimes /> Batalkan Daftar Gudang
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Daftar Gudang"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaDaftarGudang(e.target.value)
                    }}
                    others={
                        {
                            value: namaDaftarGudang,
                            name: "namaDaftarGudang"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Kode Daftar Gudang"}
                    type={"text"}
                    onchange={(e) => {
                        setKodeDaftarGudang(e.target.value)
                    }}
                    others={
                        {
                            value: kodeDaftarGudang,
                            name: "kodeDaftarGudang"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveDaftarGudang()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default DaftarGudangForm