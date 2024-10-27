import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiDaftarGudangCRUD, apiKategoriBarangCRUD, apiPegawaiCRUD, apiPenyesuaianPersediaanCRUD } from "../../../../../service/endPointList.api"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"

const PenyesuaianPersediaanForm = ({
    setAddPenyesuaianPersediaanEvent = () => { },
    penyesuaianPersediaanEdit,
    getData = () => { }
}) => {
    const [tanggal, setTanggal] = useState(penyesuaianPersediaanEdit?.tanggal ? penyesuaianPersediaanEdit.tanggal : getHariTanggalFull())
    const [nomorPenyesuaianPersediaan, setNomorPenyesuaianPersediaan] = useState(penyesuaianPersediaanEdit?.nomor_surat_Hasil ? penyesuaianPersediaanEdit.nomor_surat_Hasil : ``)
    const [pegawaiPenanggungJawab, setPegawaiPenanggungJawab] = useState(penyesuaianPersediaanEdit?.pegawai_penanggung_jawab ? penyesuaianPersediaanEdit.pegawai_penanggung_jawab : ``)
    const [pegawaiPelaksana, setPegawaiPelaksana] = useState(penyesuaianPersediaanEdit?.pegawai_pelaksana ? penyesuaianPersediaanEdit.pegawai_pelaksana : ``)
    const [kategoriBarang, setKategoriBarang] = useState(penyesuaianPersediaanEdit?.kategori_barang ? penyesuaianPersediaanEdit.kategori_barang : ``)
    const [gudangAsal, setGudangAsal] = useState(penyesuaianPersediaanEdit?.gudang_asal ? penyesuaianPersediaanEdit.gudang_asal : ``)
    const [validasi, setValidasi] = useState(penyesuaianPersediaanEdit?.validasi ? penyesuaianPersediaanEdit.validasi : ``)

    const [penyesuaaianPersediaan, setPenyesuaianPersediaan] = useState()

    const [pegawaiList, setPegawaiList] = useState([])
    const [kategoriBarangList, setKategoriBarangList] = useState([])
    const [gudangAsalList, setGudangAsalList] = useState([])

    const _savePenyesuaianPersediaan = async () => {
        if (await formValidation()) {
            apiPenyesuaianPersediaanCRUD
                .custom(`${penyesuaianPersediaanEdit?.uuid ? `/${penyesuaianPersediaanEdit.uuid}` : ``}`, penyesuaianPersediaanEdit ? "PUT" : "POST", null, {
                    data: {
                        tanggal: tanggal,
                        nomor_surat_Hasil: nomorPenyesuaianPersediaan,
                        pegawai_penanggung_jawab: pegawaiPenanggungJawab.value,
                        pegawai_pelaksana: pegawaiPelaksana.value,
                        kategori_barang: kategoriBarang.value,
                        gudang_asal: gudangAsal.value,
                        validasi: false
                    }
                }).then((resData) => {
                    if (penyesuaianPersediaanEdit) {
                        setPenyesuaianPersediaan(penyesuaianPersediaanEdit)
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        setPenyesuaianPersediaan(resData.data)
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                }).catch(err => {
                    showError(err)
                })
        }
    }

    const _getDataKategoriBarang = () => {
        apiKategoriBarangCRUD
            .custom("", "GET")
            .then(resData => {
                setKategoriBarangList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (penyesuaianPersediaanEdit) {
                        initialDataFromEditObject({
                            editObject: penyesuaianPersediaanEdit.kategori_barang,
                            dataList: resData.data.entry,
                            setState: setKategoriBarang,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setKategoriBarang({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => showError(err))
    }

    const _getDataGudang = () => {
        apiDaftarGudangCRUD
            .custom("", "GET")
            .then(resData => {
                setGudangAsalList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (penyesuaianPersediaanEdit) {
                        initialDataFromEditObject({
                            editObject: penyesuaianPersediaanEdit.gudang_asal,
                            dataList: resData.data.entry,
                            setState: setGudangAsal,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setGudangAsal({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => showError(err))
    }

    const _getDataPegawai = () => {
        apiPegawaiCRUD
            .custom("", "GET")
            .then(resData => {
                setPegawaiList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (penyesuaianPersediaanEdit) {
                        initialDataFromEditObject({
                            editObject: penyesuaianPersediaanEdit.pegawai_penanggung_jawab,
                            dataList: resData.data.entry,
                            setState: setPegawaiPenanggungJawab,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        initialDataFromEditObject({
                            editObject: penyesuaianPersediaanEdit.pegawai_pelaksana,
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

    useEffect(() => {
        _getDataPegawai()
        _getDataKategoriBarang()
        _getDataGudang()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{penyesuaianPersediaanEdit ? `Edit` : `Tambahkan`} Penyesuaian Persediaan</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddPenyesuaianPersediaanEvent()}
                ><FaTimes /> Batalkan Penyesuaian Persediaan
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
                <FormInputWithLabel
                    label={"Nomor Penyesuaian Persediaan"}
                    type={"text"}
                    onchange={(e) => {
                        setNomorPenyesuaianPersediaan(e.target.value)
                    }}
                    others={
                        {
                            value: nomorPenyesuaianPersediaan,
                            name: "nomorPenyesuaianPersediaan"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Pegawai Penanggung Jawab"}
                    optionsDataList={pegawaiList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    disabled={penyesuaaianPersediaan}
                    selectValue={pegawaiPenanggungJawab}
                    onchange={(e) => {
                        setPegawaiPenanggungJawab(e)
                    }}
                    selectName={`pegawaiPenanggungJawab`}
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormSelectWithLabel
                    label={"Pegawai Pelaksana"}
                    optionsDataList={pegawaiList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    disabled={penyesuaaianPersediaan}
                    selectValue={pegawaiPelaksana}
                    onchange={(e) => {
                        setPegawaiPelaksana(e)
                    }}
                    selectName={`pegawaiPelaksana`}
                />
                <FormSelectWithLabel
                    label={"Kategori Barang"}
                    optionsDataList={kategoriBarangList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    disabled={penyesuaaianPersediaan}
                    selectValue={kategoriBarang}
                    onchange={(e) => {
                        setKategoriBarang(e)
                    }}
                    selectName={`kategoriBarang`}
                />
                <FormSelectWithLabel
                    label={"Gudang Asal"}
                    optionsDataList={gudangAsalList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    disabled={penyesuaaianPersediaan}
                    selectValue={gudangAsal}
                    onchange={(e) => {
                        setGudangAsal(e)
                    }}
                    selectName={`gudangAsal`}
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _savePenyesuaianPersediaan()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default PenyesuaianPersediaanForm