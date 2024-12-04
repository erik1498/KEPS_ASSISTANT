import { FaPrint, FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useRef, useState } from "react"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { apiFakturPenjualanBarangCRUD, apiPegawaiCRUD, apiPengirimanBarangCRUD, apiRincianPengirimanBarangCRUD } from "../../../../../service/endPointList.api"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FormInput from "../../../../../component/form/FormInput"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"
import { PengirimanBarangPrint } from "./PengirimanBarangPrint"
import { useReactToPrint } from "react-to-print"

const PengirimanBarangForm = ({
    setAddPengirimanBarangEvent = () => { },
    pengirimanBarangEdit,
    getData = () => { }
}) => {
    const [gudangList, setGudangList] = useState([])
    const [tanggal, setTanggal] = useState(pengirimanBarangEdit?.tanggal ? pengirimanBarangEdit.tanggal : getHariTanggalFull())
    const [fakturPenjualanBarang, setFakturPenjualanBarang] = useState(pengirimanBarangEdit?.faktur_penjualan_barang ? pengirimanBarangEdit.faktur_penjualan_barang : ``)
    const [nomorSuratJalan, setNomorSuratJalan] = useState(pengirimanBarangEdit?.nomor_surat_jalan ? pengirimanBarangEdit.nomor_surat_jalan : ``)
    const [pegawaiPenanggungJawab, setPegawaiPenanggungJawab] = useState(pengirimanBarangEdit?.pegawai_penanggung_jawab ? pengirimanBarangEdit.pegawai_penanggung_jawab : ``)
    const [pegawaiPelaksana, setPegawaiPelaksana] = useState(pengirimanBarangEdit?.pegawai_pelaksana ? pengirimanBarangEdit.pegawai_pelaksana : ``)

    const [idPengirimanBarang, setIdPengirimanBarang] = useState(null)
    const [fakturPenjualanBarangList, setFakturPenjualanBarangList] = useState([])
    const [pegawaiList, setPegawaiList] = useState([])
    const [pengirimanBarangList, setPengirimanBarangList] = useState([])

    const _saveRincianPengirimanBarang = async (index) => {
        apiRincianPengirimanBarangCRUD
            .custom(`${pengirimanBarangList[index].uuid != "" ? `/${pengirimanBarangList[index].uuid}` : ``}`, pengirimanBarangList[index].uuid != "" ? "PUT" : "POST", null, {
                data: {
                    pengiriman_barang: idPengirimanBarang,
                    rincian_pesanan_penjualan_barang: pengirimanBarangList[index].rincian_pesanan_penjualan_barang,
                    jumlah: `${pengirimanBarangList[index].jumlah}`,
                    pengiriman: `${pengirimanBarangList[index].pengiriman}`,
                }
            }).then(() => {
                if (index + 1 < pengirimanBarangList.length) {
                    _saveRincianPengirimanBarang(index + 1)
                } else {
                    getData()
                    setAddPengirimanBarangEvent()
                }
            }).catch(err => {
                showError(err)
            })
    }

    const pengirimanBarangPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => pengirimanBarangPrintRef.current,
    });

    const _savePengirimanBarang = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            "pegawai_penanggung_jawab",
                "pegawai_pelaksana"
            apiPengirimanBarangCRUD
                .custom(pengirimanBarangEdit ? `/${pengirimanBarangEdit.uuid}` : ``, pengirimanBarangEdit ? "PUT" : "POST", null, {
                    data: {
                        tanggal: tanggal,
                        faktur_penjualan_barang: fakturPenjualanBarang.value,
                        nomor_surat_jalan: nomorSuratJalan,
                        pegawai_pelaksana: pegawaiPelaksana.value,
                        pegawai_penanggung_jawab: pegawaiPenanggungJawab.value
                    }
                }).then((res) => {
                    if (pengirimanBarangEdit) {
                        setIdPengirimanBarang(x => x = pengirimanBarangEdit.uuid)
                    } else {
                        setIdPengirimanBarang(x => x = res.data.uuid)
                    }
                }).catch((err) => {
                    showError(err)
                })
        }
    }

    const _getDataPegawai = () => {
        apiPegawaiCRUD
            .custom("", "GET")
            .then(resData => {
                setPegawaiList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (pengirimanBarangEdit) {
                        initialDataFromEditObject({
                            editObject: pengirimanBarangEdit.pegawai_penanggung_jawab,
                            dataList: resData.data.entry,
                            setState: setPegawaiPenanggungJawab,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        initialDataFromEditObject({
                            editObject: pengirimanBarangEdit.pegawai_pelaksana,
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
        apiPengirimanBarangCRUD.custom(`/daftar_pesanan/${idPengirimanBarang}`, "GET")
            .then(resData => {
                setPengirimanBarangList(resData.data)

                let gudangListCopy = gudangList
                resData?.data?.map((x) => {
                    if (!gudangListCopy.includes(x.daftar_gudang_name)) {
                        gudangListCopy.push(x.daftar_gudang_name)
                    }
                })
                setGudangList(x => x = gudangListCopy)

            }).catch(err => showError(err))
    }

    const _updatePengiriman = (value, rincian_pesanan_penjualan_barang) => {
        const pengirimanBarangListCopy = pengirimanBarangList
        const index = pengirimanBarangList.findIndex((x) => x.rincian_pesanan_penjualan_barang == rincian_pesanan_penjualan_barang)
        if (index > -1) {
            pengirimanBarangListCopy[index].pengiriman = value
        }
        setPengirimanBarangList(x => x = pengirimanBarangListCopy)
    }

    useEffect(() => {
        if (idPengirimanBarang) {
            _getDaftarBarangPerintahStokOpname()
        }
    }, [idPengirimanBarang])

    useEffect(() => {
        _getDataFakturPenjualanBarang()
        _getDataPegawai()
        if (pengirimanBarangEdit?.preview) {
            setIdPengirimanBarang(pengirimanBarangEdit?.uuid)
        }
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{pengirimanBarangEdit ? `${pengirimanBarangEdit?.preview ? "Lihat" : "Edit"}` : `Tambahkan`} Pengiriman Barang</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddPengirimanBarangEvent()}
                ><FaTimes /> {pengirimanBarangEdit?.preview ? "Tutup" : "Batalkan Pengiriman Barang"}
                </button>
            </div>
            <form onSubmit={(e) => _savePengirimanBarang(e)}>
                <div className="flex gap-x-2">
                    <FormInputWithLabel
                        label={"Tanggal"}
                        type={"datetime-local"}
                        onchange={(e) => {
                            setTanggal(e.target.value)
                        }}
                        addClassInput={idPengirimanBarang || pengirimanBarangEdit ? "border-none !px-1" : ""}
                        disabled={idPengirimanBarang || pengirimanBarangEdit}
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
                        addClass={idPengirimanBarang || pengirimanBarangEdit ? "border-none !px-1" : ""}
                        disabled={idPengirimanBarang || pengirimanBarangEdit}
                        onchange={(e) => {
                            setFakturPenjualanBarang(e)
                        }}
                        selectName={`fakturPenjualanBarang`}
                    />
                    <FormInputWithLabel
                        label={"Nomor Surat Jalan"}
                        type={"text"}
                        addClassInput={idPengirimanBarang || pengirimanBarangEdit?.preview ? "border-none !px-1" : ""}
                        onchange={(e) => {
                            setNomorSuratJalan(e.target.value)
                        }}
                        disabled={idPengirimanBarang || pengirimanBarangEdit?.preview}
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
                        addClass={idPengirimanBarang || pengirimanBarangEdit?.preview ? "border-none !px-1" : ""}
                        disabled={idPengirimanBarang || pengirimanBarangEdit?.preview}
                        onchange={(e) => {
                            setPegawaiPenanggungJawab(e)
                        }}
                        selectName={`pegawaiPenanggungJawab`}
                    />
                    <FormSelectWithLabel
                        label={"Pegawai Pelaksana"}
                        addClass={idPengirimanBarang || pengirimanBarangEdit?.preview ? "border-none !px-1" : ""}
                        optionsDataList={pegawaiList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        selectValue={pegawaiPelaksana}
                        disabled={idPengirimanBarang || pengirimanBarangEdit?.preview}
                        onchange={(e) => {
                            setPegawaiPelaksana(e)
                        }}
                        selectName={`pegawaiPelaksana`}
                    />
                </div>
                {
                    idPengirimanBarang ?
                        <></>
                        :
                        <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
                }
            </form>
            {
                idPengirimanBarang ? <>

                    <div className="overflow-x-auto rounded-md h-max max-h-[90vh] no-scrollbar mt-5 pb-4">
                        <table className="table table-sm table-zebra">
                            {/* head */}
                            <thead>
                                <tr className="sticky top-0 bg-white py-4 text-black">
                                    <th width={12}>No</th>
                                    <th>Kode / Nama Barang</th>
                                    <th>Satuan Barang</th>
                                    <th>Pembelian</th>
                                    <th>Telah Dikirim</th>
                                    <th>Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    pengirimanBarangList?.map((item, i) => {
                                        return <>
                                            <tr key={i}>
                                                <td>{i + 1}.</td>
                                                <td>
                                                    <b>{item.kategori_harga_barang_kode_barang}</b>
                                                    <br />
                                                    {item.daftar_gudang_name}
                                                    <br />
                                                    <br />
                                                    {item.daftar_barang_name}
                                                </td>
                                                <td>{item.satuan_barang_name}</td>
                                                <td>{item.jumlah_sudah_dikirim}</td>
                                                <td>{item.jumlah}</td>
                                                <td>
                                                    {
                                                        pengirimanBarangEdit?.preview ? <>
                                                            {item.pengiriman}
                                                        </> : <>
                                                            <FormInput
                                                                name={"pengiriman_" + i}
                                                                type={"text"}
                                                                other={{
                                                                    defaultValue: item.pengiriman
                                                                }}
                                                                onchange={(e) => {
                                                                    inputOnlyRupiah(e, item.jumlah)
                                                                    _updatePengiriman(e.target.value, item.rincian_pesanan_penjualan_barang)
                                                                }}
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
                        pengirimanBarangEdit?.preview ? <>
                            <div className="hidden">
                                <PengirimanBarangPrint
                                    ref={pengirimanBarangPrintRef}
                                    pengirimanBarangList={pengirimanBarangList}
                                    gudangList={gudangList}
                                    pengirimanBarangEdit={pengirimanBarangEdit}
                                    fakturPenjualanBarang={fakturPenjualanBarangList.filter(x => x.uuid == fakturPenjualanBarang.value)}
                                />
                            </div>
                            <button
                                className="btn btn-sm bg-red-800 mt-4 text-white"
                                type="button"
                                onClick={handlePrint}
                            >
                                <FaPrint /> Cetak Surat Jalan
                            </button>
                        </> :
                            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                                type="button"
                                onClick={() => {
                                    _saveRincianPengirimanBarang(0)
                                }}
                            ><FaSave /> Simpan</button>
                    }
                </> : <></>
            }
        </div>
    </>
}
export default PengirimanBarangForm