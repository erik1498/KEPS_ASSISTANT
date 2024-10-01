import { FaSave } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { formValidation } from "../../../../../helper/form.helper"

const PelunasanPenjualanBarangForm = () => {
    const _saveRiwayatTransaksi = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {

        }
    }
    return <>
        <form onSubmit={(e) => _saveRiwayatTransaksi(e)}>
            <div className="flex gap-x-2 mb-3">
                <FormInputWithLabel
                    label={"Tanggal"}
                    type={"datetime-local"}
                    onchange={(e) => {
                        // setTanggalFakturPenjualanBarang(e.target.value)
                    }}
                    others={
                        {
                            // value: tanggalFakturPenjualanBarang,
                            // name: "tanggalFakturPenjualanBarang",
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Bukti Transaksi"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyRupiah(e)
                        // setJumlah(e.target.value)
                    }}
                    others={
                        {
                            // value: jumlah,
                            // name: "jumlah",
                        }
                    }
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={`Nomor Pelunasan Penjualan Barang`}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyRupiah(e)
                        // setJumlah(e.target.value)
                    }}
                    others={
                        {
                            // value: jumlah,
                            // name: "jumlah",
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Kode Akun"}
                    optionsDataList={[]}
                    optionsLabel={"daftar_gudang_name"}
                    optionsValue={"uuid"}
                    selectValue={null}
                    onchange={(e) => {
                        // setGudangBarang(e)
                    }}
                    selectName={`gudangBarang`}
                />
            </div>
            <div className="mt-5 flex gap-x-2">
                <FormInputWithLabel
                    label={"Keterangan"}
                    type={"text"}
                    // disabled={fakturStatus}
                    // addClassInput={fakturStatus ? "border-none px-1" : ""}
                    onchange={(e) => {
                        // setKeteranganFakturPenjualanBarang(e.target.value)
                    }}
                    others={
                        {
                            // value: keteranganFakturPenjualanBarang,
                            // name: "keteranganFakturPenjualanBarang",
                            // disabled: fakturStatus
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
        </form>
    </>
}
export default PelunasanPenjualanBarangForm