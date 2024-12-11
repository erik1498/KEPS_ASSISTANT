import Wrap from "../../component/layout/Wrap"
import { getBulanList } from "../../helper/date.helper"
import { getRandom, parseToRupiahText } from "../../helper/number.helper"
import StackedBar from "../../component/chart/StackedBar"
import { KodeAkunType } from "../../config/objectList.config"

const DashboardPage = () => {
    const neracaSaldo = {
        debet: getRandom(getBulanList().length),
        kredit: getRandom(getBulanList().length)
    }

    return <Wrap
        isLoading={false}
    >
        <h1 className="font-bold text-2xl my-5 text-white">Report Overview</h1>
        <div className="flex gap-x-2">
            <div className="flex-1 flex flex-col gap-y-2">
                <div className="flex gap-x-2">
                    <div className="flex-1 text-white bg-green-700 rounded-md shadow-xl flex flex-col px-6 py-5">
                        <p className="text-md font-bold">Debet</p>
                        <p className="text-2xl font-bold mt-2">Rp. {parseToRupiahText(getRandom(1).at(0) * 13566467)}</p>
                    </div>
                    <div className="flex-1 text-white bg-red-700 rounded-md shadow-xl flex flex-col px-6 py-5">
                        <p className="text-md font-bold">Kredit</p>
                        <p className="text-2xl font-bold mt-2">Rp. {parseToRupiahText(getRandom(1).at(0) * 13566467)}</p>
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-x-2 bg-white rounded-md shadow-2xl">
                    <div className="flex-1 border-b-2 border-gray-600 flex gap-x-2 px-6 py-5">
                        <div className="flex-1">
                            <p className="text-md font-bold">Bukti Transaksi</p>
                            <p className="text-2xl font-bold mt-2">{parseToRupiahText(getRandom(1).at(0) * 2)}</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-md font-bold">Bukti Transaksi Tidak Seimbang</p>
                            <p className="text-2xl font-bold mt-2">{parseToRupiahText(getRandom(1).at(0) * 2)}</p>
                        </div>
                    </div>
                    <div className="flex-1 flex-col flex gap-x-2 px-6 py-5">
                        <p className="text-md font-bold">Transaksi</p>
                        <p className="text-2xl font-bold mt-2">{parseToRupiahText(getRandom(1).at(0) * 2)}</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 bg-white rounded-md shadow-2xl">
                <div className="rounded-md p-5">
                    <p className="text-md font-bold">Persentase Debet dan Kredit</p>
                    <StackedBar
                        legendDisplay={false}
                        indexAxis={"y"}
                        yAxisLabelDisplay={false}
                        data={{
                            labels: ["Persentase"],
                            datasets: [
                                {
                                    label: "Debet",
                                    data: neracaSaldo.debet,
                                    backgroundColor: 'rgba(13, 133, 0, 1)',
                                    stack: "0",
                                },
                                {
                                    label: "Kredit",
                                    data: neracaSaldo.debet.map(i => 100 - i),
                                    backgroundColor: 'rgba(200, 0, 0, 1)',
                                    stack: "0",
                                }
                            ],
                        }} />
                </div>
            </div>
            <div className="flex-1 bg-white rounded-md shadow-2xl">
                <div className="rounded-md p-5">
                    <p className="text-md font-bold">Persentase Debet dan Kredit Tipe Akun</p>
                    <StackedBar
                        legendDisplay={false}
                        indexAxis={"y"}
                        data={{
                            labels: KodeAkunType.map(i => i.name),
                            datasets: [
                                {
                                    label: "Debet",
                                    data: neracaSaldo.debet,
                                    backgroundColor: 'rgba(13, 133, 0, 1)',
                                    stack: "0",
                                },
                                {
                                    label: "Kredit",
                                    data: neracaSaldo.debet.map(i => 100 - i),
                                    backgroundColor: 'rgba(200, 0, 0, 1)',
                                    stack: "0",
                                }
                            ],
                        }} />
                </div>
            </div>
        </div>
        <div className="flex gap-x-2 mt-3">
            <div className="flex-1 bg-white rounded-md shadow-2xl">
                <div className="rounded-md p-5">
                    <p className="text-md font-bold">Persentase Saldo</p>
                    <div className="mt-6">
                        <div className="flex justify-between my-2">
                            <p className="text-xs font-bold">Saldo Debet</p>
                            <p className="text-xs font-bold">Saldo Kredit</p>
                        </div>
                        <div className="flex justify-between my-2">
                            <p className="font-bold text-sm">Rp {parseToRupiahText(getRandom(1).at(0) * 5641323)} ( {getRandom(1).at(0)} % )</p>
                            <p className="font-bold text-sm">Rp {parseToRupiahText(getRandom(1).at(0) * 5641323)} ( {getRandom(1).at(0)} % )</p>
                        </div>
                        <div class="h-full w-full bg-red-600 rounded-md">
                            <div class="h-6 rounded-md bg-green-700" style={{ width: `${getRandom(1).at(0)}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex gap-x-2 mt-3">
        <div className="flex-1 bg-white rounded-md shadow-2xl">
                <table className="table">
                    <tbody>
                        <tr>
                            <th colSpan={2}>3 Kode Akun Debet Terbesar</th>
                        </tr>
                        <tr>
                            <th>101</th>
                            <td>Kas Besar</td>
                            <td className="text-right font-bold">Rp. {parseToRupiahText(getRandom(1).at(0) * 64865)}</td>
                        </tr>
                        <tr>
                            <th>111</th>
                            <td>Piutang Karyawan</td>
                            <td className="text-right font-bold">Rp. {parseToRupiahText(getRandom(1).at(0) * 64865)}</td>
                        </tr>
                        <tr>
                            <th>503</th>
                            <td>Beban Transport</td>
                            <td className="text-right font-bold">Rp. {parseToRupiahText(getRandom(1).at(0) * 64865)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="flex-1 bg-white rounded-md shadow-2xl">
                <table className="table">
                    <tbody>
                        <tr>
                            <th colSpan={2}>3 Kode Akun Kredit Terbesar</th>
                        </tr>
                        <tr>
                            <th>101</th>
                            <td>Kas Besar</td>
                            <td className="text-right font-bold">Rp. {parseToRupiahText(getRandom(1).at(0) * 64865)}</td>
                        </tr>
                        <tr>
                            <th>111</th>
                            <td>Piutang Karyawan</td>
                            <td className="text-right font-bold">Rp. {parseToRupiahText(getRandom(1).at(0) * 64865)}</td>
                        </tr>
                        <tr>
                            <th>503</th>
                            <td>Beban Transport</td>
                            <td className="text-right font-bold">Rp. {parseToRupiahText(getRandom(1).at(0) * 64865)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        {/* <div className="grid grid-cols-12 mt-4">
            <div className="col-span-12">
                <div className="bg-white rounded-md shadow-xl px-6 py-5">
                    <h1 className="text-2xl font-bold uppercase">Laporan Neraca Saldo</h1>
                    <p className="text-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur deserunt nam labore voluptate molestiae nostrum provident alias, quasi fuga sit?</p>
                    <div className="flex">
                        <div className="flex-1">
                            <div className="rounded-md p-5 mt-4">
                                <p className="text-md font-bold">Debet Dan Kredit</p>
                                <StackedBar data={{
                                    labels: getBulanList(),
                                    datasets: [
                                        {
                                            label: 'Debet',
                                            data: neracaSaldo.debet,
                                            backgroundColor: 'rgba(13, 133, 0, 1)',
                                            stack: "0",
                                        },
                                        {
                                            label: 'Kredit',
                                            data: neracaSaldo.debet,
                                            backgroundColor: 'rgba(200, 0, 0, 1)',
                                            stack: "1",
                                        }
                                    ],
                                }} />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="rounded-md p-5 mt-4">
                                <p className="text-md font-bold">Tipe Akun</p>
                                <StackedLine
                                    indexAxis={"y"}
                                    data={{
                                        labels: getBulanList(),
                                        datasets: [
                                            {
                                                label: 'Harta',
                                                data: getRandom(getBulanList().length),
                                                backgroundColor: 'rgba(29, 0, 236, 1)',
                                                stack: "0",
                                                borderColor: 'rgba(29, 0, 236, 1)',
                                            },
                                            {
                                                label: 'Utang',
                                                data: getRandom(getBulanList().length),
                                                backgroundColor: 'rgba(255, 186, 54, 1)',
                                                stack: "1",
                                                borderColor: 'rgba(255, 186, 54, 1)',
                                            },
                                            {
                                                label: 'Modal',
                                                data: getRandom(getBulanList().length),
                                                backgroundColor: 'rgba(200, 0, 0, 1)',
                                                stack: "2",
                                                borderColor: 'rgba(200, 0, 0, 1)',
                                            },
                                            {
                                                label: 'Pendapatan',
                                                data: getRandom(getBulanList().length),
                                                backgroundColor: 'rgba(0, 201, 255, 1)',
                                                stack: "3",
                                                borderColor: 'rgba(0, 201, 255, 1)',
                                            },
                                            {
                                                label: 'Beban Operasional',
                                                data: getRandom(getBulanList().length),
                                                backgroundColor: 'rgba(44, 101, 118, 1)',
                                                stack: "4",
                                                borderColor: 'rgba(44, 101, 118, 1)',
                                            },
                                            {
                                                label: 'Pendapatan Lain - Lain',
                                                data: getRandom(getBulanList().length),
                                                backgroundColor: 'rgba(0, 82, 68, 1)',
                                                stack: "5",
                                                borderColor: 'rgba(0, 82, 68, 1)',
                                            },
                                            {
                                                label: 'Harga Pokok Penjualan',
                                                data: getRandom(getBulanList().length),
                                                backgroundColor: 'rgba(74, 68, 83, 1)',
                                                stack: "6",
                                                borderColor: 'rgba(74, 68, 83, 1)',
                                            },
                                            {
                                                label: 'Beban Lainnya',
                                                data: getRandom(getBulanList().length),
                                                backgroundColor: 'rgba(255, 0, 110, 1)',
                                                stack: "7",
                                                borderColor: 'rgba(255, 0, 110, 1)',
                                            },
                                        ],
                                    }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> */}
        {/* <div className="grid grid-cols-12 mt-4">
            <div className="col-span-12">
                <div className="bg-white rounded-md shadow-xl px-6 py-5">
                    <h1 className="text-2xl font-bold uppercase">Laporan Laba Rugi</h1>
                    <p className="text-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur deserunt nam labore voluptate molestiae nostrum provident alias, quasi fuga sit?</p>
                    <div className="flex">
                        <div className="flex-1">
                            <div className="rounded-md p-5 mt-4">
                                <p className="text-md font-bold">Tipe Akun</p>
                                <StackedLine
                                    indexAxis={"y"}
                                    data={{
                                        labels: getBulanList(),
                                        datasets: [
                                            {
                                                label: 'Pendapatan Lain - Lain',
                                                data: getRandom(getBulanList().length),
                                                backgroundColor: 'rgba(29, 0, 236, 1)',
                                                stack: "0",
                                                borderColor: 'rgba(29, 0, 236, 1)',
                                            },
                                            {
                                                label: 'Pendapatan',
                                                data: getRandom(getBulanList().length),
                                                backgroundColor: 'rgba(255, 186, 54, 1)',
                                                stack: "1",
                                                borderColor: 'rgba(255, 186, 54, 1)',
                                            },
                                            {
                                                label: 'Harga Pokok Penjualan',
                                                data: getRandom(getBulanList().length),
                                                backgroundColor: 'rgba(200, 0, 0, 1)',
                                                stack: "2",
                                                borderColor: 'rgba(200, 0, 0, 1)',
                                            },
                                            {
                                                label: 'Laba Kotor',
                                                data: getBulanList().map((_, i) => i != 4 ? getRandom(1).at(0) : 0),
                                                backgroundColor: 'rgba(0, 82, 68, 1)',
                                                borderColor: 'rgba(0, 82, 68, 1)',
                                                stack: "0"
                                            },
                                            {
                                                label: 'Beban Operasional',
                                                data: getRandom(getBulanList().length),
                                                backgroundColor: 'rgba(0, 201, 255, 1)',
                                                stack: "3",
                                                borderColor: 'rgba(0, 201, 255, 1)',
                                            },
                                            {
                                                label: 'Beban Lainnya',
                                                data: getRandom(getBulanList().length),
                                                backgroundColor: 'rgba(44, 101, 118, 1)',
                                                stack: "4",
                                                borderColor: 'rgba(44, 101, 118, 1)',
                                            }
                                        ],
                                    }} />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="rounded-md p-5 mt-4">
                                <p className="text-md font-bold">Gain Dan Loss</p>
                                <StackedBar
                                    data={{
                                        labels: getBulanList(),
                                        datasets: [
                                            {
                                                label: 'Gain',
                                                data: getBulanList().map((_, i) => i != 4 ? getRandom(1).at(0) : 0),
                                                backgroundColor: 'rgba(13, 133, 0, 1)',
                                                stack: "0"
                                            },
                                            {
                                                label: 'Loss',
                                                data: getBulanList().map((_, i) => i == 4 ? getRandom(1).at(0) : 0),
                                                backgroundColor: 'rgba(200, 0, 0, 1)',
                                                stack: "0"
                                            }
                                        ],
                                    }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> */}
        {/* <div className="grid grid-cols-12 mt-4">
            <div className="col-span-12">
                <div className="bg-white rounded-md shadow-xl px-6 py-5">
                    <h1 className="text-2xl font-bold uppercase">Laporan Neraca</h1>
                    <p className="text-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur deserunt nam labore voluptate molestiae nostrum provident alias, quasi fuga sit?</p>
                    <div className="flex">
                        <div className="flex-1">
                            <div className="rounded-md p-5 mt-4">
                                <p className="text-md font-bold">Debet Dan Kredit</p>
                                <StackedBar data={{
                                    labels: getBulanList(),
                                    datasets: [
                                        {
                                            label: 'Debet',
                                            data: neracaSaldo.debet,
                                            backgroundColor: 'rgba(13, 133, 0, 1)',
                                            stack: "0",
                                        },
                                        {
                                            label: 'Kredit',
                                            data: neracaSaldo.debet,
                                            backgroundColor: 'rgba(200, 0, 0, 1)',
                                            stack: "1",
                                        },
                                    ],
                                }} />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="rounded-md p-5 mt-4">
                                <p className="text-md font-bold">Tipe Akun</p>
                                <StackedBar
                                    indexAxis={"y"}
                                    data={{
                                        labels: getBulanList(),
                                        datasets: [
                                            {
                                                label: 'Asset',
                                                data: getRandom(getBulanList().length),
                                                backgroundColor: 'rgba(29, 0, 236, 1)',
                                                borderColor: 'rgba(29, 0, 236, 1)',
                                            },
                                            {
                                                label: 'Kewajiban',
                                                data: getRandom(getBulanList().length),
                                                backgroundColor: 'rgba(255, 186, 54, 1)',
                                                borderColor: 'rgba(255, 186, 54, 1)',
                                            },
                                            {
                                                label: 'Ekuitas',
                                                data: getRandom(getBulanList().length),
                                                backgroundColor: 'rgba(200, 0, 0, 1)',
                                                borderColor: 'rgba(200, 0, 0, 1)',
                                            }
                                        ],
                                    }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> */}
    </Wrap>
}
export default DashboardPage