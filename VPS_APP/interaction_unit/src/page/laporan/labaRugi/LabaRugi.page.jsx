import { useState } from "react";
import Wrap from "../../../component/layout/Wrap";
import PageTitle from "../../../component/general/PageTitle";
import { FaPrint, FaSearch } from "react-icons/fa";
import BulanSelectedListCard from "../../../component/card/BulanSelectedListCard";
import { apiLabaRugiR } from "../../../service/endPointList.api";
import { useDataContext } from "../../../context/dataContext.context";
import { useEffect } from "react";
import LabaRugiGain from "./component/LabaRugiGain";
import RowCard from "../../../component/card/RowCard";
import { getNormalizedLabaKotorRugiKotor } from "../../../helper/labaRugi.helper";
import { parseRupiahToFloat, parseToRupiahText } from "../../../helper/number.helper";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { LabaRugiPrint } from "./component/LabaRugiPrint";
import { getBulanByIndex } from "../../../helper/date.helper";

const LabaRugiPage = () => {

    const dataContext = useDataContext()
    const { data, setData } = dataContext

    const [isLoading, setIsLoading] = useState(false)
    const [bulan, setBulan] = useState(new Date().getMonth())
    const [labaRugi, setLabaRugi] = useState([])

    const labaRugiPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => labaRugiPrintRef.current,
    });

    const _getData = () => {
        setIsLoading(true)
        apiLabaRugiR
            .custom(`/${bulan + 1}/${data.tahun}`, "GET")
            .then((resData) => {

                let dataCopy = data
                dataCopy.dashboard.overview[bulan].labaRugi = resData?.data
                setData(dataCopy)

                setLabaRugi(resData?.data)
                setIsLoading(false)
            }).catch(err => {
                showError(err)
            })
    }

    useEffect(() => {
        _getData()
    }, [bulan])

    return <Wrap
        isLoading={isLoading}>
        <div>
            <PageTitle title={"Laba Rugi"} />
            <div className="grid grid-cols-6">
                <div className="col-span-1">
                    <BulanSelectedListCard
                        bulan={bulan}
                        setBulan={setBulan}
                    />
                    <LabaRugiGain
                        labaRugi={labaRugi}
                    />
                    <div className="hidden">
                        <LabaRugiPrint
                            data={labaRugi}
                            ref={labaRugiPrintRef}
                            bulan={getBulanByIndex(bulan)}
                            tahun={data.tahun}
                            labaRugi={labaRugi}
                        />
                    </div>
                    <button
                        onClick={handlePrint}
                        className="btn btn-sm bg-red-600 hover:bg-red-600 mt-2 text-white border-red-600"
                    >
                        <FaPrint /> Cetak Laba Rugi
                    </button>
                </div>
                <div className="col-span-5">
                    <div className="h-[65vh] pl-2">
                        <div className="flex flex-col h-full overflow-y-scroll no-scrollbar w-full rounded-md">
                            {
                                Object.keys(labaRugi).length > 0 ?
                                    <>
                                        <RowCard
                                            dataList={labaRugi.pendapatan}
                                            title={"Pendapatan"}
                                            totalTitle={"Total Pendapatan"}
                                        />
                                        <RowCard
                                            dataList={labaRugi.beban_pokok_penjualan}
                                            title={"Beban Pokok Penjualan"}
                                            totalTitle={"Total Beban Pokok Penjualan"}
                                            addingContent={[
                                                {
                                                    title: "Laba Kotor Jasa",
                                                    value: parseToRupiahText(parseRupiahToFloat(labaRugi.laba_rugi.laba_kotor_jasa))
                                                }
                                            ]}
                                        />
                                        <RowCard
                                            dataList={labaRugi.harga_pokok_penjualan}
                                            title={"Harga Pokok Penjualan"}
                                            totalTitle={"Total Harga Pokok Penjualan"}
                                            addingContent={[
                                                {
                                                    title: "Laba Kotor Barang",
                                                    value: parseToRupiahText(parseRupiahToFloat(labaRugi.laba_rugi.laba_kotor_barang))
                                                },
                                                {
                                                    title: getNormalizedLabaKotorRugiKotor(labaRugi.laba_rugi.laba_kotor),
                                                    value: parseToRupiahText(parseRupiahToFloat(labaRugi.laba_rugi.laba_kotor))
                                                }
                                            ]}
                                        />
                                        <RowCard
                                            dataList={labaRugi.beban_operasional_dan_administrasi}
                                            title={"Beban Operasional Dan Administrasi"}
                                            totalTitle={"Total Beban Operasional Dan Administrasi"}
                                        />
                                        <RowCard
                                            dataList={labaRugi.pendapatan_lain_lain}
                                            title={"Pendapatan Lain - Lain"}
                                            totalTitle={"Total Pendapatan Lain - Lain"}
                                        />
                                        <RowCard
                                            dataList={labaRugi.beban_lain_lain}
                                            title={"Beban Lain - Lain"}
                                            totalTitle={"Total Beban Lain - Lain"}
                                        />
                                        <RowCard
                                            dataList={labaRugi.beban_bunga_dan_pajak}
                                            title={"Beban Bunga Dan Pajak"}
                                            totalTitle={"Total Beban Bunga Dan Pajak"}
                                        />
                                    </>
                                    :
                                    <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Wrap>
}

export default LabaRugiPage;