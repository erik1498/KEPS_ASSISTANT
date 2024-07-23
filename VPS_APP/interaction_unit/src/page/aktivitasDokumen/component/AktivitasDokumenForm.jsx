import { FaPlus, FaSave, FaTimes } from "react-icons/fa";
import { getHariTanggal } from "../../../helper/date.helper";
import { showAlert } from "../../../helper/form.helper";
import { normalizeDataJurnalUmumSubmit } from "../../../helper/jurnalUmum.helper";
import { initialKodeAkunValue } from "../../../helper/select.helper";
import FormInputWithLabel from "../../../component/form/FormInputWithLabel";
import FormSelectWithLabel from "../../../component/form/FormSelectWithLabel";
import { JurnalUmumFormPrint } from "../../bukuBesar/jurnalUmum/component/JurnalUmumFormPrint";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { parseRupiahToFloat } from "../../../helper/number.helper";
import FormInput from "../../../component/form/FormInput";
import { inputOnlyRupiah } from "../../../helper/actionEvent.helper";

const AktivitasDokumen = ({
    setAddAktivitasDokumenEvent,
    setIsLoadingEvent = () => { },
}) => {

    const tipeDokumenList = [
        {
            title: "Notaris",
            data: [
                {
                    title: "Badan Hukum",
                    data: [
                        {
                            title: "Perseroan Terbatas"
                        },
                        {
                            title: "Yayasan"
                        },
                        {
                            title: "Lembaga / Perkumpulan"
                        },
                        {
                            title: "Koperasi"
                        }
                    ]
                },
                {
                    title: "Badan Usaha",
                    data: [
                        {
                            title: "Perseroan Komanditer"
                        },
                        {
                            title: "UD"
                        },
                        {
                            title: "Firma"
                        },
                    ]
                },
                {
                    title: "Jual Beli",
                    data: [
                        {
                            title: "Kuasa Untuk Menjual"
                        },
                        {
                            title: "Kuasa Untuk Membeli"
                        },
                        {
                            title: "PPJB"
                        },
                        {
                            title: "PJB"
                        },
                        {
                            title: "Kesepakatan Bersama"
                        },
                    ]
                },
                {
                    title: "Sewa Menyewa",
                },
                {
                    title: "Hibah",
                },
                {
                    title: "Waris",
                },
                {
                    title: "Fidusia",
                },
                {
                    title: "Waarmerking",
                },
                {
                    title: "Legalisasi",
                },
                {
                    title: "Persetujuan Dan Kuasa",
                },
                {
                    title: "Pernyataan",
                },
                {
                    title: "SKMHT",
                }
            ]
        },
        {
            title: "PPAT",
            data: [
                {
                    title: "Akta Jual Beli",
                },
                {
                    title: "Akta Hibah",
                },
                {
                    title: "Akta Pemberian Hak Tanggungan",
                },
                {
                    title: "Akta Pembagian Hak Bersama",
                },
                {
                    title: "SKMHT",
                },
                {
                    title: "Akta Peralihan Hak Pewarisan",
                },
                {
                    title: "Akta Peralihan Tukar Menukar",
                },
                {
                    title: "Pemasukan Modal Dalam Perusahaan",
                },
                {
                    title: "Reorganisasi Atau Restruktur Perseroan",
                },
                {
                    title: "Perubahan Data Berdasarkan Penetapan Atau Putusan Pengadilan",
                },
                {
                    title: "Pengalihan Hak Lelang",
                },
                {
                    title: "Cessie",
                },
                {
                    title: "Subrogasi",
                },
                {
                    title: "Roya",
                },
                {
                    title: "Roya Elektonik Perorangan",
                },
                {
                    title: "Merger Hak Tanggungan",
                }
            ]
        },
        {
            title: "Lain - Lain",
            data: [
                {
                    title: "Pengurusan Rekon Bidang Tanah",
                },
                {
                    title: "Pendaftaran Tanah Pertama Kali",
                },
                {
                    title: "Pindah KTP",
                },
                {
                    title: "KKPR",
                },
                {
                    title: "Legalisir",
                },
                {
                    title: "Turun Hak",
                },
                {
                    title: "Naik Hak",
                },
                {
                    title: "Pemecahan / Pemisahan",
                },
                {
                    title: "Ploting",
                },
                {
                    title: "Ganti Blanko",
                },
                {
                    title: "IPPT",
                },
            ]
        }
    ]

    const [tipeDokumen, setTipeDokumen] = useState({
        label: tipeDokumenList[0].title,
        value: tipeDokumenList[0].title,
    })
    const [jenisDokumen, setJenisDokumen] = useState()
    const [transaksiList, setTransaksiList] = useState([])
    const [riwayatPembayaran, setRiwayatPembayaran] = useState([])

    const [hariTanggal, setHariTanggal] = useState(getHariTanggal())
    const [nomorSurat, setNomorSurat] = useState("")
    const [nomorDokumenKlien, setNomorDokumenKlien] = useState("")
    const [biaya, setBiaya] = useState("")
    const [keteranganSurat, setKeteranganSurat] = useState("")

    const [jumlahPembayaran, setJumlahPembayaran] = useState(0)
    const [tanggalPembayaran, setTanggalPembayaran] = useState(getHariTanggal())
    const [pegawaiPenerimaPembayaran, setPegawaiPenerimaPembayaran] = useState()
    const [nomorKwitansi, setNomorKwitansi] = useState("")

    const [judulAktivitas, setJudulAktivitas] = useState("")
    const [tanggalJudulAktivitas, setTanggalJudulAktivitas] = useState(getHariTanggal())

    const [statusAktivitas, setStatusAktivitas] = useState("")
    const [tanggalStatusAktivitas, setTanggalStatusAktivitas] = useState(getHariTanggal())

    const [pegawaiPelaksana, setPegawaiPelaksana] = useState([])

    const [keterangan, setKeterangan] = useState("")
    const [tanggalKeterangan, setTanggalKeterangan] = useState(getHariTanggal())

    const addTransaksi = () => {
        let transaksiListCopy = [...transaksiList]
        transaksiListCopy.push(
            {
                judulAktivitas: judulAktivitas,
                tanggalJudulAktivitas: tanggalJudulAktivitas,
                statusAktivitas: []
            }
        )
        setTransaksiList(transaksiListCopy)
    }

    const addStatusAktivitas = (index) => {
        const transaksiListCopy = [...transaksiList]

        transaksiListCopy[index].statusAktivitas.push({
            statusAktivitas: statusAktivitas,
            tanggalStatusAktivitas: tanggalStatusAktivitas,
            pelaksana: [],
            keterangan: []
        })

        setTransaksiList(transaksiListCopy)
    }

    const addPegawaiPelaksana = (indexTransaksi, indexStatusAktivitas) => {
        const transaksiListCopy = [...transaksiList]

        transaksiListCopy[indexTransaksi].statusAktivitas[indexStatusAktivitas].pelaksana.push({
            pegawai: pegawaiPelaksana.label
        })

        setTransaksiList(transaksiListCopy)
    }

    const addKeterangan = (indexTransaksi, indexStatusAktivitas) => {
        const transaksiListCopy = [...transaksiList]

        transaksiListCopy[indexTransaksi].statusAktivitas[indexStatusAktivitas].keterangan.push({
            tanggalKeterangan: tanggalKeterangan,
            keterangan: keterangan
        })

        setTransaksiList(transaksiListCopy)
    }

    const addRiwayatPembayaran = () => {
        const riwayatPembayaranCopy = [...riwayatPembayaran]

        riwayatPembayaranCopy.push({
            jumlahPembayaran: jumlahPembayaran,
            tanggalPembayaran: tanggalPembayaran,
            pegawaiPenerimaPembayaran: pegawaiPenerimaPembayaran,
            nomorKwitansi: nomorKwitansi
        })

        setRiwayatPembayaran(riwayatPembayaranCopy)
    }

    const _saveTransaksi = async (transaksiList) => {
        // if (await formValidation()) {
        //     let transaksiListNormalized = await normalizeDataJurnalUmumSubmit(transaksiList, nomorDokumenKlienEdit, transaksiListDeleted)
        //     let transaksiUpdateDelete = transaksiListNormalized.filter(j => j.status != "POST")
        //     transaksiUpdateDelete.map((item) => {
        //         let { status, ...itemCopy } = item
        //         let uuidList = transaksiUpdateDelete.filter(i => i.uuid != undefined).map(i => `'${i.uuid}'`)
        //         itemCopy.uuidList = uuidList.length > 0 ? uuidList.join(",") : "EMPTY"
        //         apiJurnalUmumCRUD
        //             .custom(`/${itemCopy.uuid}`, status, null, status == "PUT" ? {
        //                 data: itemCopy
        //             } : null)
        //             .then(() => {
        //                 getData()
        //             }).catch((err) => {
        //                 showError(err)
        //             })
        //     })
        //     postTransaksiFromArray(0, transaksiListNormalized)
        // }
    }

    const postTransaksiFromArray = async (index, transaksiListNormalized, postResponse = []) => {
        if (transaksiListNormalized[index]) {
            let { status, ...itemCopy } = transaksiListNormalized[index]
            if (status == "POST") {
                let uuidList = transaksiListNormalized.concat([...postResponse]).filter(i => i.uuid != undefined).map(i => `'${i.uuid}'`)
                itemCopy.uuidList = uuidList.length > 0 ? uuidList.join(",") : "EMPTY"
                try {
                    let response = await axiosJWT.post(apiJurnalUmumCRUD.getUrlCRUD(), itemCopy)
                    postResponse.push({ ...response.data.data })
                    if (index + 1 < transaksiListNormalized.length) {
                        postTransaksiFromArray(index + 1, transaksiListNormalized, postResponse)
                    } else {
                        getData()
                        setAddJurnalEvent()
                        showAlert("Berhasil", "Transaksi Berhasil Disimpan")
                    }
                } catch (error) {
                    showError(error)
                }
            } else {
                if (index + 1 < transaksiListNormalized.length) {
                    postTransaksiFromArray(index + 1, transaksiListNormalized, postResponse)
                } else {
                    getData()
                    setAddJurnalEvent()
                    showAlert("Berhasil", "Transaksi Berhasil Disimpan")
                }
            }
        }
    }

    useEffect(() => {
        setIsLoadingEvent(true)
        setIsLoadingEvent(false)
    }, [])

    return <>
        <div className="bg-white rounded-md shadow-2xl h-[70vh] overflow-scroll no-scrollbar">
            <div className="pt-3 relative px-6 h-max bg-white w-full z-10">
                <div className="bg-white mb-3 sticky top-0 pt-5 pb-4 z-50 flex justify-between items-center">
                    <h1 className="uppercase text-gray-600 font-bold">{null ? "Edit " : "Tambah "} Aktivitas Dokumen</h1>
                    <button
                        className="btn btn-sm bg-red-900 text-white border-none"
                        onClick={() => setAddAktivitasDokumenEvent()}
                    ><FaTimes /> Batalkan Dokumen
                    </button>
                </div>
                <div className="flex gap-x-2">
                    <FormInputWithLabel
                        label={"Hari/Tanggal"}
                        type={"date"}
                        onchange={(e) => {
                            setHariTanggal(e.target.value)
                        }}
                        others={
                            {
                                value: hariTanggal,
                                name: "hariTanggal"
                            }
                        }
                    />
                    <FormInputWithLabel
                        label={"Nomor Surat (Urutan/Tahun) * Otomatis"}
                        type={"text"}
                        onchange={(e) => {
                            setNomorSurat(e.target.value)
                        }}
                        others={
                            {
                                value: nomorSurat,
                                name: "nomorSurat"
                            }
                        }
                    />
                    <FormInputWithLabel
                        label={"Nomor Dokumen Klien"}
                        type={"text"}
                        onchange={(e) => {
                            setNomorDokumenKlien(e.target.value)
                        }}
                        others={
                            {
                                value: nomorDokumenKlien,
                                name: "nomorDokumenKlien"
                            }
                        }
                    />
                    <FormSelectWithLabel
                        label={"Tipe Dokumen"}
                        onchange={(e) => {
                            setTipeDokumen(e)
                        }}
                        optionsDataList={tipeDokumenList}
                        optionsLabel={"title"}
                        optionsValue={"title"}
                        selectValue={tipeDokumen}
                        selectName={"kodeAkunType"}
                    />
                </div>
                <div className="flex gap-x-2 mt-3">
                    <FormSelectWithLabel
                        label={"Jenis Dokumen"}
                        onchange={(e) => {
                            setJenisDokumen(x => x = e)
                        }}
                        optionsDataList={tipeDokumenList.filter(x => x.title == tipeDokumen?.value)[0]?.data}
                        optionsLabel={"title"}
                        optionsValue={"title"}
                        selectName={"kodeAkunType"}
                    />
                    {
                        tipeDokumenList.filter(x => x.title == tipeDokumen?.value)[0]?.data?.filter(x => x.title == jenisDokumen?.value)[0]?.data?.length > 0 ?
                            <FormSelectWithLabel
                                label={"Jenis Dokumen"}
                                onchange={(e) => {
                                    // setJenisDokumen(x => x = e)
                                }}
                                optionsDataList={tipeDokumenList.filter(x => x.title == tipeDokumen?.value)[0].data.filter(x => x.title == jenisDokumen.label)[0].data}
                                optionsLabel={"title"}
                                optionsValue={"title"}
                                selectName={"kodeAkunType"}
                            />
                            : <></>
                    }
                </div>
                <div className="flex gap-x-2 mt-3">
                    <FormSelectWithLabel
                        label={"Klien"}
                        onchange={(e) => {
                        }}
                        optionsDataList={[{ name: "Klien 1" }]}
                        optionsLabel={"name"}
                        optionsValue={"name"}
                        selectName={"kodeAkunType"}
                    />
                    <FormSelectWithLabel
                        label={"Penanggung Jawab"}
                        onchange={(e) => {
                        }}
                        optionsDataList={[{ name: "Pegawai 1" }]}
                        optionsLabel={"name"}
                        optionsValue={"name"}
                        selectName={"kodeAkunType"}
                    />
                    <FormInputWithLabel
                        label={"Biaya"}
                        type={"text"}
                        onchange={(e) => {
                            inputOnlyRupiah(e)
                            setBiaya(e.target.value)
                        }}
                        others={
                            {
                                value: biaya,
                                name: "biaya"
                            }
                        }
                    />
                </div>
                <div className="flex gap-x-3 mt-3">
                    <FormInputWithLabel
                        label={"Keterangan Surat"}
                        type={"text"}
                        onchange={(e) => {
                            setKeteranganSurat(e.target.value)
                        }}
                        others={
                            {
                                value: keteranganSurat,
                                name: "keteranganSurat"
                            }
                        }
                    />
                </div>
                <button className="btn btn-sm bg-green-800 mt-4 text-white" onClick={() => {
                    _saveTransaksi({
                        transaksiList,
                        hariTanggal,
                        nomorDokumenKlien
                    })
                }}><FaSave /> Simpan</button>
                <h1 className="text-lg font-bold mt-6">Riwayat Pembayaran</h1>
                <div className="flex bg-white py-3 w-full items-end gap-x-2">
                    <FormInputWithLabel
                        label={"Jumlah Pembayaran"}
                        type={"text"}
                        onchange={(e) => {
                            inputOnlyRupiah(e)
                            setJumlahPembayaran(e.target.value)
                        }}
                        others={
                            {
                                value: jumlahPembayaran,
                                name: "jumlahPembayaran"
                            }
                        }
                    />
                    <FormInputWithLabel
                        label={"Hari/Tanggal Pembayaran"}
                        type={"date"}
                        onchange={(e) => {
                            setTanggalPembayaran(e.target.value)
                        }}
                        others={
                            {
                                value: tanggalPembayaran,
                                name: "tanggalPembayaran"
                            }
                        }
                    />
                    <FormSelectWithLabel
                        label={"Pegawai Penerima Pembayaran"}
                        onchange={(e) => {
                            setPegawaiPenerimaPembayaran(e)
                        }}
                        optionsDataList={[{ name: "Pegawai 1" }, { name: "Pegawai 2" }, { name: "Pegawai 3" }]}
                        optionsLabel={"name"}
                        optionsValue={"name"}
                        selectValue={pegawaiPenerimaPembayaran}
                        selectName={"kodeAkunType"}
                    />
                    <FormInputWithLabel
                        label={"Nomor Kwitansi"}
                        type={"text"}
                        onchange={(e) => {
                            setNomorKwitansi(e.target.value)
                        }}
                        others={
                            {
                                value: nomorKwitansi,
                                name: "nomorKwitansi"
                            }
                        }
                    />
                    <button className="btn btn-sm bg-blue-800 mt-4 text-white" onClick={() => addRiwayatPembayaran()}><FaPlus /> Tambah Riwayat Pembayaran</button>
                </div>
                <table className="table table-zebra rounded-l">
                    <tr className="font-bold bg-gray-900 text-white">
                        <td>Jumlah Pembayaran</td>
                        <td>Hari/Tanggal Pembayaran</td>
                        <td>Pegawai Penerima Pembayaran</td>
                        <td>Nomor Kwitansi</td>
                    </tr>
                    <tbody>
                        {
                            riwayatPembayaran.map((item, i) => {
                                return <tr>
                                    <td>{item.jumlahPembayaran}</td>
                                    <td>{item.tanggalPembayaran}</td>
                                    <td>{item.pegawaiPenerimaPembayaran.label}</td>
                                    <td>{item.nomorKwitansi}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                <h1 className="text-lg font-bold mt-6">Aktivitas</h1>
                <div className="flex bg-white py-3 w-full items-end gap-x-2">
                    <FormInputWithLabel
                        label={"Judul Aktivitas"}
                        type={"text"}
                        onchange={(e) => {
                            setJudulAktivitas(e.target.value)
                        }}
                        others={
                            {
                                value: judulAktivitas,
                                name: "judulAktivitas"
                            }
                        }
                    />
                    <FormInputWithLabel
                        label={"Hari/Tanggal Judul Aktivitas"}
                        type={"date"}
                        onchange={(e) => {
                            setTanggalJudulAktivitas(e.target.value)
                        }}
                        others={
                            {
                                value: tanggalJudulAktivitas,
                                name: "tanggalJudulAktivitas"
                            }
                        }
                    />
                    <button className="btn btn-sm bg-blue-800 mt-4 text-white" onClick={() => addTransaksi()}><FaPlus /> Tambah Aktivitas Dokumen</button>
                </div>
            </div>
            <div className="flex flex-col px-6 mt-6 w-full">
                {
                    transaksiList.map((transaksi, i) => {
                        return <>
                            <div className="w-full mb-3">
                                <label className="form-control w-full bg-white">
                                    <div className="label">
                                        <span className="flex items-center gap-x-2 label-text text-gray-800 font-bold">
                                            <p className="text-xl">{transaksi.judulAktivitas} [ {transaksi.tanggalJudulAktivitas} ]</p>
                                        </span>
                                    </div>
                                </label>
                                <div className="flex sticky bottom-0 bg-white py-3 w-full items-end gap-x-2">
                                    <FormInputWithLabel
                                        label={"Status Aktivitas"}
                                        type={"text"}
                                        onchange={(e) => {
                                            setStatusAktivitas(e.target.value)
                                        }}
                                        others={
                                            {
                                                value: statusAktivitas,
                                                name: "statusAktivitas"
                                            }
                                        }
                                    />
                                    <FormInputWithLabel
                                        label={"Hari/Tanggal Status Aktivitas"}
                                        type={"date"}
                                        onchange={(e) => {
                                            setTanggalStatusAktivitas(e.target.value)
                                        }}
                                        others={
                                            {
                                                value: tanggalStatusAktivitas,
                                                name: "tanggalStatusAktivitas"
                                            }
                                        }
                                    />
                                    <button className="btn btn-sm bg-blue-800 mt-4 text-white" onClick={() => addStatusAktivitas(i)}><FaPlus /> Tambah Status Aktivitas Dokumen</button>
                                </div>

                                {
                                    transaksi?.statusAktivitas?.length > 0 ? <p className="font-bold text-md my-5">Riwayat Status Aktivitas </p> : <></>
                                }

                                {
                                    transaksi?.statusAktivitas?.map((itemj, j) => {
                                        return <>
                                            <div className="border-l-4 border-blue-600 pl-4 pt-5">
                                                <label className="form-control w-full bg-white">
                                                    <div className="label">
                                                        <span className="flex items-center gap-x-2 label-text text-gray-800 font-bold">
                                                            <p className="text-md bg-blue-600 py-2 px-9 text-white rounded-lg">{itemj.statusAktivitas} [ {itemj.tanggalStatusAktivitas} ]</p>
                                                        </span>
                                                    </div>
                                                </label>

                                                <div className="flex sticky bottom-0 bg-white py-3 w-max items-end gap-x-2">

                                                    <FormSelectWithLabel
                                                        label={"Pegawai Pelaksana"}
                                                        onchange={(e) => {
                                                            setPegawaiPelaksana(e)
                                                        }}
                                                        optionsDataList={[{ name: "Pegawai 1" }, { name: "Pegawai 2" }, { name: "Pegawai 3" }]}
                                                        optionsLabel={"name"}
                                                        optionsValue={"name"}
                                                        selectValue={pegawaiPelaksana}
                                                        selectName={"kodeAkunType"}
                                                    />

                                                    <button className="btn btn-sm bg-blue-800 mt-4 text-white" onClick={() => addPegawaiPelaksana(i, j)}><FaPlus /> Tambah Pegawai Pelaksana</button>
                                                </div>

                                                <div className="flex gap-x-2">
                                                    {
                                                        itemj?.pelaksana?.map((itemk, k) => {
                                                            return <p className="px-4 py-1 text-sm font-bold rounded-lg bg-gray-500 text-white">
                                                                {itemk.pegawai}
                                                            </p>
                                                        })
                                                    }
                                                </div>
                                                <div className="flex items-end gap-x-2 w-full mt-5">
                                                    <FormInputWithLabel
                                                        label={"Hari/Tanggal Keterangan"}
                                                        type={"date"}
                                                        addClassParent={"flex-1"}
                                                        onchange={(e) => {
                                                            setTanggalKeterangan(e.target.value)
                                                        }}
                                                        others={
                                                            {
                                                                value: tanggalKeterangan,
                                                                name: "tanggalKeterangan"
                                                            }
                                                        }
                                                    />
                                                    <FormInputWithLabel
                                                        label={"Keterangan"}
                                                        type={"text"}
                                                        addClassParent={"flex-3"}
                                                        onchange={(e) => {
                                                            setKeterangan(e.target.value)
                                                        }}
                                                        others={
                                                            {
                                                                value: keterangan,
                                                                name: "keterangan"
                                                            }
                                                        }
                                                    />
                                                    <button className="btn btn-sm bg-blue-800 mt-4 text-white" onClick={() => addKeterangan(i, j)}><FaPlus /> Tambah Keterangan</button>
                                                </div>

                                                {
                                                    itemj?.keterangan?.length > 0 ? <p className="text-sm font-bold mt-5 mb-2">Keterangan</p> : <></>
                                                }

                                                {
                                                    itemj?.keterangan?.map((iteml, l) => {
                                                        return <div className="grid grid-cols-12 items-start gap-x-3 mt-4">
                                                            <p className="text-xs font-bold col-span-1">{iteml.tanggalKeterangan}</p>
                                                            <p className="text-xs font-bold col-span-11">{iteml.keterangan}</p>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        </>
                                    })
                                }
                            </div>
                        </>
                    })
                }
            </div>
        </div >
    </>
};

export default AktivitasDokumen;
