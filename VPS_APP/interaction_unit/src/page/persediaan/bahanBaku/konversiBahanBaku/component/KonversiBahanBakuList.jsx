import { useEffect, useState } from "react"
import { apiRincianKonversiBahanBakuCRUD } from "../../../../../service/endPointList.api"
import { showError } from "../../../../../helper/form.helper"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import FormInput from "../../../../../component/form/FormInput"
import { FaSave } from "react-icons/fa"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormSelect from "../../../../../component/form/FormSelect"

const KonversiBahanBakuList = ({
    konversiBahanBaku,
    satuanBahanBakuKonversiBahanBaku,
    preview
}) => {
    const [BahanBakuList, setBahanBakuList] = useState([])
    const [BahanBakuListToKonversi, setBahanBakuListToKonversi] = useState([])
    const [BahanBakuListGetKonversi, setBahanBakuListGetKonversi] = useState([])

    const _getRincianKonversiBahanBaku = () => {
        apiRincianKonversiBahanBakuCRUD
            .custom(`/by_konversi_bahan_baku/${konversiBahanBaku.uuid}`)
            .then(resData => {
                setBahanBakuList(x => x = resData.data)
            }).catch(err => showError(err))
    }

    const _updateJumlahKonversi = (value, stok_awal_bahan_baku) => {
        let BahanBakuListCopy = BahanBakuListToKonversi

        BahanBakuListCopy = BahanBakuListCopy.map(x => {
            if (x.stok_awal_bahan_baku == stok_awal_bahan_baku) {
                x.jumlah_yang_dikonversi = value
            }
            return x
        })
        setBahanBakuListToKonversi(x => x = BahanBakuListCopy)
    }

    const _updateJumlahHasilKonversi = (value, stok_awal_bahan_baku) => {
        let BahanBakuListCopy = BahanBakuListToKonversi

        BahanBakuListCopy = BahanBakuListCopy.map(x => {
            if (x.stok_awal_bahan_baku == stok_awal_bahan_baku) {
                x.jumlah_hasil_konversi_kode_bahan_baku_tujuan = value
            }
            return x
        })
        setBahanBakuListToKonversi(x => x = BahanBakuListCopy)
    }

    const _updateKodeBahanBakuTujuan = (value, stok_awal_bahan_baku) => {
        let BahanBakuListCopy = BahanBakuListToKonversi

        BahanBakuListCopy = BahanBakuListCopy.map(x => {
            if (x.stok_awal_bahan_baku == stok_awal_bahan_baku) {
                x.stok_awal_bahan_baku_tujuan = value.value
            }
            return x
        })
        setBahanBakuListToKonversi(x => x = BahanBakuListCopy)
    }

    const _saveRincianKonversiBahanBaku = () => {
        BahanBakuListToKonversi.map(async (x) => {
            await apiRincianKonversiBahanBakuCRUD
                .custom(x.uuid ? `/${x.uuid}` : '', x.uuid ? `PUT` : 'POST', null, {
                    data: {
                        konversi_bahan_baku: konversiBahanBaku.uuid,
                        stok_awal_bahan_baku: x.stok_awal_bahan_baku,
                        jumlah_yang_dikonversi: `${x.jumlah_yang_dikonversi}`,
                        stok_awal_bahan_baku_tujuan: x.stok_awal_bahan_baku_tujuan,
                        jumlah_hasil_konversi_kode_bahan_baku_tujuan: `${x.jumlah_hasil_konversi_kode_bahan_baku_tujuan}`,
                    }
                }).catch(err => showError(err))
        })
    }

    const _getKategoriHargaBahanBakuKodeBahanBaku = (stok_awal_bahan_baku_tujuan) => {
        const BahanBakuListGetKonversiGet = BahanBakuList.filter(x => x.stok_awal_bahan_baku == stok_awal_bahan_baku_tujuan)
        if (BahanBakuListGetKonversiGet.length > 0) {
            return {
                label: BahanBakuListGetKonversiGet[0].kategori_harga_bahan_baku_kode_bahan_baku,
                value: BahanBakuListGetKonversiGet[0].satuan_bahan_baku_name
            }
        }
        return null
    }

    const _getSatuanBahanBakuTujuan = (stok_awal_bahan_baku_tujuan) => {
        const BahanBakuListGetKonversiGet = BahanBakuList.filter(x => x.stok_awal_bahan_baku == stok_awal_bahan_baku_tujuan)
        if (BahanBakuListGetKonversiGet.length > 0) {
            return BahanBakuListGetKonversiGet[0].satuan_bahan_baku_name
        }
        return null
    }

    useEffect(() => {
        const BahanBakuListToKonversiGet = BahanBakuList.filter(x => x.satuan_bahan_baku_uuid == satuanBahanBakuKonversiBahanBaku.value)
        const BahanBakuListGetKonversiGet = BahanBakuList.filter(x => x.satuan_bahan_baku_uuid != satuanBahanBakuKonversiBahanBaku.value)
        setBahanBakuListToKonversi(x => x = BahanBakuListToKonversiGet)
        setBahanBakuListGetKonversi(x => x = BahanBakuListGetKonversiGet)
    }, [BahanBakuList])

    useEffect(() => {
        _getRincianKonversiBahanBaku()
    }, [konversiBahanBaku])

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
                            <th width={150}>Jumlah Yang Konversi</th>
                            <th width={200}>Kode Bahan Baku Tujuan</th>
                            <th>Satuan Bahan Baku Tujuan</th>
                            <th width={150}>Jumlah Hasil Konversi Kode Bahan Baku Tujuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            BahanBakuListToKonversi?.map((item, i) => {
                                return <>
                                    <tr key={i}>
                                        <td>{i + 1}.</td>
                                        <td>{item.daftar_bahan_baku_nama_bahan_baku}</td>
                                        <td>{item.kategori_harga_bahan_baku_kode_bahan_baku}</td>
                                        <td>{item.satuan_bahan_baku_name}</td>
                                        <td>
                                            {
                                                preview ? <>
                                                    {item.jumlah_yang_dikonversi}
                                                </> : <>
                                                    <FormInput
                                                        name={"jumlah_yang_dikonversi"}
                                                        type={"text"}
                                                        other={{
                                                            defaultValue: item.jumlah_yang_dikonversi
                                                        }}
                                                        onchange={(e) => {
                                                            inputOnlyRupiah(e)
                                                            _updateJumlahKonversi(e.target.value, item.stok_awal_bahan_baku)
                                                        }}
                                                        value={parseToRupiahText(item.jumlah_yang_dikonversi)}
                                                    />
                                                </>
                                            }
                                        </td>
                                        <td>
                                            {
                                                preview ? <>{
                                                    _getKategoriHargaBahanBakuKodeBahanBaku(item.stok_awal_bahan_baku_tujuan)?.label
                                                }</> : <>
                                                    <FormSelect
                                                        optionsDataList={BahanBakuListGetKonversi.filter(x => x.daftar_bahan_baku_uuid == item.daftar_bahan_baku_uuid)}
                                                        optionsLabel={"kategori_harga_bahan_baku_kode_bahan_baku"}
                                                        optionsValue={"stok_awal_bahan_baku"}
                                                        selectValue={_getKategoriHargaBahanBakuKodeBahanBaku(item.stok_awal_bahan_baku_tujuan)}
                                                        onchange={(e) => {
                                                            _updateKodeBahanBakuTujuan(e, item.stok_awal_bahan_baku)
                                                        }}
                                                        selectName={`satuanBahanBakuKonversiBahanBaku`}
                                                    />
                                                </>
                                            }
                                        </td>
                                        <td>{_getSatuanBahanBakuTujuan(item.stok_awal_bahan_baku_tujuan)}</td>
                                        <td>
                                            {
                                                preview ? <>
                                                    {
                                                        item.jumlah_hasil_konversi_kode_bahan_baku_tujuan
                                                    }
                                                </> : <>
                                                    <FormInput
                                                        name={"jumlah"}
                                                        type={"text"}
                                                        other={{
                                                            defaultValue: item.jumlah_hasil_konversi_kode_bahan_baku_tujuan
                                                        }}
                                                        onchange={(e) => {
                                                            inputOnlyRupiah(e)
                                                            _updateJumlahHasilKonversi(e.target.value, item.stok_awal_bahan_baku)
                                                        }}
                                                        value={parseToRupiahText(item.jumlah_hasil_konversi_kode_bahan_baku_tujuan)}
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
                            _saveRincianKonversiBahanBaku()
                        }}
                    ><FaSave /> Simpan</button>
                </>
            }
        </div>
    </>
}

export default KonversiBahanBakuList