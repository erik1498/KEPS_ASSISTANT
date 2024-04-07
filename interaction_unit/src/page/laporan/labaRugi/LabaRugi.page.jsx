import { useState } from "react";
import Wrap from "../../../component/layout/Wrap";
import PageTitle from "../../../component/general/PageTitle";
import { FaSearch } from "react-icons/fa";
import BulanSelectedListCard from "../../../component/card/BulanSelectedListCard";
import { apiLabaRugiR } from "../../../service/endPointList.api";
import { useDataContext } from "../../../context/dataContext.context";
import { useEffect } from "react";
import LabaRugiGain from "./component/LabaRugiGain";
import RowCard from "../../../component/card/RowCard";

const LabaRugiPage = () => {

    const dataContext = useDataContext()
    const { data } = dataContext

    const [isLoading, setIsLoading] = useState(false)
    const [bulan, setBulan] = useState(new Date().getMonth())
    const [labaRugi, setLabaRugi] = useState([])

    const _getData = () => {
        setIsLoading(true)
        apiLabaRugiR
            .custom(`/${bulan + 1}/${data.tahun}`, "GET")
            .then((resData) => {
                setLabaRugi(resData?.data)
                setIsLoading(false)
            }).catch(err => {
                console.log(err)
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
                                            dataList={labaRugi.harga_pokok_penjualan}
                                            title={"Harga Pokok Penjualan"}
                                            totalTitle={"Total Harga Pokok Penjualan"}
                                            addingContent={{
                                                title: "Laba Kotor",
                                                value: labaRugi.laba_rugi.laba_kotor
                                            }}
                                        />
                                        <RowCard
                                            dataList={labaRugi.beban_operasional}
                                            title={"Beban Operasional"}
                                            totalTitle={"Total Beban Operasional"}
                                        />
                                        <RowCard
                                            dataList={labaRugi.beban_lainnya}
                                            title={"Beban Lainnya"}
                                            totalTitle={"Total Beban Lainnya"}
                                        />
                                        <RowCard
                                            dataList={labaRugi.pendapatanLainLain}
                                            title={"Pendapatan Lain - Lain"}
                                            totalTitle={"Total Pendapatan Lain - Lain"}
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