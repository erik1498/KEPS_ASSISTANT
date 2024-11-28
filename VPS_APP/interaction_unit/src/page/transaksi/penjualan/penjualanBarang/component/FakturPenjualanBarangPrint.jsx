import React, { useEffect, useState } from "react";
import PDFHeader from "../../../../../component/general/PDFHeader";
import { keTerbilang, parseToRupiahText } from "../../../../../helper/number.helper";
import { formatDate } from "../../../../../helper/date.helper";

export const FakturPenjualanBarangPrint = React.forwardRef((props, ref) => {
    const [total, setTotal] = useState(0)

    useEffect(() => {
        if (props.rincianPesananPenjualanBarang) {
            const total = props.rincianPesananPenjualanBarang.reduce((p, c) => {
                return p + c.total_harga
            }, 0)
            setTotal(x => x = total)
        }
    }, [])
    return (
        <div
            ref={ref}
        >
            <PDFHeader
                bulan={props.bulan}
                tahun={props.tahun}
                title={"INVOICE"}
            />
            <div className="flex justify-between">
                <div>
                    <p className="font-bold">KEPADA :</p>
                    <p>{props.customer.name}</p>
                    <p>{props.customer.code}</p>
                    <p>HP. {props.customer.no_hp}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold">TANGGAL :</p>
                    <p>{formatDate(props.tanggalFakturPenjualanBarang)}</p>
                </div>
            </div>
            <div className="flex justify-between">
                <div className="mt-6">
                    <p className="font-bold">NO FAKTUR PENJUALAN BARANG :</p>
                    <p>{props.nomorFakturPenjualanBarang}</p>
                </div>
                <div className="text-right">
                    <div className="mt-6">
                        <p className="font-bold">NO PESANAN PENJUALAN BARANG :</p>
                        <p>{props.pesananPenjualanBarang.nomor_pesanan_penjualan_barang}</p>
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-12 text-sm gap-x-2 py-2 font-bold border-t-2 px-6">
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
                props.rincianPesananPenjualanBarang.map((x, i) => {
                    return <>
                        <div className="py-3  border-t-2">
                            <div className="grid grid-cols-12 gap-x-2 px-6 py-3 items-start font-bold">
                                <div className="col-span-1">
                                    <p className="text-sm">{i + 1}.</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm">{x.kategori_harga_barang_kode_barang}</p>
                                    <p className="text-sm my-1">{x.daftar_gudang_name}</p>
                                </div>
                                <div className="col-span-3">
                                    <p className="text-sm">{x.daftar_barang_name}</p>
                                </div>
                                <div className="col-span-3">
                                    <p className="text-sm">{x.satuan_barang_name}</p>
                                </div>
                                <div className="col-span-3">
                                    <p className="text-sm">Rp. {parseToRupiahText(x.harga)}</p>
                                    <p className="text-sm">PPN : Rp. {parseToRupiahText(x.ppn)}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-12 text-sm gap-x-2 px-6 font-bold">
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
            <div className="grid grid-cols-12 gap-x-2 px-6 pt-5 items-start font-bold border-t-2">
                <div className="col-span-9">
                    <p>PEMBAYARAN</p>
                </div>
                <div className="col-span-3">
                    <p>TOTAL <br /> Rp. {parseToRupiahText(total)}</p>
                </div>
            </div>
            <div className="px-6 pb-5">
                <p className="font-bold mt-5">TERBILANG</p>
                <p className="font-normal">{keTerbilang(total).toString().toUpperCase()} RUPIAH</p>
            </div>
            <div className="grid grid-cols-12 gap-x-2 px-6 pt-5 items-start font-bold">
                <div className="col-span-3">
                    <p>TIPE PEMBAYARAN</p>
                </div>
                <div className="col-span-8">
                    <p>: &nbsp;&nbsp;{props.tipePembayaran}</p>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-x-2 px-6 pb-5 items-start font-bold">
                <div className="col-span-3">
                    <p>SYARAT PEMBAYARAN</p>
                </div>
                <div className="col-span-8">
                    <p>: &nbsp;&nbsp;{props.syaratPembayaran}</p>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-x-2 px-6 py-5 items-start font-bold">
                <div className="col-span-12">
                    <p className="mb-2">KETERANGAN</p>
                    <p className="font-normal">{props.keteranganFakturPenjualanBarang}</p>
                </div>
            </div>
        </div>
    );
});