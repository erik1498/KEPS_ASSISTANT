import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiKelompokAsetCRUD } from "../../../../../service/endPointList.api"
import { inputOnlyNumber } from "../../../../../helper/actionEvent.helper"

const KelompokAsetForm = ({
    setAddKelompokAsetEvent = () => { },
    kelompokAsetEdit,
    getData = () => { }
}) => {
    const [namaKelompokAset, setNamaKelompokAset] = useState(kelompokAsetEdit?.name ? kelompokAsetEdit.name : ``)
    const [masaPenyusutanAset, setMasaPenyusutanAset] = useState(kelompokAsetEdit?.masa_penyusutan ? kelompokAsetEdit.masa_penyusutan : ``)

    const _saveKelompokAset = async () => {
        if (await formValidation()) {
            apiKelompokAsetCRUD
                .custom(`${kelompokAsetEdit?.uuid ? `/${kelompokAsetEdit.uuid}` : ``}`, kelompokAsetEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaKelompokAset,
                        masa_penyusutan: masaPenyusutanAset
                    }
                }).then(() => {
                    if (kelompokAsetEdit) {                
                        showAlert("Berhasil", "Data berhasil diupdate")
                    }else{
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddKelompokAsetEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{kelompokAsetEdit ? `Edit` : `Tambahkan`} Kelompok Aset</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddKelompokAsetEvent()}
                ><FaTimes /> Batalkan Kelompok Aset
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Kelompok Aset"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaKelompokAset(e.target.value)
                    }}
                    others={
                        {
                            value: namaKelompokAset,
                            name: "namaKelompokAset"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Masa Penyusutan Aset ( Tahun )"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyNumber(e)
                        setMasaPenyusutanAset(e.target.value)
                    }}
                    others={
                        {
                            value: masaPenyusutanAset,
                            name: "masaPenyusutanAset"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveKelompokAset()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default KelompokAsetForm