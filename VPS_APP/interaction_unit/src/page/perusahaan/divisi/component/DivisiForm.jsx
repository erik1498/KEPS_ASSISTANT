import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formValidation, showAlert, showError } from "../../../../helper/form.helper"
import { apiDivisiCRUD } from "../../../../service/endPointList.api"

const DivisiForm = ({
    setAddDivisiEvent = () => { },
    divisiEdit,
    getData = () => { }
}) => {
    const [namaDivisi, setNamaDivisi] = useState(divisiEdit?.name ? divisiEdit.name : ``)

    const _saveDivisi = async () => {
        if (await formValidation()) {
            apiDivisiCRUD
                .custom(`${divisiEdit?.uuid ? `/${divisiEdit.uuid}` : ``}`, divisiEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaDivisi
                    }
                }).then(() => {
                    if (divisiEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddDivisiEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{divisiEdit ? `Edit` : `Tambahkan`} Divisi</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddDivisiEvent()}
                ><FaTimes /> Batalkan Divisi
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Divisi"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaDivisi(e.target.value)
                    }}
                    others={
                        {
                            value: namaDivisi,
                            name: "namaDivisi"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveDivisi()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default DivisiForm