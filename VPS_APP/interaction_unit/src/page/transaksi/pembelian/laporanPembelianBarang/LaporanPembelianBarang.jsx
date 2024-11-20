import { useEffect, useState } from "react"
import Wrap from "../../../../component/layout/Wrap"
import PageTitle from "../../../../component/general/PageTitle"
import FormSelectWithLabel from "../../../../component/form/FormSelectWithLabel"
import { apiDaftarBarangCRUD, apiStokAwalBarangCRUD } from "../../../../service/endPointList.api"
import { FaPager } from "react-icons/fa"
import { showError } from "../../../../helper/form.helper"
import { convertTo12HoursFormat, formatDate, getHariTanggalFormated } from "../../../../helper/date.helper"
import { getNormalizedByDate } from "../../../../helper/jurnalUmum.helper"
import { parseToRupiahText } from "../../../../helper/number.helper"

const LaporanPembelianBarangPage = () => {
    const [isLoading, setIsLoading] = useState(false)

    const [kategoriHargaBarangSelected, setKategoriHargaBarangSelected] = useState()

    const [riwayatLaporan, setRiwayatLaporan] = useState([])

    const [kategoriHargaBarangList, setKategoriHargaBarangList] = useState([])
    const [gudangBarangList, setGudangBarangList] = useState([])

    const [kategoriHargaBarang, setKategoriHargaBarang] = useState()
    const [gudangBarang, setGudangBarang] = useState()

    const _getDataBarangTransaksi = () => {
        apiDaftarBarangCRUD
            .custom("/transaksi", "GET")
            .then(resData => {
                setKategoriHargaBarangList(resData.data)
            }).catch(err => showError(err))
    }

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

    const _getRiwayatStokAwalBarang = () => {
        apiStokAwalBarangCRUD
            .custom(`/riwayat_pembelian/${gudangBarang.value}`, "GET")
            .then(resData => {
                const data = getNormalizedByDate(resData.data)
                setRiwayatLaporan(x => x = data)
            }).catch(err => showError(err))
    }

    useEffect(() => {
        if (kategoriHargaBarang) {
            _getDataDaftarGudangByKategoriHarga()

            const kategoriHargaBarangGet = kategoriHargaBarangList.filter(x => x.uuid == kategoriHargaBarang.value)[0]

            setKategoriHargaBarangSelected(x => x = kategoriHargaBarangGet)
        }
    }, [kategoriHargaBarang])

    useEffect(() => {
        _getDataBarangTransaksi()
    }, [])

    return <Wrap
        isLoading={isLoading}
    >
        <div>
            <PageTitle title="Laporan Pembelian Barang" />
            <div className="grid grid-cols-12">
                <div className="col-span-3">
                    <div className="bg-white py-6 px-6 rounded-md">
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
                                <div className="px-1 gap-x-2 rounded-md py-5">
                                    <p className="text-xl font-extrabold">{kategoriHargaBarangSelected.daftar_barang_name}</p>
                                    <p className="font-bold bg-blue-800 px-2 text-white rounded-md w-max mt-2">{kategoriHargaBarangSelected.satuan_barang_name}</p>
                                </div>
                            </> : <></>
                        }
                        <button
                            className="btn mt-3 btn-sm bg-blue-800 text-white"
                            onClick={() => _getRiwayatStokAwalBarang()}
                        >
                            <FaPager /> Lihat Laporan Pembelian Barang
                        </button>
                    </div>
                </div>
                <div className="col-span-9 px-2 h-[80vh] overflow-y-scroll no-scrollbar">
                    <div className="bg-white rounded-md p-3">
                        <h1 className="font-bold text-2xl pb-6">Laporan Riwayat Pembelian Barang</h1>
                        {
                            riwayatLaporan.map((x, i) => {
                                return <>
                                    <p className="font-bold sticky top-0 bg-gray-300 p-2 z-20">{getHariTanggalFormated("/", formatDate(x.parent, false))}</p>
                                    <div className="flex flex-col">
                                        {
                                            x.data.map((y, j) => {

                                                const detail = JSON.parse(y.detail)

                                                return <div className="my-6 pl-6">
                                                    <div className="grid grid-cols-12 mb-3">
                                                        <div className="col-span-1">
                                                            <p className="text-sm pr-2 font-medium">{convertTo12HoursFormat(y.tanggal.split("T")[1])}</p>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <p className="text-sm pr-2 font-medium px-3">{y.type.replaceAll("_", " ").toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-12">
                                                        <div className="col-span-1">
                                                        </div>
                                                        <div className="col-span-3">
                                                            <p className="text-sm pr-2 px-3 pb-2 font-bold">{y.bukti_transaksi}</p>
                                                            <p className="text-sm pr-2 px-3 pb-2 font-bold">Supplier {y.supplier} ( {y.supplier_code} )</p>
                                                            {
                                                                detail?.jumlah ? <p className="text-sm pr-2 font-normal px-3"> Jumlah {parseToRupiahText(detail.jumlah)} {detail.satuan_barang}</p> : ""
                                                            }
                                                            {
                                                                detail?.diskon_persentase ? <p className="text-sm pr-2 font-normal px-3"> Diskon {detail.diskon_persentase} % </p> : ""
                                                            }
                                                            {
                                                                detail?.total ? <p className="text-sm pr-2 font-normal px-3"> Total Rp.{parseToRupiahText(detail.total)}</p> : ""
                                                            }
                                                            {
                                                                detail?.nilai_pelunasan ? <p className="text-sm pr-2 font-normal px-3"> Nilai Pelunasan Rp.{parseToRupiahText(detail.nilai_pelunasan)}</p> : ""
                                                            }
                                                            {
                                                                detail?.retur ? <p className="text-sm pr-2 font-normal px-3"> Jumlah Retur {parseToRupiahText(detail.retur)} Dengan Nilai Rp.{parseToRupiahText(detail.nilai_retur)}</p> : ""
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    </Wrap>

}
export default LaporanPembelianBarangPage