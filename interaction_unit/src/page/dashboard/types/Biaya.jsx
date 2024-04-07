import { FaArrowDown, FaCheck } from "react-icons/fa"
import { getBulanByIndex, getBulanList, getTanggal } from "../../../helper/date.helper"
import { getArray, getRandom, parseToRupiahText } from "../../../helper/number.helper"
import StackedLineApex from "../../../component/chart/apex/StackedLineApex"
import { useState } from "react"
import HorizontalBarApex from "../../../component/chart/apex/HorizontalBarApex"

const Biaya = () => {
    const [bulanSelectedSet, setBulanSelectedSet] = useState([getBulanByIndex(new Date().getMonth())])

    const addAndRemoveToBulanSelectedSet = (name) => {
        let bulanSelectedSetCopy = [...bulanSelectedSet]
        bulanSelectedSetCopy.indexOf(name) < 0 ? bulanSelectedSetCopy.push(name) : bulanSelectedSetCopy.splice(bulanSelectedSetCopy.indexOf(name), 1)
        bulanSelectedSetCopy.length == 0 ? bulanSelectedSetCopy.push(name) : null
        setBulanSelectedSet(bulanSelectedSetCopy)
    }

    return <div className="flex flex-col gap-y-3">
        <div className="grid grid-cols-12 gap-x-2">
            <div className="col-span-7 flex gap-x-2">
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
                    <div className="py-3 px-2">
                        <p className="text-md font-bold mb-3">Total Biaya</p>
                        <h1 className="text-6xl mt-2 font-bold">Rp. {parseToRupiahText(getRandom(1).at(0) * 65464165)}</h1>
                    </div>
                    <StackedLineApex
                        seriesValueLabel={
                            [
                                parseToRupiahText(getRandom(1).at(0) * 413265543),
                            ]
                        }
                        height={"430"}
                        series={[
                            {
                                name: "Biaya",
                                data: getTanggal().map(i => getRandom(1).at(0) * 1289023),
                            }
                        ]}
                    />
                </div>
            </div>
            <div className="col-span-5">
                <div className="flex-1 p-4 bg-white rounded-box shadow-2xl">
                    <div className="py-3">
                        <p className="text-md font-bold mb-3">Riwayat Biaya</p>
                    </div>
                    <div className="overflow-y-scroll no-scrollbar h-[49.5vh]">
                        {
                            getTanggal(true).map(i => {
                                return <div className="mb-4">
                                    <div className="grid grid-col-12">
                                        <p className="text-center text-xs font-bold text-white py-1 px-4 bg-green-900 rounded-md w-max">{i}</p>
                                    </div>
                                    {
                                        getArray(Math.floor(getRandom(1).at(0) / 10)).map(() => {
                                            return <div className="grid grid-cols-12 py-3 items-start border-gray-300 border-b-2">
                                                <div className="col-span-2">
                                                    <p className="text-xs font-bold text-right mr-2">12:11:98 AM</p>
                                                </div>
                                                <div className="col-span-7 pl-2">
                                                    <p className="text-xs">Lorem ipsum dolor sit amet.</p>
                                                </div>
                                                <div className="col-span-3 flex justify-center">
                                                    <div className="text-green-900 text-sm font-bold flex items-center gap-x-2">
                                                        <FaArrowDown size={11} />
                                                        <p className="text-xs">{parseToRupiahText(getRandom(1).at(0) * 651345)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-12 gap-x-2">
            <div className="col-span-12 flex gap-x-2">
                <div className="flex-1 grid grid-cols-5 justify-around p-4 bg-white rounded-box shadow-2xl">
                    {
                        getArray(15).map(() => {
                            return <div className="col-span-1 justify-center m-4 flex gap-x-2">
                                <div className="radial-progress text-green-700" style={{ "--value": getRandom(1).at(0) }} role="progressbar">{getRandom(1).at(0)}%</div>
                                <div className="flex flex-col justify-around">
                                    <h1 className="text-sm font-bold">Beban Gaji</h1>
                                    <p className="text-sm font-bold text-gray-500">{getRandom(1).at(0)} Transaksi</p>
                                    <p className="text-xl font-bold text-green-900">Rp. {parseToRupiahText(getRandom(1).at(0) * 654564)}</p>
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    </div>
}
export default Biaya;