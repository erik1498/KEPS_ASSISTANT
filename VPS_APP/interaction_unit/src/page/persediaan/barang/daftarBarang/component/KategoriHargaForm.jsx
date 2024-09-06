import { useEffect, useState } from "react"
import { kodeHargaList } from "../../../../../config/objectList.config"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { apiKategoriHargaBarangCRUD, apiSatuanBarangCRUD } from "../../../../../service/endPointList.api"
import { formValidation, showError } from "../../../../../helper/form.helper"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaSave } from "react-icons/fa"

const KategoriHargaForm = ({
    idDaftarbarang,
    ppnDaftarBarang
}) => {
    const [openForm, setOpenForm] = useState(false)
    const [kategoriHargaBarangList, setKategoriHargaBarangList] = useState([])
    const [satuanBarangList, setSatuanBarangList] = useState([])
    const [satuanBarang, setSatuanBarang] = useState()
    const [kodeBarang, setKodeBarang] = useState()
    const [hargaBarang, setHargaBarang] = useState([])

    const _getSatuanBarang = () => {
        setSatuanBarang(x => x = null)
        setOpenForm(x => x = false)
        apiSatuanBarangCRUD
            .custom(``, "GET")
            .then(resData => {
                setSatuanBarangList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    const satuanFixed = resData.data.entry.filter(item => kategoriHargaBarangList.findIndex(x => x.satuan_barang == item.uuid) < 0)
                    if (satuanFixed.length > 0) {
                        setOpenForm(x => x = true)
                        setSatuanBarang({
                            label: satuanFixed[0].name,
                            value: satuanFixed[0].uuid,
                        })
                    }
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
                _getSatuanBarang()
            }).catch(err => {
                showError(err)
            })
        }
    }

    const _getDataKategoriHargaBarang = () => {
        apiKategoriHargaBarangCRUD
            .custom("", "GET")
            .then(resData => {
                setKategoriHargaBarangList(resData.data.entry)
            })
            .catch(err => {
                showError(err)
            })
    }

    useEffect(() => {
        _getSatuanBarang()
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
            </thead>
            <tbody>
                {
                    kategoriHargaBarangList.map((x, i) => {
                        return <>
                            <tr>
                                <td>{i + 1}</td>
                                <td>{x.satuan_barang_name}</td>
                                <td>{x.kode_barang}</td>
                                {
                                    kodeHargaList.map((_, j) => <td>{x[`harga_${j + 1}`]}</td>)
                                }
                            </tr>
                        </>
                    })
                }
            </tbody>
        </table>
    </>
}
export default KategoriHargaForm