import { useState } from "react"
import Wrap from "../../component/layout/Wrap"
import Overview from "./types/Overview"
import Penjualan from "./types/Penjualan"
import Pembelian from "./types/Pembelian"
import Biaya from "./types/Biaya"
import { useEffect } from "react"
import { useDataContext } from "../../context/dataContext.context"
import { getCookie, getRolesInCookie, setCookie } from "../../helper/cookies.helper"
import AktivitasDokumen from "./types/AktivitasDokumen"

const Dashboard2Page = () => {
    const [type, setType] = useState("")

    const { _getDataKodeAkun } = useDataContext()

    useEffect(() => {
        if (!getCookie("loadedKodeAkun")) {
            _getDataKodeAkun()
            setCookie("loadedKodeAkun", true)
        }
        setType(x => x = getRolesInCookie("Dashboard_Overview") ? "overview" : "")
    }, [])
    return <Wrap
        isLoading={false}
    >
        <div className="grid grid-cols-12 gap-x-2">
            <div className="col-span-12">
                <h1 className="font-bold text-2xl my-5 uppercase text-white">{type.replace("_", " ")}</h1>
                <div className="flex my-3 gap-x-2">
                    {
                        getRolesInCookie("Dashboard_Overview") ? <>
                            <button onClick={() => setType("overview")} className={`btn-sm ${type == "overview" ? `bg-white text-blue-900 font-bold` : `text-white`} border rounded-box border-white`}>Overview</button>
                        </> : <></>
                    }
                    {
                        getRolesInCookie("Dashboard_Penjualan") ? <>
                            <button onClick={() => setType("penjualan")} className={`btn-sm ${type == "penjualan" ? `bg-white text-blue-900 font-bold` : `text-white`} border rounded-box border-white`}>Penjualan</button>
                        </> : <></>
                    }
                    {
                        getRolesInCookie("Dashboard_Pembelian") ? <>
                            <button onClick={() => setType("pembelian")} className={`btn-sm ${type == "pembelian" ? `bg-white text-blue-900 font-bold` : `text-white`} border rounded-box border-white`}>Pembelian</button>
                        </> : <></>
                    }
                    {
                        getRolesInCookie("Dashboard_Biaya") ? <>
                            <button onClick={() => setType("biaya")} className={`btn-sm ${type == "biaya" ? `bg-white text-blue-900 font-bold` : `text-white`} border rounded-box border-white`}>Biaya</button>
                        </> : <></>
                    }
                    {
                        getRolesInCookie("Dashboard_AktivitasDokumen") ? <>
                            <button onClick={() => setType("aktivitas_dokumen")} className={`btn-sm ${type == "aktivitas_dokumen" ? `bg-white text-blue-900 font-bold` : `text-white`} border rounded-box border-white`}>Aktivitas Dokumen</button>
                        </> : <></>
                    }
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
        {
            type == "aktivitas_dokumen" ? <AktivitasDokumen /> : <></>
        }
    </Wrap>
}
export default Dashboard2Page