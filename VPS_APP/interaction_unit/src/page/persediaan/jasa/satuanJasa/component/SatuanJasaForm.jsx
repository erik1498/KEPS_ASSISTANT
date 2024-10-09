import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiSatuanJasaCRUD } from "../../../../../service/endPointList.api"

const SatuanJasaForm = ({
    setAddSatuanJasaEvent = () => { },
    satuanJasaEdit,
    getData = () => { }
}) => {
    const [namaSatuanJasa, setNamaSatuanJasa] = useState(satuanJasaEdit?.name ? satuanJasaEdit.name : ``)

    const _saveSatuanJasa = async () => {
        if (await formValidation()) {
            apiSatuanJasaCRUD
                .custom(`${satuanJasaEdit?.uuid ? `/${satuanJasaEdit.uuid}` : ``}`, satuanJasaEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaSatuanJasa
                    }
                }).then(() => {
                    if (satuanJasaEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddSatuanJasaEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{satuanJasaEdit ? `Edit` : `Tambahkan`} Satuan Jasa</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddSatuanJasaEvent()}
                ><FaTimes /> Batalkan Satuan Jasa
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Satuan Jasa"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaSatuanJasa(e.target.value)
                    }}
                    others={
                        {
                            value: namaSatuanJasa,
                            name: "namaSatuanJasa"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveSatuanJasa()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default SatuanJasaForm