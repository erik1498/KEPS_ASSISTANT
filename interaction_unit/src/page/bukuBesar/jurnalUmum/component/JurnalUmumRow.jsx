import { FaPen, FaTrash } from "react-icons/fa";
import { parseRupiahToFloat, parseToRupiahText } from "../../../../helper/number.helper";
import { convertTo12HoursFormat } from "../../../../helper/date.helper";

const JurnalUmumRow = ({
    item,
    deleteItem = () => { },
    editItem = () => { },
    deleteByBuktiTransaksi = () => { },
    balanceStatus = true
}) => {
    return <div className="flex flex-col w-full bg-white text-[13px] px-3 shadow-md">
        <div className="grid grid-cols-12 sticky top-0 bg-white py-2 border-b-2">
            <div className="p-2 col-span-9 text-black flex items-end">
                <div className="text-[28px] font-bold">
                    {
                        balanceStatus ?
                            <p className={`text-[45px] -ml-1 text-white px-2 rounded-md ${item.total.debet == item.total.kredit ? "bg-green-900" : "bg-red-900"}`}>{item.tanggal}</p>
                            :
                            <p className={`text-[45px] -ml-1 text-white px-2 rounded-md bg-green-900`}>{item.tanggal}</p>
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
                                <div className="text-right text-gray-900">
                                    <h1 className=" text-green-900 font-bold flex flex-row">{parseToRupiahText(item.total.debet)}</h1>
                                </div>
                                <div className="text-right text-gray-900">
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

                    <div className="grid grid-cols-12 items-center bg-gray-3">
                        <div className=" col-span-12 border-x-4 border-transparent text-gray-900 flex flex-row items-center">
                            {
                                balanceStatus ?
                                    <div className={`${item1.debet == item1.kredit ? "bg-green-900" : "bg-red-900"} w-full py-1 text-white text-[12.3px] rounded-sm text-center font-bold px-4`}>{item1.bukti_transaksi}</div>
                                    :
                                    <div className={`bg-green-900 w-full py-1 text-white text-[12.3px] rounded-sm text-center font-bold px-4`}>{item1.bukti_transaksi}</div>
                            }
                        </div>
                    </div>

                    {
                        item1.data.map((item2, i) => {
                            return item2.map((item3, j) => {
                                return <>
                                    <hr />
                                    {
                                        j <= item2.length ?
                                            <div className="grid grid-cols-12 items-start py-1">
                                                <div className="col-span-1 px-2 text-black">
                                                    {
                                                        item3.uuid != "NERACA" ? convertTo12HoursFormat(item3.waktu) : " - - "
                                                    }
                                                </div>
                                                <div className={`col-span-2 text-gray-900 flex flex-col px-2 ${parseRupiahToFloat(item3.kredit) > 0 && item3.uuid != "NERACA" ? "text-right" : ""}`}>
                                                    <p>{item3.kode_akun} - {item3.nama_akun}</p>
                                                </div>
                                                <div className="col-span-4 text-gray-900 flex flex-col px-2">
                                                    <p>{item3.uraian}</p>
                                                </div>
                                                <div className="text-right px-2 col-span-2 text-gray-900">
                                                    {
                                                        item3.debet != "0" ? <h1 className=" text-green-900 font-bold">{parseToRupiahText(item3.debet)}</h1> : <></>
                                                    }
                                                </div>
                                                <div className="text-right px-2 col-span-2 text-gray-900">
                                                    {
                                                        item3.kredit != "0" ? <h1 className=" text-red-900 font-bold">{parseToRupiahText(item3.kredit)}</h1> : <></>
                                                    }
                                                </div>
                                                <div className="text-black text-center col-span-1 flex justify-center gap-x-3">
                                                    {
                                                        item3.sumber == "JURNAL UMUM" && balanceStatus ?
                                                            <FaTrash size={9} onClick={() => deleteItem(item3.uuid)} className="w-max mt-1 text-red-500 cursor-pointer" />
                                                            :
                                                            <></>
                                                    }
                                                </div>
                                            </div> : <></>
                                    }
                                    {
                                        j == item2.length - 1 && i == item1.data.length - 1 ?
                                            <>
                                                <hr />
                                                <div className="grid grid-cols-12 items-start py-3">
                                                    <div className="col-span-1 px-2 text-black text-center font-bold flex justify-center items-center gap-x-5">
                                                        {
                                                            item1.sumber == "JURNAL UMUM" && balanceStatus ? <>
                                                                <div className="flex justify-center items-center gap-x-2 pl-3 cursor-pointer" onClick={() => editItem(item1)} >
                                                                    <FaPen size={9} className="w-max h-full text-yellow-500" />
                                                                    <h1 className="font-bold text-yellow-500">Edit</h1>
                                                                </div>
                                                                <div className="flex justify-center items-center gap-x-2 cursor-pointer" onClick={() => deleteByBuktiTransaksi(item1.bukti_transaksi)}>
                                                                    <FaTrash size={9} className="w-max h-full text-red-500" />
                                                                    <h1 className="font-bold text-red-500">Hapus</h1>
                                                                </div>
                                                            </> : <></>
                                                        }
                                                    </div>
                                                    <div className="col-span-6"></div>
                                                    <div className="text-right px-2 col-span-2 text-gray-900">
                                                        <h1 className=" text-green-900 font-bold">{parseToRupiahText(item1.debet)}</h1>
                                                    </div>
                                                    <div className="text-right px-2 col-span-2 text-gray-900">
                                                        <h1 className=" text-red-900 font-bold">{parseToRupiahText(item1.kredit)}</h1>
                                                    </div>
                                                </div>
                                            </> : <></>
                                    }
                                </>
                            })
                        })
                    }
                </>
            })
        }

    </div>
};

export default JurnalUmumRow;
