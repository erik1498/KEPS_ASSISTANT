import { FaCheck, FaTimes } from "react-icons/fa"
import { parseToRupiahText } from "../../helper/number.helper"

const DebetKreditStatusCard = ({
    debet,
    kredit,
    forPrint
}) => {
    return <>
        <div className="flex flex-col bg-white rounded-md">
            <div className={`flex ${forPrint ? "" : "flex-col"} gap-y-2`}>
                <div className={`border-b-2 py-5 ${forPrint ? 'pl-0 pr-6' : 'px-6'}`}>
                    <p className="font-bold">Debet</p>
                    <p className="font-bold text-sm text-green-900">Rp. {parseToRupiahText(debet)}</p>
                </div>
                <div className={`border-b-2 py-5 ${forPrint ? 'pl-0 pr-6' : 'px-6'}`}>
                    <p className="font-bold">Kredit</p>
                    <p className="font-bold text-sm text-red-900">Rp. {parseToRupiahText(kredit)}</p>
                </div>
                <div className={`border-b-2 py-5 ${forPrint ? 'pl-0 pr-6' : 'px-6'}`}>
                    <p className="font-bold">Difference</p>
                    <p className="font-bold text-sm">Rp. {parseToRupiahText(Math.abs(debet - kredit))}</p>
                </div>
            </div>
            {
                !forPrint && <div className="mt-3">
                    {
                        debet == kredit ?
                            <div className="text-sm text-white font-bold bg-green-900 py-2 -mt-3 flex items-center justify-center rounded-md rounded-t-none"><FaCheck className="mr-2" /> Seimbang</div>
                            :
                            <div className="text-sm text-white font-bold bg-red-900 py-2 -mt-3 flex items-center justify-center rounded-md rounded-t-none"><FaTimes className="mr-2" /> Tidak Seimbang</div>
                    }
                </div>
            }
        </div>
    </>

}

export default DebetKreditStatusCard