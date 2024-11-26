import { useState, useEffect } from "react"
import Wrap from "../../../component/layout/Wrap"
import PageTitle from "../../../component/general/PageTitle"
import { showError } from "../../../helper/form.helper"
import { parseToRupiahText } from "../../../helper/number.helper"
import { convertTo12HoursFormat, formatDate, getHariTanggalFormated } from "../../../helper/date.helper"
import { apiDaftarBarangCRUD, apiKategoriHargaBarangCRUD, apiSatuanBarangCRUD, apiStokAwalBarangCRUD } from "../../../service/endPointList.api"
import FormSelectWithLabel from "../../../component/form/FormSelectWithLabel"
import { FaPager } from "react-icons/fa"
import { getNormalizedByDate } from "../../../helper/jurnalUmum.helper"

const LaporanHargaBarangBeliPage = () => {

    const [isLoading, setIsLoading] = useState(false)

    const [riwayatLaporan, setRiwayatLaporan] = useState([])

    const [daftarBarangList, setDaftarBarangList] = useState([])
    const [satuanBarangList, setSatuanBarangList] = useState([])

    const [daftarBarang, setDaftarBarang] = useState()
    const [satuanBarang, setSatuanBarang] = useState()

    const _getDataBarangTransaksi = () => {
        apiDaftarBarangCRUD
            .custom("/", "GET")
            .then(resData => {
                setDaftarBarangList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    setDaftarBarang(x => x = {
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid
                    })
                }
            }).catch(err => showError(err))
    }

    const _getDataSatuanBarang = () => {
        setSatuanBarang(x => x = null)
        apiSatuanBarangCRUD
            .custom(``, "GET")
            .then(resData => {
                setSatuanBarangList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    setSatuanBarang(x => x = {
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid
                    })
                }
            }).catch(err => showError(err))
    }

    const _getRiwayatPembelianBarang = () => {
        apiKategoriHargaBarangCRUD
            .custom(`/harga_beli_report/${daftarBarang.value}/${satuanBarang.value}`, "GET")
            .then(resData => {
                setRiwayatLaporan(x => x = resData.data)
            }).catch(err => showError(err))
    }

    useEffect(() => {
        _getDataBarangTransaksi()
        _getDataSatuanBarang()
    }, [])

    return <Wrap
        isLoading={isLoading}
    >
        <div>
            <PageTitle title="Laporan Pembelian Barang" />
            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <div className="bg-white py-6 px-6 rounded-t-md">
                        <div className="flex items-end gap-x-2">
                            <FormSelectWithLabel
                                label={"Kode Barang"}
                                optionsDataList={daftarBarangList}
                                optionsLabel={"name"}
                                optionsValue={"uuid"}
                                selectValue={daftarBarang}
                                onchange={(e) => {
                                    setDaftarBarang(e)
                                }}
                                selectName={`daftarBarang`}
                            />
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
                        </div>
                        <button
                            className="btn mt-3 btn-sm bg-blue-800 text-white"
                            onClick={() => _getRiwayatPembelianBarang()}
                        >
                            <FaPager /> Lihat Laporan Pembelian Barang
                        </button>
                    </div>
                </div>
                <div className="col-span-12 h-[80vh] overflow-y-scroll no-scrollbar">
                    <div className="bg-white rounded-b-md px-6">
                        <h1 className="font-bold text-2xl pb-3">Laporan Harga Barang Beli</h1>
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr className="sticky top-0 bg-white py-4 text-black">
                                    <th width={12}>No</th>
                                    <th>Kode Barang</th>
                                    <th>Supplier</th>
                                    <th>Tanggal Beli</th>
                                    <th>Harga Beli</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    riwayatLaporan?.map((item, i) => {
                                        return <>
                                            <tr key={i}>
                                                <td>{i + 1}.</td>
                                                <td>{item.kode_barang}</td>
                                                <td>{item.supplier_name}</td>
                                                <td>{formatDate(item.tanggal_pesanan_pembelian_barang)}</td>
                                                <td>{parseToRupiahText(item.harga_beli)}</td>
                                            </tr>
                                        </>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Wrap>
}
export default LaporanHargaBarangBeliPage