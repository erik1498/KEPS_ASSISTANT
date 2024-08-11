import { FaEye, FaPrint, FaTimes } from "react-icons/fa"
import { parseToRupiahText } from "../../../helper/number.helper"
import DokumenKlien from "./DokumenKlien"
import RiwayatPembayaranAktivitasDokumen from "./RiwayatPembayaranAktivitasDokumen"
import RiwayatAktivitasDokumen from "./RiwayatAktivitasDokumen"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { DetailDokumenPrint } from "./DetailDokumenPrint"
import { formatDate } from "../../../helper/date.helper"

const DetailDokumen = ({
    item,
    setIsViewDokumen = () => { }
}) => {

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

        <div className="flex justify-between">
            <p className="text-md">{item.klien}</p>
            <div className="flex justify-between">
                <div className="flex gap-x-2 bg-gray-500 text-white font-bold rounded-lg w-max">
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
        <p className="text-md font-bold mt-3">Keterangan</p>
        <p className="text-md mt-1">{item.keterangan}</p>

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