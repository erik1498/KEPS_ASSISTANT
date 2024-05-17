import React from "react";
import JurnalUmumRow from "./JurnalUmumRow";

export const JurnalUmumPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            {
                props.data.map((item, i) => {
                    return <JurnalUmumRow
                        deleteByBuktiTransaksi={() => { }}
                        deleteItem={() => { }}
                        editItem={() => { }}
                        item={item}
                        key={i}
                        balanceStatus={() => { }}
                        forPrint={true}
                    />
                })
            }
        </div>
    );
});