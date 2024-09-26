import { useEffect, useState } from "react"
import { apiDaftarBarangCRUD, apiRincianPesananPenjualanBarangCRUD } from "../../../../../service/endPointList.api"
import { showError } from "../../../../../helper/form.helper"
import { FaPlus, FaSave } from "react-icons/fa"
import ItemPesananPenjualanBarang from "./ItemPesananPenjualanBarang"
import { parseToRupiahText } from "../../../../../helper/number.helper"

const PesananPenjualanBarangList = ({
    pesananPenjualanBarang,
    customer
}) => {
    const [rincianPesananPenjualanBarang, setRincianPesananPenjualanBarang] = useState([])
    const [kategoriHargaBarangList, setKategoriHargaBarangList] = useState([])
    const [totalPesanan, setTotalPesanan] = useState(0)

    const _getDataRincianDaftarPasananPenjualan = () => {
        apiRincianPesananPenjualanBarangCRUD
            .custom(`/${pesananPenjualanBarang.uuid}`, "GET")
            .then(resData => {
                setRincianPesananPenjualanBarang(resData.data)
            }).catch(err => showError(err))
    }

    const _getDataBarangTransaksi = () => {
        apiDaftarBarangCRUD
            .custom("/transaksi", "GET")
            .then(resData => {
                setKategoriHargaBarangList(resData.data)
            }).catch(err => showError(err))
    }

    const _addRincianPesananPenjualanBarang = () => {
        const rincianPesananPenjualanBarangCopy = [...rincianPesananPenjualanBarang]
        rincianPesananPenjualanBarangCopy.push({
            pesanan_penjualan_barang: pesananPenjualanBarang.uuid,
            kategori_harga_barang: null,
            stok_awal_barang: null,
            kode_harga_customer: customer.kode_harga,
            jumlah: `${0}`,
            harga: `${0}`,
            ppn: `${0}`,
            diskon_angka: `${0}`,
            diskon_persentase: `${0}`,
            total_harga: `${0}`
        })
        setRincianPesananPenjualanBarang(x => x = rincianPesananPenjualanBarangCopy)
        setTotalPesanan(x => x = x + 10000)
    }

    const _removeRincianPesananPenjualanBarang = (index) => {
        const rincianPesananPenjualanBarangCopy = [...rincianPesananPenjualanBarang]
        setRincianPesananPenjualanBarang(x => x = rincianPesananPenjualanBarangCopy.filter((x, i) => i != index))
        setTotalPesanan(x => x = x - 10000)
    }

    useEffect(() => {
        _getDataBarangTransaksi()
        _getDataRincianDaftarPasananPenjualan()
    }, [])

    return <>
        {/* <div className="grid grid-cols-12 gap-y-4">
            <div className="col-span-3">

            </div>
            <div className="col-span-9"> */}
        {/* <table className="table table-zebra bg-white rounded-md my-5">
            <thead>
                <th>Barang</th>
                <th>Gudang</th>
                <th>Detail Pesanan</th>
            </thead>
            <tbody> */}
                {
                    rincianPesananPenjualanBarang.map((x, i) => {
                        return <>
                            <div className="flex flex-col bg-white px-4 py-2 mt-6 rounded-md">
                            <ItemPesananPenjualanBarang
                                rincianPesananPenjualanBarang={x}
                                _getDataRincianDaftarPasananPenjualan={_getDataRincianDaftarPasananPenjualan}
                                _hapusPesanan={() => {
                                    _removeRincianPesananPenjualanBarang(i)
                                }}
                                kategoriHargaBarangList={kategoriHargaBarangList}
                                customer={customer}
                            />
                            </div>
                        </>
                    })
                }
            {/* </tbody>
        </table> */}
        <div className="bg-blue-900 text-white shadow-2xl px-5 py-5 mt-6 rounded-md sticky bottom-0">
            <div className="flex gap-x-2 mb-4">
                <button
                    className="btn btn-sm bg-white text-black"
                    onClick={() => _addRincianPesananPenjualanBarang()}
                >
                    <FaPlus /> Barang Pesanan
                </button>
                <button
                    className="btn btn-sm bg-green-800 text-white"
                    onClick={() => _addRincianPesananPenjualanBarang()}
                >
                    <FaSave /> Simpan Pesanan
                </button>
            </div>
            <div className="gap-x-2 px-1">
                <p className="font-bold text-sm">Total Biaya Pesanan</p>
                <p className="font-bold text-5xl">Rp. {parseToRupiahText(totalPesanan)}</p>
            </div>
        </div>
        {/* </div>
        </div> */}
    </>
}
export default PesananPenjualanBarangList