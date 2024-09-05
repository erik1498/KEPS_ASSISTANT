import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formShowMessage, formValidation, showAlert, showError } from "../../../../helper/form.helper"
import { apiJenisBarangCRUD, apiSupplierCRUD } from "../../../../service/endPointList.api"
import { inputOnlyNumber } from "../../../../helper/actionEvent.helper"
import FormSelectWithLabel from "../../../../component/form/FormSelectWithLabel"
import { kodeHargaList } from "../../../../config/objectList.config"

const SupplierForm = ({
    setAddSupplierEvent = () => { },
    supplierEdit,
    getData = () => { }
}) => {
    const [jenisBarangList, setJenisBarangList] = useState([])
    const [namaSupplier, setNamaSupplier] = useState(supplierEdit?.name ? supplierEdit.name : ``)
    const [kodeSupplier, setKodeSupplier] = useState(supplierEdit?.code ? supplierEdit.code : ``)
    const [NPWPSupplier, setNPWPSupplier] = useState(supplierEdit?.npwp ? supplierEdit.npwp : ``)
    const [alamatRumahSupplier, setAlamatRumahSupplier] = useState(supplierEdit?.alamat_rumah ? supplierEdit.alamat_rumah : ``)
    const [alamatKantorSupplier, setAlamatKantorSupplier] = useState(supplierEdit?.alamat_kantor ? supplierEdit.alamat_kantor : ``)
    const [nomorTeleponSupplier, setNomorTeleponSupplier] = useState(supplierEdit?.no_telp ? supplierEdit.no_telp : ``)
    const [nomorHandphoneSupplier, setNomorHandphoneSupplier] = useState(supplierEdit?.no_hp ? supplierEdit.no_hp : ``)
    const [jenisBarangSupplier, setJenisBarangSupplier] = useState(supplierEdit?.jenis_barang ? {
        label: `Harga ${supplierEdit.jenis_barang}`,
        value: supplierEdit.jenis_barang
    } : ``)

    const _saveSupplier = async () => {
        if (await formValidation()) {
            apiSupplierCRUD
                .custom(`${supplierEdit?.uuid ? `/${supplierEdit.uuid}` : ``}`, supplierEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaSupplier,
                        code: kodeSupplier,
                        npwp: NPWPSupplier,
                        alamat_rumah: alamatRumahSupplier,
                        alamat_kantor: alamatKantorSupplier,
                        no_telp: nomorTeleponSupplier,
                        no_hp: nomorHandphoneSupplier,
                        jenis_barang: `${jenisBarangSupplier.value}`
                    }
                }).then(() => {
                    if (supplierEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddSupplierEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    const _getDataJenisBarang = () => {
        apiJenisBarangCRUD
            .custom(``, "GET")
            .then(resData => {
                setJenisBarangList(resData.data.entry)
            }).catch(err => {
                showError(err)
            })
    }

    useEffect(() => {
        _getDataJenisBarang()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{supplierEdit ? `Edit` : `Tambahkan`} Supplier</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddSupplierEvent()}
                ><FaTimes /> Batalkan Supplier
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Supplier"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaSupplier(e.target.value)
                    }}
                    others={
                        {
                            value: namaSupplier,
                            name: "namaSupplier"
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"Kode Supplier"}
                    type={"text"}
                    onchange={(e) => {
                        setKodeSupplier(e.target.value)
                    }}
                    others={
                        {
                            value: kodeSupplier,
                            name: "kodeSupplier"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"NPWP Supplier"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyNumber(e)
                        setNPWPSupplier(e.target.value)
                    }}
                    others={
                        {
                            value: NPWPSupplier,
                            name: "NPWPSupplier"
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"Alamat Rumah"}
                    type={"text"}
                    onchange={(e) => {
                        setAlamatRumahSupplier(e.target.value)
                    }}
                    others={
                        {
                            value: alamatRumahSupplier,
                            name: "alamatRumahSupplier"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Alamat Kantor"}
                    type={"text"}
                    onchange={(e) => {
                        setAlamatKantorSupplier(e.target.value)
                    }}
                    others={
                        {
                            value: alamatKantorSupplier,
                            name: "alamatKantorSupplier"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Nomor Telepon"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyNumber(e)
                        setNomorTeleponSupplier(e.target.value)
                    }}
                    others={
                        {
                            value: nomorTeleponSupplier,
                            name: "nomorTeleponSupplier"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Nomor Handphone"}
                    type={"text"}
                    onchange={(e) => {
                        setNomorHandphoneSupplier(e.target.value)
                    }}
                    others={
                        {
                            value: nomorHandphoneSupplier,
                            name: "nomorHandphoneSupplier"
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormSelectWithLabel
                    label={"Jenis Barang"}
                    optionsDataList={jenisBarangList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={jenisBarangSupplier}
                    onchange={(e) => {
                        setJenisBarangSupplier(e)
                    }}
                    selectName={`jenisBarangSupplier`}
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveSupplier()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default SupplierForm