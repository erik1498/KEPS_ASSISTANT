import { FaSave } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { useEffect, useState } from "react"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiRincianPesananPenjualanJasaCRUD, apiStokAwalJasaCRUD } from "../../../../../service/endPointList.api"
import { parseRupiahToFloat, parseToRupiahText } from "../../../../../helper/number.helper"
import { PPN } from "../../../../../config/objectList.config"
import ToggleBox from "../../../../../component/general/ToggleBox"

const PesananPenjualanJasaForm = ({
    pesananPenjualanJasa,
    _getDataRincianDaftarPasananPenjualan,
    kategoriHargaJasaList,
    customer
}) => {
    const [useDiskon, setUseDiskon] = useState(false)
    const [CabangJasaList, setCabangJasaList] = useState([])
    const [kategoriHargaJasaSelected, setKategoriHargaJasaSelected] = useState()

    const [kategoriHargaJasa, setKategoriHargaJasa] = useState()
    const [CabangJasa, setCabangJasa] = useState()
    const [jumlah, setJumlah] = useState(0)
    const [diskonAngka, setDiskonAngka] = useState(0)
    const [diskonPersentase, setDiskonPersentase] = useState(0)

    const [totalAkhir, setTotalAkhir] = useState(0)
    const [ppnJasa, setPPNJasa] = useState(0)
    const [hargaJasa, setHargaJasa] = useState(0)

    const _getDataDaftarCabangByKategoriHarga = () => {
        setCabangJasa(x => x = null)
        apiStokAwalJasaCRUD
            .custom(`/cabang/${kategoriHargaJasa.value}`, "GET")
            .then(resData => {
                setCabangJasaList(resData.data)
                if (resData.data.length > 0) {
                    setCabangJasa(x => x = {
                        label: resData.data[0].cabang_name,
                        value: resData.data[0].uuid
                    })
                }
            }).catch(err => showError(err))
    }

    const _savePesananJasa = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiRincianPesananPenjualanJasaCRUD
                .custom("", "POST", null, {
                    data: {
                        pesanan_penjualan_jasa: pesananPenjualanJasa.uuid,
                        kategori_harga_jasa: kategoriHargaJasa.value,
                        stok_awal_jasa: CabangJasa.value,
                        kode_harga_customer: customer.kode_harga,
                        jumlah: `${jumlah}`,
                        harga: `${kategoriHargaJasaSelected[`harga_${customer.kode_harga}`]}`,
                        harga_setelah_diskon: `${hargaJasa}`,
                        ppn: `${kategoriHargaJasaSelected.ppn == 1 ? kategoriHargaJasaSelected[`harga_${customer.kode_harga}`] * PPN / 100 : 0}`,
                        ppn_setelah_diskon: `${ppnJasa}`,
                        diskon_angka: `${diskonAngka}`,
                        diskon_persentase: `${diskonPersentase}`,
                        total_harga: `${totalAkhir}`
                    }
                }).then(resData => {
                    _getDataRincianDaftarPasananPenjualan()
                }).catch(err => showError(err))
        }
    }


    const _updateDiskonAngka = (e) => {
        try {
            const diskonAngka = (parseRupiahToFloat(e.target.value) * kategoriHargaJasaSelected[`harga_${customer.kode_harga}`]) / 100
            setDiskonPersentase(e.target.value)
            setDiskonAngka(x => x = parseToRupiahText(diskonAngka))
        } catch (error) {
            setDiskonAngka(x => x = 0)
        }
    }

    const _updateDiskonPersentase = () => {
        try {
            const diskonPersentase = parseRupiahToFloat(diskonAngka) * 100 / kategoriHargaJasaSelected[`harga_${customer.kode_harga}`]
            setDiskonPersentase(x => x = diskonPersentase)
            _updateTotalAkhir()
        } catch (error) {
            setDiskonPersentase(x => x = 0)
        }
    }

    useEffect(() => {
        if (kategoriHargaJasaSelected) {
            _updateDiskonPersentase()
        }
    }, [diskonAngka])

    const _updateTotalAkhir = () => {
        const jumlahFloat = parseRupiahToFloat(jumlah)

        const hargaJasaGet = kategoriHargaJasaSelected[`harga_${customer.kode_harga}`] - parseRupiahToFloat(diskonAngka)

        setHargaJasa(x => x = hargaJasaGet)

        const ppnJasaGet = kategoriHargaJasaSelected.ppn == 1 ? ((hargaJasaGet * PPN) / 100) : 0
        setPPNJasa(x => x = ppnJasaGet)

        const total = (jumlahFloat * hargaJasaGet) + (ppnJasaGet * jumlahFloat)
        setTotalAkhir(x => x = total)
    }

    useEffect(() => {
        if (kategoriHargaJasaSelected) {
            _updateTotalAkhir()
        }
    }, [jumlah])

    useEffect(() => {
        if (kategoriHargaJasa) {
            _getDataDaftarCabangByKategoriHarga()
            const kategoriHargaJasaGet = kategoriHargaJasaList.filter(x => x.uuid == kategoriHargaJasa.value)
            if (kategoriHargaJasaGet.length > 0) {
                setJumlah(x => x = 0)
                setUseDiskon(x => x = 0)
                setDiskonAngka(x => x = 0)
                setDiskonPersentase(x => x = 0)
                setKategoriHargaJasaSelected(kategoriHargaJasaGet[0])
            }
        }
    }, [kategoriHargaJasa])

    useEffect(() => {
        setKategoriHargaJasa({
            label: kategoriHargaJasaList[0].kode_jasa,
            value: kategoriHargaJasaList[0].uuid
        })
    }, [])

    return <>
        <form className="gap-x-2 py-3" onSubmit={(e) => _savePesananJasa(e)}>
            <div className="flex items-end gap-x-2">
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
                <FormSelectWithLabel
                    label={"Cabang Asal"}
                    optionsDataList={CabangJasaList}
                    optionsLabel={"cabang_name"}
                    optionsValue={"uuid"}
                    selectValue={CabangJasa}
                    onchange={(e) => {
                        setCabangJasa(e)
                    }}
                    selectName={`CabangJasa`}
                />
            </div>
            {
                kategoriHargaJasaSelected ? <>
                    <div className="gap-x-2 bg-gray-300 my-4 rounded-md px-2 py-3">
                        <p className="text-xl font-extrabold">{kategoriHargaJasaSelected.daftar_jasa_name}</p>
                        <p className="text-sm mt-5">Harga Jasa</p>
                        <p className="font-bold mt-1 text-xl">
                            Rp. {parseToRupiahText(kategoriHargaJasaSelected[`harga_${customer.kode_harga}`])}
                        </p>
                        {
                            kategoriHargaJasaSelected.ppn == 1 ? <>
                                <div className="flex gap-x-2 items-end mb-5">
                                    <p className="text-sm">PPN</p>
                                    <p className="font-bold">Rp. {(parseToRupiahText(kategoriHargaJasaSelected[`harga_${customer.kode_harga}`] * PPN / 100))}</p>
                                </div>
                            </> : <></>
                        }
                        <p className="font-bold bg-blue-800 px-2 text-white rounded-md w-max mt-2">{kategoriHargaJasaSelected.satuan_jasa_name}</p>
                    </div>
                    {
                        CabangJasa ? <>
                            <div className="flex gap-x-2">
                                <FormInputWithLabel
                                    addClassInput="w-max"
                                    label={"Jumlah"}
                                    type={"text"}
                                    onchange={(e) => {
                                        inputOnlyRupiah(e)
                                        setJumlah(e.target.value)
                                    }}
                                    others={
                                        {
                                            value: jumlah,
                                            name: "jumlah",
                                        }
                                    }
                                />
                            </div>
                            <div className="mt-5">
                                <ToggleBox
                                    label="Gunakan Diskon ?"
                                    setToggleBox={setUseDiskon}
                                    toggleBox={useDiskon}
                                    toggleBoxList={[
                                        {
                                            label: "Tidak",
                                            value: 0
                                        },
                                        {
                                            label: "Ya",
                                            value: 1
                                        },
                                    ]}
                                />
                            </div>
                            {
                                useDiskon ? <>
                                    <div className="mt-5 flex gap-x-2">
                                        <FormInputWithLabel
                                            label={"Diskon Angka"}
                                            type={"text"}
                                            onchange={(e) => {
                                                inputOnlyRupiah(e)
                                                setDiskonAngka(e.target.value)
                                            }}
                                            others={
                                                {
                                                    value: diskonAngka,
                                                    name: "diskonAngka",
                                                }
                                            }
                                        />
                                        <FormInputWithLabel
                                            label={"Diskon Persentase"}
                                            type={"text"}
                                            onchange={(e) => {
                                                inputOnlyRupiah(e)
                                                _updateDiskonAngka(e)
                                            }}
                                            others={
                                                {
                                                    value: diskonPersentase,
                                                    name: "diskonPersentase",
                                                }
                                            }
                                        />
                                    </div>
                                    <div className="mt-5 gap-x-2 px-1">
                                        <p className="font-bold mt-2">Harga Setelah Diskon</p>
                                        <p className="font-bold mt-2 text-xl">
                                            Rp. {parseToRupiahText(hargaJasa)}
                                        </p>
                                        {
                                            kategoriHargaJasaSelected.ppn == 1 ? <>
                                                <p className="font-bold mb-5 mt-2">PPN Rp. {parseToRupiahText(ppnJasa)}</p>
                                            </> : <></>
                                        }
                                    </div>
                                </> : <></>
                            }
                            <div className="mt-5 gap-x-2 px-1">
                                <p className="font-bold text-sm">Total Harga</p>
                                <p className="font-bold text-4xl">Rp. {parseToRupiahText(totalAkhir)}</p>
                            </div>
                        </> : <></>
                    }
                </> : <></>
            }
            {
                CabangJasa ? <>
                    <button
                        className="mt-3 btn w-full bg-green-800 text-white"
                    >
                        <FaSave /> Simpan Pesanan
                    </button>
                </> : <></>
            }
        </form>
    </>
}
export default PesananPenjualanJasaForm