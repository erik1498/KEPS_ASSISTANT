import { useEffect, useState } from "react"
import { apiRincianTransferBahanBakuCRUD } from "../../../../../service/endPointList.api"
import { showError } from "../../../../../helper/form.helper"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import FormInput from "../../../../../component/form/FormInput"
import { FaSave } from "react-icons/fa"

const TransferBahanBakuList = ({
    transferBahanBaku,
    preview
}) => {
    const [bahanBakuList, setBahanBakuList] = useState([])

    const _getRincianTransferBahanBaku = () => {
        apiRincianTransferBahanBakuCRUD
            .custom(`/by_transfer_bahan_baku/${transferBahanBaku.uuid}`)
            .then(resData => {
                setBahanBakuList(x => x = resData.data)
            }).catch(err => showError(err))
    }

    const _updateJumlah = (value, stok_awal_bahan_baku) => {
        let bahanBakuListCopy = bahanBakuList

        bahanBakuListCopy = bahanBakuListCopy.map(x => {
            if (x.stok_awal_bahan_baku == stok_awal_bahan_baku) {
                x.jumlah = value
            }
            return x
        })
        setBahanBakuList(x => x = bahanBakuListCopy)
    }

    const _saveRincianTransferBahanBaku = (index) => {
        if (bahanBakuList[index].stok_awal_bahan_baku_tujuan) {
            apiRincianTransferBahanBakuCRUD
                .custom(bahanBakuList[index].uuid ? `/${bahanBakuList[index].uuid}` : '', bahanBakuList[index].uuid ? `PUT` : 'POST', null, {
                    data: {
                        transfer_bahan_baku: transferBahanBaku.uuid,
                        stok_awal_bahan_baku: bahanBakuList[index].stok_awal_bahan_baku,
                        jumlah: bahanBakuList[index].jumlah,
                        stok_awal_bahan_baku_tujuan: bahanBakuList[index].stok_awal_bahan_baku_tujuan,
                    }
                })
                .then(() => {
                    if (index < bahanBakuList.length - 1) {
                        _saveRincianTransferBahanBaku(index + 1)
                    }else{
                        _getRincianTransferBahanBaku()
                    }
                })
                .catch(err => showError(err))
        } else {
            _saveRincianTransferBahanBaku(index + 1)
        }
    }

    useEffect(() => {
        _getRincianTransferBahanBaku()
    }, [transferBahanBaku])
    return <>
        <div className="my-5 bg-white py-5 rounded-md">
            <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Daftar Bahan Baku</h1>
            <div className="overflow-x-auto max-h-[40vh] h-max no-scrollbar pb-4">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className="sticky top-0 z-50 bg-white py-4 text-black">
                            <th width={12}>No</th>
                            <th>Nama Bahan Baku</th>
                            <th>Kode Bahan Baku</th>
                            <th>Satuan Bahan Baku</th>
                            <th width={150}>Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            bahanBakuList?.map((item, i) => {
                                return item.stok_awal_bahan_baku_tujuan && <>
                                    <tr key={i}>
                                        <td>{i + 1}.</td>
                                        <td>{item.daftar_bahan_baku_nama_bahan_baku}</td>
                                        <td>{item.kategori_harga_bahan_baku_kode_bahan_baku}</td>
                                        <td>{item.satuan_bahan_baku}</td>
                                        <td>
                                            {
                                                preview ? <>
                                                    {item.jumlah}
                                                </> : <>
                                                    <FormInput
                                                        name={"jumlah"}
                                                        type={"text"}
                                                        other={{
                                                            defaultValue: item.jumlah
                                                        }}
                                                        onchange={(e) => {
                                                            inputOnlyRupiah(e)
                                                            _updateJumlah(e.target.value, item.stok_awal_bahan_baku)
                                                        }}
                                                        value={parseToRupiahText(item.jumlah)}
                                                    />
                                                </>
                                            }
                                        </td>
                                    </tr>
                                </>
                            })
                        }
                    </tbody>
                </table>
            </div>

            {
                preview ? <></> : <>
                    <button className="btn btn-sm bg-green-800 mt-3 text-white"
                        onClick={() => {
                            _saveRincianTransferBahanBaku(0)
                        }}
                    ><FaSave /> Simpan</button>
                </>
            }
        </div>
    </>
}

export default TransferBahanBakuList