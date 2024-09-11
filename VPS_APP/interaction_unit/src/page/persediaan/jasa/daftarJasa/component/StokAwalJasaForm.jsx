import { useEffect, useState } from "react"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaSave } from "react-icons/fa"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiDaftarGudangCRUD, apiStokAwalJasaCRUD } from "../../../../../service/endPointList.api"
import { parseToRupiahText } from "../../../../../helper/number.helper"

const StokAwalJasaForm = ({
    idDaftarJasa,
    kategoriHargaJasaList
}) => {
    const [gudangJasa, setGudangJasa] = useState()
    const [kategoriHargaJasa, setKategoriHargaJasa] = useState(kategoriHargaJasaList.length > 0 ? {
        label: kategoriHargaJasaList[0].kode_jasa,
        value: kategoriHargaJasaList[0].uuid
    } : null)
    const [jumlah, setJumlah] = useState(0)

    const [gudangJasaList, setGudangJasaList] = useState([])

    const [stokAwalJasaList, setStokAwalJasaList] = useState([])

    const _saveStokAwalJasa = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiStokAwalJasaCRUD
                .custom("", "POST", null, {
                    data: {
                        daftar_jasa: idDaftarJasa,
                        daftar_gudang: gudangJasa.value,
                        kategori_harga_jasa: kategoriHargaJasa.value,
                        jumlah: jumlah
                    }
                }).then(() => {
                    _getStokAwalJasa()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    const _getGudangJasa = () => {
        apiDaftarGudangCRUD
            .custom("", "GET")
            .then(resData => {
                setGudangJasaList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    setGudangJasa({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getStokAwalJasa = () => {
        apiStokAwalJasaCRUD
            .custom(`/${idDaftarJasa}`, "GET")
            .then(resData => {
                setStokAwalJasaList(resData.data)
            }).catch(err => {
                showError(err)
            })
    }

    useEffect(() => {
        _getGudangJasa()
    }, [stokAwalJasaList])

    useEffect(() => {
        _getStokAwalJasa()
    }, [])

    return <>
        <h1 className="mt-16 mb-5 uppercase text-gray-600 font-bold">Stok Awal Jasa</h1>
        <form onSubmit={e => _saveStokAwalJasa(e)} className="pb-6">
            <div className="flex gap-x-2 items-end">
                <FormSelectWithLabel
                    label={"Gudang Jasa"}
                    optionsDataList={gudangJasaList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={gudangJasa}
                    onchange={(e) => {
                        setGudangJasa(e)
                    }}
                    selectName={`gudangJasa`}
                />
                <FormSelectWithLabel
                    label={"Kode Jasa"}
                    optionsDataList={kategoriHargaJasaList}
                    optionsLabel={"kode_jasa"}
                    optionsValue={"uuid"}
                    selectValue={kategoriHargaJasa}
                    onchange={(e) => {
                        setKategoriHargaJasa(e)
                    }}
                    selectName={`kategoriHargaJasa`}
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
                <th>Kode Jasa</th>
                <th>Satuan Jasa</th>
                <th>Jumlah</th>
            </thead>
            <tbody>
                {
                    stokAwalJasaList.map((x, i) => {
                        return <>
                            <tr>
                                <td>{i + 1}</td>
                                <td>{x.daftar_gudang_name}</td>
                                <td>{x.kategori_harga_jasa_kode_jasa}</td>
                                <td>{x.satuan_jasa_name}</td>
                                <td>{parseToRupiahText(x.jumlah)}</td>
                            </tr>
                        </>
                    })
                }
            </tbody>
        </table>
    </>
}
export default StokAwalJasaForm