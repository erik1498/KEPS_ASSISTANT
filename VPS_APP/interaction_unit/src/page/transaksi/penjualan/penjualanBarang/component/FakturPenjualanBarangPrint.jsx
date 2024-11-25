import React from "react";
import PDFHeader from "../../../../../component/general/PDFHeader";
import { keTerbilang, parseToRupiahText } from "../../../../../helper/number.helper";

export const FakturPenjualanBarangPrint = React.forwardRef((props, ref) => {
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
                    <p>Customer 1</p>
                    <p>CS00001 | 081276391273</p>
                </div>
                <div className="text-right">
                    <p className="font-bold">TANGGAL :</p>
                    <p>Senin, 19 Agustus 2024</p>
                </div>
            </div>
            <div className="flex justify-between">
                <div className="mt-6">
                    <p className="font-bold">NO FAKTUR PENJUALAN BARANG :</p>
                    <p>1890309801297939</p>
                </div>
                <div className="text-right">
                    <div className="mt-6">
                        <p className="font-bold">NO PESANAN PENJUALAN BARANG :</p>
                        <p>1890309801297939</p>
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
                                    {
                                        x?.retur ? <>
                                            <p>Retur : {parseToRupiahText(x.retur)}</p>
                                        </> : <></>
                                    }
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
            <div className="grid grid-cols-12 gap-x-2 px-6 py-5 items-start font-bold border-t-2">
                <div className="col-span-9">
                    <p>PEMBAYARAN</p>
                    <p className="font-normal mt-5">TERBILANG</p>
                    <p>{keTerbilang(300000).toString().toUpperCase()} RUPIAH</p>
                </div>
                <div className="col-span-3">
                    <p>TOTAL <br /> Rp. {parseToRupiahText(300000)}</p>
                </div>
            </div><div className="grid grid-cols-12 gap-x-2 px-6 py-5 items-start font-bold">
                <div className="col-span-12">
                    <p className="mb-2">TIPE PEMBAYARAN : KREDIT</p>
                    <p className="font-normal">SYARAT PEMBAYARAN : PELUNASAN 30 HARI</p>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-x-2 px-6 py-5 items-start font-bold">
                <div className="col-span-12">
                    <p className="mb-2">KETERANGAN</p>
                    <p className="font-normal">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae consequatur sequi doloremque, aliquid tempora earum officiis quae quis ipsa saepe in quo fuga animi cum eum perspiciatis! Nemo, inventore doloribus.</p>
                </div>
            </div>
        </div>
    );
});