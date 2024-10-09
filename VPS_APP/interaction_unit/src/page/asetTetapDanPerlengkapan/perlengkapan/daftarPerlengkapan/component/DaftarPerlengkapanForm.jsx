import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import { apiDaftarPerlengkapanCRUD, apiKategoriPerlengkapanCRUD, apiMetodePenyusutanCRUD, apiSatuanBarangCRUD, apiSupplierCRUD } from "../../../../../service/endPointList.api"

const DaftarPerlengkapanForm = ({
    setAddDaftarPerlengkapanEvent = () => { },
    daftarPerlengkapanEdit,
    getData = () => { }
}) => {
    const [supplierList, setSupplierList] = useState([])
    const [satuanBarangList, setSatuanBarangList] = useState([])
    const [kategoriPerlengkapanList, setKategoriPerlengkapanList] = useState([])

    const [namaDaftarPerlengkapan, setNamaDaftarPerlengkapan] = useState(daftarPerlengkapanEdit?.name ? daftarPerlengkapanEdit.name : ``)
    const [tanggalBeliDaftarPerlengkapan, setTanggalBeliDaftarPerlengkapan] = useState(daftarPerlengkapanEdit?.tanggal_beli ? daftarPerlengkapanEdit.tanggal_beli : getHariTanggalFull())
    const [supplierDaftarPerlengkapan, setSupplierDaftarPerlengkapan] = useState(daftarPerlengkapanEdit?.supplier ? daftarPerlengkapanEdit.supplier : ``)
    const [kuantitasDaftarPerlengkapan, setKuantitasDaftarPerlengkapan] = useState(daftarPerlengkapanEdit?.kuantitas ? parseToRupiahText(daftarPerlengkapanEdit.kuantitas) : ``)
    const [satuanBarangDaftarPerlengkapan, setSatuanBarangDaftarPerlengkapan] = useState(daftarPerlengkapanEdit?.satuan_barang ? daftarPerlengkapanEdit.satuan_barang : ``)
    const [hargaSatuanDaftarPerlengkapan, setHargaSatuanDaftarPerlengkapan] = useState(daftarPerlengkapanEdit?.harga_satuan ? parseToRupiahText(daftarPerlengkapanEdit.harga_satuan) : ``)
    const [DPPDaftarPerlengkapan, setDPPDaftarPerlengkapan] = useState(daftarPerlengkapanEdit?.dpp ? parseToRupiahText(daftarPerlengkapanEdit.dpp) : ``)
    const [PPNDaftarPerlengkapan, setPPNDaftarPerlengkapan] = useState(daftarPerlengkapanEdit?.ppn ? parseToRupiahText(daftarPerlengkapanEdit.ppn) : ``)
    const [kategoriPerlengkapanDaftarPerlengkapan, setKategoriPerlengkapanDaftarPerlengkapan] = useState(daftarPerlengkapanEdit?.kategori_perlengkapan ? daftarPerlengkapanEdit.kategori_perlengkapan : ``)

    const _getDataSupplier = () => {
        apiSupplierCRUD
            .custom(``, "GET")
            .then(resData => {
                setSupplierList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarPerlengkapanEdit) {
                        initialDataFromEditObject({
                            editObject: daftarPerlengkapanEdit.supplier,
                            dataList: resData.data.entry,
                            setState: setSupplierDaftarPerlengkapan,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setSupplierDaftarPerlengkapan({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataSatuanBarang = () => {
        apiSatuanBarangCRUD
            .custom(``, "GET")
            .then(resData => {
                setSatuanBarangList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarPerlengkapanEdit) {
                        initialDataFromEditObject({
                            editObject: daftarPerlengkapanEdit.satuan_barang,
                            dataList: resData.data.entry,
                            setState: setSatuanBarangDaftarPerlengkapan,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setSatuanBarangDaftarPerlengkapan({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataKategoriPerlengkapan = () => {
        apiKategoriPerlengkapanCRUD
            .custom(``, "GET")
            .then(resData => {
                setKategoriPerlengkapanList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarPerlengkapanEdit) {
                        initialDataFromEditObject({
                            editObject: daftarPerlengkapanEdit.kategori_perlengkapan,
                            dataList: resData.data.entry,
                            setState: setKategoriPerlengkapanDaftarPerlengkapan,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setKategoriPerlengkapanDaftarPerlengkapan({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _saveDaftarPerlengkapan = async () => {
        if (await formValidation()) {
            apiDaftarPerlengkapanCRUD
                .custom(`${daftarPerlengkapanEdit?.uuid ? `/${daftarPerlengkapanEdit.uuid}` : ``}`, daftarPerlengkapanEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaDaftarPerlengkapan,
                        tanggal_beli: tanggalBeliDaftarPerlengkapan,
                        kategori_perlengkapan: kategoriPerlengkapanDaftarPerlengkapan.value,
                        supplier: supplierDaftarPerlengkapan.value,
                        kuantitas: kuantitasDaftarPerlengkapan,
                        satuan_barang: satuanBarangDaftarPerlengkapan.value,
                        harga_satuan: hargaSatuanDaftarPerlengkapan,
                        dpp: DPPDaftarPerlengkapan,
                        ppn: PPNDaftarPerlengkapan,
                    }
                }).then(() => {
                    if (daftarPerlengkapanEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddDaftarPerlengkapanEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    useEffect(() => {
        _getDataSupplier()
        _getDataSatuanBarang()
        _getDataKategoriPerlengkapan()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{daftarPerlengkapanEdit ? `Edit` : `Tambahkan`} Daftar Perlengkapan</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddDaftarPerlengkapanEvent()}
                ><FaTimes /> Batalkan Daftar Perlengkapan
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Perlengkapan"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaDaftarPerlengkapan(e.target.value)
                    }}
                    others={
                        {
                            value: namaDaftarPerlengkapan,
                            name: "namaDaftarPerlengkapan"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Tanggal Beli"}
                    type={"datetime-local"}
                    onchange={(e) => {
                        setTanggalBeliDaftarPerlengkapan(e.target.value)
                    }}
                    others={
                        {
                            value: tanggalBeliDaftarPerlengkapan,
                            name: "tanggalBeliDaftarPerlengkapan"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Kategori Perlengkapan"}
                    optionsDataList={kategoriPerlengkapanList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={kategoriPerlengkapanDaftarPerlengkapan}
                    onchange={(e) => {
                        setKategoriPerlengkapanDaftarPerlengkapan(e)
                    }}
                    selectName={`kategoriPerlengkapanDaftarPerlengkapan`}
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormSelectWithLabel
                    label={"Supplier"}
                    optionsDataList={supplierList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={supplierDaftarPerlengkapan}
                    onchange={(e) => {
                        setSupplierDaftarPerlengkapan(e)
                    }}
                    selectName={`supplierDaftarPerlengkapan`}
                />
                <FormInputWithLabel
                    label={"Kuantitas"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyRupiah(e)
                        setKuantitasDaftarPerlengkapan(e.target.value)
                    }}
                    others={
                        {
                            value: kuantitasDaftarPerlengkapan,
                            name: "kuantitasDaftarPerlengkapan"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Satuan Barang"}
                    optionsDataList={satuanBarangList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={satuanBarangDaftarPerlengkapan}
                    onchange={(e) => {
                        setSatuanBarangDaftarPerlengkapan(e)
                    }}
                    selectName={`satuanBarangDaftarPerlengkapan`}
                />
                <FormInputWithLabel
                    label={"Harga Satuan"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyRupiah(e)
                        setHargaSatuanDaftarPerlengkapan(e.target.value)
                    }}
                    others={
                        {
                            value: hargaSatuanDaftarPerlengkapan,
                            name: "hargaSatuanDaftarPerlengkapan"
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"DPP"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyRupiah(e)
                        setDPPDaftarPerlengkapan(e.target.value)
                    }}
                    others={
                        {
                            value: DPPDaftarPerlengkapan,
                            name: "DPPDaftarPerlengkapan"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"PPN"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyRupiah(e)
                        setPPNDaftarPerlengkapan(e.target.value)
                    }}
                    others={
                        {
                            value: PPNDaftarPerlengkapan,
                            name: "PPNDaftarPerlengkapan"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveDaftarPerlengkapan()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default DaftarPerlengkapanForm