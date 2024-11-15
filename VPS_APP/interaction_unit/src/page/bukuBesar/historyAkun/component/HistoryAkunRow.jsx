import { parseToRupiahText } from "../../../../helper/number.helper";
import { convertTo12HoursFormat } from "../../../../helper/date.helper";
import { PAYROLLPENDAPATANPOTONGANSUMBERLIST, PERINTAHSTOKOPNAMESUMBERLIST } from "../../../../config/objectList.config";
import PerintahStokOpnameUraian from "./PerintahStokOpnameUraian";
import PayrollPendapatanPotonganUraian from "./PayrollPendapatanPotonganUraian";

const HistoryAkunRow = ({
    item,
    balanceStatus = true,
    forPrint
}) => {
    return <div className={`flex flex-col w-full bg-white text-[13px] ${forPrint ? '' : 'px-3 shadow-md'}`}>
        <div className="grid grid-cols-12 sticky top-0 bg-white py-2 border-b-2">
            <div className="p-2 col-span-12 text-black flex items-end">
                <div className="text-[28px] font-bold">
                    <p className={`text-[45px] -ml-1 text-white px-2 rounded-md bg-blue-900`}>{item.tanggal}</p>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-end">
                        <div className="text-gray-900 flex flex-col justify-end px-2">
                            <h1>{item.bulan}.{item.tahun}</h1>
                            <h2 className="text-[13px] font-bold">{item.hari}</h2>
                        </div>
                        {
                            balanceStatus ?
                                <div className="flex flex-col px-2 border-l-2 border-gray-600">
                                    <h1 className="font-bold">Total</h1>
                                    <div className="flex gap-x-4">
                                        <div className="text-right text-gray-900">
                                            <h1 className=" text-green-900 font-bold flex flex-row">{parseToRupiahText(item.total.debet)}</h1>
                                        </div>
                                        <div className="text-right text-gray-900">
                                            <h1 className=" text-red-900 font-bold">{parseToRupiahText(item.total.kredit)}</h1>
                                        </div>
                                    </div>
                                </div>
                                : <></>
                        }
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-12 col-span-12 items-end pt-1 font-bold">
                <div className="col-span-1 text-gray-900 flex flex-col px-2">
                    <p>Waktu</p>
                </div>
                <div className="col-span-3 text-gray-900 flex flex-col px-2">
                    <p>Uraian</p>
                </div>
                <div className="text-right px-2 col-span-2 text-gray-900">
                    <h1>Debet</h1>
                </div>
                <div className="text-right px-2 col-span-2 text-gray-900">
                    <h1>Kredit</h1>
                </div>
                <div className="text-right px-2 col-span-2 text-gray-900">
                    <h1>Saldo Debet</h1>
                </div>
                <div className="text-right px-2 col-span-2 text-gray-900">
                    <h1>Saldo Kredit</h1>
                </div>
            </div>
        </div>

        {
            item.dataList.map((item1, i) => {
                return <>
                    {
                        item1.debet == "0.00" && item1.kredit == "0.00" ? <></> : <>
                            {
                                i > 0 ? <hr /> : <></>
                            }
                            {
                                i <= item.dataList.length ?
                                    <div className="grid grid-cols-12 items-start py-1">
                                        <div className="col-span-1 px-2 text-black">
                                            {convertTo12HoursFormat(item1.waktu)}
                                        </div>
                                        <div className="col-span-3 text-gray-900 flex flex-col px-2">
                                            {
                                                !PERINTAHSTOKOPNAMESUMBERLIST.includes(item1.sumber) ? <>
                                                    {
                                                        !PAYROLLPENDAPATANPOTONGANSUMBERLIST.includes(item1.sumber) ? <p>{item1.uraian}</p> : <PayrollPendapatanPotonganUraian item={item1} />
                                                    }
                                                </> : <PerintahStokOpnameUraian item={item1} />
                                            }
                                        </div>
                                        <div className="text-right px-2 col-span-2 text-gray-900">
                                            {
                                                item1.debet != "0" ? <h1 className=" text-green-900 font-bold">{parseToRupiahText(parseFloat(item1.debet).toFixed(2))}</h1> : <></>
                                            }
                                        </div>
                                        <div className="text-right px-2 col-span-2 text-gray-900">
                                            {
                                                item1.kredit != "0" ? <h1 className=" text-red-900 font-bold">{parseToRupiahText(parseFloat(item1.kredit).toFixed(2))}</h1> : <></>
                                            }
                                        </div>
                                        <div className="text-right px-2 col-span-2 text-gray-900">
                                            <h1 className=" text-green-900 font-bold">{parseToRupiahText(item1.saldoDebet)}</h1>
                                        </div>
                                        <div className="text-right px-2 col-span-2 text-gray-900">
                                            <h1 className=" text-red-900 font-bold">{parseToRupiahText(item1.saldoKredit)}</h1>
                                        </div>
                                    </div> : <></>
                            }
                        </>
                    }
                </>
            })
        }

    </div>
};

export default HistoryAkunRow;
