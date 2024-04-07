import { FaArrowDown, FaCheck } from "react-icons/fa"
import { getBulanByIndex, getBulanList, getTanggal } from "../../../helper/date.helper"
import { getArray, getRandom, parseToRupiahText } from "../../../helper/number.helper"
import StackedLineApex from "../../../component/chart/apex/StackedLineApex"
import { useState } from "react"

const Penjualan = () => {
    const [bulanSelectedSet, setBulanSelectedSet] = useState([getBulanByIndex(new Date().getMonth())])

    const addAndRemoveToBulanSelectedSet = (name) => {
        let bulanSelectedSetCopy = [...bulanSelectedSet]
        bulanSelectedSetCopy.indexOf(name) < 0 ? bulanSelectedSetCopy.push(name) : bulanSelectedSetCopy.splice(bulanSelectedSetCopy.indexOf(name), 1)
        bulanSelectedSetCopy.length == 0 ? bulanSelectedSetCopy.push(name) : null
        setBulanSelectedSet(bulanSelectedSetCopy)
    }

    const [jenisPenjualanSet, setJenisPenjualanSet] = useState(["Barang", "Jasa"])

    const addAndRemoveToJenisPenjualanSet = (name) => {
        let jenisPenjualanSetCopy = [...jenisPenjualanSet]
        jenisPenjualanSetCopy.indexOf(name) < 0 ? jenisPenjualanSetCopy.push(name) : jenisPenjualanSetCopy.splice(jenisPenjualanSetCopy.indexOf(name), 1)
        jenisPenjualanSetCopy.length == 0 ? jenisPenjualanSetCopy.push(name) : null
        setJenisPenjualanSet(jenisPenjualanSetCopy)
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
                        <p className="text-md font-bold mb-3">Total Penjualan</p>
                        <h1 className="text-6xl mt-2 font-bold">Rp. {parseToRupiahText(getRandom(1).at(0) * 65464165)}</h1>
                    </div>
                    <StackedLineApex
                        height={"420"}
                        series={[
                            {
                                name: "Penjualan",
                                data: getTanggal().map(i => getRandom(1).at(0) * 1289023),
                            }
                        ]}
                    />
                </div>
            </div>
            <div className="col-span-5">
                <div className="flex-1 p-4 bg-white rounded-box shadow-2xl">
                    <div className="py-3">
                        <p className="text-md font-bold mb-3">Riwayat Penjualan</p>
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
    </div>
}
export default Penjualan;