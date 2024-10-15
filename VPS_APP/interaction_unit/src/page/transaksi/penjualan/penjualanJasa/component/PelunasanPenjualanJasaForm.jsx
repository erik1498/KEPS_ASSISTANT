import { FaSave } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { useEffect, useState } from "react"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { apiKodeAkunCRUD, apiPelunasanPenjualanJasaCRUD } from "../../../../../service/endPointList.api"

const PelunasanPenjualanJasaForm = ({
    fakturPenjualanJasa,
    _getDaftarRiwayatTransaksi = () => { }
}) => {

    const [kodeAkunList, setKodeAkunList] = useState([0])
    const [tanggalPelunasanPenjualanJasa, setTanggalPelunasanPenjualanJasa] = useState(getHariTanggalFull())
    const [buktiTransaksi, setBuktiTransaksi] = useState("")
    const [nomorPalunasanPenjualanJasa, setNomorPelunasanPenjualanJasa] = useState()
    const [kodeAkunPelunasanPenjualanJasa, setKodeAkunPelunasanPenjualanJasa] = useState()
    const [keteranganPelunasanPenjualanJasa, setKeteranganPelunasanPenjualanJasa] = useState()

    const _saveRiwayatTransaksi = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiPelunasanPenjualanJasaCRUD
                .custom("", "POST", null, {
                    data: {
                        faktur_penjualan_jasa: fakturPenjualanJasa.uuid,
                        tanggal: tanggalPelunasanPenjualanJasa,
                        bukti_transaksi: buktiTransaksi,
                        nomor_pelunasan_penjualan_jasa: nomorPalunasanPenjualanJasa,
                        kode_akun_perkiraan: kodeAkunPelunasanPenjualanJasa.value,
                        keterangan: keteranganPelunasanPenjualanJasa
                    }
                }).then(() => {
                    _getDaftarRiwayatTransaksi()
                    setTanggalPelunasanPenjualanJasa(getHariTanggalFull())
                })
                .catch(err => showError(err))
        }
    }

    const _getKodeAkunKasBank = () => {
        apiKodeAkunCRUD
            .custom("/kas_bank", "GET")
            .then(resData => {
                setKodeAkunList(x => x = resData.data)
                if (resData.data.length > 0) {
                    setKodeAkunPelunasanPenjualanJasa({
                        label: `${resData.data[0].code} - ${resData.data[0].name}`,
                        value: resData.data[0].uuid
                    })
                }
            })
    }

    useEffect(() => {
        _getKodeAkunKasBank()
    }, [])

    return <>
        <form onSubmit={(e) => _saveRiwayatTransaksi(e)}>
            <div className="flex gap-x-2 mb-3">
                <FormInputWithLabel
                    label={"Tanggal"}
                    type={"datetime-local"}
                    onchange={(e) => {
                        setTanggalPelunasanPenjualanJasa(e.target.value)
                    }}
                    others={
                        {
                            value: tanggalPelunasanPenjualanJasa,
                            name: "tanggalPelunasanPenjualanJasa",
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Bukti Transaksi"}
                    type={"text"}
                    onchange={(e) => {
                        setBuktiTransaksi(e.target.value)
                    }}
                    others={
                        {
                            value: buktiTransaksi,
                            name: "buktiTransaksi",
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={`Nomor Pelunasan Penjualan Jasa`}
                    type={"text"}
                    onchange={(e) => {
                        setNomorPelunasanPenjualanJasa(e.target.value)
                    }}
                    others={
                        {
                            value: nomorPalunasanPenjualanJasa,
                            name: "nomorPalunasanPenjualanJasa",
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Kode Akun"}
                    optionsDataList={kodeAkunList}
                    optionsLabel={["code", "name"]}
                    optionsValue={"uuid"}
                    optionsLabelIsArray={true}
                    optionsDelimiter={"-"}
                    selectValue={kodeAkunPelunasanPenjualanJasa}
                    onchange={(e) => {
                        setKodeAkunPelunasanPenjualanJasa(e)
                    }}
                    selectName={`kodeAkunPelunasanPenjualanJasa`}
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"Keterangan"}
                    type={"text"}
                    onchange={(e) => {
                        setKeteranganPelunasanPenjualanJasa(e.target.value)
                    }}
                    others={
                        {
                            value: keteranganPelunasanPenjualanJasa,
                            name: "keteranganPelunasanPenjualanJasa",
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
        </form>
    </>
}
export default PelunasanPenjualanJasaForm