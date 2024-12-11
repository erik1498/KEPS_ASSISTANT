import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../component/form/FormInputWithLabel"
import { useState } from "react"
import { inputOnlyNumber } from "../../../../helper/actionEvent.helper"
import { KodeAkunType, TipeTransaksiKasBankKodeAkunForm, TipeTransaksiPayrollKodeAkunForm, TipeTransaksiPembelianAsetDanPerlengkapanKodeAkunForm } from "../../../../config/objectList.config"
import FormSelectWithLabel from "../../../../component/form/FormSelectWithLabel"
import { formValidation, showAlert, showError } from "../../../../helper/form.helper"
import { apiKodeAkunCRUD } from "../../../../service/endPointList.api"
import ToggleBox from "../../../../component/general/ToggleBox"

const KodeAkunForm = ({
    setAddKodeAkunEvent = () => { },
    kodeAkunEdit,
    getData = () => { }
}) => {
    const [namaAkun, setNamaAkun] = useState(kodeAkunEdit?.name ? kodeAkunEdit.name : ``)
    const [kodeAkun, setKodeAkun] = useState(kodeAkunEdit?.code ? kodeAkunEdit.code.split(".")[1] : ``)
    const [kodeAkunTypeList, setKodeAkunTypeList] = useState(KodeAkunType)
    const [tipeTransaksiKasBank, setTipeTransaksiKasBank] = useState(kodeAkunEdit?.type_transaksi_kas_bank ? kodeAkunEdit?.type_transaksi_kas_bank : 0)
    const [tipeTransaksiPayroll, setTipeTransaksiPayroll] = useState(kodeAkunEdit?.type_transaksi_payroll ? kodeAkunEdit?.type_transaksi_payroll : 0)
    const [typeTransaksiPembelianAsetDanPerlengkapan, setTypeTransaksiPembelianAsetDanPerlengkapan] = useState(kodeAkunEdit?.type_transaksi_pembelian_aset_dan_perlengkapan ? kodeAkunEdit?.type_transaksi_pembelian_aset_dan_perlengkapan : 0)
    const [typeKodeAkun, setTypeKodeAkun] = useState({
        label: kodeAkunEdit?.type ? kodeAkunEdit.type : KodeAkunType.at(0).name,
        value: kodeAkunEdit?.type ? kodeAkunEdit.type : KodeAkunType.at(0).name
    })



    const _saveKodeAkun = async () => {
        if (await formValidation()) {
            apiKodeAkunCRUD
                .custom(`${kodeAkunEdit?.uuid ? `/${kodeAkunEdit.uuid}` : ``}`, kodeAkunEdit ? "PUT" : "POST", null, {
                    data: {
                        type: typeKodeAkun.value,
                        name: namaAkun,
                        code: `${kodeAkunTypeList.filter(x => x.name == typeKodeAkun.value)?.at(0)?.id}.${kodeAkun}`,
                        type_transaksi_kas_bank: tipeTransaksiKasBank,
                        type_transaksi_payroll: tipeTransaksiPayroll,
                        type_transaksi_pembelian_aset_dan_perlengkapan: typeTransaksiPembelianAsetDanPerlengkapan
                    }
                }).then(() => {
                    if (kodeAkunEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddKodeAkunEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }


    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{kodeAkunEdit ? `Edit` : `Tambahkan`} Kode Akun</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddKodeAkunEvent()}
                ><FaTimes /> Batalkan Kode Akun
                </button>
            </div>
            <div className="flex gap-x-4">
                <FormInputWithLabel
                    label={"Nama Akun"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaAkun(e.target.value)
                    }}
                    others={
                        {
                            value: namaAkun,
                            name: "namaAkun"
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-4">
                <FormSelectWithLabel
                    label={"Tipe Akun"}
                    onchange={(e) => {
                        setTypeKodeAkun(e)
                    }}
                    optionsDataList={kodeAkunTypeList}
                    optionsLabel={"name"}
                    optionsValue={"name"}
                    selectName={"kodeAkunType"}
                    selectValue={typeKodeAkun}
                />
                <div className="flex gap-x-2 items-end">
                    <p>{kodeAkunTypeList.filter(x => x.name == typeKodeAkun.value)?.at(0)?.id}.</p>
                    <FormInputWithLabel
                        label={"Kode Akun"}
                        type={"text"}
                        onchange={(e) => {
                            setKodeAkun(e.target.value)
                        }}
                        others={
                            {
                                value: kodeAkun,
                                name: "kodeAkun"
                            }
                        }
                    />
                </div>
            </div>
            <div className="mt-5 flex gap-x-2">
                <ToggleBox
                    label="Tipe Untuk Transaksi Kas Dan Bank"
                    setToggleBox={setTipeTransaksiKasBank}
                    toggleBox={tipeTransaksiKasBank}
                    toggleBoxList={TipeTransaksiKasBankKodeAkunForm}
                />
            </div>
            <div className="flex gap-x-2">
                <ToggleBox
                    label="Tipe Untuk Transaksi Payroll"
                    setToggleBox={setTipeTransaksiPayroll}
                    toggleBox={tipeTransaksiPayroll}
                    toggleBoxList={TipeTransaksiPayrollKodeAkunForm}
                />
            </div>
            <div className="flex gap-x-2">
                <ToggleBox
                    label="Tipe Untuk Transaksi Pembelian Aset Dan Perlengkapan"
                    setToggleBox={setTypeTransaksiPembelianAsetDanPerlengkapan}
                    toggleBox={typeTransaksiPembelianAsetDanPerlengkapan}
                    toggleBoxList={TipeTransaksiPembelianAsetDanPerlengkapanKodeAkunForm}
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveKodeAkun()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default KodeAkunForm