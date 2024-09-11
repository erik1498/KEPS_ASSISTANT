import { useEffect, useState } from "react"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaSave } from "react-icons/fa"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiDaftarGudangCRUD, apiStokAwalBarangCRUD } from "../../../../../service/endPointList.api"
import { parseToRupiahText } from "../../../../../helper/number.helper"

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
                        jumlah: jumlah
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

    useEffect(() => {
        _getGudangBarang()
    }, [stokAwalBarangList])

    useEffect(() => {
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
                <th>Gudang</th>
                <th>Kode Barang</th>
                <th>Satuan Barang</th>
                <th>Jumlah</th>
            </thead>
            <tbody>
                {
                    stokAwalBarangList.map((x, i) => {
                        return <>
                            <tr>
                                <td>{i + 1}</td>
                                <td>{x.daftar_gudang_name}</td>
                                <td>{x.kategori_harga_barang_kode_barang}</td>
                                <td>{x.satuan_barang_name}</td>
                                <td>{parseToRupiahText(x.jumlah)}</td>
                            </tr>
                        </>
                    })
                }
            </tbody>
        </table>
    </>
}
export default StokAwalBarangForm