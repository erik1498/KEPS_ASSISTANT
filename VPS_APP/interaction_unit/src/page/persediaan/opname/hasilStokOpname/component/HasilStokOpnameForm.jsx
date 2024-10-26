import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiDaftarGudangCRUD, apiKategoriBarangCRUD, apiPegawaiCRUD, apiHasilStokOpnameCRUD } from "../../../../../service/endPointList.api"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"

const HasilStokOpnameForm = ({
    setAddHasilStokOpnameEvent = () => { },
    hasilStokOpnameEdit,
    getData = () => { }
}) => {
    const [tanggal, setTanggal] = useState(hasilStokOpnameEdit?.tanggal ? hasilStokOpnameEdit.tanggal : getHariTanggalFull())
    const [nomorHasilStokOpname, setNomorHasilStokOpname] = useState(hasilStokOpnameEdit?.nomor_surat_Hasil ? hasilStokOpnameEdit.nomor_surat_Hasil : ``)
    const [pegawaiPenanggungJawab, setPegawaiPenanggungJawab] = useState(hasilStokOpnameEdit?.pegawai_penanggung_jawab ? hasilStokOpnameEdit.pegawai_penanggung_jawab : ``)
    const [pegawaiPelaksana, setPegawaiPelaksana] = useState(hasilStokOpnameEdit?.pegawai_pelaksana ? hasilStokOpnameEdit.pegawai_pelaksana : ``)
    const [kategoriBarang, setKategoriBarang] = useState(hasilStokOpnameEdit?.kategori_barang ? hasilStokOpnameEdit.kategori_barang : ``)
    const [gudangAsal, setGudangAsal] = useState(hasilStokOpnameEdit?.gudang_asal ? hasilStokOpnameEdit.gudang_asal : ``)
    const [validasi, setValidasi] = useState(hasilStokOpnameEdit?.validasi ? hasilStokOpnameEdit.validasi : ``)

    const [hasilStokOpname, setHasilStokOpname] = useState()

    const [pegawaiList, setPegawaiList] = useState([])
    const [kategoriBarangList, setKategoriBarangList] = useState([])
    const [gudangAsalList, setGudangAsalList] = useState([])

    const _saveHasilStokOpname = async () => {
        if (await formValidation()) {
            apiHasilStokOpnameCRUD
                .custom(`${hasilStokOpnameEdit?.uuid ? `/${hasilStokOpnameEdit.uuid}` : ``}`, hasilStokOpnameEdit ? "PUT" : "POST", null, {
                    data: {
                        tanggal: tanggal,
                        nomor_surat_Hasil: nomorHasilStokOpname,
                        pegawai_penanggung_jawab: pegawaiPenanggungJawab.value,
                        pegawai_pelaksana: pegawaiPelaksana.value,
                        kategori_barang: kategoriBarang.value,
                        gudang_asal: gudangAsal.value,
                        validasi: false
                    }
                }).then(() => {
                    if (hasilStokOpnameEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddHasilStokOpnameEvent()
                    getData()
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
                    if (hasilStokOpnameEdit) {
                        initialDataFromEditObject({
                            editObject: hasilStokOpnameEdit.kategori_barang,
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
                    if (hasilStokOpnameEdit) {
                        initialDataFromEditObject({
                            editObject: hasilStokOpnameEdit.gudang_asal,
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
                    if (hasilStokOpnameEdit) {
                        initialDataFromEditObject({
                            editObject: hasilStokOpnameEdit.pegawai_penanggung_jawab,
                            dataList: resData.data.entry,
                            setState: setPegawaiPenanggungJawab,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        initialDataFromEditObject({
                            editObject: hasilStokOpnameEdit.pegawai_pelaksana,
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
                <h1 className="uppercase text-gray-600 font-bold">{hasilStokOpnameEdit ? `Edit` : `Tambahkan`} Hasil Stok Opname</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddHasilStokOpnameEvent()}
                ><FaTimes /> Batalkan Hasil Stok Opname
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
                    label={"Nomor Hasil Stok Opname"}
                    type={"text"}
                    onchange={(e) => {
                        setNomorHasilStokOpname(e.target.value)
                    }}
                    others={
                        {
                            value: nomorHasilStokOpname,
                            name: "nomorHasilStokOpname"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Pegawai Penanggung Jawab"}
                    optionsDataList={pegawaiList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    disabled={hasilStokOpname}
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
                    disabled={hasilStokOpname}
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
                    disabled={hasilStokOpname}
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
                    disabled={hasilStokOpname}
                    selectValue={gudangAsal}
                    onchange={(e) => {
                        setGudangAsal(e)
                    }}
                    selectName={`gudangAsal`}
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveHasilStokOpname()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default HasilStokOpnameForm