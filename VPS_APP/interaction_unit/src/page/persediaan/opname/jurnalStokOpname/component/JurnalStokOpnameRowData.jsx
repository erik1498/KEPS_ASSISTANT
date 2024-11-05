import { convertTo12HoursFormat, formatDate, getBulanByIndex } from "../../../../../helper/date.helper"
import { parseRupiahToFloat, parseToRupiahText } from "../../../../../helper/number.helper"

const JurnalStokOpnameRowData = ({
    item1,
    balanceStatus = true,
    forPrint
}) => {
    return <>
        <div className="grid grid-cols-12 items-center bg-gray-3">
            <div className=" col-span-12 border-x-4 border-transparent text-gray-900 flex flex-row items-center">
                {
                    balanceStatus ?
                        <div className={`${item1.debet == item1.kredit ? "bg-green-900" : "bg-red-900"} w-full py-1 text-white text-[12.3px] rounded-sm text-center font-bold px-4`}>{item1.bukti_transaksi}</div>
                        :
                        <div className={`bg-green-900 w-full py-1 text-white text-[12.3px] rounded-sm text-center font-bold px-4`}>{item1.bukti_transaksi}</div>
                }
            </div>
        </div>
        {
            item1.data.map((item2, i) => {
                return item2.map((item3, j) => {
                    return item3.debet != 0 || item3.kredit != 0 ? <>
                        <>
                            <hr />
                            {
                                j <= item2.length ? <>
                                    {
                                        j == 0 ? <>
                                            <div className="px-1">
                                                <div className="px-2 bg-gray-600 py-3 text-white font-bold text-md flex flex-col justify-between">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <h1>{item3.sumber}</h1>
                                                            <h1>No. Pesanan {item3.pesanan_penjualan_barang}</h1>
                                                        </div>
                                                        <div>
                                                            <h1 className="text-right">{item3.customer_name}</h1>
                                                            <h1 className="text-right">Kode Customer {item3.customer_code}</h1>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex font-normal gap-x-2">
                                                        {
                                                            item3.detail_data?.tanggal_faktur && <p className="mb-2 text-xs">Tanggal Faktur {formatDate(item3.detail_data?.tanggal_faktur)}</p>
                                                        }
                                                        {
                                                            item3.detail_data?.jatuh_tempo && <p className="mb-2 text-xs">Jatuh Tempo {formatDate(item3.detail_data?.jatuh_tempo)}</p>
                                                        }
                                                        {
                                                            item3.detail_data?.hari_terlewat && <p className="mb-2 text-xs">{item3.detail_data?.hari_terlewat} Hari Terlewat</p>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </> : <></>
                                    }
                                    {
                                        item3.waktu_show ? <>
                                            <div className="px-1">
                                                <div className="bg-gray-200 px-2 py-1">
                                                    <b>{item3.kategori_harga_barang_kode_barang} ( {item3.daftar_gudang_name} )</b>
                                                    <p className="mb-1">{item3.daftar_barang_name}</p>
                                                    <div className="w-full flex gap-x-4">
                                                        {
                                                            item3.jumlah && <p className="mb-2 text-xs">x{item3.jumlah} {item3.satuan_barang_name}</p>
                                                        }
                                                        {
                                                            item3.harga && <p className="mb-2 text-xs">Harga Rp.{parseToRupiahText(item3.harga)}</p>
                                                        }
                                                        {
                                                            item3.ppn && <p className="mb-2 text-xs">PPN Rp.{parseToRupiahText(item3.ppn)}</p>
                                                        }
                                                        {
                                                            item3.diskon_persentase && <p className="mb-2 text-xs">Diskon {item3.diskon_persentase} %</p>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </> : <></>
                                    }
                                    <div className="grid grid-cols-12 items-start py-1">
                                        <div className="col-span-1 px-2 text-black">
                                            {
                                                item3.waktu_show && convertTo12HoursFormat(item3.waktu)
                                            }
                                        </div>
                                        <div className={`col-span-2 text-gray-900 flex flex-col px-2 ${parseRupiahToFloat(item3.kredit) > 0 && item3.uuid != "NERACA" ? "text-right" : ""}`}>
                                            <p>{item3.kode_akun} - {item3.nama_akun}</p>
                                        </div>
                                        <div className={`${forPrint ? "col-span-5" : "col-span-4"} text-gray-900 flex flex-col px-2`}>

                                        </div>
                                        <div className="text-right px-2 col-span-2 text-gray-900">
                                            {
                                                item3.debet != "0" ? <h1 className=" text-green-900 font-bold">{parseToRupiahText(item3.debet)}</h1> : <></>
                                            }
                                        </div>
                                        <div className="text-right px-2 col-span-2 text-gray-900">
                                            {
                                                item3.kredit != "0" ? <h1 className=" text-red-900 font-bold">{parseToRupiahText(item3.kredit)}</h1> : <></>
                                            }
                                        </div>
                                    </div>
                                </> : <></>
                            }
                            {
                                j == item2.length - 1 && i == item1.data.length - 1 ?
                                    <>
                                        <hr />
                                        <div className="grid grid-cols-12 items-start py-3">
                                            <div className={`${forPrint ? 'col-span-8' : 'col-span-7'}`}></div>
                                            <div className="text-right px-2 col-span-2 text-gray-900">
                                                <h1 className=" text-green-900 font-bold">{parseToRupiahText(item1.debet)}</h1>
                                            </div>
                                            <div className="text-right px-2 col-span-2 text-gray-900">
                                                <h1 className=" text-red-900 font-bold">{parseToRupiahText(item1.kredit)}</h1>
                                            </div>
                                        </div>
                                    </> : <></>
                            }
                        </>
                    </> : <></>
                })
            })
        }
    </>
}
export default JurnalStokOpnameRowData