import { useEffect, useState } from "react"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyNumber, inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaCheck, FaPen, FaSave, FaTrash } from "react-icons/fa"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiDaftarGudangCRUD, apiStokAwalBahanBakuCRUD } from "../../../../../service/endPointList.api"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import FormInput from "../../../../../component/form/FormInput"
import { getHariTanggalFull } from "../../../../../helper/date.helper"

const StokAwalBahanBakuForm = ({
    idDaftarBahanBaku,
    kategoriHargaBahanBakuList
}) => {
    const [gudangBahanBaku, setGudangBahanBaku] = useState()
    const [kategoriHargaBahanBaku, setKategoriHargaBahanBaku] = useState(kategoriHargaBahanBakuList.length > 0 ? {
        label: kategoriHargaBahanBakuList[0].kode_bahan_baku,
        value: kategoriHargaBahanBakuList[0].uuid
    } : null)
    const [jumlah, setJumlah] = useState(0)
    const [tanggal, setTanggal] = useState(getHariTanggalFull())

    const [gudangBahanBakuList, setGudangBahanBakuList] = useState([])

    const [stokAwalBahanBakuList, setStokAwalBahanBakuList] = useState([])

    const _saveStokAwalBahanBaku = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiStokAwalBahanBakuCRUD
                .custom("", "POST", null, {
                    data: {
                        daftar_bahan_baku: idDaftarBahanBaku,
                        daftar_gudang: gudangBahanBaku.value,
                        kategori_harga_bahan_baku: kategoriHargaBahanBaku.value,
                        jumlah: `${jumlah}`,
                        tanggal: `${tanggal}`
                    }
                }).then(() => {
                    _getStokAwalBahanBaku()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    const _getGudangBahanBaku = () => {
        apiDaftarGudangCRUD
            .custom("", "GET")
            .then(resData => {
                setGudangBahanBakuList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    setGudangBahanBaku({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getStokAwalBahanBaku = () => {
        apiStokAwalBahanBakuCRUD
            .custom(`/${idDaftarBahanBaku}`, "GET")
            .then(resData => {
                setStokAwalBahanBakuList(resData.data)
            }).catch(err => {
                showError(err)
            })
    }

    const _updateJumlahStokAwalBahanBaku = (value, uuid) => {
        const indexStokAwalBahanBaku = stokAwalBahanBakuList.findIndex(x => x.uuid == uuid)
        if (indexStokAwalBahanBaku != -1) {
            let stokAwalBahanBakuListCopy = stokAwalBahanBakuList
            stokAwalBahanBakuListCopy.at(indexStokAwalBahanBaku).jumlah = parseToRupiahText(value)

            setStokAwalBahanBakuList(x => x = stokAwalBahanBakuListCopy)
        }
    }

    const _updateStokAwalBahanBaku = (item) => {
        apiStokAwalBahanBakuCRUD
            .custom(`/${item.uuid}`, "PUT", null, {
                data: {
                    daftar_gudang: item.daftar_gudang,
                    daftar_bahan_baku: item.daftar_bahan_baku,
                    kategori_harga_bahan_baku: item.kategori_harga_bahan_baku,
                    jumlah: `${item.jumlah}`
                }
            })
            .catch(err => {
                showError(err)
            }).finally(() => _getStokAwalBahanBaku())
    }

    const _deleteStokAwalBahanBaku = (item) => {
        apiStokAwalBahanBakuCRUD
            .custom(`/${item.uuid}`, "DELETE")
            .catch(err => {
                showError(err)
            }).finally(() => _getStokAwalBahanBaku())
    }

    useEffect(() => {
        _getGudangBahanBaku()
        _getStokAwalBahanBaku()
    }, [])

    return <>
        <h1 className="mt-16 mb-5 uppercase text-gray-600 font-bold">Stok Awal Bahan Baku</h1>
        <form onSubmit={e => _saveStokAwalBahanBaku(e)} className="pb-6">
            <div className="flex gap-x-2 items-end">
                <FormSelectWithLabel
                    label={"Gudang Bahan Baku"}
                    optionsDataList={gudangBahanBakuList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={gudangBahanBaku}
                    onchange={(e) => {
                        setGudangBahanBaku(e)
                    }}
                    selectName={`gudangBahanBaku`}
                />
                <FormSelectWithLabel
                    label={"Kode Bahan Baku"}
                    optionsDataList={kategoriHargaBahanBakuList}
                    optionsLabel={"kode_bahan_baku"}
                    optionsValue={"uuid"}
                    selectValue={kategoriHargaBahanBaku}
                    onchange={(e) => {
                        setKategoriHargaBahanBaku(e)
                    }}
                    selectName={`kategoriHargaBahanBaku`}
                />
                {/* <FormInputWithLabel
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
                /> */}
                <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
            </div>
        </form>
        <table className="table table-sm table-zebra">
            <thead className="py-4 text-black">
                <th>No</th>
                <th>Daftar Gudang Name</th>
                <th>Kode Bahan Baku</th>
                <th>Satuan</th>
                {/* <th>Jumlah</th> */}
                <th>Aksi</th>
            </thead>
            <tbody>
                {
                    stokAwalBahanBakuList.map((item, i) => {
                        return <>
                            <tr>
                                <td>{i + 1}</td>
                                <td>{item.daftar_gudang_name}</td>
                                <td>{item.kategori_harga_bahan_baku_kode_bahan_baku}</td>
                                <td>{item.satuan_bahan_baku_name}</td>
                                {/* <td width={150}>
                                    <FormInput
                                        name={"jumlah_item_" + i}
                                        type={"text"}
                                        other={{
                                            defaultValue: parseToRupiahText(item.jumlah)
                                        }}
                                        onchange={(e) => {
                                            inputOnlyRupiah(e)
                                            _updateJumlahStokAwalBahanBaku(e.target.value, item.uuid)
                                        }}
                                    />
                                </td> */}
                                <td width={100}>
                                    <div className="flex gap-x-2">
                                        {/* <FaSave
                                            onClick={() => _updateStokAwalBahanBaku(item)}
                                            className="text-green-800 cursor-pointer"
                                            size={12}
                                        /> */}
                                        <FaTrash
                                            onClick={() => _deleteStokAwalBahanBaku(item)}
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
export default StokAwalBahanBakuForm