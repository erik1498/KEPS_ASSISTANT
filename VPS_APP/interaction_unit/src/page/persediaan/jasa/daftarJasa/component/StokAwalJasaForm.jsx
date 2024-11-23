import { useEffect, useState } from "react"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyNumber, inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaCheck, FaPen, FaSave, FaTrash } from "react-icons/fa"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiCabangCRUD, apiDaftarGudangCRUD, apiStokAwalJasaCRUD } from "../../../../../service/endPointList.api"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import FormInput from "../../../../../component/form/FormInput"
import { getHariTanggalFull } from "../../../../../helper/date.helper"

const StokAwalJasaForm = ({
    idDaftarJasa,
    kategoriHargaJasaList
}) => {
    const [cabangJasa, setCabangJasa] = useState()
    const [kategoriHargaJasa, setKategoriHargaJasa] = useState(kategoriHargaJasaList.length > 0 ? {
        label: kategoriHargaJasaList[0].kode_jasa,
        value: kategoriHargaJasaList[0].uuid
    } : null)
    const [jumlah, setJumlah] = useState(0)
    const [tanggal, setTanggal] = useState(getHariTanggalFull())

    const [cabangJasaList, setCabangJasaList] = useState([])

    const [stokAwalJasaList, setStokAwalJasaList] = useState([])

    const _saveStokAwalJasa = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiStokAwalJasaCRUD
                .custom("", "POST", null, {
                    data: {
                        daftar_jasa: idDaftarJasa,
                        cabang: cabangJasa.value,
                        kategori_harga_jasa: kategoriHargaJasa.value,
                        jumlah: `${jumlah}`,
                        tanggal: `${tanggal}`
                    }
                }).then(() => {
                    _getStokAwalJasa()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    const _getCabangJasa = () => {
        apiCabangCRUD
            .custom("", "GET")
            .then(resData => {
                setCabangJasaList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    setCabangJasa({
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

    const _updateJumlahStokAwalJasa = (value, uuid) => {
        const indexStokAwalJasa = stokAwalJasaList.findIndex(x => x.uuid == uuid)
        if (indexStokAwalJasa != -1) {
            let stokAwalJasaListCopy = stokAwalJasaList
            stokAwalJasaListCopy.at(indexStokAwalJasa).jumlah = parseToRupiahText(value)

            setStokAwalJasaList(x => x = stokAwalJasaListCopy)
        }
    }

    const _updateStokAwalJasa = (item) => {
        apiStokAwalJasaCRUD
            .custom(`/${item.uuid}`, "PUT", null, {
                data: {
                    cabang: item.cabang,
                    daftar_jasa: item.daftar_jasa,
                    kategori_harga_jasa: item.kategori_harga_jasa,
                    jumlah: `${item.jumlah}`
                }
            })
            .catch(err => {
                showError(err)
            }).finally(() => _getStokAwalJasa())
    }

    const _deleteStokAwalJasa = (item) => {
        apiStokAwalJasaCRUD
            .custom(`/${item.uuid}`, "DELETE")
            .catch(err => {
                showError(err)
            }).finally(() => _getStokAwalJasa())
    }

    useEffect(() => {
        _getCabangJasa()
        _getStokAwalJasa()
    }, [])

    return <>
        <h1 className="mt-16 mb-5 uppercase text-gray-600 font-bold">Stok Awal Jasa</h1>
        <form onSubmit={e => _saveStokAwalJasa(e)} className="pb-6">
            <div className="flex gap-x-2 items-end">
                <FormSelectWithLabel
                    label={"Cabang Jasa"}
                    optionsDataList={cabangJasaList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={cabangJasa}
                    onchange={(e) => {
                        setCabangJasa(e)
                    }}
                    selectName={`cabangJasa`}
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
                <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
            </div>
        </form>
        <table className="table table-sm table-zebra">
            <thead className="py-4 text-black">
                <th>No</th>
                <th>Daftar Cabang Name</th>
                <th>Kode Jasa</th>
                <th>Satuan</th>
                {/* <th>Jumlah</th> */}
                <th>Aksi</th>
            </thead>
            <tbody>
                {
                    stokAwalJasaList.map((item, i) => {
                        return <>
                            <tr>
                                <td>{i + 1}</td>
                                <td>{item.cabang_name}</td>
                                <td>{item.kategori_harga_jasa_kode_jasa}</td>
                                <td>{item.satuan_jasa_name}</td>
                                {/* <td width={150}>
                                    <FormInput
                                        name={"jumlah_item_" + i}
                                        type={"text"}
                                        other={{
                                            defaultValue: parseToRupiahText(item.jumlah)
                                        }}
                                        onchange={(e) => {
                                            inputOnlyRupiah(e)
                                            _updateJumlahStokAwalJasa(e.target.value, item.uuid)
                                        }}
                                    />
                                </td> */}
                                <td width={100}>
                                    <div className="flex gap-x-2">
                                        {/* <FaSave
                                            onClick={() => _updateStokAwalJasa(item)}
                                            className="text-green-800 cursor-pointer"
                                            size={12}
                                        /> */}
                                        <FaTrash
                                            onClick={() => _deleteStokAwalJasa(item)}
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
export default StokAwalJasaForm