import React from "react";
import RowCard from "../../../../component/card/RowCard";
import { getNormalizedLabaKotorRugiKotor } from "../../../../helper/labaRugi.helper";
import { parseRupiahToFloat, parseToRupiahText } from "../../../../helper/number.helper";
import LabaRugiGain from "./LabaRugiGain";
import { formatDate, getHariTanggalFull } from "../../../../helper/date.helper";

export const LabaRugiPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <div className="px-3 mb-4">
                <h1 className="text-2xl font-bold">{props.bulan} {props.tahun}</h1>
                <h1 className="text-6xl font-bold">Laba Rugi</h1>
                <p className="mb-5">Waktu Cetak - {formatDate(getHariTanggalFull())}</p>
            </div>
            <LabaRugiGain
                labaRugi={props.labaRugi}
                forPrint={true}
            />
            {
                Object.keys(props.data).length > 0 ?
                    <>
                        <RowCard
                            dataList={props.data.pendapatan}
                            title={"Pendapatan"}
                            totalTitle={"Total Pendapatan"}
                            forPrint={true}
                        />
                        <RowCard
                            dataList={props.data.harga_pokok_penjualan}
                            title={"Harga Pokok Penjualan"}
                            totalTitle={"Total Harga Pokok Penjualan"}
                            addingContent={{
                                title: getNormalizedLabaKotorRugiKotor(props.data.laba_rugi.laba_kotor),
                                value: parseToRupiahText(parseRupiahToFloat(props.data.laba_rugi.laba_kotor))
                            }}
                            forPrint={true}
                        />
                        <RowCard
                            dataList={props.data.beban_operasional}
                            title={"Beban Operasional"}
                            totalTitle={"Total Beban Operasional"}
                            forPrint={true}
                        />
                        <RowCard
                            dataList={props.data.beban_lainnya}
                            title={"Beban Lainnya"}
                            totalTitle={"Total Beban Lainnya"}
                            forPrint={true}
                        />
                        <RowCard
                            dataList={props.data.pendapatanLainLain}
                            title={"Pendapatan Lain - Lain"}
                            totalTitle={"Total Pendapatan Lain - Lain"}
                            forPrint={true}
                        />
                    </>
                    :
                    <></>
            }
        </div>
    );
});