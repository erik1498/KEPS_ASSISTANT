import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { formShowMessage, formValidation, showAlert } from "../../../../helper/form.helper"
import { apiPegawaiCRUD } from "../../../../service/endPointList.api"
import { inputOnlyNumber } from "../../../../helper/actionEvent.helper"
import FormSelectWithLabel from "../../../../component/form/FormSelectWithLabel"
import { kodeHargaList } from "../../../../config/objectList.config"

const PegawaiForm = ({
    setAddPegawaiEvent = () => { },
    pegawaiEdit,
    getData = () => { }
}) => {
    const [namaPegawai, setNamaPegawai] = useState(pegawaiEdit?.name ? pegawaiEdit.name : ``)
    const [kodePegawai, setKodePegawai] = useState(pegawaiEdit?.code ? pegawaiEdit.code : ``)
    const [NPWPPegawai, setNPWPPegawai] = useState(pegawaiEdit?.npwp ? pegawaiEdit.npwp : ``)
    const [alamatRumahPegawai, setAlamatRumahPegawai] = useState(pegawaiEdit?.alamat_rumah ? pegawaiEdit.alamat_rumah : ``)
    const [alamatKantorPegawai, setAlamatKantorPegawai] = useState(pegawaiEdit?.alamat_kantor ? pegawaiEdit.alamat_kantor : ``)
    const [nomorTeleponPegawai, setNomorTeleponPegawai] = useState(pegawaiEdit?.no_telp ? pegawaiEdit.no_telp : ``)
    const [nomorHandphonePegawai, setNomorHandphonePegawai] = useState(pegawaiEdit?.no_hp ? pegawaiEdit.no_hp : ``)
    const [jenisBarangPegawai, setJenisBarangPegawai] = useState(pegawaiEdit?.jenis_barang ? {
        label: `Harga ${pegawaiEdit.jenis_barang}`,
        value: pegawaiEdit.jenis_barang
    } : ``)

    const _savePegawai = async () => {
        if (await formValidation()) {
            apiPegawaiCRUD
                .custom(`${pegawaiEdit?.uuid ? `/${pegawaiEdit.uuid}` : ``}`, pegawaiEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaPegawai,
                        code: kodePegawai,
                        npwp: NPWPPegawai,
                        alamat_rumah: alamatRumahPegawai,
                        alamat_kantor: alamatKantorPegawai,
                        no_telp: nomorTeleponPegawai,
                        no_hp: nomorHandphonePegawai,
                        jenis_barang: `${jenisBarangPegawai.value}`
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
                    label={"Kode Pegawai"}
                    type={"text"}
                    onchange={(e) => {
                        setKodePegawai(e.target.value)
                    }}
                    others={
                        {
                            value: kodePegawai,
                            name: "kodePegawai"
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
                    label={"Alamat Rumah"}
                    type={"text"}
                    onchange={(e) => {
                        setAlamatRumahPegawai(e.target.value)
                    }}
                    others={
                        {
                            value: alamatRumahPegawai,
                            name: "alamatRumahPegawai"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Alamat Kantor"}
                    type={"text"}
                    onchange={(e) => {
                        setAlamatKantorPegawai(e.target.value)
                    }}
                    others={
                        {
                            value: alamatKantorPegawai,
                            name: "alamatKantorPegawai"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Nomor Telepon"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyNumber(e)
                        setNomorTeleponPegawai(e.target.value)
                    }}
                    others={
                        {
                            value: nomorTeleponPegawai,
                            name: "nomorTeleponPegawai"
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
                    label={"Jenis Barang"}
                    optionsDataList={kodeHargaList}
                    optionsLabel={"label"}
                    optionsValue={"value"}
                    selectValue={jenisBarangPegawai}
                    onchange={(e) => {
                        setJenisBarangPegawai(e)
                    }}
                    selectName={`jenisBarangPegawai`}
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