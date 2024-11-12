import { useEffect, useState } from "react"
import { kodeHargaList } from "../../../../../config/objectList.config"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { apiKategoriHargaBarangCRUD, apiSatuanBarangCRUD } from "../../../../../service/endPointList.api"
import { formValidation, showError } from "../../../../../helper/form.helper"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaSave, FaTrash } from "react-icons/fa"
import StokAwalBarangForm from "./StokAwalBarangForm"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import FormInput from "../../../../../component/form/FormInput"

const KategoriHargaForm = ({
    idDaftarbarang
}) => {
    const [openForm, setOpenForm] = useState(false)
    const [kategoriHargaBarangList, setKategoriHargaBarangList] = useState([])
    const [satuanBarangList, setSatuanBarangList] = useState([])
    const [satuanBarang, setSatuanBarang] = useState()
    const [kodeBarang, setKodeBarang] = useState()
    const [hargaBarang, setHargaBarang] = useState([])

    const _getSatuanBarang = () => {
        setSatuanBarang(x => x = null)
        setSatuanBarangList(x => x = [])
        setOpenForm(x => x = false)
        apiSatuanBarangCRUD
            .custom(``, "GET")
            .then(resData => {
                const satuanFixed = resData.data.entry.filter(item => kategoriHargaBarangList.findIndex(x => x.satuan_barang == item.uuid) < 0)
                if (satuanFixed.length > 0) {
                    setSatuanBarangList(satuanFixed)
                    setOpenForm(x => x = true)
                    setSatuanBarang({
                        label: satuanFixed[0].name,
                        value: satuanFixed[0].uuid,
                    })
                }
            })
            .catch(err => {
                showError(err)
            })
    }

    const _saveKategoriHarga = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            let data = {
                daftar_barang: idDaftarbarang,
                satuan_barang: satuanBarang.value,
                kode_barang: kodeBarang
            }

            kodeHargaList.map((x, i) => {
                data[`harga_${x.value}`] = hargaBarang[i]
            })

            apiKategoriHargaBarangCRUD.custom(``, `POST`, null, {
                data
            }).then(() => {
                _getDataKategoriHargaBarang()
            }).catch(err => {
                showError(err)
            })
        }
    }

    const _getDataKategoriHargaBarang = () => {
        apiKategoriHargaBarangCRUD
            .custom(`/${idDaftarbarang}`, "GET")
            .then(resData => {
                setKategoriHargaBarangList(x => x = resData.data.entry)
            })
            .catch(err => {
                showError(err)
            })
    }

    const _updateKategoriHargaBarang = (item) => {
        let data = {
            daftar_barang: item.daftar_barang,
            satuan_barang: item.satuan_barang,
            kode_barang: item.kode_barang
        }

        kodeHargaList.map((x, i) => {
            data[`harga_${x.value}`] = `${item[`harga_${x.value}`]}`
        })

        apiKategoriHargaBarangCRUD.custom(`/${item.uuid}`, `PUT`, null, {
            data
        }).catch(err => {
            showError(err)
        }).finally(() => _getDataKategoriHargaBarang())
    }

    const _deleteKategoriHargaBarang = (item) => {
        let data = {
            daftar_barang: item.daftar_barang,
            satuan_barang: item.satuan_barang,
            kode_barang: item.kode_barang
        }

        kodeHargaList.map((x, i) => {
            data[`harga_${x.value}`] = `${item[`harga_${i + 1}`]}`
        })

        apiKategoriHargaBarangCRUD.custom(`/${item.uuid}`, `DELETE`)
            .catch(err => {
                showError(err)
            }).finally(() => _getDataKategoriHargaBarang())
    }

    const _updateHarga = (value, harga_index, uuid) => {
        const indexKategoriHargaBarang = kategoriHargaBarangList.findIndex(x => x.uuid == uuid)
        if (indexKategoriHargaBarang != -1) {
            let kategoriHargaBarangListCopy = kategoriHargaBarangList
            kategoriHargaBarangListCopy.at(indexKategoriHargaBarang)[`harga_${harga_index}`] = parseToRupiahText(value)
            setKategoriHargaBarangList(x => x = kategoriHargaBarangListCopy)
        }
    }

    const _updateKodeBarang = (value, uuid) => {
        const indexKategoriHargaBarang = kategoriHargaBarangList.findIndex(x => x.uuid == uuid)
        if (indexKategoriHargaBarang != -1) {
            let kategoriHargaBarangListCopy = kategoriHargaBarangList
            kategoriHargaBarangListCopy.at(indexKategoriHargaBarang).kode_barang = value
            setKategoriHargaBarangList(x => x = kategoriHargaBarangListCopy)
        }
    }

    useEffect(() => {
        _getSatuanBarang()
    }, [kategoriHargaBarangList])

    useEffect(() => {
        _getDataKategoriHargaBarang()
    }, [])

    return <>
        <h1 className="mt-16 mb-5 uppercase text-gray-600 font-bold">Kategori Harga</h1>
        {
            openForm ? <form onSubmit={(e) => _saveKategoriHarga(e)}>
                <div className="flex gap-x-2">
                    <FormSelectWithLabel
                        label={"Satuan Barang"}
                        optionsDataList={satuanBarangList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        selectValue={satuanBarang}
                        onchange={(e) => {
                            setSatuanBarang(e)
                        }}
                        selectName={`satuanBarang`}
                    />
                    <FormInputWithLabel
                        label={"Kode Barang"}
                        type={"text"}
                        onchange={(e) => {
                            setKodeBarang(e.target.value)
                        }}
                        others={
                            {
                                value: kodeBarang,
                                name: "kodeBarang"
                            }
                        }
                    />
                </div>
                <div className="mt-5 flex gap-x-2">
                    {
                        kodeHargaList.map((x, i) => <>
                            <FormInputWithLabel
                                label={x.label}
                                type={"text"}
                                onchange={(e) => {
                                    inputOnlyRupiah(e)
                                    const hargaBarangCopy = [...hargaBarang]
                                    hargaBarangCopy[i] = e.target.value
                                    setHargaBarang(x => x = hargaBarangCopy)
                                }}
                                others={
                                    {
                                        value: hargaBarang[i],
                                        name: `hargaBarang[${i}]`
                                    }
                                }
                            />
                        </>
                        )
                    }
                </div>
                <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
            </form> : <></>
        }
        <table className="mt-5 table table-sm table-zebra">
            <thead className="py-4 text-black">
                <th>No</th>
                <th>Satuan Barang</th>
                <th>Kode Barang</th>
                {
                    kodeHargaList.map(x => <th>{x.label}</th>)
                }
                <th>Aksi</th>
            </thead>
            <tbody>
                {
                    kategoriHargaBarangList.map((x, i) => {
                        return <>
                            <tr>
                                <td>{i + 1}</td>
                                <td>{x.satuan_barang_name}</td>
                                <td>
                                    <FormInput
                                        name={"kode_barang" + i}
                                        type={"text"}
                                        other={{
                                            defaultValue: x.kode_barang
                                        }}
                                        onchange={(e) => {
                                            _updateKodeBarang(e.target.value, x.uuid)
                                        }}
                                    />
                                </td>
                                {
                                    kodeHargaList.map((item) => <td width={150}>
                                        <FormInput
                                            name={"harga_" + item.value}
                                            type={"text"}
                                            other={{
                                                defaultValue: parseToRupiahText(x[`harga_${item.value}`])
                                            }}
                                            onchange={(e) => {
                                                inputOnlyRupiah(e)
                                                _updateHarga(e.target.value, item.value, x.uuid)
                                            }}
                                        />
                                    </td>)
                                }
                                <td width={100}>
                                    <div className="flex gap-x-2">
                                        <FaSave
                                            onClick={() => _updateKategoriHargaBarang(x)}
                                            className="text-green-800 cursor-pointer"
                                            size={12}
                                        />
                                        <FaTrash
                                            onClick={() => _deleteKategoriHargaBarang(x)}
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
        {
            satuanBarangList.length == 0 ? <StokAwalBarangForm
                idDaftarBarang={idDaftarbarang}
                kategoriHargaBarangList={kategoriHargaBarangList}
            /> : <></>
        }
    </>
}
export default KategoriHargaForm