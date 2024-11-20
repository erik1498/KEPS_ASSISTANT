import { useEffect, useState } from "react"
import { apiRincianKonversiBarangCRUD } from "../../../../../service/endPointList.api"
import { showError } from "../../../../../helper/form.helper"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import FormInput from "../../../../../component/form/FormInput"
import { FaSave } from "react-icons/fa"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormSelect from "../../../../../component/form/FormSelect"

const KonversiBarangList = ({
    konversiBarang,
    satuanBarangKonversiBarang,
    preview
}) => {
    const [barangList, setBarangList] = useState([])
    const [barangListToKonversi, setBarangListToKonversi] = useState([])
    const [barangListGetKonversi, setBarangListGetKonversi] = useState([])

    const _getRincianKonversiBarang = () => {
        apiRincianKonversiBarangCRUD
            .custom(`/by_konversi_barang/${konversiBarang.uuid}`)
            .then(resData => {
                setBarangList(x => x = resData.data)
            }).catch(err => showError(err))
    }

    const _updateJumlahKonversi = (value, stok_awal_barang) => {
        let barangListCopy = barangListToKonversi

        barangListCopy = barangListCopy.map(x => {
            if (x.stok_awal_barang == stok_awal_barang) {
                x.jumlah_yang_dikonversi = value
            }
            return x
        })
        setBarangListToKonversi(x => x = barangListCopy)
    }

    const _updateJumlahHasilKonversi = (value, stok_awal_barang) => {
        let barangListCopy = barangListToKonversi

        barangListCopy = barangListCopy.map(x => {
            if (x.stok_awal_barang == stok_awal_barang) {
                x.jumlah_hasil_konversi_kode_barang_tujuan = value
            }
            return x
        })
        setBarangListToKonversi(x => x = barangListCopy)
    }

    const _updateKodeBarangTujuan = (value, stok_awal_barang) => {
        let barangListCopy = barangListToKonversi

        barangListCopy = barangListCopy.map(x => {
            if (x.stok_awal_barang == stok_awal_barang) {
                x.stok_awal_barang_tujuan = value.value
            }
            return x
        })
        setBarangListToKonversi(x => x = barangListCopy)
    }

    const _saveRincianKonversiBarang = () => {
        barangListToKonversi.map(async (x) => {
            await apiRincianKonversiBarangCRUD
                .custom(x.uuid ? `/${x.uuid}` : '', x.uuid ? `PUT` : 'POST', null, {
                    data: {
                        konversi_barang: konversiBarang.uuid,
                        stok_awal_barang: x.stok_awal_barang,
                        jumlah_yang_dikonversi: `${x.jumlah_yang_dikonversi}`,
                        stok_awal_barang_tujuan: x.stok_awal_barang_tujuan,
                        jumlah_hasil_konversi_kode_barang_tujuan: `${x.jumlah_hasil_konversi_kode_barang_tujuan}`,
                    }
                }).catch(err => showError(err))
        })
    }

    const _getKategoriHargaBarangKodeBarang = (stok_awal_barang_tujuan) => {
        const barangListGetKonversiGet = barangList.filter(x => x.stok_awal_barang == stok_awal_barang_tujuan)
        if (barangListGetKonversiGet.length > 0) {
            return {
                label: barangListGetKonversiGet[0].kategori_harga_barang_kode_barang,
                value: barangListGetKonversiGet[0].satuan_barang_name
            }
        }
        return null
    }

    const _getSatuanBarangTujuan = (stok_awal_barang_tujuan) => {
        const barangListGetKonversiGet = barangList.filter(x => x.stok_awal_barang == stok_awal_barang_tujuan)
        if (barangListGetKonversiGet.length > 0) {
            return barangListGetKonversiGet[0].satuan_barang_name
        }
        return null
    }

    useEffect(() => {
        const barangListToKonversiGet = barangList.filter(x => x.satuan_barang_uuid == satuanBarangKonversiBarang.value)
        const barangListGetKonversiGet = barangList.filter(x => x.satuan_barang_uuid != satuanBarangKonversiBarang.value)
        setBarangListToKonversi(x => x = barangListToKonversiGet)
        setBarangListGetKonversi(x => x = barangListGetKonversiGet)
    }, [barangList])

    useEffect(() => {
        _getRincianKonversiBarang()
    }, [konversiBarang])

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
                            <th width={150}>Jumlah Yang Konversi</th>
                            <th width={200}>Kode Barang Tujuan</th>
                            <th>Satuan Barang Tujuan</th>
                            <th width={150}>Jumlah Hasil Konversi Kode Barang Tujuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            barangListToKonversi?.map((item, i) => {
                                return <>
                                    <tr key={i}>
                                        <td>{i + 1}.</td>
                                        <td>{item.daftar_barang_nama_barang}</td>
                                        <td>{item.kategori_harga_barang_kode_barang}</td>
                                        <td>{item.satuan_barang_name}</td>
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
                                                            _updateJumlahKonversi(e.target.value, item.stok_awal_barang)
                                                        }}
                                                        value={parseToRupiahText(item.jumlah_yang_dikonversi)}
                                                    />
                                                </>
                                            }
                                        </td>
                                        <td>
                                            {
                                                preview ? <>{
                                                    _getKategoriHargaBarangKodeBarang(item.stok_awal_barang_tujuan)?.label
                                                }</> : <>
                                                    <FormSelect
                                                        optionsDataList={barangListGetKonversi.filter(x => x.daftar_barang_uuid == item.daftar_barang_uuid)}
                                                        optionsLabel={"kategori_harga_barang_kode_barang"}
                                                        optionsValue={"stok_awal_barang"}
                                                        selectValue={_getKategoriHargaBarangKodeBarang(item.stok_awal_barang_tujuan)}
                                                        onchange={(e) => {
                                                            _updateKodeBarangTujuan(e, item.stok_awal_barang)
                                                        }}
                                                        selectName={`satuanBarangKonversiBarang`}
                                                    />
                                                </>
                                            }
                                        </td>
                                        <td>{_getSatuanBarangTujuan(item.stok_awal_barang_tujuan)}</td>
                                        <td>
                                            {
                                                preview ? <>
                                                    {
                                                        item.jumlah_hasil_konversi_kode_barang_tujuan
                                                    }
                                                </> : <>
                                                    <FormInput
                                                        name={"jumlah"}
                                                        type={"text"}
                                                        other={{
                                                            defaultValue: item.jumlah_hasil_konversi_kode_barang_tujuan
                                                        }}
                                                        onchange={(e) => {
                                                            inputOnlyRupiah(e)
                                                            _updateJumlahHasilKonversi(e.target.value, item.stok_awal_barang)
                                                        }}
                                                        value={parseToRupiahText(item.jumlah_hasil_konversi_kode_barang_tujuan)}
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
                            _saveRincianKonversiBarang()
                        }}
                    ><FaSave /> Simpan</button>
                </>
            }
        </div>
    </>
}

export default KonversiBarangList