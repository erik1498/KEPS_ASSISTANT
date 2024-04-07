import { useState } from "react"
import Wrap from "../../component/layout/Wrap"
import Overview from "./types/Overview"
import Penjualan from "./types/Penjualan"
import Pembelian from "./types/Pembelian"
import Biaya from "./types/Biaya"

const Dashboard2Page = () => {
    const [type, setType] = useState("overview")
    return <Wrap
        isLoading={false}
    >
        <div className="grid grid-cols-12 gap-x-2">
            <div className="col-span-12">
                <h1 className="font-bold text-2xl my-5 text-white">Report</h1>
                <div className="flex my-3 gap-x-2">
                    <button onClick={() => setType("overview")} className={`btn-sm ${type=="overview" ? `bg-white text-blue-900 font-bold` : `text-white`} border rounded-box border-white`}>Overview</button>
                    <button onClick={() => setType("penjualan")} className={`btn-sm ${type=="penjualan" ? `bg-white text-blue-900 font-bold` : `text-white`} border rounded-box border-white`}>Penjualan</button>
                    <button onClick={() => setType("pembelian")} className={`btn-sm ${type=="pembelian" ? `bg-white text-blue-900 font-bold` : `text-white`} border rounded-box border-white`}>Pembelian</button>
                    <button onClick={() => setType("biaya")} className={`btn-sm ${type=="biaya" ? `bg-white text-blue-900 font-bold` : `text-white`} border rounded-box border-white`}>Biaya</button>
                </div>
            </div>
        </div>
        {
            type == "overview" ? <Overview /> : <></>
        }
        {
            type == "penjualan" ? <Penjualan /> : <></>
        }
        {
            type == "pembelian" ? <Pembelian /> : <></>
        }
        {
            type == "biaya" ? <Biaya /> : <></>
        }
    </Wrap>
}
export default Dashboard2Page