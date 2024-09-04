import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formShowMessage, formValidation, showAlert } from "../../../../helper/form.helper"
import { apiCabangCRUD } from "../../../../service/endPointList.api"

const CabangForm = ({
    setAddCabangEvent = () => { },
    cabangEdit,
    getData = () => { }
}) => {
    const [namaCabang, setNamaCabang] = useState(cabangEdit?.name ? cabangEdit.name : ``)

    const _saveCabang = async () => {
        if (await formValidation()) {
            apiCabangCRUD
                .custom(`${cabangEdit?.uuid ? `/${cabangEdit.uuid}` : ``}`, cabangEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaCabang
                    }
                }).then(() => {
                    if (cabangEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddCabangEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{cabangEdit ? `Edit` : `Tambahkan`} Cabang</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddCabangEvent()}
                ><FaTimes /> Batalkan Cabang
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Cabang"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaCabang(e.target.value)
                    }}
                    others={
                        {
                            value: namaCabang,
                            name: "namaCabang"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveCabang()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default CabangForm