import React from "react";
import { formatDate, getHariTanggalFull } from "../../../../../helper/date.helper";

export const DaftarGudangPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <div className="px-3 mb-4">
                <h1 className="text-6xl font-bold">Daftar Gudang</h1>
                <p className="mb-5">Waktu Cetak - {formatDate(getHariTanggalFull())}</p>
            </div>
            <table className="table">
                <thead>
                    <tr className="sticky top-0 bg-white py-4 text-black">
                        <th width={12}>No</th>
                        <th>Nama Daftar Gudang</th>
                        <th>Kode Daftar Gudang</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props?.data?.map((item, i) => {
                            return <>
                                {
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.code}</td>
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