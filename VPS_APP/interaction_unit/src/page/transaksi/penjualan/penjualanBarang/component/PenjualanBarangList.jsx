import { useEffect, useState } from "react"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { apiKategoriHargaBarangCRUD } from "../../../../../service/endPointList.api"
import { showError } from "../../../../../helper/form.helper"
import { FaSave } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"

const PesananPenjualanBarangList = ({
    pesananPenjualanBarang
}) => {
    const [kodeBarangList, setKodeBarangList] = useState([])

    const [kodeBarang, setKodeBarang] = useState()
    const [jumlah, setJumlah] = useState("0")

    const _getDataBarangTransaksi = () => {
        apiKategoriHargaBarangCRUD
            .custom("", "GET")
            .then(resData => {
                setKodeBarangList(resData.data.entry)
            }).catch(err => showError(err))
    }

    useEffect(() => {
        _getDataBarangTransaksi()
    }, [])

    return <div className="mt-5">
        <div className="bg-white rounded-md shadow-2xl h-[60vh] overflow-scroll no-scrollbar relative p-6">
            <div className="flex gap-x-2">
                <FormSelectWithLabel
                    label={"Kode Barang"}
                    optionsDataList={kodeBarangList}
                    optionsLabel={"kode_barang"}
                    optionsValue={"uuid"}
                    selectValue={kodeBarang}
                    onchange={(e) => {
                        setKodeBarang(e)
                    }}
                    selectName={`kodeBarang`}
                />
                <FormSelectWithLabel
                    label={"Asal Gudang"}
                    optionsDataList={kodeBarangList}
                    optionsLabel={"kode_barang"}
                    optionsValue={"uuid"}
                    selectValue={kodeBarang}
                    onchange={(e) => {
                        setKodeBarang(e)
                    }}
                    selectName={`kodeBarang`}
                />
                <FormInputWithLabel
                    label={"Jumlah"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyRupiah(e)
                        setJumlah(e.target.value)
                    }}
                    others={
                        {
                            value: jumlah,
                            name: "jumlah"
                        }
                    }
                />
            </div>
            <h1>DAFTAR BARANG DISINI</h1>
        </div>
    </div>
}
export default PesananPenjualanBarangList