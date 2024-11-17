import { formatDate } from "../../../../../helper/date.helper"
import { parseToRupiahText } from "../../../../../helper/number.helper"

const JurnalPenyusutanUraian = ({
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
                    </div>
                </div>
                <p className="my-2 font-bold">{data?.detail_data?.daftar_aset_name}</p>
                {
                    data?.detail_data?.supplier_name &&
                    <p className="mb-2">{data?.detail_data?.supplier_name} ( {data?.detail_data?.supplier_code} )</p>
                }
                <div className="w-full flex items-start gap-x-4">
                    {
                        data?.detail_data?.harga_satuan && <p className="mb-2 text-xs">Harga Beli <br /> Rp.{parseToRupiahText(data?.detail_data?.harga_satuan)}</p>
                    }
                    {
                        data?.detail_data?.dpp && <p className="mb-2 text-xs">DPP <br /> Rp.{parseToRupiahText(data?.detail_data?.dpp)}</p>
                    }
                    {
                        data?.detail_data?.ppn && <p className="mb-2 text-xs">PPN <br /> Rp.{parseToRupiahText(data?.detail_data?.ppn)}</p>
                    }
                    {
                        data?.detail_data?.metode_penyusutan ? <p className="mb-2 text-xs">Metode Penyusutan <br />{data?.detail_data?.metode_penyusutan}</p> : <></>
                    }
                    {
                        data?.detail_data?.kategori_aset ? <p className="mb-2 text-xs">Kategori Aset <br />{data?.detail_data?.kategori_aset}</p> : <></>
                    }
                    {
                        data?.detail_data?.kelompok_aset ? <p className="mb-2 text-xs">Kelompok Aset <br />{data?.detail_data?.kelompok_aset}</p> : <></>
                    }
                    {
                        data?.detail_data?.kuantitas && data?.detail_data?.kuantitas != 0 ? <p className="mb-2 text-xs">{data?.detail_data?.kuantitas} <br /> {data?.detail_data?.satuan_barang_name}</p> : <></>
                    }
                </div>
                {
                    data?.detail_data?.keterangan_penyesuaian_persediaan && <p className="mb-2 text-xs">Keterangan <br /> {data?.detail_data?.keterangan_penyesuaian_persediaan}</p>
                }
            </div>
        </div>
    </>
}
export default JurnalPenyusutanUraian