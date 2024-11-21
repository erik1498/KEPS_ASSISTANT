import { formatDate } from "../../../../../helper/date.helper"
import { parseToRupiahText } from "../../../../../helper/number.helper"

const JurnalStokOpnameUraian = ({
    data,
    bg_color = false
}) => {
    return <>
        <div className={`${bg_color ? "px-1" : ""}`}>
            <div className={`${bg_color ? "bg-gray-200 px-2 py-1" : ""}`}>
                <div className="flex justify-between">
                    <div>
                        <h1>{data?.sumber}</h1>
                        {
                            data?.detail_data?.pesanan_penjualan_barang && <h1>No. Pesanan {data?.detail_data?.pesanan_penjualan_barang}</h1>
                        }
                        {
                            data?.detail_data?.customer_name &&
                            <h1>{data?.detail_data?.customer_name} ( {data?.detail_data?.customer_code} )</h1>
                        }
                        {
                            data?.detail_data?.supplier_name &&
                            <h1>{data?.detail_data?.supplier_name} ( {data?.detail_data?.supplier_code} )</h1>
                        }
                    </div>
                </div>
                <div className="mt-3 flex font-normal gap-x-2">
                    {
                        data?.detail_data?.tanggal_faktur && <p className="mb-2 text-xs">Tanggal Faktur {formatDate(data?.detail_data?.tanggal_faktur)}</p>
                    }
                    {
                        data?.detail_data?.jatuh_tempo && <p className="mb-2 text-xs">Jatuh Tempo {formatDate(data?.detail_data?.jatuh_tempo)}</p>
                    }
                    {
                        data?.detail_data?.hari_terlewat && <p className="mb-2 text-xs">{data?.detail_data?.hari_terlewat} Hari Terlewat</p>
                    }
                </div>
                <b>{data?.detail_data?.kategori_harga_barang_kode_barang} ( {data?.detail_data?.daftar_gudang_name} )</b>
                <p className="mb-1">{data?.daftar_barang_name}</p>
                <div className="w-full flex items-start gap-x-4">
                    {
                        data?.jumlah && <p className="mb-2 text-xs">x{data?.jumlah} {data?.satuan_barang_name}</p>
                    }
                    {
                        data?.harga && <p className="mb-2 text-xs">Harga Rp.{parseToRupiahText(data?.harga)}</p>
                    }
                    {
                        data?.ppn && <p className="mb-2 text-xs">PPN Rp.{parseToRupiahText(data?.ppn)}</p>
                    }
                    {
                        !data?.diskon_persentase ? <></> : <p className="mb-2 text-xs">Diskon {data?.diskon_persentase} %</p>
                    }
                    {
                        data?.detail_data?.harga_beli && <p className="mb-2 text-xs">Harga Beli Rp. {parseToRupiahText(data?.detail_data?.harga_beli)}</p>
                    }
                    {
                        data?.detail_data?.stok_sistem && <p className="mb-2 text-xs">Stok Sistem {parseToRupiahText(data?.detail_data?.stok_sistem)}</p>
                    }
                    {
                        data?.detail_data?.tipe_penyesuaian && data?.detail_data?.tipe_penyesuaian != "SESUAI" ? <p className="mb-2 text-xs">Tipe Penyesuaian <br />{data?.detail_data?.tipe_penyesuaian}</p> : <></>
                    }
                    {
                        data?.detail_data?.jumlah_penyesuaian && data?.detail_data?.jumlah_penyesuaian != 0 ? <p className="mb-2 text-xs">{data?.detail_data?.jumlah_penyesuaian} <br /> {data?.detail_data?.satuan_barang_name}</p> : <></>
                    }
                </div>
                {
                    data?.detail_data?.keterangan_penyesuaian_persediaan && <p className="mb-2 text-xs">Keterangan <br /> {data?.detail_data?.keterangan_penyesuaian_persediaan}</p>
                }
            </div>
        </div>
    </>
}
export default JurnalStokOpnameUraian