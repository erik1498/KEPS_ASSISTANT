import { FaCheck, FaTimes } from "react-icons/fa"
import { parseRupiahToFloat, parseToRupiahText } from "../../helper/number.helper"

const AktivaPasivaStatusCard = ({
    aktiva,
    pasiva
}) => {
    return <>
        <div>
            <div className="stats py-4 stats-vertical rounded-md rounded-b-none shadow-2xl bg-white text-gray-900 w-full">

                <div className="stat">
                    <div className="stat-title text-gray-900 font-bold">Aktiva</div>
                    <div className="stat-value text-sm text-green-900">Rp. {parseToRupiahText(aktiva)}</div>
                </div>

                <div className="stat">
                    <div className="stat-title text-gray-900 font-bold">Pasiva</div>
                    <div className="stat-value text-sm text-red-900">Rp. {parseToRupiahText(pasiva)}</div>
                </div>

                <div className="stat pb-0">
                    <div className="stat-title text-gray-900 font-bold">Difference</div>
                    <div className="stat-value text-sm text-blue-900">Rp. {parseToRupiahText(Math.abs(parseRupiahToFloat(pasiva) - parseRupiahToFloat(aktiva)))}</div>
                </div>

            </div>

            <div className="mt-3">
                {
                    parseRupiahToFloat(aktiva) == parseRupiahToFloat(pasiva) ?
                        <div className="text-sm text-white font-bold bg-green-900 py-2 -mt-3 flex items-center justify-center rounded-md rounded-t-none"><FaCheck className="mr-2" /> Seimbang</div>
                        :
                        <div className="text-sm text-white font-bold bg-red-900 py-2 -mt-3 flex items-center justify-center rounded-md rounded-t-none"><FaTimes className="mr-2" /> Tidak Seimbang</div>
                }
            </div>
        </div>
    </>

}

export default AktivaPasivaStatusCard