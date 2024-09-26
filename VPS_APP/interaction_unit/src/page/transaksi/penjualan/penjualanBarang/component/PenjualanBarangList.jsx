import { useEffect, useState } from "react"
import { apiRincianPesananPenjualanBarangCRUD } from "../../../../../service/endPointList.api"
import { showError } from "../../../../../helper/form.helper"
import { FaPlus } from "react-icons/fa"
import ItemPesananPenjualanBarang from "./ItemPesananPenjualanBarang"
import { parseToRupiahText } from "../../../../../helper/number.helper"

const PesananPenjualanBarangList = ({
    pesananPenjualanBarang,
    customer
}) => {
    const [rincianPesananPenjualanBarang, setRincianPesananPenjualanBarang] = useState([])

    const _getDataRincianDaftarPasananPenjualan = () => {
        apiRincianPesananPenjualanBarangCRUD
            .custom(`/${pesananPenjualanBarang.uuid}`, "GET")
            .then(resData => {
                setRincianPesananPenjualanBarang(resData.data)
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
    }

    const _removeRincianPesananPenjualanBarang = (index) => {
        const rincianPesananPenjualanBarangCopy = [...rincianPesananPenjualanBarang]
        setRincianPesananPenjualanBarang(x => x = rincianPesananPenjualanBarangCopy.filter((x, i) => i != index))
    }

    useEffect(() => {
        _getDataRincianDaftarPasananPenjualan()
    }, [])

    return <>
        <div className="bg-white px-4 py-5 mt-6 rounded-md sticky top-0">
            <div className="gap-x-2 px-1">
                <p className="font-bold text-sm">Total Biaya Pesanan</p>
                <p className="font-bold text-5xl">Rp. {parseToRupiahText("100000")}</p>
            </div>
            <button
                className="mt-4 btn btn-sm bg-green-800 text-white"
                onClick={() => _addRincianPesananPenjualanBarang()}
            ><FaPlus /> Barang Pesanan</button>
        </div>
        <div className="grid grid-cols-12 gap-x-2">
            <div className="col-span-12">
                {
                    rincianPesananPenjualanBarang.map((x, i) => {
                        return <>
                            <div className="bg-white mt-6 px-4 rounded-md">
                                <div className="py-5 rounded-md">
                                    <ItemPesananPenjualanBarang
                                        rincianPesananPenjualanBarang={x}
                                        _getDataRincianDaftarPasananPenjualan={_getDataRincianDaftarPasananPenjualan}
                                        _hapusnPesanan={() => {
                                            _removeRincianPesananPenjualanBarang(i)
                                        }}
                                        customer={customer}
                                    />
                                </div>
                            </div>
                        </>
                    })
                }
            </div>
        </div>
    </>
}
export default PesananPenjualanBarangList