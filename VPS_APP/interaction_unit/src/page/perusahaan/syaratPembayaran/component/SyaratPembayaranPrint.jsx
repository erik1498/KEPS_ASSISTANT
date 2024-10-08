import React from "react";
import PDFHeader from "../../../../component/general/PDFHeader";

export const SyaratPembayaranPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <PDFHeader
                bulan={props.bulan}
                tahun={props.tahun}
                title={"Syarat Pembayaran"}
            />
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