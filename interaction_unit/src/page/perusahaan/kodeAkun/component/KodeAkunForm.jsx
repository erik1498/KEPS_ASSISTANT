import { FaPlus, FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { inputOnlyNumber } from "../../../../helper/actionEvent.helper"
import FormSelect from "../../../../component/form/FormSelect"
import { KodeAkunType } from "../../../../config/objectList.config"
import FormSelectWithLabel from "../../../../component/form/FormSelectWithLabel"
import { formShowMessage, formValidation } from "../../../../helper/form.helper"
import { apiKodeAkunCRUD } from "../../../../service/endPointList.api"

const KodeAkunForm = ({
    setAddKodeAkunEvent = () => { },
    kodeAkunEdit,
    getData = () => { }
}) => {
    const [namaAkun, setNamaAkun] = useState(kodeAkunEdit?.name ? kodeAkunEdit.name : ``)
    const [kodeAkun, setKodeAkun] = useState(kodeAkunEdit?.code ? kodeAkunEdit.code : ``)
    const [kodeAkunTypeList, setKodeAkunTypeList] = useState(KodeAkunType())
    const [typeKodeAkun, setTypeKodeAkun] = useState({
        label: kodeAkunEdit?.type ? kodeAkunEdit.type : `Harta`,
        value: kodeAkunEdit?.type ? kodeAkunEdit.type : `Harta`
    })



    const _saveKodeAkun = async () => {
        if (await formValidation()) {
            apiKodeAkunCRUD
                .custom(`${kodeAkunEdit?.uuid ? `/${kodeAkunEdit.uuid}` : ``}`, kodeAkunEdit ? "PUT" : "POST", null, {
                    data: {
                        type: typeKodeAkun.value,
                        name: namaAkun,
                        code: kodeAkun
                    }
                }).then(() => {
                    setAddKodeAkunEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.message))
                })
        }
    }


    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{kodeAkunEdit ? `Edit` : `Tambahkan`} Kode Akun</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddKodeAkunEvent()}
                ><FaTimes /> Batalkan Kode Akun
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Akun"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaAkun(e.target.value)
                    }}
                    others={
                        {
                            value: namaAkun,
                            name: "namaAkun"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Kode Akun"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyNumber(e)
                        setKodeAkun(e.target.value)
                    }}
                    others={
                        {
                            value: kodeAkun,
                            name: "kodeAkun"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Tipe Akun"}
                    onchange={(e) => {
                        setTypeKodeAkun(e)
                    }}
                    optionsDataList={kodeAkunTypeList}
                    optionsLabel={"name"}
                    optionsValue={"name"}
                    selectName={"kodeAkunType"}
                    selectValue={typeKodeAkun}
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveKodeAkun()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default KodeAkunForm