import { useEffect, useState } from "react"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { apiDaftarBarangCRUD, apiRincianPesananPenjualanBarangCRUD, apiStokAwalBarangCRUD } from "../../../../../service/endPointList.api"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { FaPlus, FaSave } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { parseToRupiahText } from "../../../../../../../process_unit/src/utils/numberParsingUtil"
import { PPN } from "../../../../../config/objectList.config"
import { parseRupiahToFloat } from "../../../../../helper/number.helper"

const PesananPenjualanBarangList = ({
    pesananPenjualanBarang,
    customer
}) => {
    const [kategoriHargaBarangList, setKategoriHargaBarangList] = useState([])
    const [gudangBarangList, setGudangBarangList] = useState([])
    const [kategoriHargaBarangSelected, setKategoriHargaBarangSelected] = useState()

    const [kategoriHargaBarang, setKategoriHargaBarang] = useState()
    const [gudangBarang, setGudangBarang] = useState()
    const [jumlah, setJumlah] = useState(0)
    const [diskonAngka, setDiskonAngka] = useState(0)
    const [diskonPersentase, setDiskonPersentase] = useState(0)

    const [totalBarang, setTotalBarang] = useState(0)
    const [totalAkhir, setTotalAkhir] = useState(0)
    const [ppnBarang, setPPNBarang] = useState(0)

    const _getDataBarangTransaksi = () => {
        apiDaftarBarangCRUD
            .custom("/transaksi", "GET")
            .then(resData => {
                setKategoriHargaBarangList(resData.data)
            }).catch(err => showError(err))
    }

    const _getDataDaftarGudangByKategoriHarga = () => {
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
                        ppn: `${ppnBarang}`,
                        diskon_angka: `${diskonAngka}`,
                        diskon_persentase: `${diskonPersentase}`,
                        total_harga: `${totalAkhir}`
                    }
                }).then(resData => {

                }).catch(err => showError(err))
        }
    }


    const _updateDiskonAngka = (e) => {
        try {
            const diskonAngka = (parseRupiahToFloat(e.target.value) * kategoriHargaBarangSelected[`harga_${customer.kode_harga}`]) / 100
            setDiskonPersentase(e.target.value)
            setDiskonAngka(x => x = parseToRupiahText(diskonAngka))

            setTotalAkhir(x => x = totalBarang - (parseRupiahToFloat(diskonAngka) * parseRupiahToFloat(jumlah)))
        } catch (error) {
            setDiskonAngka(x => x = 0)
        }
    }

    const _updateDiskonPersentase = () => {
        try {
            const diskonPersentase = parseRupiahToFloat(diskonAngka) * 100 / kategoriHargaBarangSelected[`harga_${customer.kode_harga}`]
            setDiskonPersentase(x => x = diskonPersentase)
            setTotalAkhir(x => x = totalBarang - (parseRupiahToFloat(diskonAngka) * parseRupiahToFloat(jumlah)))
        } catch (error) {
            setDiskonPersentase(x => x = 0)
        }
    }

    useEffect(() => {
        if (kategoriHargaBarangSelected) {
            _updateDiskonPersentase()
        }
    }, [totalBarang, diskonAngka])

    useEffect(() => {
        if (kategoriHargaBarangSelected) {

            const jumlahFloat = parseRupiahToFloat(jumlah)

            const ppnBarangGet = ((kategoriHargaBarangSelected[`harga_${customer.kode_harga}`] * PPN) / 100)

            const total = (jumlahFloat * kategoriHargaBarangSelected[`harga_${customer.kode_harga}`]) + (ppnBarangGet * jumlahFloat)

            setPPNBarang(x => x = ppnBarangGet)
            setTotalBarang(x => x = total)
        }
    }, [jumlah, kategoriHargaBarangSelected])

    useEffect(() => {
        if (kategoriHargaBarang) {
            _getDataDaftarGudangByKategoriHarga()
            const kategoriHargaBarangGet = kategoriHargaBarangList.filter(x => x.uuid == kategoriHargaBarang.value)
            if (kategoriHargaBarangGet.length > 0) {
                setKategoriHargaBarangSelected(kategoriHargaBarangGet[0])
            }
        }
    }, [kategoriHargaBarang])

    useEffect(() => {
        _getDataBarangTransaksi()
    }, [])

    return <div className="mt-5">
        <div className="my-5 bg-white py-5 px-6 rounded-md">
            <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Barang Pesanan</h1>
            <form onSubmit={e => _savePesananBarang(e)}>
                <div className="flex items-end gap-x-2">
                    <FormSelectWithLabel
                        label={"Kode Barang"}
                        optionsDataList={kategoriHargaBarangList}
                        optionsLabel={["kode_barang", "daftar_barang_name"]}
                        optionsValue={"uuid"}
                        optionsLabelIsArray={true}
                        optionsDelimiter={"-"}
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
                    kategoriHargaBarang ? <>
                        <div className="mt-5 flex gap-x-2">
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
                                        name: "jumlah",
                                    }
                                }
                            />
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
                        <div className="mt-5 flex gap-x-2">
                            <FormInputWithLabel
                                label={"Satuan Barang"}
                                type={"text"}
                                addClassParent="flex-2"
                                addClassInput="border-none px-1 no-required"
                                others={
                                    {
                                        value: kategoriHargaBarangSelected?.satuan_barang_name,
                                        disabled: true
                                    }
                                }
                            />
                            <FormInputWithLabel
                                label={"Jenis Barang"}
                                type={"text"}
                                addClassParent="flex-2"
                                addClassInput="border-none px-1 no-required"
                                others={
                                    {
                                        value: kategoriHargaBarangSelected?.jenis_barang_code,
                                        disabled: true
                                    }
                                }
                            />
                            <FormInputWithLabel
                                label={"Harga Barang"}
                                type={"text"}
                                addClassParent="flex-2"
                                addClassInput="border-none px-1 no-required"
                                others={
                                    {
                                        value: `Rp. ${parseToRupiahText(kategoriHargaBarangSelected ? kategoriHargaBarangSelected[`harga_${customer.kode_harga}`] : "0")}`,
                                        disabled: true
                                    }
                                }
                            />
                            <FormInputWithLabel
                                label={"PPN Barang"}
                                type={"text"}
                                addClassParent="flex-2"
                                addClassInput="border-none px-1 no-required"
                                others={
                                    {
                                        value: `Rp. ${parseToRupiahText(ppnBarang)}`,
                                        disabled: true
                                    }
                                }
                            />
                        </div>
                        <div className="mt-5 gap-x-2 px-1">
                            <p className="font-bold text-sm">Total Harga</p>
                            <p className="font-bold text-4xl">Rp. {parseToRupiahText(totalAkhir)}</p>
                        </div>
                        <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaPlus /> Tambahkan</button>
                    </> : <></>
                }
            </form>
        </div>
    </div>
}
export default PesananPenjualanBarangList