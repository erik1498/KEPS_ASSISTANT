import React, { useEffect, useState } from "react";
import PDFHeader from "../../../../../component/general/PDFHeader";
import { keTerbilang, parseToRupiahText } from "../../../../../helper/number.helper";
import { formatDate } from "../../../../../helper/date.helper";

export const PesananPembelianBarangPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <PDFHeader
                bulan={props.bulan}
                tahun={props.tahun}
                title={"PESANAN PEMBELIAN BARANG"}
            />
            <div className="flex justify-between">
                <div>
                    <p className="font-bold">KEPADA :</p>
                    <p>{props.supplier.name}</p>
                    <p>{props.supplier.code}</p>
                    <p>HP. {props.supplier.no_hp}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold">TANGGAL :</p>
                    <p>{formatDate(props.tanggalPesananPembelianBarang)}</p>
                </div>
            </div>
            <div className="flex justify-between">
                <div className="mt-6">
                    <p className="font-bold">NO PESANAN PEMBELIAN BARANG :</p>
                    <p>{props.nomorPesananPembelianBarang}</p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-12 text-sm gap-x-2 py-2 font-bold border-t-2">
                <div className="col-span-1">
                    <p>No.</p>
                </div>
                <div className="col-span-2">
                    <p>Kode Barang</p>
                </div>
                <div className="col-span-3">
                    <p>Nama Barang</p>
                </div>
                <div className="col-span-3">
                    <p>Satuan Barang</p>
                </div>
                <div className="col-span-3">
                    <p>Harga Barang</p>
                </div>
            </div>
            {
                props.rincianPesananPembelianBarang.map((x, i) => {
                    return <>
                        <div className="py-3  border-t-2">
                            <div className="grid grid-cols-12 gap-x-2 py-3 items-start font-bold">
                                <div className="col-span-1">
                                    <p className="text-sm">{i + 1}.</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm">{x.kategori_harga_Barang_kode_Barang}</p>
                                    <p className="text-sm my-1">{x.daftar_gudang_name}</p>
                                </div>
                                <div className="col-span-3">
                                    <p className="text-sm">{x.daftar_Barang_name}</p>
                                </div>
                                <div className="col-span-3">
                                    <p className="text-sm">{x.satuan_Barang_name}</p>
                                </div>
                                <div className="col-span-3">
                                    <p className="text-sm">Rp. {parseToRupiahText(x.harga)}</p>
                                    <p className="text-sm">PPN : Rp. {parseToRupiahText(x.ppn)}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-12 text-sm gap-x-2 font-bold">
                                <div className="col-span-1">
                                </div>
                                <div className="col-span-2">
                                    <p>Jumlah : {parseToRupiahText(x.jumlah)}</p>
                                </div>
                                <div className="col-span-3">
                                    {
                                        x.diskon_angka > 0 ? <>
                                            <p>Diskon</p>
                                            <p>Harga Diskon</p>
                                            <p>PPN Diskon</p>
                                        </> : <></>
                                    }
                                </div>
                                <div className="col-span-3">
                                    {
                                        x.diskon_angka > 0 ? <>
                                            <p>Rp. {parseToRupiahText(x.diskon_angka)} ({x.diskon_persentase} % )</p>
                                            <p>Rp. {parseToRupiahText(x.harga_setelah_diskon)}</p>
                                            <p>Rp. {parseToRupiahText(x.ppn_setelah_diskon)}</p>
                                        </> : <></>
                                    }
                                </div>
                                <div className="col-span-3">
                                    Total Harga <p>Rp. {parseToRupiahText(x.total_harga)}</p>
                                </div>
                            </div>
                        </div>
                    </>
                })
            }
            <div className="grid grid-cols-12 gap-x-2 pt-5 items-start font-bold border-t-2">
                <div className="col-span-9">
                    <p>PEMBAYARAN</p>
                </div>
                <div className="col-span-3">
                    <p>TOTAL <br /> Rp. {parseToRupiahText(props.total)}</p>
                </div>
            </div>
            <div className="pb-5">
                <p className="font-bold mt-5">TERBILANG</p>
                <p className="font-normal">{keTerbilang(props.total).toString().toUpperCase()} RUPIAH</p>
            </div>
        </div>
    );
});