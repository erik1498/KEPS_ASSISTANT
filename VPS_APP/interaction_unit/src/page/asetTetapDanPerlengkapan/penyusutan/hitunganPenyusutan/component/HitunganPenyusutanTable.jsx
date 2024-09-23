import { useEffect, useState } from "react"
import { apiDaftarAsetCRUD } from "../../../../../service/endPointList.api"
import { parseToRupiahText } from "../../../../../helper/number.helper"

const HitunganPenyusutanTable = ({
    idAset,
    metodePenyusutanName
}) => {

    const [hitunganList, setHitunganList] = useState([])
    const _getHitunganPenyusutan = () => {
        apiDaftarAsetCRUD.custom(`/hitungan_penyusutan/${idAset}`, "GET")
            .then(resData => {
                setHitunganList(resData.data)
            })
    }

    useEffect(() => {
        _getHitunganPenyusutan()
    }, [])
    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl my-6">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">Hitungan Penyusutan</h1>
            </div>
            <table className="table">

                <thead>
                    <tr className="sticky top-0 bg-white py-4 text-black">
                        {
                            metodePenyusutanName == "Garis Lurus" ?
                                <>
                                    <th>No.</th>
                                    <th>Tahun Perolehan</th>
                                    <th colSpan={2}>Masa</th>
                                    <th>Harga Beli</th>
                                    <th>Persentase %</th>
                                    <th>Nilai Penyusutan</th>
                                    <th>Nilai Buku</th>
                                </>
                                :
                                <>
                                    <th>No.</th>
                                    <th>Tahun Perolehan</th>
                                    <th>Harga Beli</th>
                                    <th>Akumulasi Penyusutan Awal Tahun</th>
                                    <th>Nilai Buku Awal Tahun</th>
                                    <th>Persentase %</th>
                                    <th>Nilai Penyusutan</th>
                                    <th>Nilai Buku Akhir Tahun</th>
                                </>
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        metodePenyusutanName == "Garis Lurus" ?
                            <>
                                {
                                    hitunganList.map((item, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{item.tahunPerolehan}</td>
                                                <td>{item.masa ? item.masa[0] : null}</td>
                                                <td>{item.masa ? item.masa[1] : null}</td>
                                                <td>{parseToRupiahText(item.hargaBeli)}</td>
                                                <td>{parseToRupiahText(item.persentase)}</td>
                                                <td>{parseToRupiahText(item.nilaiPenyusutan)}</td>
                                                <td>{parseToRupiahText(item.nilaiBuku)}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </>
                            :
                            <>
                                {
                                    hitunganList.map((item, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{item.tahunPerolehan}</td>
                                                <td>{parseToRupiahText(item.hargaBeli)}</td>
                                                <td>{parseToRupiahText(item.akumulasiPenyusutanAwalTahun)}</td>
                                                <td>{parseToRupiahText(item.nilaiBukuAwalTahun)}</td>
                                                <td>{parseToRupiahText(item.persentasePenyusutan)}</td>
                                                <td>{parseToRupiahText(item.nilaiPenyusutan)}</td>
                                                <td>{parseToRupiahText(item.nilaiBukuAkhirTahun)}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </>
                    }
                </tbody>
            </table>
        </div>
    </>
}
export default HitunganPenyusutanTable