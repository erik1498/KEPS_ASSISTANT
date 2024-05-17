import React from "react";
import PerubahanModalRow from "./PerubahanModalRow";

export const PerubahanModalPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            {
                props.data.map((item) => {
                    return <PerubahanModalRow
                        dataList={item}
                        title={item.bulan}
                        totalTitle={"Total Ekuitas"}
                    />
                })
            }
        </div>
    );
});