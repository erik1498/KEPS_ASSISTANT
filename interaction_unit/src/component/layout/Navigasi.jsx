import { FaBook, FaBuilding, FaClipboardList, FaCog, FaListOl, FaMicrochip, FaMoneyBill, FaRegChartBar, FaSignOutAlt, FaThLarge } from "react-icons/fa";
import NavigationLink from "./NavigationLink";
import { useEffect } from "react";
import { useState } from "react";
import NavigationLinkParent from "./NavigationLinkParent";
import { eraseCookie, getCookie } from "../../helper/cookies.helper";
import { useNavigate } from "react-router-dom";
import FormSelect from "../form/FormSelect";
import { useDataContext } from "../../context/dataContext.context";
import { yearList } from "../../config/objectList.config";

const Navigasi = ({setLoadingOpen}) => {
    const navigate = useNavigate()

    const { data, setData } = useDataContext()

    const [tahun, setTahun] = useState(data.tahun)
    const [sideBars, setSideBars] = useState([])

    useEffect(() => {
        let sidebarArr = window.location.pathname.split("/").slice(1)
        sidebarArr = sidebarArr.map(item => {
            return (item.charAt(0).toUpperCase() + item.slice(1)).replace(/([A-Z])/g, ' $1').trim()
        })
        setSideBars(sidebarArr)
    }, [])

    return <>
        <div className="top-36 left-0 right-0 fixed -z-0 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#1e3a8a" fill-opacity="1" d="M0,192L48,192C96,192,192,192,288,170.7C384,149,480,107,576,128C672,149,768,235,864,229.3C960,224,1056,128,1152,101.3C1248,75,1344,117,1392,138.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
        </div>
        <div className="sticky top-0 z-50">
            <div className="bg-white px-8 py-5 grid grid-cols-2">
                <div className="uppercase text-blue-900">
                    <h1 className="text-xl font-bold">Keps Assistant</h1>
                    <p className="text-[9px] bg-blue-900 w-max text-white font-bold px-3 py-1 rounded-md">Friend of Your Business Progress</p>
                </div>
                <div className="col-span-1 flex justify-end align-middle">
                    <div
                        onClick={() => {
                            setLoadingOpen(true)
                            eraseCookie("token")
                            eraseCookie("refreshToken")
                            eraseCookie("tokenExpired")
                            eraseCookie("login")
                            eraseCookie("loadedKodeAkun")
                            navigate("/")
                        }}
                        className="flex items-center bg-red-800 p-4 text-white rounded-full shadow-2xl cursor-pointer"
                    >
                        <FaSignOutAlt size={20} />
                    </div>
                </div>
            </div>
            <ul className="menu menu-horizontal bg-white text-blue-900 px-2 w-full border-t-2 border-blue-900 shadow-2xl">
                <li>
                    <NavigationLink
                        icon={<FaThLarge />}
                        label={"Dashboard"}
                        to={"/dashboard"}
                        addClass={"mr-2 ml-6"}
                    />
                </li>
                <li>
                    <NavigationLink
                        icon={<FaClipboardList />}
                        label={"Kode Akun"}
                        to={"/perusahaan/kodeAkun"}
                    />
                </li>
                <li>
                    <details>
                        <NavigationLinkParent
                            Icon={<FaBook size={15} />}
                            parentName={"Buku Besar"}
                            sideBars={sideBars[0]}
                        />
                        <ul className="bg-white rounded-md w-full">
                            <li>
                                <NavigationLink to="/bukuBesar/jurnalUmum" addClass={"my-1"} label={"Jurnal Umum"} />
                            </li>
                            <li>
                                <NavigationLink to="/bukuBesar/historyAkun" addClass={"my-1"} label={"History Akun"} />
                            </li>
                        </ul>
                    </details>
                </li>
                <li>
                    <details>
                        <NavigationLinkParent
                            Icon={<FaRegChartBar size={15} />}
                            parentName={"Laporan"}
                            sideBars={sideBars[0]}
                        />
                        <ul className="bg-white rounded-md w-max">
                            <li>
                                <NavigationLink to="/laporan/neracaSaldo" addClass={"my-1"} label={"Neraca Saldo"} />
                            </li>
                            <li>
                                <NavigationLink to="/laporan/labaRugi" addClass={"my-1"} label={"Laba Rugi"} />
                            </li>
                            <li>
                                <NavigationLink to="/laporan/neraca" addClass={"my-1"} label={"Neraca"} />
                            </li>
                            <li>
                                <NavigationLink to="/laporan/perubahanModal" addClass={"my-1"} label={"Perubahan Modal"} />
                            </li>
                        </ul>
                    </details>
                </li>
            </ul>
            <div className="flex justify-between  py-3 px-8 bg-blue-900">
                <div className="text-sm text-white breadcrumbs">
                    <ul>
                        {
                            sideBars.map(item => {
                                return <>
                                    <li>
                                        <p>{item}</p>
                                    </li>
                                </>
                            })
                        }
                    </ul>
                </div>
                <FormSelect
                    optionsDataList={yearList()}
                    optionsLabel={"value"}
                    optionsValue={"value"}
                    selectValue={{
                        label: tahun,
                        value: tahun
                    }}
                    onchange={(e) => {
                        let dataCopy = data
                        dataCopy.tahun = e.value
                        setData(dataCopy)
                        setTahun(e.value)
                    }}
                    addClass={`w-max bg-blue-900 font-bold`}
                />
            </div>
        </div>
    </>
}

export default Navigasi;