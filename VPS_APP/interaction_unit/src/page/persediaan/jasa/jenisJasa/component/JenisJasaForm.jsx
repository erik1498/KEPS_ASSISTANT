import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiJenisJasaCRUD } from "../../../../../service/endPointList.api"

const JenisJasaForm = ({
    setAddJenisJasaEvent = () => { },
    jenisJasaEdit,
    getData = () => { }
}) => {
    const [namaJenisJasa, setNamaJenisJasa] = useState(jenisJasaEdit?.name ? jenisJasaEdit.name : ``)
    const [kodeJenisJasa, setKodeJenisJasa] = useState(jenisJasaEdit?.code ? jenisJasaEdit.code : ``)

    const _saveJenisJasa = async () => {
        if (await formValidation()) {
            apiJenisJasaCRUD
                .custom(`${jenisJasaEdit?.uuid ? `/${jenisJasaEdit.uuid}` : ``}`, jenisJasaEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaJenisJasa,
                        code: kodeJenisJasa
                    }
                }).then(() => {
                    if (jenisJasaEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddJenisJasaEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{jenisJasaEdit ? `Edit` : `Tambahkan`} Jenis Jasa</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddJenisJasaEvent()}
                ><FaTimes /> Batalkan Jenis Jasa
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Jenis Jasa"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaJenisJasa(e.target.value)
                    }}
                    others={
                        {
                            value: namaJenisJasa,
                            name: "namaJenisJasa"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Kode Jenis Jasa"}
                    type={"text"}
                    onchange={(e) => {
                        setKodeJenisJasa(e.target.value)
                    }}
                    others={
                        {
                            value: kodeJenisJasa,
                            name: "kodeJenisJasa"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveJenisJasa()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default JenisJasaForm