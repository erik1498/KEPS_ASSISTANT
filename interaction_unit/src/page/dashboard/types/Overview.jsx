import { FaArrowDown, FaArrowUp, FaCheck, FaTimes } from "react-icons/fa";
import { getRandom, getSumOfStringValue, parseRupiahToFloat, parseToRupiahText } from "../../../helper/number.helper";
import StackedLineApex from "../../../component/chart/apex/StackedLineApex";
import { KodeAkunType } from "../../../config/objectList.config";
import { useState } from "react";
import RadarApex from "../../../component/chart/apex/RadarApex";
import StackedBarApex from "../../../component/chart/apex/StackedBarApex";
import { getBulanByIndex, getBulanList, getTanggal } from "../../../helper/date.helper";
import { useDataContext } from "../../../context/dataContext.context";
import { useEffect } from "react";
import { apiJurnalUmumCRUD, apiLabaRugiR, apiNeracaCRUD, apiNeracaSaldoR, apiPerubahanModal } from "../../../service/endPointList.api";
import CandlestickApex from "../../../component/chart/apex/CandlestickApex";

const Overview = () => {

    const { data, setData } = useDataContext()
    const bulanListMap = getBulanList()

    const [loadNormalized, setLoadNormalized] = useState(false)
    const [dataOverview, setDataOverview] = useState({})

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

    const normalizedDataOverview = () => {
        let dataTransaksi = []
        let buktiTransaksi = {
            total: [],
            gagal: []
        }
        let dataPerTanggal = {
            tanggal: [],
            debet: [],
            kredit: []
        }
        let typeAkunTransaksi = {
            daftar: [],
            jumlah: []
        }
        let neracaSaldo = {
            label: [],
            debet: [],
            kredit: [],
        }
        let totalSaldoDebet = 0
        let totalSaldoKredit = 0
        let totalDebet = 0;
        let totalKredit = 0;
        urutkanBulanSelectedSet().forEach(bulan => {
            const bulanIdx = bulanListMap.indexOf(bulan)
            if (data.dashboard.overview[bulanIdx].jurnal) {
                let dataTransaksiBulan = data.dashboard.overview[bulanIdx].jurnal.filter(i => kodeAkunTypeSet.indexOf(i.type_akun) > -1 && i.uuid != "NERACA")

                totalDebet = getSumOfStringValue(dataTransaksiBulan.map(i => i.debet))
                totalKredit = getSumOfStringValue(dataTransaksiBulan.map(i => i.kredit))
                dataTransaksiBulan.forEach(j => {

                    if (buktiTransaksi.total.indexOf(j.bukti_transaksi) < 0) {
                        buktiTransaksi.total.push(j.bukti_transaksi)

                        let totalDebetBuktiTransaksi = 0;
                        let totalKreditBuktiTransaksi = 0;
                        dataTransaksiBulan
                            .filter(k => k.bukti_transaksi == j.bukti_transaksi)
                            .map(i => { totalDebetBuktiTransaksi += parseFloat(i.debet), totalKreditBuktiTransaksi += parseFloat(i.kredit) });

                        if (totalDebetBuktiTransaksi != totalKreditBuktiTransaksi) {
                            buktiTransaksi.gagal.push(j.buktiTransaksi)
                        }

                    }

                    const indexOfTanggal = dataPerTanggal.tanggal.indexOf(`${j.tanggal} ${getBulanByIndex(parseFloat(j.bulan) - 1)} ${j.tahun}`)
                    if (indexOfTanggal < 0) {
                        dataPerTanggal.tanggal.push(`${j.tanggal} ${getBulanByIndex(parseFloat(j.bulan) - 1)} ${j.tahun}`)

                        dataPerTanggal.debet[dataPerTanggal.tanggal.length - 1] = parseFloat(j.debet)
                        dataPerTanggal.kredit[dataPerTanggal.tanggal.length - 1] = parseFloat(j.kredit)
                    }
                    else {
                        dataPerTanggal.debet[indexOfTanggal] += parseFloat(j.debet)
                        dataPerTanggal.kredit[indexOfTanggal] += parseFloat(j.kredit)
                    }
                })

                dataTransaksi = dataTransaksi.concat(dataTransaksiBulan)

                let byTypeAkun = data.dashboard.overview[bulanIdx].jurnal.filter(i => i.uuid != "NERACA")
                byTypeAkun.forEach(i => {
                    const indexOfTypeAkun = typeAkunTransaksi.daftar.indexOf(i.type_akun)
                    if (indexOfTypeAkun < 0) {
                        typeAkunTransaksi.daftar.push(i.type_akun)
                        typeAkunTransaksi.jumlah.push(1)
                    } else {
                        typeAkunTransaksi.jumlah[indexOfTypeAkun] += 1
                    }
                })
            } else {
                apiJurnalUmumCRUD
                    .custom(`/bulan/${bulanIdx + 1}/${data.tahun}/bukti_transaksi`, "GET")
                    .then(async (resData) => {
                        let dataCopy = data
                        dataCopy.dashboard.overview[getBulanList().indexOf(bulan)].jurnal = resData?.data
                        setData(dataCopy)
                        setLoadNormalized(!loadNormalized)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }

            if (data.dashboard.overview[bulanIdx].neracaSaldo != null) {

                totalSaldoDebet = getSumOfStringValue(data.dashboard.overview[bulanIdx].neracaSaldo.map(i => i.debet))
                totalSaldoKredit = getSumOfStringValue(data.dashboard.overview[bulanIdx].neracaSaldo.map(i => i.kredit))

                data.dashboard.overview[bulanIdx].neracaSaldo.forEach(i => {
                    const idxOfNeracaSaldo = neracaSaldo.label.indexOf(i.kode_akun_perkiraan_type)
                    if (idxOfNeracaSaldo < 0) {
                        neracaSaldo.debet.push(i.debet)
                        neracaSaldo.kredit.push(i.kredit)
                        neracaSaldo.label.push(i.kode_akun_perkiraan_type)
                    } else {
                        neracaSaldo.debet[idxOfNeracaSaldo] = getSumOfStringValue([neracaSaldo.debet[idxOfNeracaSaldo], i.debet])
                        neracaSaldo.kredit[idxOfNeracaSaldo] = getSumOfStringValue([neracaSaldo.kredit[idxOfNeracaSaldo], i.kredit])
                    }
                })
            } else {
                apiNeracaSaldoR
                    .custom(`/${bulanIdx + 1}/${data.tahun}`, "GET")
                    .then(async (resData) => {
                        let dataCopy = data
                        dataCopy.dashboard.overview[getBulanList().indexOf(bulan)].neracaSaldo = resData?.data
                        setData(dataCopy)
                        setLoadNormalized(!loadNormalized)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }

            if (data.dashboard.overview[bulanIdx].labaRugi == null) {
                apiLabaRugiR
                    .custom(`/${bulanIdx + 1}/${data.tahun}`, "GET")
                    .then((resData) => {
                        let dataCopy = data
                        dataCopy.dashboard.overview[bulanIdx].labaRugi = resData.data
                        setData(dataCopy)
                        setLoadNormalized(!loadNormalized)
                    }).catch(err => {
                        console.log(err)
                    })
            }

            if (data.dashboard.overview[bulanIdx].neraca == null) {
                apiNeracaCRUD
                    .custom(`/${bulanIdx + 1}/${data.tahun}`, "GET")
                    .then((resData) => {
                        let dataCopy = data
                        dataCopy.dashboard.overview[getBulanList().indexOf(bulan)].neraca = resData.data
                        setData(dataCopy)
                        setLoadNormalized(!loadNormalized)
                    }).catch(err => {
                        console.log(err)
                    })
            }

            if (data.dashboard.overview[bulanIdx].perubahanModal == null) {
                apiPerubahanModal
                    .custom(`/${data.tahun}`, "GET")
                    .then((resData) => {
                        let dataCopy = data
                        dataCopy.dashboard.overview[getBulanList().indexOf(bulan)].perubahanModal = resData.data
                        setData(dataCopy)
                        setLoadNormalized(!loadNormalized)
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })
        return {
            buktiTransaksi,
            typeAkunTransaksi,
            dataPerTanggal,
            neracaSaldo,
            totalDebet,
            totalKredit,
            totalSaldoDebet,
            totalSaldoKredit,
            dataTransaksi,
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
        let normalizedOverview = normalizedDataOverview()
        setDataOverview(normalizedOverview)
    }, [bulanSelectedSet, kodeAkunTypeSet, loadNormalized])

    return <div className="flex flex-col gap-y-3">
        <div className="grid grid-cols-12 gap-2">
            <div className="xl:col-span-8 col-span-12 flex xl:flex-row flex-col gap-x-2">
                <div className="xl:w-max flex xl:flex-col flex-wrap xl:justify-around justify-start gap-y-1 mb-2 xl:mb-0">
                    {
                        getBulanList().map((item, i) => {
                            return <>
                                <div onClick={() => { addAndRemoveToBulanSelectedSet(item) }} key={i} className={`rounded-box text-md badge border-none w-max xl:w-full xl:flex-1 cursor-pointer font-bold ${bulanSelectedSet.indexOf(item) >= 0 ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
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
                                <h1 className="text-6xl font-bold">{parseToRupiahText(dataOverview?.dataTransaksi?.length)} Transaksi</h1>
                                <div className="mt-3 flex items-end">
                                    <p className="bg-blue-300 text-blue-900 text-sm font-bold px-6 py-1 rounded-md w-max">
                                        {parseToRupiahText(dataOverview?.buktiTransaksi?.total?.length)} Bukti Transaksi
                                    </p>
                                    <p className="ml-3 text-xs text-red-600 font-bold">{parseToRupiahText(dataOverview?.buktiTransaksi?.gagal?.length)} Tidak Seimbang.</p>
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
                    <div className="flex px-3">
                        <div className={`flex items-center w-max ${dataOverview?.totalDebet == dataOverview?.totalKredit ? `bg-green-400 text-green-900` : `bg-red-400 text-red-900`} px-2 py-1 gap-x-2 rounded-md`}>
                            {
                                dataOverview?.totalDebet == dataOverview?.totalKredit ?
                                    <FaCheck size={14} />
                                    :
                                    <FaTimes size={14} />
                            }
                            {
                                dataOverview?.totalDebet == dataOverview?.totalKredit ?
                                    <p className="text-xs font-bold">Debet dan Kredit Seimbang</p>
                                    :
                                    <p className="text-xs font-bold">Debet dan Kredit Tidak Seimbang</p>
                            }
                        </div>
                    </div>
                    <StackedLineApex
                        seriesValueLabel={
                            [
                                parseToRupiahText(dataOverview?.totalDebet),
                                parseToRupiahText(dataOverview?.totalKredit)
                            ]
                        }
                        categories={dataOverview?.dataPerTanggal?.tanggal}
                        height={"340"}
                        series={[
                            {
                                name: "Debet",
                                data: dataOverview?.dataPerTanggal?.debet ? dataOverview?.dataPerTanggal?.debet : [],
                            },
                            {
                                name: "Kredit",
                                data: dataOverview?.dataPerTanggal?.kredit ? dataOverview?.dataPerTanggal?.kredit : []
                            }
                        ]}
                    />
                </div>
            </div>
            <div className="xl:col-span-4 col-span-12">
                <div className="flex gap-x-2 h-full">
                    <div className="flex-1 flex flex-col gap-y-2">
                        <div className="flex-1 p-4 bg-white rounded-box shadow-2xl">
                            <RadarApex
                                height={"450"}
                                categories={dataOverview?.typeAkunTransaksi?.daftar}
                                series={[
                                    {
                                        name: 'Jumlah Transaksi',
                                        data: dataOverview?.typeAkunTransaksi?.jumlah,
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
                    <div className="flex justify-center px-3">
                        <div className={`flex items-center w-max ${dataOverview?.totalSaldoDebet == dataOverview?.totalSaldoKredit ? `bg-green-400 text-green-900` : `bg-red-400 text-red-900`} px-2 py-1 gap-x-2 rounded-md`}>
                            {
                                dataOverview?.totalSaldoDebet == dataOverview?.totalSaldoKredit ?
                                    <FaCheck size={14} />
                                    :
                                    <FaTimes size={14} />
                            }
                            {
                                dataOverview?.totalSaldoDebet == dataOverview?.totalSaldoKredit ?
                                    <p className="text-xs font-bold">Debet dan Kredit Seimbang</p>
                                    :
                                    <p className="text-xs font-bold">Debet dan Kredit Tidak Seimbang</p>
                            }
                        </div>
                    </div>
                    <StackedBarApex
                        seriesValueLabel={
                            [
                                parseToRupiahText(dataOverview?.totalSaldoDebet ? dataOverview?.totalSaldoDebet : 0),
                                parseToRupiahText(dataOverview?.totalSaldoKredit ? dataOverview?.totalSaldoKredit : 0)
                            ]
                        }
                        categories={dataOverview?.neracaSaldo?.label}
                        height={"340"}
                        series={[
                            {
                                name: "Debet",
                                data: dataOverview?.neracaSaldo?.debet ? dataOverview?.neracaSaldo?.debet : [],
                            },
                            {
                                name: "Kredit",
                                data: dataOverview?.neracaSaldo?.kredit ? dataOverview?.neracaSaldo?.kredit : []
                            }
                        ]}
                    />
                </div>
            </div>
        </div>
        {
            urutkanBulanSelectedSet().map(bulan => {
                return <>
                    <div className="grid grid-cols-12 gap-x-2 bg-white rounded-box shadow-2xl p-5">
                        <h1 className="col-span-12 text-center uppercase text-2xl font-bold border-b-4 pb-2">{bulan}</h1>
                        <div className={`col-span-4 py-4 px-4`}>
                            <div className="flex justify-center items-end">
                                <div className="py-3 px-2 flex gap-x-4 items-center">
                                    <div className={`flex items-center justify-center gap-x-2 ${data.dashboard.overview[getBulanList().indexOf(bulan)]?.labaRugi?.laba_rugi?.gain ? `bg-green-300 text-green-900` : `bg-red-300 text-red-900`} text-sm font-bold p-6 rounded-full`}>
                                        {
                                            data.dashboard.overview[getBulanList().indexOf(bulan)]?.labaRugi?.laba_rugi?.gain ? <FaArrowDown size={40} /> : <FaArrowUp size={40} />
                                        }
                                    </div>
                                    <div className="flex flex-col">
                                        <p className={`text-sm font-bold ${data.dashboard.overview[getBulanList().indexOf(bulan)]?.labaRugi?.laba_rugi?.gain ? `text-green-700` : `text-red-800`}`}>{data.dashboard.overview[getBulanList().indexOf(bulan)]?.labaRugi?.laba_rugi?.gain ? "Gain" : "Loss"}</p>
                                        <h1 className={`text-4xl font-bold ${data.dashboard.overview[getBulanList().indexOf(bulan)]?.labaRugi?.laba_rugi?.gain ? `text-green-700` : `text-red-800`} mb-0`}>{parseToRupiahText(data.dashboard.overview[getBulanList().indexOf(bulan)]?.labaRugi?.laba_rugi?.gain ? data.dashboard.overview[getBulanList().indexOf(bulan)]?.labaRugi?.laba_rugi?.gain : data.dashboard.overview[getBulanList().indexOf(bulan)]?.labaRugi?.laba_rugi?.loss * -1)}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-8 p-4 flex-1 flex">
                            <table className="table table-sm">
                                <tbody>
                                    <tr>
                                        <td>Harga Pokok Penjualan</td>
                                        <td className="text-right font-bold">{data.dashboard.overview[getBulanList().indexOf(bulan)]?.labaRugi?.harga_pokok_penjualan?.count}</td>
                                    </tr>
                                    <tr>
                                        <td>Beban Operasional</td>
                                        <td className="text-right font-bold">{data.dashboard.overview[getBulanList().indexOf(bulan)]?.labaRugi?.beban_operasional?.count}</td>
                                    </tr>
                                    <tr>
                                        <td>Beban Lainnya</td>
                                        <td className="text-right font-bold">{data.dashboard.overview[getBulanList().indexOf(bulan)]?.labaRugi?.beban_lainnya?.count}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className="table table-sm">
                                <tr className="border-b-2">
                                    <td>Pendapatan</td>
                                    <td className="text-right font-bold">{data.dashboard.overview[getBulanList().indexOf(bulan)]?.labaRugi?.pendapatan?.count}</td>
                                </tr>
                                <tr className="border-b-2">
                                    <td>Pendapatan Lain - Lain</td>
                                    <td className="text-right font-bold">{data.dashboard.overview[getBulanList().indexOf(bulan)]?.labaRugi?.pendapatanLainLain?.count}</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td className="text-right font-bold">&nbsp;</td>
                                </tr>
                            </table>
                        </div>
                        <div className="col-span-12">
                            <div className="flex justify-center px-3">
                                <div className={`flex items-center w-max ${parseRupiahToFloat(data.dashboard.overview[getBulanList().indexOf(bulan)]?.neraca?.neraca?.aktiva) == parseRupiahToFloat(data.dashboard.overview[getBulanList().indexOf(bulan)]?.neraca?.neraca?.pasiva) ? `bg-green-400 text-green-900` : `bg-red-400 text-red-900`} px-2 py-1 gap-x-2 rounded-md`}>
                                    {
                                        parseRupiahToFloat(data.dashboard.overview[getBulanList().indexOf(bulan)]?.neraca?.neraca?.aktiva) == parseRupiahToFloat(data.dashboard.overview[getBulanList().indexOf(bulan)]?.neraca?.neraca?.pasiva) ?
                                            <FaCheck size={14} />
                                            :
                                            <FaTimes size={14} />
                                    }
                                    {
                                        parseRupiahToFloat(data.dashboard.overview[getBulanList().indexOf(bulan)]?.neraca?.neraca?.aktiva) == parseRupiahToFloat(data.dashboard.overview[getBulanList().indexOf(bulan)]?.neraca?.neraca?.pasiva) ?
                                            <p className="text-xs font-bold">Aktiva dan Pasiva Seimbang</p>
                                            :
                                            <p className="text-xs font-bold">Aktiva dan Pasiva Tidak Seimbang</p>
                                    }
                                </div>
                            </div>
                            <StackedBarApex
                                seriesValueLabel={
                                    [
                                        parseToRupiahText(parseRupiahToFloat(data.dashboard.overview[getBulanList().indexOf(bulan)]?.neraca?.neraca?.aktiva)) ? parseToRupiahText(parseRupiahToFloat(data.dashboard.overview[getBulanList().indexOf(bulan)]?.neraca?.neraca?.aktiva)) : 0,
                                        parseToRupiahText(parseRupiahToFloat(data.dashboard.overview[getBulanList().indexOf(bulan)]?.neraca?.neraca?.pasiva)) ? parseToRupiahText(parseRupiahToFloat(data.dashboard.overview[getBulanList().indexOf(bulan)]?.neraca?.neraca?.pasiva)) : 0
                                    ]
                                }
                                categories={["Neraca"]}
                                height={"240"}
                                series={[
                                    {
                                        name: "Aktiva",
                                        data: [parseRupiahToFloat(data.dashboard.overview[getBulanList().indexOf(bulan)]?.neraca?.neraca?.aktiva)],
                                    },
                                    {
                                        name: "Pasiva",
                                        data: [parseRupiahToFloat(data.dashboard.overview[getBulanList().indexOf(bulan)]?.neraca?.neraca?.pasiva)],
                                    }
                                ]}
                            />
                            <div className="flex justify-around">
                                <div className="text-center">
                                    <p className="text-sm">Aset</p>
                                    <p className="text-md font-bold">Rp. {parseToRupiahText(data.dashboard.overview[getBulanList().indexOf(bulan)]?.neraca?.harta?.count)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm">Kewajiban</p>
                                    <p className="text-md font-bold">Rp. {parseToRupiahText(data.dashboard.overview[getBulanList().indexOf(bulan)]?.neraca?.utang?.count)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm">Ekuitas</p>
                                    <p className="text-md font-bold">Rp. {parseToRupiahText(data.dashboard.overview[getBulanList().indexOf(bulan)]?.neraca?.modal?.count)}</p>
                                </div>
                            </div>
                            <div className="text-center mt-10">
                                <p className="text-xl uppercase font-bold">Perubahan Modal</p>
                                <p className="text-md font-bold">Rp. {
                                    data?.dashboard?.overview[getBulanList().indexOf(bulan)]?.perubahanModal ?
                                        data?.dashboard?.overview[getBulanList().indexOf(bulan)]?.perubahanModal[getBulanList().indexOf(bulan)] ? data?.dashboard?.overview[getBulanList().indexOf(bulan)]?.perubahanModal[getBulanList().indexOf(bulan)] : 0
                                        :
                                        0
                                }</p>
                            </div>
                        </div>
                    </div>
                </>
            })
        }
    </div>
}
export default Overview;