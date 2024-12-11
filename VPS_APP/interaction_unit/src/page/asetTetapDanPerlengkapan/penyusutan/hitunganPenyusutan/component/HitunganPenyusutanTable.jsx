import { GARIS_LURUS } from "../../../../../config/objectList.config"
import { parseToRupiahText } from "../../../../../helper/number.helper"

const HitunganPenyusutanTable = ({
    hitunganList = [],
    metodePenyusutanName = GARIS_LURUS
}) => {

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl my-6">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">Hitungan Penyusutan</h1>
            </div>
            <table className="table">

                <thead>
                    <tr className="sticky top-0 bg-white py-4 text-black">
                        {
                            metodePenyusutanName == GARIS_LURUS ?
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
                        metodePenyusutanName == GARIS_LURUS ?
                            <>
                                {
                                    hitunganList.map((item, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{item.tahun_perolehan}</td>
                                                <td>{item.masa_awal != -1 ? item.masa_awal : null}</td>
                                                <td>{item.masa_akhir != -1 ? item.masa_akhir : null}</td>
                                                <td>{parseToRupiahText(item.harga_beli != -1 ? item.harga_beli : null)}</td>
                                                <td>{parseToRupiahText(item.persentase != -1 ? item.persentase : null)}</td>
                                                <td>{parseToRupiahText(item.nilai_penyusutan != -1 ? item.nilai_penyusutan : null)}</td>
                                                <td>{parseToRupiahText(item.nilai_buku != -1 ? item.nilai_buku : null)}</td>
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
                                                <td>{item.tahun_perolehan}</td>
                                                <td>{parseToRupiahText(item.harga_beli != -1 ? item.harga_beli : null)}</td>
                                                <td>{parseToRupiahText(item.akumulasi_penyusutan_awal_tahun != -1 ? item.akumulasi_penyusutan_awal_tahun : null)}</td>
                                                <td>{parseToRupiahText(item.nilai_buku_awal_tahun != -1 ? item.nilai_buku_awal_tahun : null)}</td>
                                                <td>{parseToRupiahText(item.persentase_penyusutan != -1 ? item.persentase_penyusutan : null)}</td>
                                                <td>{parseToRupiahText(item.nilai_penyusutan != -1 ? item.nilai_penyusutan : null)}</td>
                                                <td>{parseToRupiahText(item.nilai_buku_akhir_tahun != -1 ? item.nilai_buku_akhir_tahun : null)}</td>
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