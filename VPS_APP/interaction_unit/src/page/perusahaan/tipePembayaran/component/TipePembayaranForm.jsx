import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formShowMessage, formValidation, showAlert } from "../../../../helper/form.helper"
import { apiTipePembayaranCRUD } from "../../../../service/endPointList.api"

const TipePembayaranForm = ({
    setAddTipePembayaranEvent = () => { },
    tipePembayaranEdit,
    getData = () => { }
}) => {
    const [namaTipePembayaran, setNamaTipePembayaran] = useState(tipePembayaranEdit?.name ? tipePembayaranEdit.name : ``)

    const _saveTipePembayaran = async () => {
        if (await formValidation()) {
            apiTipePembayaranCRUD
                .custom(`${tipePembayaranEdit?.uuid ? `/${tipePembayaranEdit.uuid}` : ``}`, tipePembayaranEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaTipePembayaran
                    }
                }).then(() => {
                    if (tipePembayaranEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddTipePembayaranEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{tipePembayaranEdit ? `Edit` : `Tambahkan`} Tipe Pembayaran</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddTipePembayaranEvent()}
                ><FaTimes /> Batalkan Tipe Pembayaran
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Tipe Pembayaran"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaTipePembayaran(e.target.value)
                    }}
                    others={
                        {
                            value: namaTipePembayaran,
                            name: "namaTipePembayaran"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveTipePembayaran()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default TipePembayaranForm