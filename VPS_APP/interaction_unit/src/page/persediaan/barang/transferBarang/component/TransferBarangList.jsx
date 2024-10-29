import { useEffect, useState } from "react"
import { apiRincianTransferBarangCRUD } from "../../../../../service/endPointList.api"
import { showError } from "../../../../../helper/form.helper"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import FormInput from "../../../../../component/form/FormInput"
import { FaSave } from "react-icons/fa"

const TransferBarangList = ({
    transferBarang
}) => {
    const [barangList, setBarangList] = useState([])

    const _getRincianTransferBarang = () => {
        apiRincianTransferBarangCRUD
            .custom(`/by_transfer_barang/${transferBarang.uuid}`)
            .then(resData => {
                setBarangList(x => x = resData.data)
            }).catch(err => showError(err))
    }

    const _updateJumlah = (value, stok_awal_barang) => {
        let barangListCopy = barangList

        barangListCopy = barangListCopy.map(x => {
            if (x.stok_awal_barang == stok_awal_barang) {
                x.jumlah = value
            }
            return x
        })
        setBarangList(x => x = barangListCopy)
    }

    const _saveRincianTransferBarang = (index) => {
        if (barangList[index].stok_awal_barang_tujuan) {
            apiRincianTransferBarangCRUD
                .custom(barangList[index].uuid ? `/${barangList[index].uuid}` : '', barangList[index].uuid ? `PUT` : 'POST', null, {
                    data: {
                        transfer_barang: transferBarang.uuid,
                        stok_awal_barang: barangList[index].stok_awal_barang,
                        jumlah: barangList[index].jumlah,
                        stok_awal_barang_tujuan: barangList[index].stok_awal_barang_tujuan,
                    }
                })
                .then(() => {
                    if (index < barangList.length) {
                        _saveRincianTransferBarang(index + 1)
                    }
                })
                .catch(err => showError(err))
        } else {
            _saveRincianTransferBarang(index + 1)
        }
    }

    useEffect(() => {
        _getRincianTransferBarang()
    }, [transferBarang])
    return <>
        <div className="my-5 bg-white py-5 rounded-md">
            <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Daftar Barang</h1>
            <div className="overflow-x-auto max-h-[40vh] h-max no-scrollbar pb-4">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className="sticky top-0 z-50 bg-white py-4 text-black">
                            <th width={12}>No</th>
                            <th>Nama Barang</th>
                            <th>Kode Barang</th>
                            <th>Satuan Barang</th>
                            <th width={150}>Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            barangList?.map((item, i) => {
                                return item.stok_awal_barang_tujuan && <>
                                    <tr key={i}>
                                        <td>{i + 1}.</td>
                                        <td>{item.daftar_barang_nama_barang}</td>
                                        <td>{item.kategori_harga_barang_kode_barang}</td>
                                        <td>{item.satuan_barang}</td>
                                        <td>
                                            <FormInput
                                                name={"jumlah"}
                                                type={"text"}
                                                other={{
                                                    defaultValue: item.jumlah
                                                }}
                                                onchange={(e) => {
                                                    inputOnlyRupiah(e)
                                                    _updateJumlah(e.target.value, item.stok_awal_barang)
                                                }}
                                                value={parseToRupiahText(item.jumlah)}
                                            />
                                        </td>
                                    </tr>
                                </>
                            })
                        }
                    </tbody>
                </table>
            </div>

            <button className="btn btn-sm bg-green-800 mt-3 text-white"
                onClick={() => {
                    _saveRincianTransferBarang(0)
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}

export default TransferBarangList