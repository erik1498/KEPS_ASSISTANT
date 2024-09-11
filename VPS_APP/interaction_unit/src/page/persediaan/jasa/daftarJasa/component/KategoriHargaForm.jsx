import { useEffect, useState } from "react"
import { kodeHargaList } from "../../../../../config/objectList.config"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { apiKategoriHargaJasaCRUD, apiSatuanJasaCRUD } from "../../../../../service/endPointList.api"
import { formValidation, showError } from "../../../../../helper/form.helper"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { FaSave } from "react-icons/fa"
import StokAwalJasaForm from "./StokAwalJasaForm"
import { parseToRupiahText } from "../../../../../helper/number.helper"

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
                const satuanFixed = resData.data.entry.filter(item => kategoriHargaJasaList.findIndex(x => x.satuan_jasa == item.uuid) < 0)
                if (satuanFixed.length > 0) {
                    setSatuanJasaList(satuanFixed)
                    setOpenForm(x => x = true)
                    setSatuanJasa({
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
            .custom("", "GET")
            .then(resData => {
                setKategoriHargaJasaList(x => x = resData.data.entry)
            })
            .catch(err => {
                showError(err)
            })
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
                        kodeHargaList.map((x, i) => <>
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
                    kodeHargaList.map(x => <th>{x.label}</th>)
                }
            </thead>
            <tbody>
                {
                    kategoriHargaJasaList.map((x, i) => {
                        return <>
                            <tr>
                                <td>{i + 1}</td>
                                <td>{x.satuan_jasa_name}</td>
                                <td>{x.kode_jasa}</td>
                                {
                                    kodeHargaList.map((_, j) => <td>{parseToRupiahText(x[`harga_${j + 1}`])}</td>)
                                }
                            </tr>
                        </>
                    })
                }
            </tbody>
        </table>
        {
            satuanJasaList.length == 0 ? <StokAwalJasaForm
                idDaftarJasa={idDaftarJasa}
                kategoriHargaJasaList={kategoriHargaJasaList}
            /> : <></>
        }
    </>
}
export default KategoriHargaForm