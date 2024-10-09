import React from "react";
import { getBulanByIndex } from "../../../../../helper/date.helper";
import PendapatanPegawai from "./PendapatanPegawai";
import PotonganPegawai from "./PotonganPegawai";
import { keTerbilang, parseToRupiahText } from "../../../../../helper/number.helper";
import PDFHeader from "../../../../../component/general/PDFHeader";

export const SlipGajiPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <PDFHeader
                bulan={props.bulan}
                tahun={props.tahun}
                title={"Slip Gaji Pegawai"}
            />
            <div className="mt-16 py-6 border-y-2 border-gray-200">
                <div className="grid grid-cols-12">
                    <p className="col-span-3">Nama</p>
                    <p className="col-span-9">:&nbsp;&nbsp;&nbsp;{props.pegawai.name}</p>
                </div>
                <div className="grid grid-cols-12">
                    <p className="col-span-3">NIK</p>
                    <p className="col-span-9">:&nbsp;&nbsp;&nbsp;{props.pegawai.nik}</p>
                </div>
                <div className="grid grid-cols-12">
                    <p className="col-span-3">Divisi</p>
                    <p className="col-span-9">:&nbsp;&nbsp;&nbsp;{props.pegawai.divisi_name}</p>
                </div>
                <div className="grid grid-cols-12">
                    <p className="col-span-3">Jabatan</p>
                    <p className="col-span-9">:&nbsp;&nbsp;&nbsp;{props.pegawai.jabatan_name}</p>
                </div>
                <div className="grid grid-cols-12">
                    <p className="col-span-3">Alamat</p>
                    <p className="col-span-9">:&nbsp;&nbsp;&nbsp;{props.pegawai.alamat}</p>
                </div>
                <div className="grid grid-cols-12">
                    <p className="col-span-3">Handphone</p>
                    <p className="col-span-9">:&nbsp;&nbsp;&nbsp;{props.pegawai.no_hp}</p>
                </div>
                <div className="grid grid-cols-12">
                    <p className="col-span-3">Periode</p>
                    <p className="col-span-9">:&nbsp;&nbsp;&nbsp;{getBulanByIndex(props.periode - 1)}</p>
                </div>
                <div className="grid grid-cols-12">
                    <p className="col-span-3">Status Tanggungan</p>
                    <p className="col-span-9">:&nbsp;&nbsp;&nbsp;{props.pegawai.status_tanggungan_name}</p>
                </div>
                <div className="grid grid-cols-12">
                    <p className="col-span-3">Status Kerja</p>
                    <p className="col-span-9">:&nbsp;&nbsp;&nbsp;{props.pegawai.status_kerja}</p>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-x-4">
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
            <div className="flex justify-between text-2xl font-bold border-y-2 border-gray-200 pt-4 py-2">
                <p>Jumlah Diterima</p>
                <p>Rp. {parseToRupiahText(props.takeHomePay)}</p>
            </div>
            <p className="text-right mt-5"><b>TERBILANG</b> : {keTerbilang(props.takeHomePay).toUpperCase()}</p>
        </div>
    );
});