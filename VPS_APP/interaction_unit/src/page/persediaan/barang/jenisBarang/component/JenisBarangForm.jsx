import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formShowMessage, formValidation, showAlert } from "../../../../../helper/form.helper"
import { apiJenisBarangCRUD } from "../../../../../service/endPointList.api"

const JenisBarangForm = ({
    setAddJenisBarangEvent = () => { },
    jenisBarangEdit,
    getData = () => { }
}) => {
    const [namaJenisBarang, setNamaJenisBarang] = useState(jenisBarangEdit?.name ? jenisBarangEdit.name : ``)
    const [kodeJenisBarang, setKodeJenisBarang] = useState(jenisBarangEdit?.code ? jenisBarangEdit.code : ``)

    const _saveJenisBarang = async () => {
        if (await formValidation()) {
            apiJenisBarangCRUD
                .custom(`${jenisBarangEdit?.uuid ? `/${jenisBarangEdit.uuid}` : ``}`, jenisBarangEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaJenisBarang,
                        code: kodeJenisBarang
                    }
                }).then(() => {
                    if (jenisBarangEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddJenisBarangEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{jenisBarangEdit ? `Edit` : `Tambahkan`} Jenis Barang</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddJenisBarangEvent()}
                ><FaTimes /> Batalkan Jenis Barang
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Jenis Barang"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaJenisBarang(e.target.value)
                    }}
                    others={
                        {
                            value: namaJenisBarang,
                            name: "namaJenisBarang"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Kode Jenis Barang"}
                    type={"text"}
                    onchange={(e) => {
                        setKodeJenisBarang(e.target.value)
                    }}
                    others={
                        {
                            value: kodeJenisBarang,
                            name: "kodeJenisBarang"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveJenisBarang()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default JenisBarangForm