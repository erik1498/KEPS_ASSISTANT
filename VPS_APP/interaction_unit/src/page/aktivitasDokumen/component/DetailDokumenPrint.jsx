import React from "react"
import DokumenKlien from "./DokumenKlien"
import RiwayatPembayaranAktivitasDokumen from "./RiwayatPembayaranAktivitasDokumen"
import RiwayatAktivitasDokumen from "./RiwayatAktivitasDokumen"
import { parseToRupiahText } from "../../../helper/number.helper"
import { formatDate, getHariTanggalFull } from "../../../helper/date.helper"

export const DetailDokumenPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <h1 className="text-4xl font-bold mb-3">Aktivitas Dokumen</h1>
            <p>Waktu Cetak - {formatDate(getHariTanggalFull())}</p>
            <div className="bg-white py-5 rounded-md">
                <div className="flex justify-between items-center">
                    <p className="text-md">Tanggal {formatDate(props?.data?.tanggal)} | {props?.data?.penanggung_jawab}</p>
                </div>
                <p className="text-sm mb-4">Status Dokumen ( {props?.data?.status} )</p>
                <p className="py-1 w-max rounded font-bold">No. Surat : {props?.data?.no_surat}</p>
                <div className="flex items-start font-bold mb-2">
                    <p className="text-md"> Biaya Rp. {parseToRupiahText(props?.data?.biaya)}</p>
                    {
                        props?.data?.hutang == 0 ? <p className="text-md px-2 text-green-600">( Lunas )</p> :
                            <p className="text-md px-2 text-red-600">( Hutang Rp. {parseToRupiahText(props?.data?.hutang)} )</p>
                    }
                </div>

                <div className="flex justify-between">
                    <p className="text-md">{props?.data?.klien}</p>
                    <div className="flex justify-between">
                        <div className="flex gap-x-2 bg-gray-500 text-white font-bold rounded-lg w-max">
                            <p className="text-md w-max pl-2">{props?.data?.tipe_dokumen}</p>
                            <p className={`text-md w-max border-l-2 px-2 border-white ${props?.data?.jenis_dokumen == "EMPTY" ? "" : "border-r-2"}`}>{props?.data?.kategori_dokumen}</p>
                            {
                                props?.data?.jenis_dokumen != "EMPTY" ? <>
                                    <p className="text-md w-max pr-2">{props?.data?.jenis_dokumen}</p>
                                </> : <></>
                            }
                        </div>
                    </div>
                </div>
                <p className="text-md font-bold mt-3">Keterangan</p>
                <p className="text-md mt-1">{props?.data?.keterangan}</p>

                <DokumenKlien
                    idAktivitasDokumen={props?.data?.uuid}
                    viewMode={true}
                />

                <RiwayatPembayaranAktivitasDokumen
                    idAktivitasDokumen={props?.data?.uuid}
                    viewMode={true}
                />

                <RiwayatAktivitasDokumen
                    idAktivitasDokumen={props?.data?.uuid}
                    viewMode={true}
                />
            </div>
        </div>
    )
})