import { useEffect, useRef, useState } from "react"
import { useDataContext } from "../../../../../context/dataContext.context"
import { keTerbilang, parseToRupiahText } from "../../../../../helper/number.helper"
import { apiGajiCRUD } from "../../../../../service/endPointList.api"
import PendapatanPegawai from "./PendapatanPegawai"
import PotonganPegawai from "./PotonganPegawai"
import { showError } from "../../../../../helper/form.helper"
import { useReactToPrint } from "react-to-print"
import { SlipGajiPrint } from "./SlipGajiPrint"
import { FaPrint } from "react-icons/fa"

const SlipGaji = ({
    idPegawai,
    periode,
    pegawaiList = []
}) => {
    const { data } = useDataContext()

    let total = {
        pendapatan: 0,
        potongan: 0
    }

    let sumbercheckArr = []

    const [takeHomePay, setTakeHomePay] = useState(0)

    const [slipGaji, setSlipGaji] = useState()

    const _getSlipGajiPegawai = () => {
        apiGajiCRUD.custom(`/slip_gaji/${idPegawai}?bulan=${periode}&tahun=${data.tahun}`)
            .then(resData => {
                setSlipGaji(resData.data)
            }).catch(err => showError(err))
    }

    const slipGajiPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => slipGajiPrintRef.current,
    });

    const _getDataBySumber = (sumber, type) => {
        try {
            const slipGajiGet = slipGaji.filter(x => x.sumber == sumber).at(0)
            if (slipGajiGet.nilai) {
                if (!sumbercheckArr.includes(`${sumber}_${type}`)) {
                    sumbercheckArr.push(`${sumber}_${type}`)
                    total[type] += slipGajiGet.nilai
                }

                setTakeHomePay(x => x = total.pendapatan - total.potongan)
                return slipGajiGet.nilai
            }
            return 0
        } catch (err) {
            return 0
        }
    }

    useEffect(() => {
        _getSlipGajiPegawai()
    }, [])

    return <>
        <div className="my-6 grid grid-cols-12 gap-x-4">
            <PendapatanPegawai
                slipGaji={slipGaji}
                _getDataBySumber={_getDataBySumber}
                total={total}
            />
            <PotonganPegawai
                slipGaji={slipGaji}
                _getDataBySumber={_getDataBySumber}
                total={total}
            />
        </div>
        <div className="p-6 bg-green-800 text-white rounded-md">
            <p className="font-bold">Jumlah Diterima</p>
            <h1 className="text-4xl font-bold">Rp. {parseToRupiahText(takeHomePay)}</h1>
            <p className="mt-3"><b>TERBILANG</b> : {keTerbilang(takeHomePay).toUpperCase()}</p>
        </div>
        <div className="hidden">
            <SlipGajiPrint
                data={slipGaji}
                _getDataBySumber={_getDataBySumber}
                total={total}
                periode={periode}
                tahun={data.tahun}
                takeHomePay={takeHomePay}
                pegawai={pegawaiList.filter(x => x.uuid == idPegawai)?.at(0)}
                ref={slipGajiPrintRef}
            />
        </div>
        <button
            onClick={handlePrint}
            className="btn btn-sm bg-red-600 hover:bg-red-600 text-white border-red-600 mt-4"
        >
            <FaPrint /> Cetak Slip Gaji
        </button>
    </>
}
export default SlipGaji