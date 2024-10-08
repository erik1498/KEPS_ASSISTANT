import React from "react";
import RowCard from "../../../../component/card/RowCard";
import AktivaPasivaStatusCard from "../../../../component/card/AktivaPasivaStatusCard";
import PDFHeader from "../../../../component/general/PDFHeader";

export const NeracaPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <PDFHeader
                bulan={props.bulan}
                tahun={props.tahun}
                title={"Neraca"}
            />
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