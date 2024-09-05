import React from "react";
import { formatDate, getHariTanggalFull } from "../../../../helper/date.helper";

export const SyaratPembayaranPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <div className="px-3 mb-4">
                <h1 className="text-6xl font-bold">Syarat Pembayaran</h1>
                <p className="mb-5">Waktu Cetak - {formatDate(getHariTanggalFull())}</p>
            </div>
            <table className="table">
                <thead>
                    <tr className="sticky top-0 bg-white py-4 text-black">
                        <th width={12}>No</th>
                        <th>Tipe Pembayaran</th>
                        <th>Nama Syarat Pembayaran</th>
                        <th>Hari Kadaluarsa</th>
                        <th>Denda</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props?.data?.map((item, i) => {
                            return <>
                                {
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{item.tipe_pembayaran_name}</td>
                                        <td>{item.name}</td>
                                        <td>{item.hari_kadaluarsa}</td>
                                        <td>{item.denda} %</td>
                                    </tr>
                                }
                            </>
                        })
                    }
                </tbody>
            </table>
        </div>
    );
});