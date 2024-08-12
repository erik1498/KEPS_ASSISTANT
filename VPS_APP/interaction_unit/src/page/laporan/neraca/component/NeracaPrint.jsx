import React from "react";
import RowCard from "../../../../component/card/RowCard";
import AktivaPasivaStatusCard from "../../../../component/card/AktivaPasivaStatusCard";
import { formatDate, getHariTanggalFull } from "../../../../helper/date.helper";

export const NeracaPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <div className="px-3 mb-4">
                <h1 className="text-2xl font-bold">{props.bulan} {props.tahun}</h1>
                <h1 className="text-6xl font-bold">Neraca</h1>
                <p className="mb-5">Waktu Cetak - {formatDate(getHariTanggalFull())}</p>
            </div>
            <AktivaPasivaStatusCard
                aktiva={props?.data?.neraca?.aktiva}
                pasiva={props?.data?.neraca?.pasiva}
                forPrint={true}
            />
            {
                Object.keys(props.data).length > 0 ?
                    <>
                        <RowCard
                            dataList={props.data.harta}
                            title={"Aset"}
                            totalTitle={"Total Asset"}
                            forPrint={true}
                        />
                        <RowCard
                            dataList={props.data.utang}
                            title={"Kewajiban"}
                            totalTitle={"Total Kewajiban"}
                            forPrint={true}
                        />
                        <RowCard
                            dataList={props.data.modal}
                            title={"Ekuitas"}
                            totalTitle={"Total Ekuitas"}
                            forPrint={true}
                        />
                    </>
                    :
                    <></>
            }
        </div>
    );
});