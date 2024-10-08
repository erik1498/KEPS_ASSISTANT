import React from "react";
import PDFHeader from "../../../../../component/general/PDFHeader";

export const JenisPenjualanBarangPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <PDFHeader
                bulan={props.bulan}
                tahun={props.tahun}
                title={"Jenis Penjualan Barang"}
            />
            <table className="table">
                <thead>
                    <tr className="sticky top-0 bg-white py-4 text-black">
                        <th width={12}>No</th>
                        <th>Nama Jenis Penjualan Barang</th>
                        <th>Kode Jenis Penjualan Barang</th>
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