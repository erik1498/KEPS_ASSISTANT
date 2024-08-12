import { useEffect, useState } from "react";
import { pegawaiList } from "../../../config/objectList.config";
import { parseToRupiahText } from "../../../helper/number.helper";
import { apiAktivitasDokumen, apiRiwayatPembayaranAktivitasDokumen, apiStatusRiwayatAktivitasDokumenPegawaiPelaksana } from "../../../service/endPointList.api";
import { useDataContext } from "../../../context/dataContext.context";
import StackedBarApex from "../../../component/chart/apex/StackedBarApex";
import { FaDotCircle } from "react-icons/fa";
import { formatDate } from "../../../helper/date.helper";

const AktivitasDokumen = () => {

    const { data } = useDataContext()

    const [dataAktivitasDokumen, setDataAktivitasDokumen] = useState()

    const normalizeDataAktivitasDokumen = async () => {
        try {

            const riwayatPembayaran = await apiRiwayatPembayaranAktivitasDokumen.custom("/all/" + data.tahun, "GET")
            const riwayatPembayaranData = riwayatPembayaran.data.map(x => {
                x.list_pembayaran = x.list_pembayaran == null ? [] : JSON.parse(`[${x.list_pembayaran}]`)
                return x
            })

            const riwayatStatusAktivitasPegawaiPelaksana = await apiStatusRiwayatAktivitasDokumenPegawaiPelaksana.custom("/all/" + data.tahun, "GET")
            const riwayatStatusAktivitasPegawaiPelaksanaData = riwayatStatusAktivitasPegawaiPelaksana.data

            const response = await apiAktivitasDokumen.custom(`/tahun/${data.tahun}`)
            const responseData = response.data.entry

            const pegawaiListData = pegawaiList

            for (let index = 0; index < pegawaiListData.length; index++) {
                pegawaiListData[index].total_dokumen = responseData.filter(x => x.penanggung_jawab == pegawaiListData[index].nama).length
                pegawaiListData[index].mulai = responseData.filter(x => x.penanggung_jawab == pegawaiListData[index].nama && x.status == "Mulai").length
                pegawaiListData[index].dalam_proses = responseData.filter(x => x.penanggung_jawab == pegawaiListData[index].nama && x.status == "Dalam Proses").length
                pegawaiListData[index].selesai = responseData.filter(x => x.penanggung_jawab == pegawaiListData[index].nama && x.status == "Selesai").length
                pegawaiListData[index].riwayat_pembayaran = riwayatPembayaranData.map(x => {
                    if (x.list_pembayaran.filter(y => y.pegawai_penerima == pegawaiListData[index].nama).length > 0)
                        return 1
                    return 0
                }).reduce((sum, current) => { return sum + current }, 0)
                pegawaiListData[index].riwayat_pembayaran_total = riwayatPembayaranData.map(x => x.list_pembayaran.length).reduce((sum, current) => { return sum + current }, 0)
                pegawaiListData[index].pegawai_pelaksana = riwayatStatusAktivitasPegawaiPelaksanaData.filter(x => x.pegawai_pelaksana?.split(",").indexOf(pegawaiListData[index].nama) > -1).length
                pegawaiListData[index].pegawai_pelaksana_total = riwayatStatusAktivitasPegawaiPelaksanaData.length
            }

            setDataAktivitasDokumen(x => x = {
                total_dokumen: responseData.length,
                selesai: responseData.filter(x => x.status == "Selesai").length,
                belum_selesai: responseData.filter(x => x.status != "Selesai").length,
                mulai: responseData.filter(x => x.status == "Mulai").length,
                dalam_proses: responseData.filter(x => x.status == "Dalam Proses").length,
                pegawai_data: pegawaiListData,
                riwayat_pembayaran: riwayatPembayaranData,
                total_pegawai_pelaksana: riwayatStatusAktivitasPegawaiPelaksanaData?.map(x => x.pegawai_pelaksana?.split(",")?.length)?.reduce((sum, current) => { sum + current }, 1)
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
        <div className="grid grid-cols-12 gap-x-2">
            <div className="col-span-6">
                {
                    dataAktivitasDokumen?.pegawai_data?.map((item, i) => {
                        return <>
                            <div className="bg-white px-6 py-6 rounded-xl shadow-lg mb-2">
                                <p className="text-4xl font-bold ">{item.nama}</p>
                                <div className="flex mt-5">
                                    <div className="w-full">
                                        <p className="font-bold bg-gray-400 w-max rounded-md px-4 text-white">{item.total_dokumen} Dokumen</p>
                                        <div className="flex w-full py-3">
                                            <div className={`bg-blue-600 h-6 rounded-full`} style={{ width: `${(item.mulai * 100) / item.total_dokumen}%` }}></div>
                                            <div className={`bg-red-600 h-6 rounded-full`} style={{ width: `${(item.dalam_proses * 100) / item.total_dokumen}%` }}></div>
                                            <div className={`bg-green-600 h-6 rounded-full`} style={{ width: `${(item.selesai * 100) / item.total_dokumen}%` }}></div>
                                        </div>
                                        <div className="flex gap-x-2 font-bold w-full pb-3">
                                            <p className="text-blue-600 border-r-2 border-gray-400 pr-2">
                                                {item.mulai} Mulai
                                            </p>
                                            <p className="text-red-600 border-r-2 border-gray-400 pr-2">
                                                {item.dalam_proses} Dalam Proses
                                            </p>
                                            <p className="text-green-600 rounded">
                                                {item.selesai} Selesai
                                            </p>
                                        </div>

                                        <div className="border-b-2 pb-4 border-gray-300">
                                            <p className="text-md font-bold mt-5 mb-2">Keterlibatan Dalam Riwayat Pembayaran</p>
                                            <div className="flex w-full">
                                                <div className={`bg-orange-600 h-3 rounded`} style={{ width: `${(item.riwayat_pembayaran * 100) / item.riwayat_pembayaran_total}%` }}></div>
                                            </div>
                                            <p className="text-xs font-semibold mt-1">Terlibat Dalam {item.riwayat_pembayaran} Dari {item.riwayat_pembayaran_total} Riwayat Pembayaran ({(item.riwayat_pembayaran * 100) / item.riwayat_pembayaran_total} %)</p>
                                        </div>

                                        <div className="border-b-2 pb-4 border-gray-300">
                                            <p className="text-md font-bold mt-5 mb-2">Staf Pelaksana</p>
                                            <div className="flex w-full">
                                                <div className={`bg-lime-600 h-3 rounded`} style={{ width: `${isNaN((item.pegawai_pelaksana * 100) / item?.pegawai_pelaksana_total) ? "0" : (item.pegawai_pelaksana * 100) / item?.pegawai_pelaksana_total}%` }}></div>
                                            </div>
                                            <p className="text-xs font-semibold mt-1">Menjadi {item.pegawai_pelaksana} Kali Staff Pelaksana Dari {item.pegawai_pelaksana_total} Tugas ({isNaN((item.pegawai_pelaksana * 100) / item?.pegawai_pelaksana_total) ? "0" : (item.pegawai_pelaksana * 100) / item?.pegawai_pelaksana_total}%`)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    })
                }
            </div>
            <div className="col-span-6">
                <div className="bg-white px-6 py-6 rounded-xl shadow-lg">
                    <p className="font-bold text-xl mb-4">Riwayat Pembayaran</p>
                    <div className="h-[100vh] overflow-y-scroll no-scrollbar">
                        {
                            dataAktivitasDokumen?.riwayat_pembayaran?.map((item, i) => {
                                return <div className="w-full" key={i}>
                                    <div className="bg-blue-800 rounded-full h-3 w-3/12 mt-5"></div>
                                    <div className="flex justify-between py-3 pl-2">
                                        <p className="font-bold text-md">No.Surat : {item.no_surat}</p>
                                        <p className="font-bold text-md bg-green-700 text-white px-2 rounded-full">Rp. {parseToRupiahText(item.biaya)}</p>
                                    </div>
                                    <div className="pl-4">
                                        {
                                            item?.list_pembayaran?.map((ktem, k) => {
                                                return <div className={`grid items-start grid-cols-12 py-2 border-t-2 rounded px-2`} key={k}>
                                                    <div className="col-span-4 flex items-center gap-x-2">
                                                        <FaDotCircle size={10} className="text-blue-600" />
                                                        <p className="text-sm">{formatDate(ktem.tanggal)}</p>
                                                    </div>
                                                    <div className="col-span-4">
                                                        <p className="text-sm">{ktem.pegawai_penerima}</p>
                                                        <p className="text-sm font-bold">{ktem.nomor_kwitansi_tanda_terima}</p>
                                                    </div>
                                                    <p className="col-span-4 text-sm text-right">Rp. {parseToRupiahText(ktem.nilai_pembayaran)}</p>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
}
export default AktivitasDokumen;