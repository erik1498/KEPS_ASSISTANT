import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formShowMessage, formValidation, showAlert } from "../../../../../helper/form.helper"
import { apiSatuanBarangCRUD } from "../../../../../service/endPointList.api"

const SatuanBarangForm = ({
    setAddSatuanBarangEvent = () => { },
    satuanBarangEdit,
    getData = () => { }
}) => {
    const [namaSatuanBarang, setNamaSatuanBarang] = useState(satuanBarangEdit?.name ? satuanBarangEdit.name : ``)

    const _saveSatuanBarang = async () => {
        if (await formValidation()) {
            apiSatuanBarangCRUD
                .custom(`${satuanBarangEdit?.uuid ? `/${satuanBarangEdit.uuid}` : ``}`, satuanBarangEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaSatuanBarang
                    }
                }).then(() => {
                    if (satuanBarangEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddSatuanBarangEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{satuanBarangEdit ? `Edit` : `Tambahkan`} Satuan Barang</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddSatuanBarangEvent()}
                ><FaTimes /> Batalkan Satuan Barang
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Satuan Barang"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaSatuanBarang(e.target.value)
                    }}
                    others={
                        {
                            value: namaSatuanBarang,
                            name: "namaSatuanBarang"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveSatuanBarang()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default SatuanBarangForm