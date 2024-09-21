import { useEffect, useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"
import PotonganPegawaiForm from "./component/PotonganPegawaiForm"
import { FaPlus } from "react-icons/fa"
import BulanSelectedListCard from "../../../../component/card/BulanSelectedListCard"
import ToggleBox from "../../../../component/general/ToggleBox"
import { apiKerugianCRUD, apiLainLainCRUD, apiPiutangKaryawanCRUD, apiPPH2126CRUD } from "../../../../service/endPointList.api"
import DebetKreditStatusCard from "../../../../component/card/DebetKreditStatusCard"
import { normalizeDataJurnalUmum } from "../../../../helper/jurnalUmum.helper"
import { useDataContext } from "../../../../context/dataContext.context"
import { showError } from "../../../../helper/form.helper"
import PotonganRow from "./component/PotonganRow"

const PotonganPegawaiPage = () => {
    const { data } = useDataContext()
    const [potonganPegawaiForm, setPotonganPegawaiForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [bulan, setBulan] = useState(new Date().getMonth())

    const [toggleBox, setToggleBox] = useState("PPH 21/26")

    const [listTipePotongan, setListTipePotongan] = useState([
        "PPH 21/26",
        "Lain - Lain",
        "Kerugian",
        "Piutang"
    ])

    const [daftarTransaksi, setDaftarTransaksi] = useState([])
    const [dataPotonganPegawai, setDataPotonganPegawai] = useState([])
    const [debet, setDebet] = useState("0")
    const [kredit, setKredit] = useState("0")

    const _getData = () => {

        const listTipeApi = [
            {
                label: "PPH 21/26",
                api: apiPPH2126CRUD
            },
            {
                label: "Lain - Lain",
                api: apiLainLainCRUD
            },
            {
                label: "Kerugian",
                api: apiKerugianCRUD
            },
            {
                label: "Piutang",
                api: apiPiutangKaryawanCRUD
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
        setDataPotonganPegawai(normalizedData.returnData)
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
                potonganPegawaiForm ?
                    <PotonganPegawaiForm
                        setPotonganPegawaiForm={
                            () => setPotonganPegawaiForm(!potonganPegawaiForm)
                        }
                        setIsLoadingEvent={setIsLoading}
                    /> :
                    <>
                        <PageTitle title="Potongan Pegawai" />
                        <div className="grid grid-cols-6 gap-x-4">
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
                                            setPotonganPegawaiForm(true)
                                        }}><FaPlus /> Tambah Transaksi</button>
                                    </div>
                                </div>
                                <ToggleBox
                                    addClass={"px-4 py-3"}
                                    label="Tipe Potongan"
                                    setToggleBox={setToggleBox}
                                    toggleBox={toggleBox}
                                    toggleBoxList={listTipePotongan.map(x => {
                                        return {
                                            value: x,
                                            label: x
                                        }
                                    })}
                                />
                                <div className="flex flex-col h-full overflow-y-scroll no-scrollbar w-full rounded-md">
                                    {
                                        dataPotonganPegawai.map((item, i) => {
                                            return <PotonganRow
                                                item={item}
                                                key={i}
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
export default PotonganPegawaiPage