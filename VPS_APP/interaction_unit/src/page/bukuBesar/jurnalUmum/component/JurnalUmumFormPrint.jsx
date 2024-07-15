import React from "react";
import { parseToRupiahText } from "../../../../helper/number.helper";
import { convertTo12HoursFormat } from "../../../../helper/date.helper";

export const JurnalUmumFormPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <div className="px-3">
                <h1 className="text-6xl font-bold mb-3">Form Jurnal Umum</h1>
                <h1 className="text-2xl font-bold">Tanggal : {props.tanggal}</h1>
                <h1 className="text-2xl font-bold mb-20">Bukti Transaksi : {props.buktiTransaksi}</h1>
                {
                    props.data.map((item, idx) => {
                        return <>
                            <p className="text-2xl font-bold">Transaksi {idx + 1}</p>
                            <div className="grid w-full grid-cols-12 gap-x-2 border-b-2">
                                <div className="col-span-1">
                                    <label className="form-control w-full max-w-xs bg-white">
                                        <div className="label">
                                            <span className="label-text text-gray-600">Waktu</span>
                                        </div>
                                    </label>
                                </div>
                                <div className="col-span-2">
                                    <label className="form-control w-full max-w-xs bg-white">
                                        <div className="label">
                                            <span className="label-text text-gray-600">Kode Akun</span>
                                        </div>
                                    </label>
                                </div>
                                <div className="col-span-5">
                                    <label className="form-control w-full max-w-xs bg-white">
                                        <div className="label">
                                            <span className="label-text text-gray-600">Uraian</span>
                                        </div>
                                    </label>
                                </div>
                                <div className="col-span-2">
                                    <label className="form-control w-full max-w-xs bg-white">
                                        <div className="label">
                                            <span className="label-text text-gray-600">Debet</span>
                                        </div>
                                    </label>
                                </div>
                                <div className="col-span-2">
                                    <label className="form-control w-full max-w-xs bg-white">
                                        <div className="label">
                                            <span className="label-text text-gray-600">Kredit</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            {
                                item.map(x => {
                                    return <>
                                        <div className="grid w-full grid-cols-12 gap-x-2 border-b-2">
                                            <div className="mt-5 col-span-1">
                                                <p>{convertTo12HoursFormat(x.waktu)}</p>
                                            </div>
                                            <div className="mt-5 col-span-2">
                                                <p>{x.kodeAkun.label}</p>
                                            </div>
                                            <div className="mt-5 col-span-5">
                                                <p>{x.uraian}</p>
                                            </div>
                                            <div className="mt-5 col-span-2">
                                                <p>{parseToRupiahText(x.debet)}</p>
                                            </div>
                                            <div className="mt-5 col-span-2">
                                                <p>{parseToRupiahText(x.kredit)}</p>
                                            </div>
                                        </div>
                                    </>
                                })
                            }

                            <div className="grid w-full grid-cols-12 gap-x-2 items-end">
                                <div className="mt-5 col-span-8">
                                    <h1 className={`text-md ${props.totalDebetKredit.totalDebet[idx] == props.totalDebetKredit.totalKredit[idx] ? `text-green-600` : `text-red-600`} font-bold mt-1`}>{props.totalDebetKredit.totalDebet[idx] == props.totalDebetKredit.totalKredit[idx] ? `Seimbang` : `Tidak Seimbang`}</h1>
                                </div>
                                <div className="mt-5 col-span-2 font-bold">
                                    <p>{parseToRupiahText(props.totalDebetKredit.totalDebet[idx])}</p>
                                </div>
                                <div className="mt-5 col-span-2 font-bold">
                                    <p>{parseToRupiahText(props.totalDebetKredit.totalKredit[idx])}</p>
                                </div>
                            </div>
                        </>
                    })
                }
            </div >
        </div >
    );
});