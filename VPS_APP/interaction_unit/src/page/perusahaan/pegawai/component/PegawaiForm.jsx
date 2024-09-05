import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formShowMessage, formValidation, showAlert, showError } from "../../../../helper/form.helper"
import { apiDivisiCRUD, apiJabatanCRUD, apiPegawaiCRUD, apiStatusTanggunganCRUD } from "../../../../service/endPointList.api"
import { inputOnlyNumber } from "../../../../helper/actionEvent.helper"
import FormSelectWithLabel from "../../../../component/form/FormSelectWithLabel"
import { agamaList, jenisKelaminList, kodeHargaList, statusKerjaList } from "../../../../config/objectList.config"
import { getHariTanggal } from "../../../../helper/date.helper"
import { initialDataFromEditObject } from "../../../../helper/select.helper"

const PegawaiForm = ({
    setAddPegawaiEvent = () => { },
    pegawaiEdit,
    getData = () => { }
}) => {
    const [namaPegawai, setNamaPegawai] = useState(pegawaiEdit?.name ? pegawaiEdit.name : ``)
    const [NIPPegawai, setNIPPegawai] = useState(pegawaiEdit?.nip ? pegawaiEdit.nip : ``)
    const [NIKPegawai, setNIKPegawai] = useState(pegawaiEdit?.nik ? pegawaiEdit.nik : ``)
    const [NPWPPegawai, setNPWPPegawai] = useState(pegawaiEdit?.npwp ? pegawaiEdit.npwp : ``)
    const [tempatLahirPegawai, setTempatLahirPegawai] = useState(pegawaiEdit?.tempat_lahir ? pegawaiEdit.tempat_lahir : ``)
    const [tanggalLahirPegawai, setTanggalLahirPegawai] = useState(pegawaiEdit?.tanggal_lahir ? pegawaiEdit.tanggal_lahir : getHariTanggal())
    const [alamatPegawai, setAlamatPegawai] = useState(pegawaiEdit?.alamat ? pegawaiEdit.alamat : ``)
    const [nomorHandphonePegawai, setNomorHandphonePegawai] = useState(pegawaiEdit?.no_hp ? pegawaiEdit.no_hp : ``)
    const [jenisKelaminPegawai, setJenisKelamin] = useState(pegawaiEdit?.jenis_kelamin ? {
        label: pegawaiEdit.jenis_kelamin == 0 ? "Perempuan" : "Laki - Laki",
        value: pegawaiEdit.jenis_kelamin
    } : {
        label: jenisKelaminList[0].label,
        value: jenisKelaminList[0].value
    })
    const [agamaPegawai, setAgamaPegawai] = useState(pegawaiEdit?.agama ? {
        label: pegawaiEdit.agama,
        value: pegawaiEdit.agama
    } : {
        label: agamaList[0].label,
        value: agamaList[0].value
    })
    const [divisiPegawai, setDivisiPegawai] = useState(pegawaiEdit?.divisi ? pegawaiEdit.divisi : ``)
    const [divisiList, setDivisiList] = useState([])
    const [jabatanPegawai, setJabatanPegawai] = useState(pegawaiEdit?.jabatan ? pegawaiEdit.jabatan : ``)
    const [jabatanList, setJabatanList] = useState([])
    const [statusTanggunganPegawai, setStatusTanggunganPegawai] = useState()
    const [statusTanggunganList, setStatusTanggunganList] = useState([])
    const [statusKerjaPegawai, setStatusKerjaPegawai] = useState(pegawaiEdit?.status_kerja ? {
        label: pegawaiEdit.status_kerja,
        value: pegawaiEdit.status_kerja
    } : {
        label: statusKerjaList[0].label,
        value: statusKerjaList[0].value
    })

    const _savePegawai = async () => {
        if (await formValidation()) {
            apiPegawaiCRUD
                .custom(`${pegawaiEdit?.uuid ? `/${pegawaiEdit.uuid}` : ``}`, pegawaiEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaPegawai,
                        nip: NIPPegawai,
                        nik: NIKPegawai,
                        npwp: NPWPPegawai,
                        tempat_lahir: tempatLahirPegawai,
                        tanggal_lahir: tanggalLahirPegawai,
                        alamat: alamatPegawai,
                        no_hp: nomorHandphonePegawai,
                        jenis_kelamin: jenisKelaminPegawai.value,
                        agama: agamaPegawai.value,
                        divisi: divisiPegawai.value,
                        jabatan: jabatanPegawai.value,
                        status_tanggungan: statusTanggunganPegawai.value,
                        status_kerja: statusKerjaPegawai.value
                    }
                }).then(() => {
                    if (pegawaiEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddPegawaiEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    const _getDataDivisi = () => {
        apiDivisiCRUD
            .custom("", "GET")
            .then(resData => {
                setDivisiList(resData.data.entry)
                if (pegawaiEdit) {
                    initialDataFromEditObject({
                        editObject: pegawaiEdit.divisi,
                        dataList: resData.data.entry,
                        setState: setDivisiPegawai,
                        labelKey: "name",
                        valueKey: "uuid",
                    })
                    return
                }
                if (resData.data.entry.length > 0) {
                    setDivisiPegawai({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataJabatan = () => {
        apiJabatanCRUD
            .custom("", "GET")
            .then(resData => {
                setJabatanList(resData.data.entry)
                if (pegawaiEdit) {
                    initialDataFromEditObject({
                        editObject: pegawaiEdit.jabatan,
                        dataList: resData.data.entry,
                        setState: setJabatanPegawai,
                        labelKey: "name",
                        valueKey: "uuid",
                    })
                    return
                }
                if (resData.data.entry.length > 0) {
                    setJabatanPegawai({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataStatusTanggungan = () => {
        apiStatusTanggunganCRUD
            .custom("", "GET")
            .then(resData => {
                setStatusTanggunganList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (pegawaiEdit) {
                        initialDataFromEditObject({
                            editObject: pegawaiEdit.status_tanggungan,
                            dataList: resData.data.entry,
                            setState: setStatusTanggunganPegawai,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setStatusTanggunganPegawai({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    useEffect(() => {
        _getDataDivisi()
        _getDataJabatan()
        _getDataStatusTanggungan()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{pegawaiEdit ? `Edit` : `Tambahkan`} Pegawai</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddPegawaiEvent()}
                ><FaTimes /> Batalkan Pegawai
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Pegawai"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaPegawai(e.target.value)
                    }}
                    others={
                        {
                            value: namaPegawai,
                            name: "namaPegawai"
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"NIP Pegawai"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyNumber(e)
                        setNIPPegawai(e.target.value)
                    }}
                    others={
                        {
                            value: NIPPegawai,
                            name: "NIPPegawai"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"NIK Pegawai"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyNumber(e)
                        setNIKPegawai(e.target.value)
                    }}
                    others={
                        {
                            value: NIKPegawai,
                            name: "NIKPegawai"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"NPWP Pegawai"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyNumber(e)
                        setNPWPPegawai(e.target.value)
                    }}
                    others={
                        {
                            value: NPWPPegawai,
                            name: "NPWPPegawai"
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"Tempat Lahir"}
                    type={"text"}
                    onchange={(e) => {
                        setTempatLahirPegawai(e.target.value)
                    }}
                    others={
                        {
                            value: tempatLahirPegawai,
                            name: "tempatLahirPegawai"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Tanggal Lahir"}
                    type={"date"}
                    onchange={(e) => {
                        setTanggalLahirPegawai(e.target.value)
                    }}
                    others={
                        {
                            value: tanggalLahirPegawai,
                            name: "tanggalLahirPegawai"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Alamat"}
                    type={"text"}
                    onchange={(e) => {
                        setAlamatPegawai(e.target.value)
                    }}
                    others={
                        {
                            value: alamatPegawai,
                            name: "alamatPegawai"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Nomor Handphone"}
                    type={"text"}
                    onchange={(e) => {
                        setNomorHandphonePegawai(e.target.value)
                    }}
                    others={
                        {
                            value: nomorHandphonePegawai,
                            name: "nomorHandphonePegawai"
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormSelectWithLabel
                    label={"Jenis Kelamin"}
                    optionsDataList={jenisKelaminList}
                    optionsLabel={"label"}
                    optionsValue={"value"}
                    selectValue={jenisKelaminPegawai}
                    onchange={(e) => {
                        setJenisKelamin(e)
                    }}
                    selectName={`jenisKelaminPegawai`}
                />
                <FormSelectWithLabel
                    label={"Agama"}
                    optionsDataList={agamaList}
                    optionsLabel={"label"}
                    optionsValue={"value"}
                    selectValue={agamaPegawai}
                    onchange={(e) => {
                        setAgamaPegawai(e)
                    }}
                    selectName={`agamaPegawai`}
                />
                <FormSelectWithLabel
                    label={"Divisi"}
                    optionsDataList={divisiList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={divisiPegawai}
                    onchange={(e) => {
                        setDivisiPegawai(e)
                    }}
                    selectName={`divisiPegawai`}
                />
                <FormSelectWithLabel
                    label={"Jabatan"}
                    optionsDataList={jabatanList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={jabatanPegawai}
                    onchange={(e) => {
                        setJabatanPegawai(e)
                    }}
                    selectName={`jabatanPegawai`}
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormSelectWithLabel
                    label={"Status Tanggungan"}
                    optionsDataList={statusTanggunganList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={statusTanggunganPegawai}
                    onchange={(e) => {
                        setStatusTanggunganPegawai(e)
                    }}
                    selectName={`statusTanggunganPegawai`}
                />
                <FormSelectWithLabel
                    label={"Status Kerja"}
                    optionsDataList={statusKerjaList}
                    optionsLabel={"label"}
                    optionsValue={"value"}
                    selectValue={statusKerjaPegawai}
                    onchange={(e) => {
                        setStatusKerjaPegawai(e)
                    }}
                    selectName={`statusKerjaPegawai`}
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _savePegawai()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default PegawaiForm