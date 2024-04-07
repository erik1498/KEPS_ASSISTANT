import { FaCheck, FaTimes } from "react-icons/fa"
import { parseToRupiahText } from "../../helper/number.helper"

const DebetKreditStatusCard = ({
    debet,
    kredit
}) => {
    return <>
        <div>
            <div className="stats py-4 stats-vertical rounded-md rounded-b-none shadow-2xl bg-white text-gray-900 w-full">

                <div className="stat py-3">
                    <div className="stat-title text-gray-900 font-bold">Debet</div>
                    <div className="stat-value text-sm text-green-900">Rp. {parseToRupiahText(debet)}</div>
                </div>

                <div className="stat pb-3">
                    <div className="stat-title text-gray-900 font-bold">Kredit</div>
                    <div className="stat-value text-sm text-red-900">Rp. {parseToRupiahText(kredit)}</div>
                </div>

                <div className="stat pb-0">
                    <div className="stat-title text-gray-900 font-bold">Difference</div>
                    <div className="stat-value text-sm text-blue-900">Rp. {parseToRupiahText(Math.abs(debet - kredit))}</div>
                </div>

            </div>

            <div className="mt-3">
                {
                    debet == kredit ?
                        <div className="text-sm text-white font-bold bg-green-900 py-2 -mt-3 flex items-center justify-center rounded-md rounded-t-none"><FaCheck className="mr-2" /> Seimbang</div>
                        :
                        <div className="text-sm text-white font-bold bg-red-900 py-2 -mt-3 flex items-center justify-center rounded-md rounded-t-none"><FaTimes className="mr-2" /> Tidak Seimbang</div>
                }
            </div>
        </div>
    </>

}

export default DebetKreditStatusCard