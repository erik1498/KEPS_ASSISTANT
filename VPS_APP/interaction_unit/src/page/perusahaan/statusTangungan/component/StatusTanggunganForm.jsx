import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formValidation, showAlert, showError } from "../../../../helper/form.helper"
import { apiStatusTanggunganCRUD } from "../../../../service/endPointList.api"

const StatusTanggunganForm = ({
    setAddStatusTanggunganEvent = () => { },
    statusTanggunganEdit,
    getData = () => { }
}) => {
    const [namaStatusTanggungan, setNamaStatusTanggungan] = useState(statusTanggunganEdit?.name ? statusTanggunganEdit.name : ``)

    const _saveStatusTanggungan = async () => {
        if (await formValidation()) {
            apiStatusTanggunganCRUD
                .custom(`${statusTanggunganEdit?.uuid ? `/${statusTanggunganEdit.uuid}` : ``}`, statusTanggunganEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaStatusTanggungan
                    }
                }).then(() => {
                    if (statusTanggunganEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddStatusTanggunganEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{statusTanggunganEdit ? `Edit` : `Tambahkan`} Syarat Pembayaran</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddStatusTanggunganEvent()}
                ><FaTimes /> Batalkan Status Tanggungan
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Status Tanggungan"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaStatusTanggungan(e.target.value)
                    }}
                    others={
                        {
                            value: namaStatusTanggungan,
                            name: "namaStatusTanggungan"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveStatusTanggungan()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default StatusTanggunganForm