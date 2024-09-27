import { useEffect, useState } from "react"
import { apiDaftarBarangCRUD, apiRincianPesananPenjualanBarangCRUD } from "../../../../../service/endPointList.api"
import { showError } from "../../../../../helper/form.helper"
import { FaMoneyBill, FaSortNumericDown } from "react-icons/fa"
import FormPesananPenjualanBarang from "./FormPesananPenjualanBarang"
import { parseToRupiahText } from "../../../../../helper/number.helper"

const PesananPenjualanBarangList = ({
    pesananPenjualanBarang,
    customer
}) => {
    const [rincianPesananPenjualanBarang, setRincianPesananPenjualanBarang] = useState([])
    const [kategoriHargaBarangList, setKategoriHargaBarangList] = useState([])

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
        <div className="grid grid-cols-12 gap-x-2">
            <div className="col-span-4">
                {
                    kategoriHargaBarangList.length > 0 ? <>
                        <div className="bg-white rounded-md my-4 py-6 px-4 shadow-2xl">
                            <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Detail Barang Pesanan</h1>
                            <FormPesananPenjualanBarang
                                _getDataRincianDaftarPasananPenjualan={_getDataRincianDaftarPasananPenjualan}
                                _hapusPesanan={() => { }}
                                customer={customer}
                                kategoriHargaBarangList={kategoriHargaBarangList}
                                pesananPenjualanBarang={pesananPenjualanBarang}
                            />
                        </div>
                    </> : <></>
                }
            </div>
            <div className="col-span-8">
                <div className="bg-white px-4 my-4 rounded-md">
                    {
                        rincianPesananPenjualanBarang.reverse().map(x => {
                            return <>
                                <div className="gap-x-2 px-2 py-3">
                                    <p className="text-2xl font-extrabold">[ {x.kategori_harga_barang_kode_barang} ] {x.daftar_barang_name}</p>
                                    <p className="font-bold mt-2">Harga Barang</p>
                                    <p className="font-bold mt-1 text-xl">
                                        Rp. {parseToRupiahText(x.harga)}
                                    </p>
                                    <p className="font-bold mb-5 mt-2">PPN Rp. {parseToRupiahText(x.ppn)}</p>
                                    <p className="font-bold bg-blue-800 px-2 text-white rounded-md w-max mt-2">{x.satuan_barang_name}</p>
                                </div>
                            </>
                        })
                    }
                </div>
            </div>
        </div>
    </>
}
export default PesananPenjualanBarangList