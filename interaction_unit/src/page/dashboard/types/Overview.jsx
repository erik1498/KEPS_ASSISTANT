import { FaArrowDown, FaCheck } from "react-icons/fa";
import { getRandom, parseToRupiahText } from "../../../helper/number.helper";
import StackedLineApex from "../../../component/chart/apex/StackedLineApex";
import { KodeAkunType } from "../../../config/objectList.config";
import { useState } from "react";
import RadarApex from "../../../component/chart/apex/RadarApex";
import StackedBarApex from "../../../component/chart/apex/StackedBarApex";
import { getBulanByIndex, getBulanList, getTanggal } from "../../../helper/date.helper";

const Overview = () => {
    const [bulanSelectedSet, setBulanSelectedSet] = useState([getBulanByIndex(new Date().getMonth())])

    const addAndRemoveToBulanSelectedSet = (name) => {
        let bulanSelectedSetCopy = [...bulanSelectedSet]
        bulanSelectedSetCopy.indexOf(name) < 0 ? bulanSelectedSetCopy.push(name) : bulanSelectedSetCopy.splice(bulanSelectedSetCopy.indexOf(name), 1)
        bulanSelectedSetCopy.length == 0 ? bulanSelectedSetCopy.push(name) : null
        setBulanSelectedSet(bulanSelectedSetCopy)
    }

    const [kodeAkunTypeSet, setKodeAkunTypeSet] = useState(KodeAkunType().map(i => i.name))

    const addAndRemoveToKodeAkunTypeSet = (name) => {
        let kodeAkunTypeSetCopy = [...kodeAkunTypeSet]
        kodeAkunTypeSetCopy.indexOf(name) < 0 ? kodeAkunTypeSetCopy.push(name) : kodeAkunTypeSetCopy.splice(kodeAkunTypeSetCopy.indexOf(name), 1)
        kodeAkunTypeSetCopy.length == 0 ? kodeAkunTypeSetCopy.push(name) : null
        setKodeAkunTypeSet(kodeAkunTypeSetCopy)
    }

    return <div className="flex flex-col gap-y-3">
        <div className="grid grid-cols-12 gap-x-2">
            <div className="col-span-8 flex gap-x-2">
                <div className="flex flex-col justify-around gap-y-1">
                    {
                        getBulanList().map((item, i) => {
                            return <>
                                <div onClick={() => { addAndRemoveToBulanSelectedSet(item) }} key={i} className={`flex-1 rounded-box text-md badge border-none w-full cursor-pointer font-bold ${bulanSelectedSet.indexOf(item) >= 0 ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
                                    {item}
                                </div>
                            </>
                        })
                    }
                </div>
                <div className="flex-1 p-4 bg-white rounded-box shadow-2xl">
                    <div className="flex items-end">
                        <div className="flex-1">
                            <div className="py-3 px-2">
                                <h1 className="text-6xl font-bold">{parseToRupiahText(getRandom(1).at(0) * 34)} Transaksi</h1>
                                <div className="mt-3 flex items-end">
                                    <p className="bg-blue-300 text-blue-900 text-sm font-bold px-6 py-1 rounded-md w-max">
                                        {parseToRupiahText(getRandom(1).at(0) * 10)} Bukti Transaksi
                                    </p>
                                    <p className="ml-3 text-xs text-red-600 font-bold">{parseToRupiahText(getRandom(1).at(0))} Tidak Seimbang.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-2 pt-5 pb-3">
                        <div className="flex">
                            {
                                KodeAkunType().map((i, idx) => {
                                    return <button
                                        onClick={e => addAndRemoveToKodeAkunTypeSet(i.name)}
                                        className={`border text-xs border-blue-900 ${kodeAkunTypeSet.indexOf(i.name) > -1 ? `bg-blue-900 text-white` : `bg-white text-blue-900`} font-bold px-3 py-1 ${idx > 0 ? `border-l-0` : `rounded-md rounded-r-none`} ${idx == KodeAkunType().length - 1 ? `rounded-md rounded-l-none` : ``}`}>
                                        {i.name}
                                    </button>
                                })
                            }
                        </div>
                    </div>
                    <div className="px-3 pb-5 pt-3 flex items-end gap-x-2">
                        <p className="text-md font-bold">{getRandom(1).at(0)} Bukti Transaksi</p>
                        <p className="text-xs text-red-600 font-bold">{getRandom(1).at(0)} Tidak Seimbang</p>
                    </div>
                    <div className="flex px-3">
                        <div className="flex items-center w-max bg-green-400 text-green-900 px-2 py-1 gap-x-2 rounded-md">
                            <FaCheck size={14} />
                            <p className="text-xs font-bold">Debet dan Kredit Seimbang</p>
                        </div>
                    </div>
                    <StackedLineApex
                        seriesValueLabel={
                            [
                                parseToRupiahText(getRandom(1).at(0) * 413265543),
                                parseToRupiahText(getRandom(1).at(0) * 413265543)
                            ]
                        }
                        height={"280"}
                        series={[
                            {
                                name: "Debet",
                                data: getTanggal().map(i => getRandom(1).at(0) * 1289023),
                            },
                            {
                                name: "Kredit",
                                data: getTanggal().map(i => getRandom(1).at(0) * 1289023)
                            }
                        ]}
                    />
                </div>
            </div>
            <div className="col-span-4">
                <div className="flex gap-x-2">
                    <div className="flex-1 flex flex-col gap-y-2">
                        <div className="flex-1 p-4 bg-white rounded-box shadow-2xl">
                            <RadarApex
                                height={"550"}
                                categories={KodeAkunType().reverse().map(i => i.name)}
                                series={[
                                    {
                                        name: 'Seimbang',
                                        data: KodeAkunType().reverse().map(i => getRandom(1).at(0) * 10),
                                    },
                                    {
                                        name: 'Tidak Seimbang',
                                        data: KodeAkunType().reverse().map(i => getRandom(1).at(0) * 10),
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-12 gap-x-2">
            <div className="col-span-12">
                <div className="p-4 bg-white rounded-box shadow-2xl">
                    <div className="px-3 py-2 flex justify-center">
                        <div className="flex items-center w-max bg-green-400 text-green-900 px-2 py-1 gap-x-2 rounded-md">
                            <FaCheck size={14} />
                            <p className="text-xs font-bold">Saldo Debet dan Saldo Kredit Seimbang</p>
                        </div>
                    </div>
                    <StackedBarApex
                        seriesValueLabel={
                            [
                                parseToRupiahText(getRandom(1).at(0) * 413265543),
                                parseToRupiahText(getRandom(1).at(0) * 413265543)
                            ]
                        }
                        height={"220"}
                        series={[
                            {
                                name: 'Debet',
                                data: KodeAkunType().map(i => {
                                    return {
                                        x: i.name,
                                        y: getRandom(1).at(0) * 4135432
                                    }
                                })
                            },
                            {
                                name: 'Kredit',
                                data: KodeAkunType().map(i => {
                                    return {
                                        x: i.name,
                                        y: getRandom(1).at(0) * 4135432
                                    }
                                })
                            }
                        ]} />
                </div>
            </div>
        </div>
        <div className="flex gap-x-2">
            <div className="py-4 px-4 bg-green-900 rounded-box shadow-2xl">
                <div className="flex items-end">
                    <div className="py-3 px-2 flex gap-x-4 items-center">
                        <div className="flex items-center justify-center gap-x-2 bg-green-300 text-green-900 text-sm font-bold p-6 rounded-full">
                            <FaArrowDown size={40} />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-bold text-white">Gain</p>
                            <h1 className="text-4xl font-bold text-white mb-0">{parseToRupiahText(getRandom(1).at(0) * 10820593)}</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 flex-1 bg-white rounded-box shadow-2xl flex">
                <table className="table table-sm">
                    <tbody>
                        <tr>
                            <td>Harga Pokok Penjualan</td>
                            <td className="text-right font-bold">Rp. {parseToRupiahText(getRandom(1).at(0) * 354132646)}</td>
                        </tr>
                        <tr>
                            <td>Beban Operasional</td>
                            <td className="text-right font-bold">Rp. {parseToRupiahText(getRandom(1).at(0) * 354132646)}</td>
                        </tr>
                        <tr>
                            <td>Beban Lainnya</td>
                            <td className="text-right font-bold">Rp. {parseToRupiahText(getRandom(1).at(0) * 354132646)}</td>
                        </tr>
                    </tbody>
                </table>
                <table className="table table-sm">
                    <tr className="border-b-2">
                        <td>Pendapatan</td>
                        <td className="text-right font-bold">Rp. {parseToRupiahText(getRandom(1).at(0) * 354132646)}</td>
                    </tr>
                    <tr className="border-b-2">
                        <td>Pendapatan Lain - Lain</td>
                        <td className="text-right font-bold">Rp. {parseToRupiahText(getRandom(1).at(0) * 354132646)}</td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td className="text-right font-bold">&nbsp;</td>
                    </tr>
                </table>
            </div>
        </div>
        <div className="p-4 bg-white rounded-box shadow-2xl">
            <div className="px-3 py-2 flex justify-center">
                <div className="flex items-center w-max bg-green-400 text-green-900 px-2 py-1 gap-x-2 rounded-md">
                    <FaCheck size={14} />
                    <p className="text-xs font-bold">Aktiva dan Pasiva Seimbang</p>
                </div>
            </div>
            <StackedBarApex
                height={"200"}
                seriesValueLabel={
                    [
                        parseToRupiahText(getRandom(1).at(0) * 413265543),
                        parseToRupiahText(getRandom(1).at(0) * 413265543)
                    ]
                }
                series={[
                    {
                        name: 'Aktiva',
                        data: [{
                            x: 'Saldo Neraca',
                            y: getRandom(1).at(0) * 4135432
                        }]
                    }, {
                        name: 'Pasiva',
                        data: [{
                            x: 'Saldo Neraca',
                            y: getRandom(1).at(0) * 4135432
                        }]
                    },
                ]} />
            <div className="flex justify-around">
                <div className="text-center">
                    <p className="text-sm">Aset</p>
                    <p className="text-md font-bold">Rp. {parseToRupiahText(getRandom(1).at(0) * 31351345)}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm">Kewajiban</p>
                    <p className="text-md font-bold">Rp. {parseToRupiahText(getRandom(1).at(0) * 31351345)}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm">Ekuitas</p>
                    <p className="text-md font-bold">Rp. {parseToRupiahText(getRandom(1).at(0) * 31351345)}</p>
                </div>
            </div>
        </div>
    </div>
}
export default Overview;