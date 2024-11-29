import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { apiPenggunaanPerlengkapanCRUD, apiDaftarPerlengkapanCRUD } from "../../../../../service/endPointList.api"
import { inputOnlyNumber } from "../../../../../helper/actionEvent.helper"

const PenggunaanPerlengkapanForm = ({
    setAddPenggunaanPerlengkapanEvent = () => { },
    penggunaanPerlengkapanEdit,
    getData = () => { }
}) => {

    const [daftarPerlengkapanList, setDaftarPerlengkapanList] = useState([])

    const [tanggalBeliPenggunaanPerlengkapan, setTanggalBeliPenggunaanPerlengkapan] = useState(penggunaanPerlengkapanEdit?.tanggal_beli ? penggunaanPerlengkapanEdit.tanggal_beli : getHariTanggalFull())
    const [buktiTransaksiPenggunaanPerlengkapan, setBuktiTransaksiPenggunaanPerlengkapan] = useState(penggunaanPerlengkapanEdit?.bukti_transaksi ? penggunaanPerlengkapanEdit.bukti_transaksi : null)
    const [jumlahPenggunaanPerlengkapan, setJumlahPenggunaanPerlengkapan] = useState(penggunaanPerlengkapanEdit?.jumlah ? penggunaanPerlengkapanEdit.jumlah : null)
    const [daftarPerlengkapanPenggunaanPerlengkapan, setDaftarPerlengkapanPenggunaanPerlengkapan] = useState(penggunaanPerlengkapanEdit?.daftar_perlengkapan ? penggunaanPerlengkapanEdit.daftar_perlengkapan : null)
    const [keteranganPenggunaanPerlengkapan, setKeteranganPenggunaanPerlengkapan] = useState(penggunaanPerlengkapanEdit?.keterangan ? penggunaanPerlengkapanEdit.keterangan : null)

    const _getDataDaftarPerlengkapan = () => {
        apiDaftarPerlengkapanCRUD
            .custom(``, "GET")
            .then(resData => {
                setDaftarPerlengkapanList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (penggunaanPerlengkapanEdit) {
                        initialDataFromEditObject({
                            editObject: penggunaanPerlengkapanEdit.daftar_perlengkapan,
                            dataList: resData.data.entry,
                            setState: setDaftarPerlengkapanPenggunaanPerlengkapan,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setDaftarPerlengkapanPenggunaanPerlengkapan({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _savePenggunaanPerlengkapan = async () => {
        if (await formValidation()) {
            apiPenggunaanPerlengkapanCRUD
                .custom(`${penggunaanPerlengkapanEdit?.uuid ? `/${penggunaanPerlengkapanEdit.uuid}` : ``}`, penggunaanPerlengkapanEdit ? "PUT" : "POST", null, {
                    data: {
                        tanggal: tanggalBeliPenggunaanPerlengkapan,
                        bukti_transaksi: buktiTransaksiPenggunaanPerlengkapan,
                        jumlah: jumlahPenggunaanPerlengkapan,
                        daftar_perlengkapan: daftarPerlengkapanPenggunaanPerlengkapan.value,
                        keterangan: keteranganPenggunaanPerlengkapan,
                    }
                }).then(() => {
                    if (penggunaanPerlengkapanEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddPenggunaanPerlengkapanEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    useEffect(() => {
        _getDataDaftarPerlengkapan()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{penggunaanPerlengkapanEdit ? `Edit` : `Tambahkan`} Penggunaan Perlengkapan</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddPenggunaanPerlengkapanEvent()}
                ><FaTimes /> Batalkan Penggunaan Perlengkapan
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Tanggal Beli"}
                    type={"datetime-local"}
                    onchange={(e) => {
                        setTanggalBeliPenggunaanPerlengkapan(e.target.value)
                    }}
                    others={
                        {
                            value: tanggalBeliPenggunaanPerlengkapan,
                            name: "tanggalBeliPenggunaanPerlengkapan"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Bukti Transaksi"}
                    type={"text"}
                    onchange={(e) => {
                        setBuktiTransaksiPenggunaanPerlengkapan(e.target.value)
                    }}
                    others={
                        {
                            value: buktiTransaksiPenggunaanPerlengkapan,
                            name: "buktiTransaksiPenggunaanPerlengkapan"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Jumlah"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyNumber(e)
                        setJumlahPenggunaanPerlengkapan(e.target.value)
                    }}
                    others={
                        {
                            value: jumlahPenggunaanPerlengkapan,
                            name: "jumlahPenggunaanPerlengkapan"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Daftar Perlengkapan"}
                    optionsDataList={daftarPerlengkapanList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={daftarPerlengkapanPenggunaanPerlengkapan}
                    onchange={(e) => {
                        setDaftarPerlengkapanPenggunaanPerlengkapan(e)
                    }}
                    selectName={`daftarPerlengkapanPenggunaanPerlengkapan`}
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"Keterangan Penggunaan Perlengkapan"}
                    type={"text"}
                    onchange={(e) => {
                        setKeteranganPenggunaanPerlengkapan(e.target.value)
                    }}
                    others={
                        {
                            value: keteranganPenggunaanPerlengkapan,
                            name: "keteranganPenggunaanPerlengkapan"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _savePenggunaanPerlengkapan()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default PenggunaanPerlengkapanForm