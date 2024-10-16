import { FaSave } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { formValidation, showError } from "../../../../../helper/form.helper"
import { useEffect, useState } from "react"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { apiKodeAkunCRUD, apiPelunasanPembelianBarangCRUD } from "../../../../../service/endPointList.api"

const PelunasanPembelianBarangForm = ({
    fakturPembelianBarang,
    _getDaftarRiwayatTransaksi = () => { }
}) => {

    const [kodeAkunList, setKodeAkunList] = useState([0])
    const [tanggalPelunasanPembelianBarang, setTanggalPelunasanPembelianBarang] = useState(getHariTanggalFull())
    const [buktiTransaksi, setBuktiTransaksi] = useState("")
    const [nomorPalunasanPembelianBarang, setNomorPelunasanPembelianBarang] = useState()
    const [kodeAkunPelunasanPembelianBarang, setKodeAkunPelunasanPembelianBarang] = useState()
    const [keteranganPelunasanPembelianBarang, setKeteranganPelunasanPembelianBarang] = useState()

    const _saveRiwayatTransaksi = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiPelunasanPembelianBarangCRUD
                .custom("", "POST", null, {
                    data: {
                        faktur_pembelian_barang: fakturPembelianBarang.uuid,
                        tanggal: tanggalPelunasanPembelianBarang,
                        bukti_transaksi: buktiTransaksi,
                        nomor_pelunasan_pembelian_barang: nomorPalunasanPembelianBarang,
                        kode_akun_perkiraan: kodeAkunPelunasanPembelianBarang.value,
                        keterangan: keteranganPelunasanPembelianBarang
                    }
                }).then(() => {
                    _getDaftarRiwayatTransaksi()
                    setTanggalPelunasanPembelianBarang(getHariTanggalFull())
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
                    setKodeAkunPelunasanPembelianBarang({
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
                        setTanggalPelunasanPembelianBarang(e.target.value)
                    }}
                    others={
                        {
                            value: tanggalPelunasanPembelianBarang,
                            name: "tanggalPelunasanPembelianBarang",
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
                    label={`Nomor Pelunasan Pembelian Barang`}
                    type={"text"}
                    onchange={(e) => {
                        setNomorPelunasanPembelianBarang(e.target.value)
                    }}
                    others={
                        {
                            value: nomorPalunasanPembelianBarang,
                            name: "nomorPalunasanPembelianBarang",
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
                    selectValue={kodeAkunPelunasanPembelianBarang}
                    onchange={(e) => {
                        setKodeAkunPelunasanPembelianBarang(e)
                    }}
                    selectName={`kodeAkunPelunasanPembelianBarang`}
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"Keterangan"}
                    type={"text"}
                    onchange={(e) => {
                        setKeteranganPelunasanPembelianBarang(e.target.value)
                    }}
                    others={
                        {
                            value: keteranganPelunasanPembelianBarang,
                            name: "keteranganPelunasanPembelianBarang",
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
        </form>
    </>
}
export default PelunasanPembelianBarangForm