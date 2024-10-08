import React from "react";
import NeracaSaldoRow from "./NeracaSaldoRow";
import DebetKreditStatusCard from "../../../../component/card/DebetKreditStatusCard";
import PDFHeader from "../../../../component/general/PDFHeader";

export const NeracaSaldoPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            <PDFHeader
                bulan={props.bulan}
                tahun={props.tahun}
                title={"Neraca Saldo"}
            />
            <DebetKreditStatusCard
                debet={props.debet}
                kredit={props.kredit}
                forPrint={true}
            />
            {
                props.data.length > 0 ? <div className="flex flex-col w-full bg-white text-[13px] pb-3">
                    {
                        props.data.length > 0 ? <div className="grid grid-cols-12 bg-white col-span-12 items-end py-3 sticky top-0">
                            <div className="col-span-4 text-gray-900 font-bold flex flex-col px-2">
                                <h1 className="text-md">Kode Akun Perkiraan</h1>
                            </div>
                            <div className="px-2 col-span-4 text-gray-900 font-bold">
                                <h1 className="text-md">Debet</h1>
                            </div>
                            <div className="px-2 col-span-4 text-gray-900 font-bold">
                                <h1 className="text-md">Kredit</h1>
                            </div>
                        </div> : <></>
                    }
                    {
                        props.data.length > 0 ? props.data.map((item, i) => {
                            return <NeracaSaldoRow item={item} />
                        }) : <></>
                    }
                </div> : <></>
            }
        </div>
    );
});