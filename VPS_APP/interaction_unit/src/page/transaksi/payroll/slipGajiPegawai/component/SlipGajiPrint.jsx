import React from "react";
import { formatDate, getHariTanggalFull } from "../../../../../helper/date.helper";
import PendapatanPegawai from "./PendapatanPegawai";
import PotonganPegawai from "./PotonganPegawai";
import { parseToRupiahText } from "../../../../../helper/number.helper";

export const SlipGajiPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <div className="px-3">
                <h1 className="text-2xl font-bold">{props.bulan} {props.tahun}</h1>
                <h1 className="text-6xl font-bold">Slip Gaji</h1>
                <p className="mb-5">Waktu Cetak - {formatDate(getHariTanggalFull())}</p>
            </div>
            <div className="px-3">
                <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Data Pegawai</h1>
                <div className="grid grid-cols-12 gap-x-4">
                    <div className="col-span-6">
                        <div className="grid grid-cols-12">
                            <p className="col-span-3">Nama</p>
                            <p className="col-span-9">:&nbsp;&nbsp;&nbsp;{props.pegawai.name}</p>
                        </div>
                        <div className="grid grid-cols-12">
                            <p className="col-span-3">Divisi</p>
                            <p className="col-span-9">:&nbsp;&nbsp;&nbsp;{props.pegawai.divisi_name}</p>
                        </div>
                        <div className="grid grid-cols-12">
                            <p className="col-span-3">Jabatan</p>
                            <p className="col-span-9">:&nbsp;&nbsp;&nbsp;{props.pegawai.jabatan_name}</p>
                        </div>
                    </div>
                    <div className="col-span-6">
                        <div className="grid grid-cols-12">
                            <p className="col-span-3">Alamat</p>
                            <p className="col-span-9">:&nbsp;&nbsp;&nbsp;{props.pegawai.alamat}</p>
                        </div>
                        <div className="grid grid-cols-12">
                            <p className="col-span-3">Handphone</p>
                            <p className="col-span-9">:&nbsp;&nbsp;&nbsp;{props.pegawai.no_hp}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-6 grid grid-cols-12 gap-x-4">
                <PendapatanPegawai
                    slipGaji={props.data}
                    _getDataBySumber={props._getDataBySumber}
                    total={props.total}
                    forPrint={true}
                />
                <PotonganPegawai
                    slipGaji={props.data}
                    _getDataBySumber={props._getDataBySumber}
                    total={props.total}
                    forPrint={true}
                />
            </div>
            <div className="flex justify-between text-2xl font-bold px-3 mt-3 border-t-2 border-gray-200 pt-3">
                <p>Total</p>
                <p>Rp. {parseToRupiahText(props.takeHomePay)}</p>
            </div>
        </div>
    );
});