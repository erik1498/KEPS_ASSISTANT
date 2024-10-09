import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formValidation, showAlert, showError } from "../../../../helper/form.helper"
import { apiJabatanCRUD } from "../../../../service/endPointList.api"

const JabatanForm = ({
    setAddJabatanEvent = () => { },
    jabatanEdit,
    getData = () => { }
}) => {
    const [namaJabatan, setNamaJabatan] = useState(jabatanEdit?.name ? jabatanEdit.name : ``)

    const _saveJabatan = async () => {
        if (await formValidation()) {
            apiJabatanCRUD
                .custom(`${jabatanEdit?.uuid ? `/${jabatanEdit.uuid}` : ``}`, jabatanEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaJabatan
                    }
                }).then(() => {
                    if (jabatanEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddJabatanEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{jabatanEdit ? `Edit` : `Tambahkan`} Jabatan</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddJabatanEvent()}
                ><FaTimes /> Batalkan Jabatan
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Jabatan"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaJabatan(e.target.value)
                    }}
                    others={
                        {
                            value: namaJabatan,
                            name: "namaJabatan"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveJabatan()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default JabatanForm