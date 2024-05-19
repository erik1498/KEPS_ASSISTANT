import React from "react";
import PerubahanModalRow from "./PerubahanModalRow";

export const PerubahanModalPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <div className="px-3 mb-10">
                <h1 className="text-6xl font-bold">Perubahan Modal</h1>
                <h1 className="text-2xl font-bold">{props.tahun}</h1>
            </div>
            {
                props.data.map((item) => {
                    return <PerubahanModalRow
                        forPrint={true}
                        dataList={item}
                        title={item.bulan}
                        totalTitle={"Total Ekuitas"}
                    />
                })
            }
        </div>
    );
});