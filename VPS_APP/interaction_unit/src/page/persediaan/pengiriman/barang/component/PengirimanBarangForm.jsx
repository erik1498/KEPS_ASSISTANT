import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiFakturPenjualanBarangCRUD, apiPegawaiCRUD, apiPengirimanBarangCRUD, apiPerintahStokOpnameCRUD } from "../../../../../service/endPointList.api"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInput from "../../../../../component/form/FormInput"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import { useDataContext } from "../../../../../context/dataContext.context"

const PengirimanBarangForm = ({
    setAddPengirimanBarangEvent = () => { },
    pengirimanBarangEdit,
    getData = () => { }
}) => {
    const dataContext = useDataContext()
    const { data } = dataContext
    
    const [tanggal, setTanggal] = useState(pengirimanBarangEdit?.tanggal ? pengirimanBarangEdit.tanggal : getHariTanggalFull())
    const [fakturPenjualanBarang, setFakturPenjualanBarang] = useState(pengirimanBarangEdit?.faktur_penjualan_barang ? pengirimanBarangEdit.faktur_penjualan_barang : ``)
    const [nomorSuratJalan, setNomorSuratJalan] = useState(pengirimanBarangEdit?.nomor_surat_jalan ? pengirimanBarangEdit.nomor_surat_jalan : ``)
    const [pegawaiPenanggungJawab, setPegawaiPenanggungJawab] = useState(pengirimanBarangEdit?.pegawai_penanggung_jawab ? pengirimanBarangEdit.pegawai_penanggung_jawab : ``)
    const [pegawaiPelaksana, setPegawaiPelaksana] = useState(pengirimanBarangEdit?.pegawai_pelaksana ? pengirimanBarangEdit.pegawai_pelaksana : ``)

    const [fakturPenjualanBarangList, setFakturPenjualanBarangList] = useState([])
    const [pegawaiList, setPegawaiList] = useState([])
    const [pengirimanBarangList, setPengirimanBarangList] = useState([])

    const _savePengirimanBarang = async (index) => {
        apiPengirimanBarangCRUD
            .custom(`${pengirimanBarangList[index].uuid != "" ? `/${pengirimanBarangList[index].uuid}` : ``}`, pengirimanBarangList[index].uuid != "" ? "PUT" : "POST", null, {
                data: {
                    tanggal: tanggal,
                    perintah_stok_opname: fakturPenjualanBarang.value,
                    hasil_stok_opname: pengirimanBarangList[index].hasil_stok_opname,
                    kuantitas: `${pengirimanBarangList[index].kuantitas}`,
                    stok_tersedia_sistem: `${pengirimanBarangList[index].stok_sistem}`,
                    tipe_penyesuaian: `${pengirimanBarangList[index].tipe_penyesuaian}`,
                    jumlah: `${_getJumlahPerbedaan(pengirimanBarangList[index])}`,
                    keterangan: pengirimanBarangList[index].keterangan
                }
            }).then(() => {
                if (index + 1 < pengirimanBarangList.length) {
                    _savePengirimanBarang(index + 1)
                } else {
                    getData()
                    setAddPengirimanBarangEvent()
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataPegawai = () => {
        apiPegawaiCRUD
            .custom("", "GET")
            .then(resData => {
                setPegawaiList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if ([pengirimanBarangEdit]) {
                        initialDataFromEditObject({
                            editObject: [pengirimanBarangEdit].pegawai_penanggung_jawab,
                            dataList: resData.data.entry,
                            setState: setPegawaiPenanggungJawab,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        initialDataFromEditObject({
                            editObject: [pengirimanBarangEdit].pegawai_pelaksana,
                            dataList: resData.data.entry,
                            setState: setPegawaiPelaksana,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setPegawaiPenanggungJawab({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                    setPegawaiPelaksana({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => showError(err))
    }

    const _getDataFakturPenjualanBarang = () => {
        apiFakturPenjualanBarangCRUD
            .custom(``, "GET")
            .then(resData => {
                setFakturPenjualanBarangList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (pengirimanBarangEdit) {
                        initialDataFromEditObject({
                            editObject: pengirimanBarangEdit.faktur_penjualan_barang,
                            dataList: resData.data.entry,
                            setState: setFakturPenjualanBarang,
                            labelKey: "nomor_faktur_penjualan_barang",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setFakturPenjualanBarang({
                        label: resData.data.entry[0].nomor_faktur_penjualan_barang,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => showError(err))
    }

    const _getDaftarBarangPerintahStokOpname = () => {
        apiPengirimanBarangCRUD.custom(`/daftar_pesanan/${fakturPenjualanBarang.value}`, "GET")
            .then(resData => {
                setPengirimanBarangList(resData.data)
            }).catch(err => showError(err))
    }

    useEffect(() => {
        if (fakturPenjualanBarang) {
            _getDaftarBarangPerintahStokOpname()
        }
    }, [fakturPenjualanBarang])

    useEffect(() => {
        _getDataFakturPenjualanBarang()
        _getDataPegawai()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{pengirimanBarangEdit ? `Edit` : `Tambahkan`} Pengiriman Barang</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddPengirimanBarangEvent()}
                ><FaTimes /> Batalkan Pengiriman Barang
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Tanggal"}
                    type={"datetime-local"}
                    onchange={(e) => {
                        setTanggal(e.target.value)
                    }}
                    others={
                        {
                            value: tanggal,
                            name: "tanggal"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Faktur Penjualan Barang"}
                    optionsDataList={fakturPenjualanBarangList}
                    optionsLabel={"nomor_faktur_penjualan_barang"}
                    optionsValue={"uuid"}
                    selectValue={fakturPenjualanBarang}
                    onchange={(e) => {
                        setFakturPenjualanBarang(e)
                    }}
                    selectName={`fakturPenjualanBarang`}
                />
                <FormInputWithLabel
                    label={"Nomor Surat Jalan"}
                    type={"text"}
                    onchange={(e) => {
                        setNomorSuratJalan(e.target.value)
                    }}
                    others={
                        {
                            value: nomorSuratJalan,
                            name: "nomorSuratJalan"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Pegawai Penanggung Jawab"}
                    optionsDataList={pegawaiList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={pegawaiPenanggungJawab}
                    onchange={(e) => {
                        setPegawaiPenanggungJawab(e)
                    }}
                    selectName={`pegawaiPenanggungJawab`}
                />
                <FormSelectWithLabel
                    label={"Pegawai Pelaksana"}
                    optionsDataList={pegawaiList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={pegawaiPelaksana}
                    onchange={(e) => {
                        setPegawaiPelaksana(e)
                    }}
                    selectName={`pegawaiPelaksana`}
                />
            </div>
            <div className="overflow-x-auto rounded-md h-max max-h-[90vh] no-scrollbar mt-5 pb-4">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className="sticky top-0 bg-white py-4 text-black">
                            <th width={12}>No</th>
                            <th>Kode Barang</th>
                            <th>Nama Barang</th>
                            <th>Satuan Barang</th>
                            <th>Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pengirimanBarangList?.map((item, i) => {
                                return <>
                                    <tr key={i}>
                                        <td>{i + 1}.</td>
                                        <td>{item.kategori_harga_barang_kode_barang}</td>
                                        <td>{item.daftar_barang_name}</td>
                                        <td>{item.satuan_barang_name}</td>
                                        <td>{item.jumlah}</td>
                                        <td>
                                            <FormInput
                                                name={"keterangan_" + i}
                                                type={"text"}
                                                other={{
                                                    defaultValue: item.keterangan
                                                }}
                                                onchange={(e) => {
                                                    _updateKeterangan(e.target.value, item.stok_awal_barang)
                                                }}
                                                value={parseToRupiahText(item.keterangan)}
                                            />
                                        </td>
                                    </tr>
                                </>
                            })
                        }
                    </tbody>
                </table>
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _savePengirimanBarang(0)
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default PengirimanBarangForm