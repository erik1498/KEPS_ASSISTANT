import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formShowMessage, formValidation, showAlert } from "../../../../helper/form.helper"
import { apiCustomerCRUD } from "../../../../service/endPointList.api"
import { inputOnlyNumber } from "../../../../helper/actionEvent.helper"
import FormSelectWithLabel from "../../../../component/form/FormSelectWithLabel"
import { kodeHargaList } from "../../../../config/objectList.config"

const CustomerForm = ({
    setAddCustomerEvent = () => { },
    customerEdit,
    getData = () => { }
}) => {
    const [namaCustomer, setNamaCustomer] = useState(customerEdit?.name ? customerEdit.name : ``)
    const [kodeCustomer, setKodeCustomer] = useState(customerEdit?.code ? customerEdit.code : ``)
    const [NPWPCustomer, setNPWPCustomer] = useState(customerEdit?.npwp ? customerEdit.npwp : ``)
    const [alamatRumahCustomer, setAlamatRumahCustomer] = useState(customerEdit?.alamat_rumah ? customerEdit.alamat_rumah : ``)
    const [alamatKantorCustomer, setAlamatKantorCustomer] = useState(customerEdit?.alamat_kantor ? customerEdit.alamat_kantor : ``)
    const [nomorTeleponCustomer, setNomorTeleponCustomer] = useState(customerEdit?.no_telp ? customerEdit.no_telp : ``)
    const [nomorHandphoneCustomer, setNomorHandphoneCustomer] = useState(customerEdit?.no_hp ? customerEdit.no_hp : ``)
    const [kodeHargaCustomer, setKodeHargaCustomer] = useState(customerEdit?.kode_harga ? {
        label: `Harga ${customerEdit.kode_harga}`,
        value: customerEdit.kode_harga
    } : ``)

    const _saveCustomer = async () => {
        if (await formValidation()) {
            apiCustomerCRUD
                .custom(`${customerEdit?.uuid ? `/${customerEdit.uuid}` : ``}`, customerEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaCustomer,
                        code: kodeCustomer,
                        npwp: NPWPCustomer,
                        alamat_rumah: alamatRumahCustomer,
                        alamat_kantor: alamatKantorCustomer,
                        no_telp: nomorTeleponCustomer,
                        no_hp: nomorHandphoneCustomer,
                        kode_harga: `${kodeHargaCustomer.value}`
                    }
                }).then(() => {
                    if (customerEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddCustomerEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{customerEdit ? `Edit` : `Tambahkan`} Customer</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddCustomerEvent()}
                ><FaTimes /> Batalkan Customer
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Customer"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaCustomer(e.target.value)
                    }}
                    others={
                        {
                            value: namaCustomer,
                            name: "namaCustomer"
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"Kode Customer"}
                    type={"text"}
                    onchange={(e) => {
                        setKodeCustomer(e.target.value)
                    }}
                    others={
                        {
                            value: kodeCustomer,
                            name: "kodeCustomer"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"NPWP Customer"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyNumber(e)
                        setNPWPCustomer(e.target.value)
                    }}
                    others={
                        {
                            value: NPWPCustomer,
                            name: "NPWPCustomer"
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"Alamat Rumah"}
                    type={"text"}
                    onchange={(e) => {
                        setAlamatRumahCustomer(e.target.value)
                    }}
                    others={
                        {
                            value: alamatRumahCustomer,
                            name: "alamatRumahCustomer"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Alamat Kantor"}
                    type={"text"}
                    onchange={(e) => {
                        setAlamatKantorCustomer(e.target.value)
                    }}
                    others={
                        {
                            value: alamatKantorCustomer,
                            name: "alamatKantorCustomer"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Nomor Telepon"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyNumber(e)
                        setNomorTeleponCustomer(e.target.value)
                    }}
                    others={
                        {
                            value: nomorTeleponCustomer,
                            name: "nomorTeleponCustomer"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Nomor Handphone"}
                    type={"text"}
                    onchange={(e) => {
                        setNomorHandphoneCustomer(e.target.value)
                    }}
                    others={
                        {
                            value: nomorHandphoneCustomer,
                            name: "nomorHandphoneCustomer"
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormSelectWithLabel
                    label={"Kode Harga"}
                    optionsDataList={kodeHargaList}
                    optionsLabel={"label"}
                    optionsValue={"value"}
                    selectValue={kodeHargaCustomer}
                    onchange={(e) => {
                        setKodeHargaCustomer(e)
                    }}
                    selectName={`kodeHargaCustomer`}
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveCustomer()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default CustomerForm