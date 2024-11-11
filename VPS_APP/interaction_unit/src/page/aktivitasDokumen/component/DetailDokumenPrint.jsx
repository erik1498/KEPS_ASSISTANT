import React from "react"
import DokumenKlien from "./DokumenKlien"
import RiwayatPembayaranAktivitasDokumen from "./RiwayatPembayaranAktivitasDokumen"
import RiwayatAktivitasDokumen from "./RiwayatAktivitasDokumen"
import { parseToRupiahText } from "../../../helper/number.helper"
import { formatDate, getHariTanggalFull } from "../../../helper/date.helper"
import { getCookie } from "../../../helper/cookies.helper"
import PDFHeader from "../../../component/general/PDFHeader"

export const DetailDokumenPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <PDFHeader
                bulan={props.bulan}
                tahun={props.tahun}
                title={"Aktivitas Dokumen"}
            />
            <div className="bg-white py-5 rounded-md">
                <div className="flex justify-between items-center">
                    <p className="text-md">Tanggal {formatDate(props?.data?.tanggal)} | {props?.data?.penanggung_jawab_name}</p>
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

                <div className="flex justify-between border-y-2 py-5 mt-5">
                    <div className="flex flex-col">
                        <p className="text-xl font-bold">{props.data.klien}</p>
                        <div className="flex flex-col gap-x-3 mt-2">
                            <div className="flex gap-x-2">
                                <p className="text-sm font-bold">Nomor HP : </p>
                                <p className="text-sm">{props.data.nomor_hp_klien}</p>
                            </div>
                            <div className="flex gap-x-2">
                                <p className="text-sm font-bold">Email : </p>
                                <p className="text-sm">{props.data.email_klien}</p>
                            </div>
                            <div className="flex gap-x-2">
                                <p className="text-sm font-bold">Alamat : </p>
                                <p className="text-sm">{props.data.alamat_klien}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-x-2 bg-gray-500 text-white font-bold rounded-lg w-max h-max">
                            <p className="text-md w-max pl-2">{props.data.tipe_dokumen}</p>
                            <p className={`text-md w-max border-l-2 px-2 border-white ${props.data.jenis_dokumen == "EMPTY" ? "" : "border-r-2"}`}>{props.data.kategori_dokumen}</p>
                            {
                                props.data.jenis_dokumen != "EMPTY" ? <>
                                    <p className="text-md w-max pr-2">{props.data.jenis_dokumen}</p>
                                </> : <></>
                            }
                        </div>
                    </div>
                </div>

                <div className="border-b-2 py-5 mb-3">
                    <p className="text-sm font-bold">Keterangan</p>
                    <p className="text-sm mt-1">{props.data.keterangan}</p>
                </div>

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
            <div className="page-break">
                <div className="flex justify-between">
                    <h1 className="font-bold mb-10">Penyerahan Dokumen Pada Tanggal : </h1>
                    <h1>_____________________________________</h1>
                </div>
                <div className="flex justify-between">
                    <div className="flex flex-1 flex-col font-bold">
                        <p>Diserahkan Oleh</p>
                        <p className="mt-20">_________________________________________________</p>
                    </div>
                    <div className="flex flex-1 flex-col items-start justify-start font-bold">
                        <p>Diterima Oleh</p>
                        <p className="mt-20">_________________________________________________</p>
                    </div>
                </div>
                <div className="flex justify-between gap-x-2 mt-10">
                    <div className="flex flex-1 flex-col items-start justify-start font-bold">
                        <p>Disetujui Oleh</p>
                        <p className="mt-20">_________________________________________________</p>
                    </div>
                </div>
                <div className="flex justify-between gap-x-2 mt-10">
                    <div className="flex flex-1 flex-col items-start justify-start font-bold">
                        <p>Kontak Penerima Berkas</p>
                        <p className="mt-5">_________________________________________________</p>
                    </div>
                </div>
                <div className="mt-6 pb-[80vh] border border-black pt-2 px-2 mb-20">
                    <p>Catatan : </p>
                </div>
            </div>
        </div>
    )
})