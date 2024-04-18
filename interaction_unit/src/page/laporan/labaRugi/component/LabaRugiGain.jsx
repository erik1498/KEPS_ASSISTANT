import { parseToRupiahText } from "../../../../helper/number.helper"

const LabaRugiGain = ({
    labaRugi
}) => {
    return <>
        {
            Object.keys(labaRugi).length > 0 && labaRugi.laba_rugi.loss != 0 ? <>
                <div>
                    <div className={`stats stats-vertical rounded-md shadow-2xl w-full ${labaRugi.laba_rugi.gain != null ? "bg-green-900" : "bg-red-900"}`}>

                        <div className="stat">
                            <div className="stat-title text-white text-[20px] font-bold">
                                {
                                    labaRugi.laba_rugi.gain != null ? "Gain" : "Loss"
                                }
                            </div>
                            <div className="stat-value text-sm text-white">
                                {
                                    labaRugi.laba_rugi.gain != null ? `Rp. ${parseToRupiahText(labaRugi.laba_rugi.gain)}` : `Rp. ${parseToRupiahText(Math.abs(labaRugi.laba_rugi.loss))}`
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </> : <></>
        }
    </>
}

export default LabaRugiGain