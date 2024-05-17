import React from "react";
import RowCard from "../../../../component/card/RowCard";
import { getNormalizedLabaKotorRugiKotor } from "../../../../helper/labaRugi.helper";
import { parseRupiahToFloat, parseToRupiahText } from "../../../../helper/number.helper";

export const LabaRugiPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            {
                Object.keys(props.data).length > 0 ?
                    <>
                        <RowCard
                            dataList={props.data.pendapatan}
                            title={"Pendapatan"}
                            totalTitle={"Total Pendapatan"}
                        />
                        <RowCard
                            dataList={props.data.harga_pokok_penjualan}
                            title={"Harga Pokok Penjualan"}
                            totalTitle={"Total Harga Pokok Penjualan"}
                            addingContent={{
                                title: getNormalizedLabaKotorRugiKotor(props.data.laba_rugi.laba_kotor),
                                value: parseToRupiahText(parseRupiahToFloat(props.data.laba_rugi.laba_kotor))
                            }}
                        />
                        <RowCard
                            dataList={props.data.beban_operasional}
                            title={"Beban Operasional"}
                            totalTitle={"Total Beban Operasional"}
                        />
                        <RowCard
                            dataList={props.data.beban_lainnya}
                            title={"Beban Lainnya"}
                            totalTitle={"Total Beban Lainnya"}
                        />
                        <RowCard
                            dataList={props.data.pendapatanLainLain}
                            title={"Pendapatan Lain - Lain"}
                            totalTitle={"Total Pendapatan Lain - Lain"}
                        />
                    </>
                    :
                    <></>
            }
        </div>
    );
});