import React from "react";
import PerubahanModalRow from "./PerubahanModalRow";
import PDFHeader from "../../../../component/general/PDFHeader";

export const PerubahanModalPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <PDFHeader
                bulan={props.bulan}
                tahun={props.tahun}
                title={"Perubahan Modal"}
            />
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