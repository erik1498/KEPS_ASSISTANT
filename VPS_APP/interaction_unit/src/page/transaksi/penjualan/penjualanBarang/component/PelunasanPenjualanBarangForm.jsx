import { FaSave } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { useEffect, useState } from "react"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { apiKodeAkunCRUD, apiPelunasanPenjualanBarangCRUD } from "../../../../../service/endPointList.api"

const PelunasanPenjualanBarangForm = ({
    fakturPenjualanBarang,
    _getDaftarRiwayatTransaksi = () => { }
}) => {

    const [kodeAkunList, setKodeAkunList] = useState([0])
    const [tanggalPelunasanPenjualanBarang, setTanggalPelunasanPenjualanBarang] = useState(getHariTanggalFull())
    const [buktiTransaksi, setBuktiTransaksi] = useState("")
    const [nomorPalunasanPenjualanBarang, setNomorPelunasanPenjualanBarang] = useState()
    const [kodeAkunPelunasanPenjualanBarang, setKodeAkunPelunasanPenjualanBarang] = useState()
    const [keteranganPelunasanPenjualanBarang, setKeteranganPelunasanPenjualanBarang] = useState()

    const _saveRiwayatTransaksi = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiPelunasanPenjualanBarangCRUD
                .custom("", "POST", null, {
                    data: {
                        faktur_penjualan_barang: fakturPenjualanBarang.uuid,
                        tanggal: tanggalPelunasanPenjualanBarang,
                        bukti_transaksi: buktiTransaksi,
                        nomor_pelunasan_penjualan_barang: nomorPalunasanPenjualanBarang,
                        kode_akun_perkiraan: kodeAkunPelunasanPenjualanBarang.value,
                        keterangan: keteranganPelunasanPenjualanBarang
                    }
                }).then(() => {
                    _getDaftarRiwayatTransaksi()
                    setTanggalPelunasanPenjualanBarang(getHariTanggalFull())
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
                    setKodeAkunPelunasanPenjualanBarang({
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
                        setTanggalPelunasanPenjualanBarang(e.target.value)
                    }}
                    others={
                        {
                            value: tanggalPelunasanPenjualanBarang,
                            name: "tanggalPelunasanPenjualanBarang",
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
                    label={`Nomor Pelunasan Penjualan Barang`}
                    type={"text"}
                    onchange={(e) => {
                        setNomorPelunasanPenjualanBarang(e.target.value)
                    }}
                    others={
                        {
                            value: nomorPalunasanPenjualanBarang,
                            name: "nomorPalunasanPenjualanBarang",
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
                    selectValue={kodeAkunPelunasanPenjualanBarang}
                    onchange={(e) => {
                        setKodeAkunPelunasanPenjualanBarang(e)
                    }}
                    selectName={`kodeAkunPelunasanPenjualanBarang`}
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"Keterangan"}
                    type={"text"}
                    onchange={(e) => {
                        setKeteranganPelunasanPenjualanBarang(e.target.value)
                    }}
                    others={
                        {
                            value: keteranganPelunasanPenjualanBarang,
                            name: "keteranganPelunasanPenjualanBarang",
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
        </form>
    </>
}
export default PelunasanPenjualanBarangForm