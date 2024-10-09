import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiMetodePenyusutanCRUD } from "../../../../../service/endPointList.api"

const MetodePenyusutanForm = ({
    setAddMetodePenyusutanEvent = () => { },
    MetodePenyusutanEdit,
    getData = () => { }
}) => {
    const [namaMetodePenyusutan, setNamaMetodePenyusutan] = useState(MetodePenyusutanEdit?.name ? MetodePenyusutanEdit.name : ``)

    const _saveMetodePenyusutan = async () => {
        if (await formValidation()) {
            apiMetodePenyusutanCRUD
                .custom(`${MetodePenyusutanEdit?.uuid ? `/${MetodePenyusutanEdit.uuid}` : ``}`, MetodePenyusutanEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaMetodePenyusutan
                    }
                }).then(() => {
                    if (MetodePenyusutanEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddMetodePenyusutanEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{MetodePenyusutanEdit ? `Edit` : `Tambahkan`} Metode Penyusutan</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddMetodePenyusutanEvent()}
                ><FaTimes /> Batalkan Metode Penyusutan
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Metode Penyusutan"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaMetodePenyusutan(e.target.value)
                    }}
                    others={
                        {
                            value: namaMetodePenyusutan,
                            name: "namaMetodePenyusutan"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveMetodePenyusutan()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default MetodePenyusutanForm