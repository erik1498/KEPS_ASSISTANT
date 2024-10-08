import React from "react";
import JurnalUmumRow from "./JurnalUmumRow";
import DebetKreditStatusCard from "../../../../component/card/DebetKreditStatusCard";
import PDFHeader from "../../../../component/general/PDFHeader";

export const JurnalUmumPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <PDFHeader
                bulan={props.bulan}
                tahun={props.tahun}
                title={"Jurnal Umum"}
            />
            <DebetKreditStatusCard
                debet={props.debet}
                kredit={props.kredit}
                forPrint={true}
            />
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