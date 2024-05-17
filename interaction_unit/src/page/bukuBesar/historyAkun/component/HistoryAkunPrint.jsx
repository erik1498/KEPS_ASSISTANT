import React from "react";
import HistoryAkunRow from "./HistoryAkunRow";

export const HistoryAkunPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            {
                props.data.map((item, i) => {
                    return <HistoryAkunRow item={item} balanceStatus={props.balanceStatus} key={i} />
                })
            }
        </div>
    );
});