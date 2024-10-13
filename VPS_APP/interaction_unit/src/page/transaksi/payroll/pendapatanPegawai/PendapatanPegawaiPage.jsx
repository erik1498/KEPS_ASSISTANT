import { useEffect, useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"
import PendapatanPegawaiForm from "./component/PendapatanPegawaiForm"
import { FaPlus } from "react-icons/fa"
import BulanSelectedListCard from "../../../../component/card/BulanSelectedListCard"
import ToggleBox from "../../../../component/general/ToggleBox"
import PendapatanRow from "./component/PendapatanRow"
import { apiGajiCRUD, apiHadiahCRUD, apiLemburCRUD, apiTunjanganUangCRUD } from "../../../../service/endPointList.api"
import { useDataContext } from "../../../../context/dataContext.context"
import { showError } from "../../../../helper/form.helper"
import { normalizeDataJurnalUmum } from "../../../../helper/jurnalUmum.helper"
import DebetKreditStatusCard from "../../../../component/card/DebetKreditStatusCard"

const PendapatanPegawaiPage = () => {
    const { data } = useDataContext()
    const [pendapatanPegawaiForm, setPendapatanPegawaiForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [bulan, setBulan] = useState(new Date().getMonth())

    const [toggleBox, setToggleBox] = useState("Gaji")

    const [listTipePendapatan, setListTipePendapatan] = useState([
        "Gaji",
        "Tunjangan Uang",
        "Lembur",
        "Hadiah"
    ])

    const [daftarTransaksi, setDaftarTransaksi] = useState([])
    const [dataPendapatanPegawai, setDataPendapatanPegawai] = useState([])
    const [debet, setDebet] = useState("0")
    const [kredit, setKredit] = useState("0")

    const _getData = () => {
        const listTipeApi = [
            {
                label: "Gaji",
                api: apiGajiCRUD
            },
            {
                label: "Tunjangan Uang",
                api: apiTunjanganUangCRUD
            },
            {
                label: "Lembur",
                api: apiLemburCRUD
            },
            {
                label: "Hadiah",
                api: apiHadiahCRUD
            },
        ]

        setIsLoading(true)
        const apiSelected = listTipeApi.filter(x => x.label == toggleBox)[0].api
        
        apiSelected.custom(`?bulan=${bulan + 1}&tahun=${data.tahun}`, "GET")
            .then(async (resData) => {
                setDaftarTransaksi(x => x = resData.data)
                setIsLoading(false)
            })
            .catch(err => {
                showError(err)
            })
    };

    const normalizeData = async () => {
        let normalizedData = await normalizeDataJurnalUmum(daftarTransaksi.map(x => {
            x.bulan = bulan + 1
            x.tahun = data.tahun
            x.waktu = x.waktu ? x.waktu : x.tanggal.split("T")[1].replace(".000", "")
            x.tanggal = x.tanggal.length > 2 ? new Date(x.tanggal).getDate() : x.tanggal
            return x
        }))
        setDataPendapatanPegawai(normalizedData.returnData)
        setDebet(normalizedData.totalDebet)
        setKredit(normalizedData.totalKredit)
    }

    useEffect(() => {
        normalizeData()
    }, [daftarTransaksi])

    useEffect(() => {
        _getData()
    }, [toggleBox, bulan])

    return <Wrap
        isLoading={isLoading}>
        <div>
            {
                pendapatanPegawaiForm ?
                    <PendapatanPegawaiForm
                        setPendapatanPegawaiForm={
                            () => setPendapatanPegawaiForm(!pendapatanPegawaiForm)
                        }
                        setIsLoadingEvent={setIsLoading}
                    /> :
                    <>
                        <PageTitle title="Pendapatan Pegawai" />
                        <div className="grid grid-cols-6 gap-x-2">
                            <div className="col-span-1">
                                <BulanSelectedListCard
                                    bulan={bulan}
                                    setBulan={setBulan}
                                />
                                <DebetKreditStatusCard
                                    debet={debet}
                                    kredit={kredit}
                                />
                            </div>
                            <div className="col-span-5">
                                <div className="bg-white py-3 px-6 mb-3 rounded-md flex justify-end shadow-2xl">
                                    <div>
                                        <button className="btn btn-sm bg-blue-900 text-white border-none" onClick={() => {
                                            setPendapatanPegawaiForm(true)
                                        }}><FaPlus /> Tambah Transaksi</button>
                                    </div>
                                </div>
                                <ToggleBox
                                    addClass={"px-4 py-3"}
                                    label="Tipe Pendapatan"
                                    setToggleBox={setToggleBox}
                                    toggleBox={toggleBox}
                                    toggleBoxList={listTipePendapatan.map(x => {
                                        return {
                                            value: x,
                                            label: x
                                        }
                                    })}
                                />
                                <div className="flex flex-col h-full overflow-y-scroll no-scrollbar w-full rounded-md">
                                    {
                                        dataPendapatanPegawai.map((item, i) => {
                                            return <PendapatanRow
                                                item={item}
                                                key={i}
                                                forPrint={true}
                                            />
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </>
            }
        </div>
    </Wrap>
}
export default PendapatanPegawaiPage