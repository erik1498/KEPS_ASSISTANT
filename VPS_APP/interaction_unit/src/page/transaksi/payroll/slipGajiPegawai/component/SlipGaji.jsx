import { useEffect, useState } from "react"
import { useDataContext } from "../../../../../context/dataContext.context"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import { apiGajiCRUD } from "../../../../../service/endPointList.api"
import PendapatanPegawai from "./PendapatanPegawai"
import PotonganPegawai from "./PotonganPegawai"
import { showError } from "../../../../../helper/form.helper"

const SlipGaji = ({
    idPegawai,
    periode
}) => {
    const { data } = useDataContext()

    let total = {
        pendapatan: 0,
        potongan: 0
    }

    const [takeHomePay, setTakeHomePay] = useState(0)

    const [slipGaji, setSlipGaji] = useState()

    const _getSlipGajiPegawai = () => {
        apiGajiCRUD.custom(`/slip_gaji/${idPegawai}?bulan=${periode}&tahun=${data.tahun}`)
            .then(resData => {
                setSlipGaji(resData.data)
            }).catch(err => showError(err))
    }

    const _getDataBySumber = (sumber, type) => {
        try {
            const slipGajiGet = slipGaji.filter(x => x.sumber == sumber).at(0)
            if (slipGajiGet.nilai) {
                total[type] += slipGajiGet.nilai

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
            <p>Take Home Pay</p>
            <h1 className="text-4xl font-bold">Rp. {parseToRupiahText(takeHomePay)}</h1>
        </div>
    </>
}
export default SlipGaji