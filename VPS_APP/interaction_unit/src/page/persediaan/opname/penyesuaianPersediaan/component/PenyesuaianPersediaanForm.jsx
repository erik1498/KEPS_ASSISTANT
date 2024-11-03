import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiPenyesuaianPersediaanCRUD, apiPerintahStokOpnameCRUD } from "../../../../../service/endPointList.api"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInput from "../../../../../component/form/FormInput"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import { useDataContext } from "../../../../../context/dataContext.context"

const PenyesuaianPersediaanForm = ({
    setAddPenyesuaianPersediaanEvent = () => { },
    penyesuaianPersediaanEdit,
    getData = () => { }
}) => {
    const dataContext = useDataContext()
    const { data } = dataContext
    
    const [tanggal, setTanggal] = useState(penyesuaianPersediaanEdit?.penyesuaian_persediaan_tanggal ? penyesuaianPersediaanEdit.penyesuaian_persediaan_tanggal : getHariTanggalFull())
    const [perintahStokOpname, setPerintahStokOpname] = useState(penyesuaianPersediaanEdit?.uuid ? penyesuaianPersediaanEdit.uuid : ``)

    const [perintahStokOpnameList, setPerintahStokOpnameList] = useState([])
    const [penyesuaianPersediaanList, setPenyesuaianPersediaanList] = useState([])

    const _savePenyesuaianPersediaan = async (index) => {
        apiPenyesuaianPersediaanCRUD
            .custom(`${penyesuaianPersediaanList[index].uuid != "" ? `/${penyesuaianPersediaanList[index].uuid}` : ``}`, penyesuaianPersediaanList[index].uuid != "" ? "PUT" : "POST", null, {
                data: {
                    tanggal: tanggal,
                    perintah_stok_opname: perintahStokOpname.value,
                    hasil_stok_opname: penyesuaianPersediaanList[index].hasil_stok_opname,
                    kuantitas: `${penyesuaianPersediaanList[index].kuantitas}`,
                    stok_tersedia_sistem: `${penyesuaianPersediaanList[index].stok_sistem}`,
                    tipe_penyesuaian: `${penyesuaianPersediaanList[index].tipe_penyesuaian}`,
                    jumlah: `${_getJumlahPerbedaan(penyesuaianPersediaanList[index])}`,
                    keterangan: penyesuaianPersediaanList[index].keterangan
                }
            }).then(() => {
                if (index + 1 < penyesuaianPersediaanList.length) {
                    _savePenyesuaianPersediaan(index + 1)
                } else {
                    getData()
                    setAddPenyesuaianPersediaanEvent()
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataPerintahStokOpname = () => {
        apiPerintahStokOpnameCRUD
            .custom(`?tahun=${data.tahun}`, "GET")
            .then(resData => {
                setPerintahStokOpnameList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (penyesuaianPersediaanEdit) {
                        initialDataFromEditObject({
                            editObject: penyesuaianPersediaanEdit.uuid,
                            dataList: resData.data.entry,
                            setState: setPerintahStokOpname,
                            labelKey: "nomor_surat_perintah",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setPerintahStokOpname({
                        label: resData.data.entry[0].nomor_surat_perintah,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => showError(err))
    }

    const _getDaftarBarangPerintahStokOpname = () => {
        apiPenyesuaianPersediaanCRUD.custom(`/daftar_barang/${perintahStokOpname.value}`, "GET")
            .then(resData => {
                setPenyesuaianPersediaanList(resData.data)
            }).catch(err => showError(err))
    }

    const _updateKeterangan = (value, stok_awal_barang) => {
        let hasilStokOpnameListCopy = penyesuaianPersediaanList

        hasilStokOpnameListCopy = hasilStokOpnameListCopy.map(x => {
            if (x.stok_awal_barang == stok_awal_barang) {
                x.keterangan = value
            }
            return x
        })
        setPenyesuaianPersediaanList(x => x = hasilStokOpnameListCopy)
    }

    const _getJumlahPerbedaan = (item) => {
        if (item.tipe_penyesuaian != "SESUAI") {
            return item.tipe_penyesuaian == "PENGURANGAN" ? parseInt(item.stok_sistem) - parseInt(item.kuantitas) : parseInt(item.kuantitas) - parseInt(item.stok_sistem)
        }
        return "0"
    }

    useEffect(() => {
        if (perintahStokOpname) {
            _getDaftarBarangPerintahStokOpname()
        }
    }, [perintahStokOpname])

    useEffect(() => {
        _getDataPerintahStokOpname()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{penyesuaianPersediaanEdit ? `Edit` : `Tambahkan`} Penyesuaian Persediaan</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddPenyesuaianPersediaanEvent()}
                ><FaTimes /> Batalkan Penyesuaian Persediaan
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Tanggal"}
                    type={"datetime-local"}
                    onchange={(e) => {
                        setTanggal(e.target.value)
                    }}
                    others={
                        {
                            value: tanggal,
                            name: "tanggal"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Perintah Stok Opname"}
                    optionsDataList={perintahStokOpnameList}
                    optionsLabel={"nomor_surat_perintah"}
                    optionsValue={"uuid"}
                    disabled={true}
                    selectValue={perintahStokOpname}
                    onchange={(e) => {
                        setPerintahStokOpname(e)
                    }}
                    selectName={`perintahStokOpname`}
                />
            </div>
            <div className="overflow-x-auto rounded-md h-max max-h-[90vh] no-scrollbar mt-5 pb-4">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className="sticky top-0 bg-white py-4 text-black">
                            <th width={12}>No</th>
                            <th>Kode Barang</th>
                            <th>Nama Barang</th>
                            <th>Satuan Barang</th>
                            <th>Stok Sistem</th>
                            <th>Kuantitas</th>
                            <th>Tipe Penyesuaian</th>
                            <th>Jumlah</th>
                            <th>Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            penyesuaianPersediaanList?.map((item, i) => {
                                return <>
                                    <tr key={i}>
                                        <td>{i + 1}.</td>
                                        <td>{item.kategori_harga_barang_kode_barang}</td>
                                        <td>{item.daftar_barang_name}</td>
                                        <td>{item.satuan_barang_name}</td>
                                        <td>{item.stok_sistem}</td>
                                        <td>{item.kuantitas}</td>
                                        <td>{item.tipe_penyesuaian}</td>
                                        <td>{_getJumlahPerbedaan(item)}</td>
                                        <td>
                                            <FormInput
                                                name={"keterangan_" + i}
                                                type={"text"}
                                                other={{
                                                    defaultValue: item.keterangan
                                                }}
                                                onchange={(e) => {
                                                    _updateKeterangan(e.target.value, item.stok_awal_barang)
                                                }}
                                                value={parseToRupiahText(item.keterangan)}
                                            />
                                        </td>
                                    </tr>
                                </>
                            })
                        }
                    </tbody>
                </table>
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _savePenyesuaianPersediaan(0)
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default PenyesuaianPersediaanForm