import { FaArrowDown, FaArrowUp, FaCheck } from "react-icons/fa"
import { convertTo12HoursFormat, getBulanByIndex, getBulanList, getTanggal } from "../../../helper/date.helper"
import { getArray, getRandom, getSumOfStringValue, parseToRupiahText, sumArray } from "../../../helper/number.helper"
import StackedLineApex from "../../../component/chart/apex/StackedLineApex"
import { useState } from "react"
import { apiJurnalUmumCRUD } from "../../../service/endPointList.api"
import { useEffect } from "react"
import { useDataContext } from "../../../context/dataContext.context"

const Penjualan = () => {

    const { data, setData } = useDataContext()

    const [bulanSelectedSet, setBulanSelectedSet] = useState([getBulanByIndex(new Date().getMonth())])

    const [loadNormalized, setLoadNormalized] = useState(false)

    const [dataPenjualan, setDataPenjualan] = useState({})

    const addAndRemoveToBulanSelectedSet = (name) => {
        let bulanSelectedSetCopy = [...bulanSelectedSet]
        bulanSelectedSetCopy.indexOf(name) < 0 ? bulanSelectedSetCopy.push(name) : bulanSelectedSetCopy.splice(bulanSelectedSetCopy.indexOf(name), 1)
        bulanSelectedSetCopy.length == 0 ? bulanSelectedSetCopy.push(name) : null
        setBulanSelectedSet(bulanSelectedSetCopy)
    }


    const normalizedDataPenjualan = () => {
        let daftarTransaksi = []
        let penjualanFlow = {
            tanggal: [],
            debet: [],
            kredit: [],
        }
        let dataPerTanggal = {
            tanggal: [],
            listData: []
        }
        urutkanBulanSelectedSet().forEach(bulan => {
            const bulanIdx = getBulanList().indexOf(bulan)
            if (data.dashboard.penjualan[bulanIdx]) {
                daftarTransaksi = daftarTransaksi.concat(data.dashboard.penjualan[bulanIdx].filter(i => i.uuid != "NERACA"))
                daftarTransaksi.forEach(i => {
                    let indexOfTanggal = penjualanFlow.tanggal.indexOf(`${i.tanggal} ${getBulanByIndex(parseFloat(i.bulan) - 1)} ${i.tahun}`)
                    if (indexOfTanggal < 0) {

                        penjualanFlow.tanggal.push(`${i.tanggal} ${getBulanByIndex(parseFloat(i.bulan) - 1)} ${i.tahun}`)
                        dataPerTanggal.tanggal.push(`${i.tanggal} ${getBulanByIndex(parseFloat(i.bulan) - 1)} ${i.tahun}`)

                        let listData = daftarTransaksi.filter(j => j.tanggal == i.tanggal && j.bulan == i.bulan && i.tahun == j.tahun)
                        dataPerTanggal.listData.push(listData)
                        penjualanFlow.debet.push(getSumOfStringValue(listData.map(i => i.debet)))
                        penjualanFlow.kredit.push(getSumOfStringValue(listData.map(i => i.kredit)))
                    }
                })
            } else {
                apiJurnalUmumCRUD
                    .custom(`/bulan/${bulanIdx + 1}/${data.tahun}/bukti_transaksi`, "GET")
                    .then(async (resData) => {
                        let dataCopy = data
                        dataCopy.dashboard.penjualan[bulanIdx] = resData?.data?.filter(i => i.kode_akun == "401" || i.kode_akun == "405")
                        setData(dataCopy)
                        setLoadNormalized(!loadNormalized)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })
        return {
            daftarTransaksi,
            dataPerTanggal,
            penjualanFlow,
        }
    }

    const urutkanBulanSelectedSet = () => {
        let bulanList = []
        getBulanList().forEach(b => {
            if (bulanSelectedSet.indexOf(b) > -1) {
                bulanList.push(b)
            }
        });
        return bulanList
    }

    useEffect(() => {
        let normalizedPenjualan = normalizedDataPenjualan()
        setDataPenjualan(normalizedPenjualan)
    }, [bulanSelectedSet, loadNormalized])

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
                        <h1 className="text-6xl mt-2 font-bold">Rp. {parseToRupiahText(sumArray(dataPenjualan?.penjualanFlow?.kredit) + sumArray(dataPenjualan?.penjualanFlow?.debet))}</h1>
                    </div>
                    <StackedLineApex
                        seriesValueLabel={
                            [
                                getSumOfStringValue(dataPenjualan?.penjualanFlow?.debet),
                                getSumOfStringValue(dataPenjualan?.penjualanFlow?.kredit)
                            ]
                        }
                        categories={dataPenjualan?.penjualanFlow?.tanggal}
                        height={"450"}
                        series={[
                            {
                                name: "Debet",
                                data: dataPenjualan?.penjualanFlow?.debet ? dataPenjualan?.penjualanFlow?.debet : [],
                            },
                            {
                                name: "Kredit",
                                data: dataPenjualan?.penjualanFlow?.kredit ? dataPenjualan?.penjualanFlow?.kredit : []
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
                            dataPenjualan?.dataPerTanggal?.tanggal?.map((i, idx) => {
                                return <div className="mb-4">
                                    <div className="grid grid-col-12">
                                        <p className="text-center text-xs font-bold text-white py-1 px-4 bg-green-900 rounded-md w-max">{i}</p>
                                    </div>
                                    {
                                        dataPenjualan?.dataPerTanggal?.listData[idx].map((j) => {
                                            return <div className="grid grid-cols-12 py-3 items-start border-gray-300 border-b-2">
                                                <div className="col-span-2">
                                                    <p className="text-xs font-bold text-right mr-2">{convertTo12HoursFormat(j.waktu)}</p>
                                                </div>
                                                <div className="col-span-7 pl-2">
                                                    <p className="text-xs font-bold mb-2">{j.nama_akun}</p>
                                                    <p className="text-xs">{j.uraian}</p>
                                                </div>
                                                <div className="col-span-3 flex justify-center">
                                                    {
                                                        parseFloat(j.debet).toFixed(2) != "0.00" ?
                                                            <div className={`text-green-900 text-sm font-bold flex items-center gap-x-2`}>
                                                                <FaArrowDown size={11} />
                                                                <p className="text-xs">{parseToRupiahText(j.debet)}</p>
                                                            </div> :
                                                            <div className={`text-red-900 text-sm font-bold flex items-center gap-x-2`}>
                                                                <FaArrowUp size={11} />
                                                                <p className="text-xs">{parseToRupiahText(j.kredit)}</p>
                                                            </div>
                                                    }
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
        <div className="grid grid-cols-2 gap-x-2">
            <div className="col-span-1 justify-center my-2 flex gap-x-2 bg-white rounded-box shadow-2xl p-4">
                <div className="radial-progress text-blue-700" style={{ "--value": ((getSumOfStringValue(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "401").map(i => parseFloat(i.kredit))) + getSumOfStringValue(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "401").map(i => parseFloat(i.debet)))) * 100) / getSumOfStringValue(dataPenjualan?.penjualanFlow?.kredit) + getSumOfStringValue(dataPenjualan?.penjualanFlow?.debet) }} role="progressbar">{((sumArray(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "401").map(i => parseFloat(i.kredit))) + sumArray(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "401").map(i => parseFloat(i.debet)))) * 100) / sumArray(dataPenjualan?.penjualanFlow?.kredit) + sumArray(dataPenjualan?.penjualanFlow?.debet) ? (((sumArray(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "401").map(i => parseFloat(i.kredit))) + sumArray(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "401").map(i => parseFloat(i.debet)))) * 100) / sumArray(dataPenjualan?.penjualanFlow?.kredit) + sumArray(dataPenjualan?.penjualanFlow?.debet)).toString().substring(0, 4) : 0}%</div>
                <div className="flex flex-col justify-around">
                    <h1 className="text-sm font-bold text-blue-900">Penjualan Barang</h1>
                    <p className="text-sm font-bold text-gray-500">{dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "401").length} Transaksi ( {((getSumOfStringValue(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "401").map(i => parseFloat(i.kredit))) + getSumOfStringValue(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "401").map(i => parseFloat(i.debet)))) * 100) / getSumOfStringValue(dataPenjualan?.penjualanFlow?.kredit) + getSumOfStringValue(dataPenjualan?.penjualanFlow?.debet)} % )</p>
                    <p className="text-xl font-bold text-blue-900">Rp. {parseToRupiahText(getSumOfStringValue(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "401").map(i => parseFloat(i.kredit))) + getSumOfStringValue(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "401").map(i => parseFloat(i.debet))))}</p>
                </div>
            </div>
            
            <div className="col-span-1 justify-center my-2 flex gap-x-2 bg-white rounded-box shadow-2xl p-4">
                <div className="radial-progress text-blue-700" style={{ "--value": ((getSumOfStringValue(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "405").map(i => parseFloat(i.kredit))) + getSumOfStringValue(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "405").map(i => parseFloat(i.debet)))) * 100) / getSumOfStringValue(dataPenjualan?.penjualanFlow?.kredit) + getSumOfStringValue(dataPenjualan?.penjualanFlow?.debet) }} role="progressbar">{((sumArray(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "405").map(i => parseFloat(i.kredit))) + sumArray(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "405").map(i => parseFloat(i.debet)))) * 100) / sumArray(dataPenjualan?.penjualanFlow?.kredit) + sumArray(dataPenjualan?.penjualanFlow?.debet) ? (((sumArray(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "405").map(i => parseFloat(i.kredit))) + sumArray(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "405").map(i => parseFloat(i.debet)))) * 100) / sumArray(dataPenjualan?.penjualanFlow?.kredit) + sumArray(dataPenjualan?.penjualanFlow?.debet)).toString().substring(0, 4) : 0}%</div>
                <div className="flex flex-col justify-around">
                    <h1 className="text-sm font-bold text-blue-900">Penjualan Jasa</h1>
                    <p className="text-sm font-bold text-gray-500">{dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "405").length} Transaksi ( {((getSumOfStringValue(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "405").map(i => parseFloat(i.kredit))) + getSumOfStringValue(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "405").map(i => parseFloat(i.debet)))) * 100) / getSumOfStringValue(dataPenjualan?.penjualanFlow?.kredit) + getSumOfStringValue(dataPenjualan?.penjualanFlow?.debet)} % )</p>
                    <p className="text-xl font-bold text-blue-900">Rp. {parseToRupiahText(getSumOfStringValue(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "405").map(i => parseFloat(i.kredit))) + getSumOfStringValue(dataPenjualan?.daftarTransaksi?.filter(i => i.kode_akun == "405").map(i => parseFloat(i.debet))))}</p>
                </div>
            </div>
        </div>
    </div>
}
export default Penjualan;