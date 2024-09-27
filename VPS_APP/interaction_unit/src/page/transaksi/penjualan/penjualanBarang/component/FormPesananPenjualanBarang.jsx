import { FaSave } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { useEffect, useState } from "react"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiRincianPesananPenjualanBarangCRUD, apiStokAwalBarangCRUD } from "../../../../../service/endPointList.api"
import { parseRupiahToFloat, parseToRupiahText } from "../../../../../helper/number.helper"
import { PPN } from "../../../../../config/objectList.config"
import ToggleBox from "../../../../../component/general/ToggleBox"

const FormPesananPenjualanBarang = ({
    pesananPenjualanBarang,
    _getDataRincianDaftarPasananPenjualan,
    kategoriHargaBarangList,
    customer
}) => {
    const [useDiskon, setUseDiskon] = useState(false)
    const [gudangBarangList, setGudangBarangList] = useState([])
    const [kategoriHargaBarangSelected, setKategoriHargaBarangSelected] = useState()

    const [kategoriHargaBarang, setKategoriHargaBarang] = useState()
    const [gudangBarang, setGudangBarang] = useState()
    const [jumlah, setJumlah] = useState(0)
    const [diskonAngka, setDiskonAngka] = useState(0)
    const [diskonPersentase, setDiskonPersentase] = useState(0)

    const [totalAkhir, setTotalAkhir] = useState(0)
    const [ppnBarang, setPPNBarang] = useState(0)
    const [hargaBarang, setHargaBarang] = useState(0)

    const _getDataDaftarGudangByKategoriHarga = () => {
        setGudangBarang(x => x = null)
        apiStokAwalBarangCRUD
            .custom(`/gudang_barang/${kategoriHargaBarang.value}`, "GET")
            .then(resData => {
                setGudangBarangList(resData.data)
                if (resData.data.length > 0) {
                    setGudangBarang(x => x = {
                        label: resData.data[0].daftar_gudang_name,
                        value: resData.data[0].uuid
                    })
                }
            }).catch(err => showError(err))
    }

    const _savePesananBarang = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiRincianPesananPenjualanBarangCRUD
                .custom("", "POST", null, {
                    data: {
                        pesanan_penjualan_barang: pesananPenjualanBarang.uuid,
                        kategori_harga_barang: kategoriHargaBarang.value,
                        stok_awal_barang: gudangBarang.value,
                        kode_harga_customer: customer.kode_harga,
                        jumlah: `${jumlah}`,
                        harga: `${kategoriHargaBarangSelected[`harga_${customer.kode_harga}`]}`,
                        ppn: `${kategoriHargaBarangSelected[`harga_${customer.kode_harga}`] * PPN / 100}`,
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
            const diskonAngka = (parseRupiahToFloat(e.target.value) * kategoriHargaBarangSelected[`harga_${customer.kode_harga}`]) / 100
            setDiskonPersentase(e.target.value)
            setDiskonAngka(x => x = parseToRupiahText(diskonAngka))
        } catch (error) {
            setDiskonAngka(x => x = 0)
        }
    }

    const _updateDiskonPersentase = () => {
        try {
            const diskonPersentase = parseRupiahToFloat(diskonAngka) * 100 / kategoriHargaBarangSelected[`harga_${customer.kode_harga}`]
            setDiskonPersentase(x => x = diskonPersentase)
            _updateTotalAkhir()
        } catch (error) {
            setDiskonPersentase(x => x = 0)
        }
    }

    useEffect(() => {
        if (kategoriHargaBarangSelected) {
            _updateDiskonPersentase()
        }
    }, [diskonAngka])

    const _updateTotalAkhir = () => {
        const jumlahFloat = parseRupiahToFloat(jumlah)

        const hargaBarangGet = kategoriHargaBarangSelected[`harga_${customer.kode_harga}`] - parseRupiahToFloat(diskonAngka)

        setHargaBarang(x => x = hargaBarangGet)

        const ppnBarangGet = ((hargaBarangGet * PPN) / 100)
        setPPNBarang(x => x = ppnBarangGet)

        const total = (jumlahFloat * hargaBarangGet) + (ppnBarangGet * jumlahFloat)
        setTotalAkhir(x => x = total)
    }

    useEffect(() => {
        if (kategoriHargaBarangSelected) {
            _updateTotalAkhir()
        }
    }, [jumlah])

    useEffect(() => {
        if (kategoriHargaBarang) {
            _getDataDaftarGudangByKategoriHarga()
            const kategoriHargaBarangGet = kategoriHargaBarangList.filter(x => x.uuid == kategoriHargaBarang.value)
            if (kategoriHargaBarangGet.length > 0) {
                setJumlah(x => x = 0)
                setUseDiskon(x => x = 0)
                setDiskonAngka(x => x = 0)
                setDiskonPersentase(x => x = 0)
                setKategoriHargaBarangSelected(kategoriHargaBarangGet[0])
            }
        }
    }, [kategoriHargaBarang])

    useEffect(() => {
        setKategoriHargaBarang({
            label: kategoriHargaBarangList[0].kode_barang,
            value: kategoriHargaBarangList[0].uuid
        })
    }, [])

    return <>
        <form className="grid grid-cols-12 gap-x-2 py-3 px-2" onSubmit={(e) => _savePesananBarang(e)}>
            <div className="col-span-12">
                <div className="flex items-end gap-x-2">
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
                    <FormSelectWithLabel
                        label={"Gudang Asal"}
                        optionsDataList={gudangBarangList}
                        optionsLabel={"daftar_gudang_name"}
                        optionsValue={"uuid"}
                        selectValue={gudangBarang}
                        onchange={(e) => {
                            setGudangBarang(e)
                        }}
                        selectName={`gudangBarang`}
                    />
                </div>
                {
                    kategoriHargaBarangSelected ? <>
                        <div className="gap-x-2 border-b-[3px] border-black px-2 py-3">
                            <p className="font-bold">Nama Barang</p>
                            <p className="text-2xl font-extrabold">{kategoriHargaBarangSelected.daftar_barang_name}</p>
                            <p className="font-bold mt-5">Harga Barang</p>
                            <p className="font-bold mt-1 text-xl">
                                Rp. {parseToRupiahText(kategoriHargaBarangSelected[`harga_${customer.kode_harga}`])}
                            </p>
                            <p className="font-bold mb-5 mt-2">PPN Rp. {(parseToRupiahText(kategoriHargaBarangSelected[`harga_${customer.kode_harga}`] * PPN / 100))}</p>
                            <p className="font-bold bg-blue-800 px-2 text-white rounded-md w-max mt-2">{kategoriHargaBarangSelected.satuan_barang_name}</p>
                        </div>
                        {
                            gudangBarang ? <>
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
                                                Rp. {parseToRupiahText(hargaBarang)}
                                            </p>
                                            <p className="font-bold mb-5 mt-2">PPN Rp. {parseToRupiahText(ppnBarang)}</p>
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
            </div>
            {
                gudangBarang ? <>
                    <button
                        className="mt-3 btn col-span-12 bg-green-800 text-white"
                    >
                        <FaSave /> Simpan Pesanan
                    </button>
                </> : <></>
            }
        </form>
    </>
}
export default FormPesananPenjualanBarang