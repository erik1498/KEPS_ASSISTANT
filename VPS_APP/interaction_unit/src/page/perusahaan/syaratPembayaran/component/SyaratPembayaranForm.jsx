import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formValidation, showAlert, showError } from "../../../../helper/form.helper"
import { apiSyaratPembayaranCRUD } from "../../../../service/endPointList.api"
import FormSelectWithLabel from "../../../../component/form/FormSelectWithLabel"
import { inputOnlyNumber } from "../../../../helper/actionEvent.helper"

const SyaratPembayaranForm = ({
    setAddSyaratPembayaranEvent = () => { },
    syaratPembayaranEdit,
    tipePembayaranList = [],
    getData = () => { }
}) => {
    const [namaSyaratPembayaran, setNamaSyaratPembayaran] = useState(syaratPembayaranEdit?.name ? syaratPembayaranEdit.name : ``)
    const [tipePembayaran, setTipePembayaran] = useState(syaratPembayaranEdit?.tipe_pembayaran ? syaratPembayaranEdit.tipe_pembayaran : null)
    const [hariKadaluarsa, setHariKadaluarsa] = useState(syaratPembayaranEdit?.hari_kadaluarsa ? syaratPembayaranEdit.hari_kadaluarsa : null)
    const [denda, setDenda] = useState(syaratPembayaranEdit?.denda ? syaratPembayaranEdit.denda : null)

    const _saveSyaratPembayaran = async () => {
        if (await formValidation()) {
            apiSyaratPembayaranCRUD
                .custom(`${syaratPembayaranEdit?.uuid ? `/${syaratPembayaranEdit.uuid}` : ``}`, syaratPembayaranEdit ? "PUT" : "POST", null, {
                    data: {
                        tipe_pembayaran: tipePembayaran.value,
                        name: namaSyaratPembayaran,
                        hari_kadaluarsa: hariKadaluarsa,
                        denda: denda
                    }
                }).then(() => {
                    if (syaratPembayaranEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddSyaratPembayaranEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{syaratPembayaranEdit ? `Edit` : `Tambahkan`} Syarat Pembayaran</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddSyaratPembayaranEvent()}
                ><FaTimes /> Batalkan Syarat Pembayaran
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormSelectWithLabel
                    label={"Tipe Pembayaran"}
                    optionsDataList={tipePembayaranList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={tipePembayaran}
                    onchange={(e) => {
                        setTipePembayaran(e)
                    }}
                    selectName={`tipe_pembayaran`}
                />
                <FormInputWithLabel
                    label={"Nama Syarat Pembayaran"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaSyaratPembayaran(e.target.value)
                    }}
                    others={
                        {
                            value: namaSyaratPembayaran,
                            name: "namaSyaratPembayaran"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Hari Kadaluarsa"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyNumber(e)
                        setHariKadaluarsa(e.target.value)
                    }}
                    others={
                        {
                            value: hariKadaluarsa,
                            name: "hariKadaluarsa"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Denda"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyNumber(e)
                        setDenda(e.target.value)
                    }}
                    others={
                        {
                            value: denda,
                            name: "denda"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveSyaratPembayaran()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default SyaratPembayaranForm