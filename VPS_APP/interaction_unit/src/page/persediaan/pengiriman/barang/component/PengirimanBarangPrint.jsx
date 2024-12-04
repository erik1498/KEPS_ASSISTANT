import React, { useEffect, useState } from "react";
import PDFHeader from "../../../../../component/general/PDFHeader";
import { parseToRupiahText } from "../../../../../helper/number.helper";
import { formatDate } from "../../../../../helper/date.helper";

export const PengirimanBarangPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <PDFHeader
                bulan={props?.bulan}
                tahun={props?.tahun}
                title={"Surat Jalan"}
                useTime={false}
            />
            <div className="flex justify-between">
                <div>
                    <p className="font-bold">KEPADA :</p>
                    <p>{props?.pengirimanBarangEdit?.customer_name}</p>
                    <p>{props?.pengirimanBarangEdit?.customer_code}</p>
                    <p className="my-4">Alamat:
                        <br />
                        {props?.pengirimanBarangEdit?.customer_alamat_kantor}</p>
                    <p className="mb-4">HP: <br />
                        {props?.pengirimanBarangEdit?.customer_no_hp}
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-bold">TANGGAL :</p>
                    <p>{formatDate(props?.pengirimanBarangEdit?.tanggal)}</p>
                </div>
            </div>
            <div className="flex justify-between">
                <div className="mt-6">
                    <p className="font-bold">NO FAKTUR PENJUALAN BARANG :</p>
                    <p>{props?.fakturPenjualanBarang?.at(0)?.nomor_faktur_penjualan_barang}</p>
                </div>
                <div className="text-right">
                    <div className="mt-6">
                        <p className="font-bold">NO PESANAN PENJUALAN BARANG :</p>
                        <p>{props?.pengirimanBarangEdit?.nomor_pesanan_penjualan_barang}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between">
                <div className="mt-6">
                    <p className="font-bold">NO SURAT JALAN :</p>
                    <p>{props?.pengirimanBarangEdit?.nomor_surat_jalan}</p>
                </div>
            </div>
            <p className="pt-5">
                Dikirimkan barang-barang sebagai berikut :
            </p>
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
                <div className="col-span-2">
                    <p>Satuan Barang</p>
                </div>
                <div className="col-span-2">
                    <p>Jumlah Beli</p>
                </div>
                <div className="col-span-2">
                    <p>Jumlah Pengiriman</p>
                </div>
            </div>
            {
                props?.pengirimanBarangList?.map((x, i) => {
                    return <>
                        <div className="py-3  border-y-2">
                            <div className="grid grid-cols-12 gap-x-2 py-3 items-start font-bold">
                                <div className="col-span-1">
                                    <p className="text-sm">{i + 1}.</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm">{x?.kategori_harga_barang_kode_barang}</p>
                                    <p className="text-xs font-normal">{x?.daftar_gudang_name}</p>
                                </div>
                                <div className="col-span-3">
                                    <p className="text-sm">{x?.daftar_barang_name}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm">{x?.satuan_barang_name}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm">{parseToRupiahText(x?.jumlah)}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm">{parseToRupiahText(x?.pengiriman)}</p>
                                </div>
                            </div>
                            <p className="font-normal text-xs pb-16">Keterangan</p>
                        </div>
                    </>
                })
            }
            <div className="grid grid-cols-12 py-5 gap-5 items-start font-bold">
                {
                    props.gudangList.map(x => {
                        return <>
                            <div className="col-span-4 border-b-2 border-black">
                                <p className="mb-20">Pihak {x}</p>
                                <p>&nbsp;</p>
                            </div>
                        </>
                    })
                }
                <div className="col-span-4 border-b-2 border-black">
                    <p className="mb-20">Penanggung Jawab</p>
                    <p className="font-normal">{props?.pengirimanBarangEdit?.pegawai_penanggung_jawab_name}</p>
                </div>
                <div className="col-span-4 border-b-2 border-black">
                    <p className="mb-20">Pelaksana</p>
                    <p className="font-normal">{props?.pengirimanBarangEdit?.pegawai_pelaksana_name}</p>
                </div>
                <div className="col-span-4 border-b-2 border-black">
                    <p className="mb-20">Diterima Oleh</p>
                    <p>&nbsp;</p>
                </div>
            </div>
        </div>
    );
});