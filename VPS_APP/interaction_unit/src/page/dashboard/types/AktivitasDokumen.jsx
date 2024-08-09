import { useEffect, useState } from "react";
import { pegawaiList, statusAktivitasDokumenList } from "../../../config/objectList.config";
import { parseToRupiahText } from "../../../helper/number.helper";
import { apiAktivitasDokumen, apiRiwayatPembayaranAktivitasDokumen, apiStatusRiwayatAktivitasDokumenPegawaiPelaksana } from "../../../service/endPointList.api";
import { useDataContext } from "../../../context/dataContext.context";
import StackedBarApex from "../../../component/chart/apex/StackedBarApex";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import RadialBarApex from "../../../component/chart/apex/RadialBarApex";

const AktivitasDokumen = () => {

    const { data } = useDataContext()

    const [dataAktivitasDokumen, setDataAktivitasDokumen] = useState()

    const normalizeDataAktivitasDokumen = async () => {
        try {

            const riwayatPembayaran = await apiRiwayatPembayaranAktivitasDokumen.custom("/all", "GET")
            const riwayatPembayaranData = riwayatPembayaran.data


            const riwayatStatusAktivitasPegawaiPelaksana = await apiStatusRiwayatAktivitasDokumenPegawaiPelaksana.custom("/all", "GET")
            const riwayatStatusAktivitasPegawaiPelaksanaData = riwayatStatusAktivitasPegawaiPelaksana.data

            const response = await apiAktivitasDokumen.custom(`/tahun/${data.tahun}`)
            const responseData = response.data.entry

            const pegawaiListData = pegawaiList

            for (let index = 0; index < pegawaiListData.length; index++) {
                pegawaiListData[index].total_dokumen = responseData.filter(x => x.penanggung_jawab == pegawaiListData[index].nama).length
                pegawaiListData[index].mulai = responseData.filter(x => x.penanggung_jawab == pegawaiListData[index].nama && x.status == "Mulai").length
                pegawaiListData[index].dalam_proses = responseData.filter(x => x.penanggung_jawab == pegawaiListData[index].nama && x.status == "Dalam Proses").length
                pegawaiListData[index].selesai = responseData.filter(x => x.penanggung_jawab == pegawaiListData[index].nama && x.status == "Selesai").length
                pegawaiListData[index].riwayat_pembayaran = riwayatPembayaranData.filter(x => x.pegawai_penerima == pegawaiListData[index].nama).length
                pegawaiListData[index].pegawai_pelaksana = riwayatStatusAktivitasPegawaiPelaksanaData.filter(x => x.pegawai_pelaksana == pegawaiListData[index].nama).length
            }

            setDataAktivitasDokumen(x => x = {
                total_dokumen: responseData.length,
                selesai: responseData.filter(x => x.status == "Selesai").length,
                belum_selesai: responseData.filter(x => x.status != "Selesai").length,
                mulai: responseData.filter(x => x.status == "Mulai").length,
                dalam_proses: responseData.filter(x => x.status == "Dalam Proses").length,
                pegawai_data: pegawaiListData
            })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        normalizeDataAktivitasDokumen()
    }, [])

    return <div className="flex flex-col gap-y-3">
        <div className="grid grid-cols-12 gap-2">
            <div className="xl:col-span-12 col-span-12 flex xl:flex-row flex-col gap-x-2">
                <div className="flex-1 p-4 bg-white rounded-box shadow-2xl">
                    <div className="flex items-end">
                        <div className="flex-1">
                            <div className="py-3 px-2">
                                <h1 className="text-6xl font-bold">{parseToRupiahText(dataAktivitasDokumen?.total_dokumen)} Dokumen</h1>
                            </div>
                        </div>
                    </div>

                    <StackedBarApex
                        seriesValueLabel={
                            [
                                dataAktivitasDokumen?.mulai,
                                dataAktivitasDokumen?.dalam_proses,
                                dataAktivitasDokumen?.selesai
                            ]
                        }
                        categories={["Status Dokumen"]}
                        height={"240"}
                        seriesRupiah={false}
                        valueUseRp={false}
                        colors={['#1e3a8a', '#dc2626', '#15803d']}
                        series={[
                            {
                                name: "Mulai",
                                data: [dataAktivitasDokumen?.mulai],
                            },
                            {
                                name: "Dalam Proses",
                                data: [dataAktivitasDokumen?.dalam_proses],
                            },
                            {
                                name: "Selesai",
                                data: [dataAktivitasDokumen?.selesai],
                            }
                        ]}
                    />
                </div>
            </div>
        </div>
        {
            dataAktivitasDokumen?.pegawai_data?.map((item, i) => {
                return <>
                    <div className="bg-white px-6 py-6 rounded-xl shadow-lg">
                        <p className="text-4xl font-bold ">{item.nama}</p>
                        <div className="flex mt-5">
                            <div className="w-full">
                                <p className="font-bold bg-gray-400 w-max rounded-md px-4 text-white">{item.total_dokumen} Dokumen</p>
                                <div className="flex w-full py-3">
                                    <div className={`bg-blue-600 h-6 w-[${(item.mulai * 100) / item.total_dokumen}%] rounded`}></div>
                                    <div className={`bg-red-600 h-6 w-[${(item.dalam_proses * 100) / item.total_dokumen}%] rounded`}></div>
                                    <div className={`bg-green-600 h-6 w-[${(item.selesai * 100) / item.total_dokumen}%] rounded`}></div>
                                </div>
                                <div className="flex gap-x-2 font-bold w-full pb-3">
                                    <p className="text-blue-600 rounded">
                                        {item.mulai} Mulai
                                    </p>
                                    <p className="text-red-600 rounded">
                                        {item.dalam_proses} Dalam Proses
                                    </p>
                                    <p className="text-green-600 rounded">
                                        {item.selesai} Selesai
                                    </p>
                                </div>
                                <p>Terlibat Dalam {item.riwayat_pembayaran} Riwayat Pembayaran</p>
                                <p>{item.pegawai_pelaksana} Kali Menjadi Staf Pelaksana</p>
                            </div>
                        </div>
                    </div>
                </>
            })
        }
    </div>
}
export default AktivitasDokumen;