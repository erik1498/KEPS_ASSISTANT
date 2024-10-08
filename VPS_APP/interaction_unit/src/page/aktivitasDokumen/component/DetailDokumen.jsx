import { FaEye, FaPrint, FaTimes } from "react-icons/fa"
import { parseToRupiahText } from "../../../helper/number.helper"
import DokumenKlien from "./DokumenKlien"
import RiwayatPembayaranAktivitasDokumen from "./RiwayatPembayaranAktivitasDokumen"
import RiwayatAktivitasDokumen from "./RiwayatAktivitasDokumen"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { DetailDokumenPrint } from "./DetailDokumenPrint"
import { formatDate } from "../../../helper/date.helper"
import { useDataContext } from "../../../context/dataContext.context"

const DetailDokumen = ({
    item,
    setIsViewDokumen = () => { }
}) => {

    const { data } = useDataContext()
    const detailDokumenRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => detailDokumenRef.current,
    });

    return <div className="bg-white px-4 py-5 rounded-md">
        <div className="flex justify-between items-center">
            <p className="text-md">Tanggal {formatDate(item.tanggal)} | {item.penanggung_jawab}</p>
            <div className="flex items-center gap-x-3">
                <button
                    className="btn btn-xs shadow-none border-0 bg-red-500 text-white"
                    onClick={() => {
                        handlePrint()
                    }}
                >
                    <FaPrint size={10} />
                    Cetak
                </button>

                <div className="hidden">
                    <DetailDokumenPrint
                        data={item}
                        tahun={data.tahun}
                        ref={detailDokumenRef}
                    />
                </div>
                <button
                    className="btn btn-xs bg-transparent shadow-none border-0 text-red-400"
                    onClick={() => {
                        setIsViewDokumen(null)
                    }}
                >
                    <FaTimes size={10} />
                    Keluar
                </button>
            </div>
        </div>
        <p className="text-sm mb-4">Status Dokumen ( {item.status} )</p>
        <p className="py-1 w-max rounded font-bold">No. Surat : {item.no_surat}</p>
        <div className="flex items-start font-bold mb-2">
            <p className="text-md"> Biaya Rp. {parseToRupiahText(item.biaya)}</p>
            {
                item.hutang == 0 ? <p className="text-md px-2 text-green-600">( Lunas )</p> :
                    <p className="text-md px-2 text-red-600">( Hutang Rp. {parseToRupiahText(item.hutang)} )</p>
            }
        </div>

        <div className="flex justify-between border-y-2 py-5 mt-5">
            <div className="flex flex-col">
                <p className="text-xl font-bold">{item.klien}</p>
                <div className="flex flex-col gap-x-3 mt-2">
                    <div className="flex gap-x-2">
                        <p className="text-sm font-bold">Nomor HP : </p>
                        <p className="text-sm">{item.nomor_hp_klien}</p>
                    </div>
                    <div className="flex gap-x-2">
                        <p className="text-sm font-bold">Email : </p>
                        <p className="text-sm">{item.email_klien}</p>
                    </div>
                    <div className="flex gap-x-2">
                        <p className="text-sm font-bold">Alamat : </p>
                        <p className="text-sm">{item.alamat_klien}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between">
                <div className="flex gap-x-2 bg-gray-500 text-white font-bold rounded-lg w-max h-max">
                    <p className="text-md w-max pl-2">{item.tipe_dokumen}</p>
                    <p className={`text-md w-max border-l-2 px-2 border-white ${item.jenis_dokumen == "EMPTY" ? "" : "border-r-2"}`}>{item.kategori_dokumen}</p>
                    {
                        item.jenis_dokumen != "EMPTY" ? <>
                            <p className="text-md w-max pr-2">{item.jenis_dokumen}</p>
                        </> : <></>
                    }
                </div>
            </div>
        </div>

        <div className="border-b-2 py-5">
            <p className="text-sm font-bold">Keterangan</p>
            <p className="text-sm mt-1">{item.keterangan}</p>
        </div>

        <p className="text-sm font-bold w-max mt-6 mb-3">{item.jumlah_dokumen} Dokumen Klien</p>
        <DokumenKlien
            idAktivitasDokumen={item.uuid}
            viewMode={true}
        />

        <RiwayatPembayaranAktivitasDokumen
            idAktivitasDokumen={item.uuid}
            viewMode={true}
        />

        <RiwayatAktivitasDokumen
            idAktivitasDokumen={item.uuid}
            viewMode={true}
        />
    </div>
}

export default DetailDokumen