import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiHasilStokOpnameCRUD, apiPerintahStokOpnameCRUD } from "../../../../../service/endPointList.api"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"

const HasilStokOpnameForm = ({
    setAddHasilStokOpnameEvent = () => { },
    hasilStokOpnameEdit,
    getData = () => { }
}) => {
    const [tanggal, setTanggal] = useState(hasilStokOpnameEdit?.tanggal ? hasilStokOpnameEdit.tanggal : getHariTanggalFull())
    const [perintahStokOpname, setPerintahStokOpname] = useState(hasilStokOpnameEdit?.perintah_stok_opname ? hasilStokOpnameEdit.perintah_stok_opname : ``)

    const [perintahStokOpnameList, setPerintahStokOpnameList] = useState([])
    const [hasilStokOpnameList, setHasilStokOpnameList] = useState([])

    const _saveHasilStokOpname = async (index) => {
        apiHasilStokOpnameCRUD
            .custom(`${hasilStokOpnameList[index].uuid != "" ? `/${hasilStokOpnameList[index].uuid}` : ``}`, hasilStokOpnameList[index].uuid != "" ? "PUT" : "POST", null, {
                data: {
                    tanggal: tanggal,
                    perintah_stok_opname: perintahStokOpname.value,
                    stok_awal_barang: hasilStokOpnameList[index].stok_awal_barang,
                    kuantitas: `${0}`
                }
            }).then(() => {
                if (index + 1 < hasilStokOpnameList.length) {
                    _saveHasilStokOpname(index + 1)
                } else {
                    getData()
                    setAddHasilStokOpnameEvent()
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataPerintahStokOpname = () => {
        apiPerintahStokOpnameCRUD
            .custom("", "GET")
            .then(resData => {
                setPerintahStokOpnameList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (hasilStokOpnameEdit) {
                        initialDataFromEditObject({
                            editObject: hasilStokOpnameEdit.kategori_barang,
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
        apiHasilStokOpnameCRUD.custom(`/daftar_barang/${perintahStokOpname.value}`, "GET")
            .then(resData => {
                setHasilStokOpnameList(resData.data)
            }).catch(err => showError(err))
    }

    useEffect(() => {
        _getDaftarBarangPerintahStokOpname()
    }, [perintahStokOpname])

    useEffect(() => {
        _getDataPerintahStokOpname()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{hasilStokOpnameEdit ? `Edit` : `Tambahkan`} Hasil Stok Opname</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddHasilStokOpnameEvent()}
                ><FaTimes /> Batalkan Hasil Stok Opname
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
                            <th>Kuantitas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            hasilStokOpnameList?.map((item, i) => {
                                return <>
                                    <tr key={i}>
                                        <td>{i + 1}.</td>
                                        <td>{item.kategori_harga_barang_kode_barang}</td>
                                        <td>{item.daftar_barang_name}</td>
                                        <td>{item.satuan_barang_name}</td>
                                        <td>{item.kuantitas}</td>
                                    </tr>
                                </>
                            })
                        }
                    </tbody>
                </table>
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveHasilStokOpname(0)
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default HasilStokOpnameForm