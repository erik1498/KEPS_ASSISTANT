import { FaSave } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { useEffect, useState } from "react"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiRincianPesananPembelianBarangCRUD, apiStokAwalBarangCRUD } from "../../../../../service/endPointList.api"
import { parseRupiahToFloat, parseToRupiahText } from "../../../../../helper/number.helper"
import { PPN } from "../../../../../config/objectList.config"
import ToggleBox from "../../../../../component/general/ToggleBox"

const PesananPembelianBarangForm = ({
    pesananPembelianBarang,
    _getDataRincianDaftarPasananPembelian,
    kategoriHargaBarangList,
    customer
}) => {
    const [gudangBarangList, setGudangBarangList] = useState([])
    const [kategoriHargaBarangSelected, setKategoriHargaBarangSelected] = useState()

    const [kategoriHargaBarang, setKategoriHargaBarang] = useState()
    const [gudangBarang, setGudangBarang] = useState()
    const [jumlah, setJumlah] = useState(0)
    const [ppnBarang, setPPNBarang] = useState(0)
    const [hargaBarang, setHargaBarang] = useState(0)
    const [totalAkhir, setTotalAkhir] = useState(0)

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
            apiRincianPesananPembelianBarangCRUD
                .custom("", "POST", null, {
                    data: {
                        pesanan_pembelian_barang: pesananPembelianBarang.uuid,
                        kategori_harga_barang: kategoriHargaBarang.value,
                        stok_awal_barang: gudangBarang.value,
                        jumlah: `${jumlah}`,
                        harga: `${hargaBarang}`,
                        ppn: `${ppnBarang}`,
                        total_harga: `${totalAkhir}`
                    }
                }).then(resData => {
                    _getDataRincianDaftarPasananPembelian()
                }).catch(err => showError(err))
        }
    }

    const _updateTotalAkhir = () => {
        const jumlahFloat = parseRupiahToFloat(jumlah)
        const hargaFloat = parseRupiahToFloat(hargaBarang)
        const ppnFloat = parseRupiahToFloat(ppnBarang)

        const total = (jumlahFloat * hargaFloat) + (ppnFloat * jumlahFloat)
        setTotalAkhir(x => x = total)
    }

    useEffect(() => {
        if (kategoriHargaBarangSelected) {
            _updateTotalAkhir()
        }
    }, [jumlah, hargaBarang, ppnBarang])

    useEffect(() => {
        if (kategoriHargaBarang) {
            _getDataDaftarGudangByKategoriHarga()
            const kategoriHargaBarangGet = kategoriHargaBarangList.filter(x => x.uuid == kategoriHargaBarang.value)
            if (kategoriHargaBarangGet.length > 0) {
                setJumlah(x => x = 0)
                setHargaBarang(x => x = 0)
                setPPNBarang(x => x = 0)
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
        <form className="gap-x-2 py-3" onSubmit={(e) => _savePesananBarang(e)}>
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
                    <div className="gap-x-2 bg-gray-300 my-4 rounded-md px-2 py-3">
                        <p className="text-xl font-extrabold">{kategoriHargaBarangSelected.daftar_barang_name}</p>
                        <p className="font-bold bg-blue-800 px-2 text-white rounded-md w-max mt-2">{kategoriHargaBarangSelected.satuan_barang_name}</p>
                    </div>
                    {
                        gudangBarang ? <>
                            <div className="flex gap-x-2">
                                <FormInputWithLabel
                                    addClassInput="w-full"
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
                                <FormInputWithLabel
                                    addClassInput="w-full"
                                    label={"Harga Barang"}
                                    type={"text"}
                                    onchange={(e) => {
                                        inputOnlyRupiah(e)
                                        setHargaBarang(e.target.value)
                                    }}
                                    others={
                                        {
                                            value: hargaBarang,
                                            name: "hargaBarang",
                                        }
                                    }
                                />
                                <FormInputWithLabel
                                    addClassInput="w-full"
                                    label={"PPN Barang"}
                                    type={"text"}
                                    onchange={(e) => {
                                        inputOnlyRupiah(e)
                                        setPPNBarang(e.target.value)
                                    }}
                                    others={
                                        {
                                            value: ppnBarang,
                                            name: "ppnBarang",
                                        }
                                    }
                                />
                            </div>
                            <div className="mt-5 gap-x-2 px-1">
                                <p className="font-bold text-sm">Total Harga</p>
                                <p className="font-bold text-4xl">Rp. {parseToRupiahText(totalAkhir)}</p>
                            </div>
                        </> : <></>
                    }
                </> : <></>
            }
            {
                gudangBarang ? <>
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
export default PesananPembelianBarangForm