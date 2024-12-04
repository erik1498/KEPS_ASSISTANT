import { parseToRupiahText } from "../../../../../helper/number.helper"

const JurnalPenyusutanUraian = ({
    data,
    bg_color = false
}) => {
    console.log(data)
    return <>
        <div className={`px-1`}>
            <div className={`${!bg_color ? "bg-gray-200 px-2 py-1" : ""}`}>
                <div className="flex justify-between">
                    <div>
                        <h1 className="font-bold">{data?.sumber}</h1>
                    </div>
                </div>
                {
                    data?.detail_data?.daftar_aset_name ? <p className="my-2 font-bold">{data?.detail_data?.daftar_aset_invoice} - {data?.detail_data?.daftar_aset_name}</p> : <></>
                }
                {
                    data?.detail_data?.daftar_perlengkapan_name ? <p className="my-2 font-bold">{data?.detail_data?.daftar_perlengkapan_invoice} - {data?.detail_data?.daftar_perlengkapan_name}</p> : <></>
                }
                {
                    data?.detail_data?.supplier_name &&
                    <p className="mb-2">{data?.detail_data?.supplier_name} ( {data?.detail_data?.supplier_code} )</p>
                }
                <div className="w-full flex items-start gap-x-4">
                {
                        data?.detail_data?.harga_satuan && <p className="mb-2 text-xs">Rp.{parseToRupiahText(data?.detail_data?.harga_satuan)} x{data?.detail_data?.kuantitas} {data?.detail_data?.satuan_barang_name}</p>
                    }
                    {
                        data?.detail_data?.metode_penyusutan ? <p className="mb-2 text-xs">{data?.detail_data?.metode_penyusutan}</p> : <></>
                    }
                    {
                        data?.detail_data?.kategori_aset ? <p className="mb-2 text-xs">{data?.detail_data?.kategori_aset}</p> : <></>
                    }
                    {
                        data?.detail_data?.kelompok_aset ? <p className="mb-2 text-xs">{data?.detail_data?.kelompok_aset}</p> : <></>
                    }
                </div>
                {
                    data?.detail_data?.keterangan_penyesuaian_persediaan && <p className="mb-2 text-xs">Keterangan <br /> {data?.detail_data?.keterangan_penyesuaian_persediaan}</p>
                }
                {
                    data?.detail_data?.keterangan && <p className="mb-2 text-xs">Keterangan <br /> {data?.detail_data?.keterangan}</p>
                }
            </div>
        </div>
    </>
}
export default JurnalPenyusutanUraian