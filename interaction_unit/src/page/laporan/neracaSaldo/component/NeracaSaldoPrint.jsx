import React from "react";
import NeracaSaldoRow from "./NeracaSaldoRow";

export const NeracaSaldoPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            {
                props.data.length > 0 ? <div className="flex flex-col w-full bg-white text-[13px] px-3 pb-3 shadow-md">
                    {
                        props.data.length > 0 ? <div className="grid grid-cols-12 bg-white col-span-12 items-end py-4 sticky top-0">
                            <div className="col-span-4 text-gray-900 font-bold flex flex-col px-2">
                                <h1 className="text-2xl">Kode Akun Perkiraan</h1>
                            </div>
                            <div className="px-2 col-span-4 text-gray-900 font-bold">
                                <h1 className="text-2xl">Debet</h1>
                            </div>
                            <div className="px-2 col-span-4 text-gray-900 font-bold">
                                <h1 className="text-2xl">Kredit</h1>
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