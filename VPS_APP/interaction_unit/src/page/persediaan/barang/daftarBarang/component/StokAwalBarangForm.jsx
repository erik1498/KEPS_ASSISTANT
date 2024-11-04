import { useEffect, useState } from "react"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyNumber, inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaCheck, FaPen, FaSave, FaTrash } from "react-icons/fa"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiDaftarGudangCRUD, apiStokAwalBarangCRUD } from "../../../../../service/endPointList.api"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import FormInput from "../../../../../component/form/FormInput"

const StokAwalBarangForm = ({
    idDaftarBarang,
    kategoriHargaBarangList
}) => {
    const [gudangBarang, setGudangBarang] = useState()
    const [kategoriHargaBarang, setKategoriHargaBarang] = useState(kategoriHargaBarangList.length > 0 ? {
        label: kategoriHargaBarangList[0].kode_barang,
        value: kategoriHargaBarangList[0].uuid
    } : null)
    const [jumlah, setJumlah] = useState(0)

    const [gudangBarangList, setGudangBarangList] = useState([])

    const [stokAwalBarangList, setStokAwalBarangList] = useState([])

    const _saveStokAwalBarang = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiStokAwalBarangCRUD
                .custom("", "POST", null, {
                    data: {
                        daftar_barang: idDaftarBarang,
                        daftar_gudang: gudangBarang.value,
                        kategori_harga_barang: kategoriHargaBarang.value,
                        jumlah: `${jumlah}`
                    }
                }).then(() => {
                    _getStokAwalBarang()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    const _getGudangBarang = () => {
        apiDaftarGudangCRUD
            .custom("", "GET")
            .then(resData => {
                setGudangBarangList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    setGudangBarang({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getStokAwalBarang = () => {
        apiStokAwalBarangCRUD
            .custom(`/${idDaftarBarang}`, "GET")
            .then(resData => {
                setStokAwalBarangList(resData.data)
            }).catch(err => {
                showError(err)
            })
    }

    const _updateJumlahStokAwalBarang = (value, uuid) => {
        const indexStokAwalBarang = stokAwalBarangList.findIndex(x => x.uuid == uuid)
        if (indexStokAwalBarang != -1) {
            let stokAwalBarangListCopy = stokAwalBarangList
            stokAwalBarangListCopy.at(indexStokAwalBarang).jumlah = parseToRupiahText(value)

            setStokAwalBarangList(x => x = stokAwalBarangListCopy)
        }
    }

    const _updateStokAwalBarang = (item) => {
        apiStokAwalBarangCRUD
            .custom(`/${item.uuid}`, "PUT", null, {
                data: {
                    daftar_gudang: item.daftar_gudang,
                    daftar_barang: item.daftar_barang,
                    kategori_harga_barang: item.kategori_harga_barang,
                    jumlah: `${item.jumlah}`
                }
            })
            .catch(err => {
                showError(err)
            }).finally(() => _getStokAwalBarang())
    }

    const _deleteStokAwalBarang = (item) => {
        apiStokAwalBarangCRUD
            .custom(`/${item.uuid}`, "DELETE")
            .catch(err => {
                showError(err)
            }).finally(() => _getStokAwalBarang())
    }

    useEffect(() => {
        _getGudangBarang()
        _getStokAwalBarang()
    }, [])

    return <>
        <h1 className="mt-16 mb-5 uppercase text-gray-600 font-bold">Stok Awal Barang</h1>
        <form onSubmit={e => _saveStokAwalBarang(e)} className="pb-6">
            <div className="flex gap-x-2 items-end">
                <FormSelectWithLabel
                    label={"Gudang Barang"}
                    optionsDataList={gudangBarangList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={gudangBarang}
                    onchange={(e) => {
                        setGudangBarang(e)
                    }}
                    selectName={`gudangBarang`}
                />
                <FormSelectWithLabel
                    label={"Kode Barang"}
                    optionsDataList={kategoriHargaBarangList}
                    optionsLabel={"kode_barang"}
                    optionsValue={"uuid"}
                    selectValue={kategoriHargaBarang}
                    onchange={(e) => {
                        setKategoriHargaBarang(e)
                    }}
                    selectName={`kategoriHargaBarang`}
                />
                <FormInputWithLabel
                    label={"Jumlah"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyRupiah(e)
                        setJumlah(e.target.value)
                    }}
                    others={
                        {
                            value: jumlah,
                            name: "jumlah"
                        }
                    }
                />
                <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
            </div>
        </form>
        <table className="table table-sm table-zebra">
            <thead className="py-4 text-black">
                <th>No</th>
                <th>Daftar Gudang Name</th>
                <th>Kode Barang</th>
                <th>Satuan</th>
                <th>Jumlah</th>
                <th>Aksi</th>
            </thead>
            <tbody>
                {
                    stokAwalBarangList.map((item, i) => {
                        return <>
                            <tr>
                                <td>{i + 1}</td>
                                <td>{item.daftar_gudang_name}</td>
                                <td>{item.kategori_harga_barang_kode_barang}</td>
                                <td>{item.satuan_barang_name}</td>
                                <td width={150}>
                                    <FormInput
                                        name={"jumlah_item_" + i}
                                        type={"text"}
                                        other={{
                                            defaultValue: parseToRupiahText(item.jumlah)
                                        }}
                                        onchange={(e) => {
                                            inputOnlyRupiah(e)
                                            _updateJumlahStokAwalBarang(e.target.value, item.uuid)
                                        }}
                                    />
                                </td>
                                <td width={100}>
                                    <div className="flex gap-x-2">
                                        <FaSave
                                            onClick={() => _updateStokAwalBarang(item)}
                                            className="text-green-800 cursor-pointer"
                                            size={12}
                                        />
                                        <FaTrash
                                            onClick={() => _deleteStokAwalBarang(item)}
                                            className="text-red-500 cursor-pointer"
                                            size={12}
                                        />
                                    </div>
                                </td>
                            </tr>
                        </>
                    })
                }
            </tbody>
        </table>
    </>
}
export default StokAwalBarangForm