import { useEffect, useState } from "react"
import { kodeHargaList } from "../../../../../config/objectList.config"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { apiKategoriHargaJasaCRUD, apiSatuanJasaCRUD } from "../../../../../service/endPointList.api"
import { formValidation, showError } from "../../../../../helper/form.helper"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaSave, FaTrash } from "react-icons/fa"
import StokAwalJasaForm from "./StokAwalJasaForm"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import FormInput from "../../../../../component/form/FormInput"

const KategoriHargaForm = ({
    idDaftarJasa
}) => {
    const [openForm, setOpenForm] = useState(false)
    const [kategoriHargaJasaList, setKategoriHargaJasaList] = useState([])
    const [satuanJasaList, setSatuanJasaList] = useState([])
    const [satuanJasa, setSatuanJasa] = useState()
    const [kodeJasa, setKodeJasa] = useState()
    const [hargaJasa, setHargaJasa] = useState([])

    const _getSatuanJasa = () => {
        setSatuanJasa(x => x = null)
        setSatuanJasaList(x => x = [])
        setOpenForm(x => x = false)
        apiSatuanJasaCRUD
            .custom(``, "GET")
            .then(resData => {
                setSatuanJasaList(resData.data.entry)
                setOpenForm(x => x = true)
                setSatuanJasa({
                    label: resData.data.entry[0].name,
                    value: resData.data.entry[0].uuid,
                })
            })
            .catch(err => {
                showError(err)
            })
    }

    const _saveKategoriHarga = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            let data = {
                daftar_jasa: idDaftarJasa,
                satuan_jasa: satuanJasa.value,
                kode_jasa: kodeJasa
            }

            kodeHargaList.map((x, i) => {
                data[`harga_${x.value}`] = hargaJasa[i]
            })

            apiKategoriHargaJasaCRUD.custom(``, `POST`, null, {
                data
            }).then(() => {
                _getDataKategoriHargaJasa()
            }).catch(err => {
                showError(err)
            })
        }
    }

    const _getDataKategoriHargaJasa = () => {
        apiKategoriHargaJasaCRUD
            .custom(`/${idDaftarJasa}`, "GET")
            .then(resData => {
                setKategoriHargaJasaList(x => x = resData.data.entry)
            })
            .catch(err => {
                showError(err)
            })
    }

    const _updateKategoriHargaJasa = (item) => {
        let data = {
            daftar_jasa: item.daftar_jasa,
            satuan_jasa: item.satuan_jasa,
            kode_jasa: item.kode_jasa
        }

        kodeHargaList.filter(x => x.value != "beli").map((x, i) => {
            data[`harga_${x.value}`] = `${item[`harga_${x.value}`]}`
        })

        apiKategoriHargaJasaCRUD.custom(`/${item.uuid}`, `PUT`, null, {
            data
        }).catch(err => {
            showError(err)
        }).finally(() => _getDataKategoriHargaJasa())
    }

    const _deleteKategoriHargaJasa = (item) => {
        let data = {
            daftar_jasa: item.daftar_jasa,
            satuan_jasa: item.satuan_jasa,
            kode_jasa: item.kode_jasa
        }

        kodeHargaList.map((x, i) => {
            data[`harga_${x.value}`] = `${item[`harga_${i + 1}`]}`
        })

        apiKategoriHargaJasaCRUD.custom(`/${item.uuid}`, `DELETE`)
            .catch(err => {
                showError(err)
            }).finally(() => _getDataKategoriHargaJasa())
    }

    const _updateHarga = (value, harga_index, uuid) => {
        const indexKategoriHargaJasa = kategoriHargaJasaList.findIndex(x => x.uuid == uuid)
        if (indexKategoriHargaJasa != -1) {
            let kategoriHargaJasaListCopy = kategoriHargaJasaList
            kategoriHargaJasaListCopy.at(indexKategoriHargaJasa)[`harga_${harga_index}`] = parseToRupiahText(value)
            setKategoriHargaJasaList(x => x = kategoriHargaJasaListCopy)
        }
    }

    const _updateKodeJasa = (value, uuid) => {
        const indexKategoriHargaJasa = kategoriHargaJasaList.findIndex(x => x.uuid == uuid)
        if (indexKategoriHargaJasa != -1) {
            let kategoriHargaJasaListCopy = kategoriHargaJasaList
            kategoriHargaJasaListCopy.at(indexKategoriHargaJasa).kode_jasa = value
            setKategoriHargaJasaList(x => x = kategoriHargaJasaListCopy)
        }
    }

    useEffect(() => {
        _getSatuanJasa()
    }, [kategoriHargaJasaList])

    useEffect(() => {
        _getDataKategoriHargaJasa()
    }, [])

    return <>
        <h1 className="mt-16 mb-5 uppercase text-gray-600 font-bold">Kategori Harga</h1>
        {
            openForm ? <form onSubmit={(e) => _saveKategoriHarga(e)}>
                <div className="flex gap-x-2">
                    <FormSelectWithLabel
                        label={"Satuan Jasa"}
                        optionsDataList={satuanJasaList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        selectValue={satuanJasa}
                        onchange={(e) => {
                            setSatuanJasa(e)
                        }}
                        selectName={`satuanJasa`}
                    />
                    <FormInputWithLabel
                        label={"Kode Jasa"}
                        type={"text"}
                        onchange={(e) => {
                            setKodeJasa(e.target.value)
                        }}
                        others={
                            {
                                value: kodeJasa,
                                name: "kodeJasa"
                            }
                        }
                    />
                </div>
                <div className="mt-5 flex gap-x-2">
                    {
                        kodeHargaList.filter(x => x.value != "beli").map((x, i) => <>
                            <FormInputWithLabel
                                label={x.label}
                                type={"text"}
                                onchange={(e) => {
                                    inputOnlyRupiah(e)
                                    const hargaJasaCopy = [...hargaJasa]
                                    hargaJasaCopy[i] = e.target.value
                                    setHargaJasa(x => x = hargaJasaCopy)
                                }}
                                others={
                                    {
                                        value: hargaJasa[i],
                                        name: `hargaJasa[${i}]`
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
                <th>Satuan Jasa</th>
                <th>Kode Jasa</th>
                {
                    kodeHargaList.filter(x => x.value != "beli").map(x => <th>{x.label}</th>)
                }
                <th>Aksi</th>
            </thead>
            <tbody>
                {
                    kategoriHargaJasaList.map((x, i) => {
                        return <>
                            <tr>
                                <td>{i + 1}</td>
                                <td>{x.satuan_jasa_name}</td>
                                <td>
                                    <FormInput
                                        name={"kode_jasa" + i}
                                        type={"text"}
                                        other={{
                                            defaultValue: x.kode_jasa
                                        }}
                                        onchange={(e) => {
                                            _updateKodeJasa(e.target.value, x.uuid)
                                        }}
                                    />
                                </td>
                                {
                                    kodeHargaList.filter(x => x.value != "beli").map((item) => <td width={150}>
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
                                            onClick={() => _updateKategoriHargaJasa(x)}
                                            className="text-green-800 cursor-pointer"
                                            size={12}
                                        />
                                        <FaTrash
                                            onClick={() => _deleteKategoriHargaJasa(x)}
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
        <StokAwalJasaForm
            idDaftarJasa={idDaftarJasa}
            kategoriHargaJasaList={kategoriHargaJasaList}
        />
    </>
}
export default KategoriHargaForm