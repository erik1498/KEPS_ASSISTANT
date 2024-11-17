import { parseToRupiahText } from "../../../../../helper/number.helper";
import JurnalPenyusutanRowData from "./JurnalPenyusutanRowData";

const JurnalPenyusutanRow = ({
    item,
    balanceStatus = true,
    forPrint = false
}) => {
    return <div className={`flex flex-col w-full bg-white text-[13px] px-3 ${forPrint ? '' : 'shadow-md'}`}>
        <div className="grid grid-cols-12 sticky top-0 bg-white py-2 border-b-2">
            <div className="p-2 col-span-9 text-black flex items-end">
                <div className="text-[28px] font-bold">
                    {
                        balanceStatus ?
                            <p className={`text-[45px] -ml-1 text-white px-2 rounded-md ${item.total.debet == item.total.kredit ? "bg-green-900" : "bg-red-900"}`}>{item.tanggal < 10 ? `0${item.tanggal}` : item.tanggal}</p>
                            :
                            <p className={`text-[45px] -ml-1 text-white px-2 rounded-md bg-green-900`}>{item.tanggal < 10 ? `0${item.tanggal}` : item.tanggal}</p>
                    }
                </div>
                <div className="flex flex-col">
                    <div className="flex items-end">
                        <div className="text-gray-900 flex flex-col justify-end px-2">
                            <h1>{item.bulan}.{item.tahun}</h1>
                            <h2 className="text-[13px] font-bold">{item.hari}</h2>
                        </div>
                        <div className="flex flex-col px-2 border-l-2 border-gray-600">
                            <h1 className="font-bold">Total</h1>
                            <div className="flex gap-x-4">
                                <div className="text-right">
                                    <h1 className=" text-green-900 font-bold flex flex-row">{parseToRupiahText(item.total.debet)}</h1>
                                </div>
                                <div className="text-right">
                                    <h1 className=" text-red-900 font-bold">{parseToRupiahText(item.total.kredit)}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {
            item.buktiTransaksi.map(item1 => {
                return <>
                    <JurnalPenyusutanRowData
                        item1={item1}
                        balanceStatus={true}
                        forPrint={forPrint}
                    />
                </>
            })
        }

    </div>
};

export default JurnalPenyusutanRow;