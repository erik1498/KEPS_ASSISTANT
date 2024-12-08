import { useEffect, useState } from "react"
import { kodeHargaBahanBakuList } from "../../../../../config/objectList.config"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { apiKategoriHargaBahanBakuCRUD, apiSatuanBahanBakuCRUD } from "../../../../../service/endPointList.api"
import { formValidation, showError } from "../../../../../helper/form.helper"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaSave, FaTrash } from "react-icons/fa"
import StokAwalBahanBakuForm from "./StokAwalBahanBakuForm"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import FormInput from "../../../../../component/form/FormInput"

const KategoriHargaForm = ({
    idDaftarBahanBaku
}) => {
    const [openForm, setOpenForm] = useState(false)
    const [kategoriHargaBahanBakuList, setKategoriHargaBahanBakuList] = useState([])
    const [satuanBahanBakuList, setSatuanBahanBakuList] = useState([])
    const [satuanBahanBaku, setSatuanBahanBaku] = useState()
    const [kodeBahanBaku, setKodeBahanBaku] = useState()
    const [hargaBahanBaku, setHargaBahanBaku] = useState([])

    const _getSatuanBahanBaku = () => {
        setSatuanBahanBaku(x => x = null)
        setSatuanBahanBakuList(x => x = [])
        setOpenForm(x => x = false)
        apiSatuanBahanBakuCRUD
            .custom(``, "GET")
            .then(resData => {
                setSatuanBahanBakuList(resData.data.entry)
                setOpenForm(x => x = true)
                setSatuanBahanBaku({
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
                daftar_bahan_baku: idDaftarBahanBaku,
                satuan_bahan_baku: satuanBahanBaku.value,
                kode_bahan_baku: kodeBahanBaku
            }

            kodeHargaBahanBakuList.map((x, i) => {
                data[`harga_${x.value}`] = hargaBahanBaku[i]
            })

            apiKategoriHargaBahanBakuCRUD.custom(``, `POST`, null, {
                data
            }).then(() => {
                _getDataKategoriHargaBahanBaku()
            }).catch(err => {
                showError(err)
            })
        }
    }

    const _getDataKategoriHargaBahanBaku = () => {
        apiKategoriHargaBahanBakuCRUD
            .custom(`/${idDaftarBahanBaku}`, "GET")
            .then(resData => {
                setKategoriHargaBahanBakuList(x => x = resData.data.entry)
            })
            .catch(err => {
                showError(err)
            })
    }

    const _updateKategoriHargaBahanBaku = (item) => {
        let data = {
            daftar_bahan_baku: item.daftar_bahan_baku,
            satuan_bahan_baku: item.satuan_bahan_baku,
            kode_bahan_baku: item.kode_bahan_baku
        }

        kodeHargaBahanBakuList.map((x, i) => {
            data[`harga_${x.value}`] = `${item[`harga_${x.value}`]}`
        })

        apiKategoriHargaBahanBakuCRUD.custom(`/${item.uuid}`, `PUT`, null, {
            data
        }).catch(err => {
            showError(err)
        }).finally(() => _getDataKategoriHargaBahanBaku())
    }

    const _deleteKategoriHargaBahanBaku = (item) => {
        let data = {
            daftar_bahan_baku: item.daftar_bahan_baku,
            satuan_bahan_baku: item.satuan_bahan_baku,
            kode_bahan_baku: item.kode_bahan_baku
        }

        kodeHargaBahanBakuList.map((x, i) => {
            data[`harga_${x.value}`] = `${item[`harga_${i + 1}`]}`
        })

        apiKategoriHargaBahanBakuCRUD.custom(`/${item.uuid}`, `DELETE`)
            .catch(err => {
                showError(err)
            }).finally(() => _getDataKategoriHargaBahanBaku())
    }

    const _updateHarga = (value, harga_index, uuid) => {
        const indexKategoriHargaBahanBaku = kategoriHargaBahanBakuList.findIndex(x => x.uuid == uuid)
        if (indexKategoriHargaBahanBaku != -1) {
            let kategoriHargaBahanBakuListCopy = kategoriHargaBahanBakuList
            kategoriHargaBahanBakuListCopy.at(indexKategoriHargaBahanBaku)[`harga_${harga_index}`] = parseToRupiahText(value)
            setKategoriHargaBahanBakuList(x => x = kategoriHargaBahanBakuListCopy)
        }
    }

    const _updateKodeBahanBaku = (value, uuid) => {
        const indexKategoriHargaBahanBaku = kategoriHargaBahanBakuList.findIndex(x => x.uuid == uuid)
        if (indexKategoriHargaBahanBaku != -1) {
            let kategoriHargaBahanBakuListCopy = kategoriHargaBahanBakuList
            kategoriHargaBahanBakuListCopy.at(indexKategoriHargaBahanBaku).kode_bahan_baku = value
            setKategoriHargaBahanBakuList(x => x = kategoriHargaBahanBakuListCopy)
        }
    }

    useEffect(() => {
        _getSatuanBahanBaku()
    }, [kategoriHargaBahanBakuList])

    useEffect(() => {
        _getDataKategoriHargaBahanBaku()
    }, [])

    return <>
        <h1 className="mt-16 mb-5 uppercase text-gray-600 font-bold">Kategori Harga</h1>
        {
            openForm ? <form onSubmit={(e) => _saveKategoriHarga(e)}>
                <div className="flex gap-x-2">
                    <FormSelectWithLabel
                        label={"Satuan Bahan Baku"}
                        optionsDataList={satuanBahanBakuList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        selectValue={satuanBahanBaku}
                        onchange={(e) => {
                            setSatuanBahanBaku(e)
                        }}
                        selectName={`satuanBahanBaku`}
                    />
                    <FormInputWithLabel
                        label={"Kode Bahan Baku"}
                        type={"text"}
                        onchange={(e) => {
                            setKodeBahanBaku(e.target.value)
                        }}
                        others={
                            {
                                value: kodeBahanBaku,
                                name: "kodeBahanBaku"
                            }
                        }
                    />
                </div>
                <div className="mt-5 flex gap-x-2">
                    {
                        kodeHargaBahanBakuList.map((x, i) => <>
                            <FormInputWithLabel
                                label={x.label}
                                type={"text"}
                                onchange={(e) => {
                                    inputOnlyRupiah(e)
                                    const hargaBahanBakuCopy = [...hargaBahanBaku]
                                    hargaBahanBakuCopy[i] = e.target.value
                                    setHargaBahanBaku(x => x = hargaBahanBakuCopy)
                                }}
                                others={
                                    {
                                        value: hargaBahanBaku[i],
                                        name: `hargaBahanBaku[${i}]`
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
                <th>Satuan Bahan Baku</th>
                <th>Kode Bahan Baku</th>
                {
                    kodeHargaBahanBakuList.map(x => <th>{x.label}</th>)
                }
                <th>Aksi</th>
            </thead>
            <tbody>
                {
                    kategoriHargaBahanBakuList.map((x, i) => {
                        return <>
                            <tr>
                                <td>{i + 1}</td>
                                <td>{x.satuan_bahan_baku_name}</td>
                                <td>
                                    <FormInput
                                        name={"kode_bahan_baku" + i}
                                        type={"text"}
                                        other={{
                                            defaultValue: x.kode_bahan_baku
                                        }}
                                        onchange={(e) => {
                                            _updateKodeBahanBaku(e.target.value, x.uuid)
                                        }}
                                    />
                                </td>
                                {
                                    kodeHargaBahanBakuList.map((item) => <td width={150}>
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
                                            onClick={() => _updateKategoriHargaBahanBaku(x)}
                                            className="text-green-800 cursor-pointer"
                                            size={12}
                                        />
                                        <FaTrash
                                            onClick={() => _deleteKategoriHargaBahanBaku(x)}
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
        <StokAwalBahanBakuForm
            idDaftarBahanBaku={idDaftarBahanBaku}
            kategoriHargaBahanBakuList={kategoriHargaBahanBakuList}
        />
    </>
}
export default KategoriHargaForm