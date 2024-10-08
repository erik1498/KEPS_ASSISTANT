import React from "react";
import HistoryAkunRow from "./HistoryAkunRow";
import PDFHeader from "../../../../component/general/PDFHeader";

export const HistoryAkunPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <PDFHeader
                bulan={props.bulan}
                tahun={props.tahun}
                title={"History Akun"}
            />
            <h1 className="text-4xl font-bold mt-5">{props.kode_akun_perkiraan}</h1>
            {
                props.data.map((item, i) => {
                    return <HistoryAkunRow
                        item={item}
                        balanceStatus={props.balanceStatus}
                        key={i}
                        forPrint={true}
                    />
                })
            }
        </div>
    );
});