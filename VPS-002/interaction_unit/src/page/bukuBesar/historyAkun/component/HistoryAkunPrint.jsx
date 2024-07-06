import React from "react";
import HistoryAkunRow from "./HistoryAkunRow";

export const HistoryAkunPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <div className="px-3">
                <h1 className="text-2xl font-bold">{props.bulan} {props.tahun}</h1>
                <h1 className="text-6xl font-bold">History Akun</h1>
                <h1 className="text-4xl font-bold mt-5">{props.kode_akun_perkiraan}</h1>
            </div>
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