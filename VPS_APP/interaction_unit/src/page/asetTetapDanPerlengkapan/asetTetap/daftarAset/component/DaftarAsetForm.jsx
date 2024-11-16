import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiDaftarAsetCRUD, apiKategoriAsetCRUD, apiKelompokAsetCRUD, apiMetodePenyusutanCRUD, apiSatuanBarangCRUD, apiSupplierCRUD } from "../../../../../service/endPointList.api"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { parseToRupiahText } from "../../../../../helper/number.helper"

const DaftarAsetForm = ({
    setAddDaftarAsetEvent = () => { },
    daftarAsetEdit,
    getData = () => { }
}) => {
    const [supplierList, setSupplierList] = useState([])
    const [satuanBarangList, setSatuanBarangList] = useState([])
    const [metodePenyusutanList, setMetodePenyusutanList] = useState([])
    const [kelompokAsetList, setKelompokAsetList] = useState([])
    const [kategoriAsetList, setKategoriAsetList] = useState([])

    const [namaDaftarAset, setNamaDaftarAset] = useState(daftarAsetEdit?.name ? daftarAsetEdit.name : ``)
    const [tanggalBeliDaftarAset, setTanggalBeliDaftarAset] = useState(daftarAsetEdit?.tanggal_beli ? daftarAsetEdit.tanggal_beli : getHariTanggalFull())
    const [supplierDaftarAset, setSupplierDaftarAset] = useState(daftarAsetEdit?.supplier ? daftarAsetEdit.supplier : ``)
    const [nomorInvoiceDaftarAset, setNomorInvoiceDaftarAset] = useState(daftarAsetEdit?.nomor_invoice ? daftarAsetEdit.nomor_invoice : ``)
    const [kuantitasDaftarAset, setKuantitasDaftarAset] = useState(daftarAsetEdit?.kuantitas ? parseToRupiahText(daftarAsetEdit.kuantitas) : ``)
    const [satuanBarangDaftarAset, setSatuanBarangDaftarAset] = useState(daftarAsetEdit?.satuan_barang ? daftarAsetEdit.satuan_barang : ``)
    const [hargaSatuanDaftarAset, setHargaSatuanDaftarAset] = useState(daftarAsetEdit?.harga_satuan ? parseToRupiahText(daftarAsetEdit.harga_satuan) : ``)
    const [DPPDaftarAset, setDPPDaftarAset] = useState(daftarAsetEdit?.dpp ? parseToRupiahText(daftarAsetEdit.dpp) : ``)
    const [PPNDaftarAset, setPPNDaftarAset] = useState(daftarAsetEdit?.ppn ? parseToRupiahText(daftarAsetEdit.ppn) : ``)
    const [metodePenyusutanDaftarAset, setMetodePenyusutanDaftarAset] = useState(daftarAsetEdit?.metode_penyusutan ? daftarAsetEdit.metode_penyusutan : ``)
    const [kelompokAsetDaftarAset, setKelompokAsetDaftarAset] = useState(daftarAsetEdit?.kelompok_aset ? daftarAsetEdit.kelompok_aset : ``)
    const [kategoriAsetDaftarAset, setKategoriAsetDaftarAset] = useState(daftarAsetEdit?.kategori_aset ? daftarAsetEdit.kategori_aset : ``)

    const _getDataSupplier = () => {
        apiSupplierCRUD
            .custom(``, "GET")
            .then(resData => {
                setSupplierList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarAsetEdit) {
                        initialDataFromEditObject({
                            editObject: daftarAsetEdit.supplier,
                            dataList: resData.data.entry,
                            setState: setSupplierDaftarAset,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setSupplierDaftarAset({
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
                    if (daftarAsetEdit) {
                        initialDataFromEditObject({
                            editObject: daftarAsetEdit.satuan_barang,
                            dataList: resData.data.entry,
                            setState: setSatuanBarangDaftarAset,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setSatuanBarangDaftarAset({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataMetodePenyusutan = () => {
        apiMetodePenyusutanCRUD
            .custom(``, "GET")
            .then(resData => {
                setMetodePenyusutanList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarAsetEdit) {
                        initialDataFromEditObject({
                            editObject: daftarAsetEdit.metode_penyusutan,
                            dataList: resData.data.entry,
                            setState: setMetodePenyusutanDaftarAset,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setMetodePenyusutanDaftarAset({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataKelompokAset = () => {
        apiKelompokAsetCRUD
            .custom(``, "GET")
            .then(resData => {
                setKelompokAsetList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarAsetEdit) {
                        initialDataFromEditObject({
                            editObject: daftarAsetEdit.kelompok_aset,
                            dataList: resData.data.entry,
                            setState: setKelompokAsetDaftarAset,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setKelompokAsetDaftarAset({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataKategoriAset = () => {
        apiKategoriAsetCRUD
            .custom(``, "GET")
            .then(resData => {
                setKategoriAsetList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (daftarAsetEdit) {
                        initialDataFromEditObject({
                            editObject: daftarAsetEdit.kategori_aset,
                            dataList: resData.data.entry,
                            setState: setKategoriAsetDaftarAset,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setKategoriAsetDaftarAset({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _saveDaftarAset = async () => {
        if (await formValidation()) {
            apiDaftarAsetCRUD
                .custom(`${daftarAsetEdit?.uuid ? `/${daftarAsetEdit.uuid}` : ``}`, daftarAsetEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaDaftarAset,
                        tanggal_beli: tanggalBeliDaftarAset,
                        nomor_invoice: nomorInvoiceDaftarAset,
                        supplier: supplierDaftarAset.value,
                        kuantitas: kuantitasDaftarAset,
                        satuan_barang: satuanBarangDaftarAset.value,
                        harga_satuan: hargaSatuanDaftarAset,
                        dpp: DPPDaftarAset,
                        ppn: PPNDaftarAset,
                        metode_penyusutan: metodePenyusutanDaftarAset.value,
                        kelompok_aset: kelompokAsetDaftarAset.value,
                        kategori_aset: kategoriAsetDaftarAset.value
                    }
                }).then(() => {
                    if (daftarAsetEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddDaftarAsetEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    useEffect(() => {
        _getDataSupplier()
        _getDataSatuanBarang()
        _getDataMetodePenyusutan()
        _getDataKelompokAset()
        _getDataKategoriAset()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{daftarAsetEdit ? `Edit` : `Tambahkan`} Daftar Aset</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddDaftarAsetEvent()}
                ><FaTimes /> Batalkan Daftar Aset
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Aset"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaDaftarAset(e.target.value)
                    }}
                    others={
                        {
                            value: namaDaftarAset,
                            name: "namaDaftarAset"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Tanggal Beli"}
                    type={"datetime-local"}
                    onchange={(e) => {
                        setTanggalBeliDaftarAset(e.target.value)
                    }}
                    others={
                        {
                            value: tanggalBeliDaftarAset,
                            name: "tanggalBeliDaftarAset"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Nomor Invoice"}
                    type={"text"}
                    onchange={(e) => {
                        setNomorInvoiceDaftarAset(e.target.value)
                    }}
                    others={
                        {
                            value: nomorInvoiceDaftarAset,
                            name: "nomorInvoiceDaftarAset"
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormSelectWithLabel
                    label={"Supplier"}
                    optionsDataList={supplierList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={supplierDaftarAset}
                    onchange={(e) => {
                        setSupplierDaftarAset(e)
                    }}
                    selectName={`supplierDaftarAset`}
                />
                <FormInputWithLabel
                    label={"Kuantitas"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyRupiah(e)
                        setKuantitasDaftarAset(e.target.value)
                    }}
                    others={
                        {
                            value: kuantitasDaftarAset,
                            name: "kuantitasDaftarAset"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Satuan Barang"}
                    optionsDataList={satuanBarangList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={satuanBarangDaftarAset}
                    onchange={(e) => {
                        setSatuanBarangDaftarAset(e)
                    }}
                    selectName={`satuanBarangDaftarAset`}
                />
                <FormInputWithLabel
                    label={"Harga Satuan"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyRupiah(e)
                        setHargaSatuanDaftarAset(e.target.value)
                    }}
                    others={
                        {
                            value: hargaSatuanDaftarAset,
                            name: "hargaSatuanDaftarAset"
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
                        setDPPDaftarAset(e.target.value)
                    }}
                    others={
                        {
                            value: DPPDaftarAset,
                            name: "DPPDaftarAset"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"PPN"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyRupiah(e)
                        setPPNDaftarAset(e.target.value)
                    }}
                    others={
                        {
                            value: PPNDaftarAset,
                            name: "PPNDaftarAset"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Metode Penyusutan"}
                    optionsDataList={metodePenyusutanList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={metodePenyusutanDaftarAset}
                    onchange={(e) => {
                        setMetodePenyusutanDaftarAset(e)
                    }}
                    selectName={`metodePenyusutanDaftarAset`}
                />
                <FormSelectWithLabel
                    label={"Kelompok Aset"}
                    optionsDataList={kelompokAsetList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={kelompokAsetDaftarAset}
                    onchange={(e) => {
                        setKelompokAsetDaftarAset(e)
                    }}
                    selectName={`kelompokAsetDaftarAset`}
                />
                <FormSelectWithLabel
                    label={"Kategori Aset"}
                    optionsDataList={kategoriAsetList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={kategoriAsetDaftarAset}
                    onchange={(e) => {
                        setKategoriAsetDaftarAset(e)
                    }}
                    selectName={`kategoriAsetDaftarAset`}
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveDaftarAset()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default DaftarAsetForm