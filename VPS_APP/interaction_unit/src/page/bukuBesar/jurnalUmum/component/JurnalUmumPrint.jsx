import React from "react";
import JurnalUmumRow from "./JurnalUmumRow";
import DebetKreditStatusCard from "../../../../component/card/DebetKreditStatusCard";
import { formatDate, getHariTanggalFull } from "../../../../helper/date.helper";

export const JurnalUmumPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <div className="px-3">
                <h1 className="text-2xl font-bold">{props.bulan} {props.tahun}</h1>
                <h1 className="text-6xl font-bold">Jurnal Umum</h1>
                <p className="mb-5">Waktu Cetak - {formatDate(getHariTanggalFull())}</p>
            </div>
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