import React from "react";
import PDFHeader from "../../../../component/general/PDFHeader";

export const KodeAkunPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <PDFHeader
                bulan={props.bulan}
                tahun={props.tahun}
                title={"Kode Akun"}
            />
            <table className="table">
                <thead>
                    <tr className="sticky top-0 bg-white py-4 text-black">
                        <th width={12}>No</th>
                        <th>Kode Akun</th>
                        <th>Tipe Akun</th>
                        <th>Nama Akun</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props?.data?.map((item, i) => {
                            return <>
                                {
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{item.code}</td>
                                        <td>{item.type}</td>
                                        <td>{item.name}</td>
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