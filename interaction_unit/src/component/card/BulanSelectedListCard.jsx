import { getBulanList } from "../../helper/date.helper"

const BulanSelectedListCard = ({
    setBulan = () => {},
    bulan
}) => {
    return <>
        <div className="card-body py-4 px-6 bg-white mb-5 rounded-md shadow-md">
            <p className="font-bold text-gray-900">Bulan</p>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-1 pb-4">
                {
                    getBulanList().map((item, i) => {
                        return <>
                            <div onClick={() => setBulan(i)} key={i} className={`badge w-full cursor-pointer text-xs font-bold border-opacity-20 rounded-md p-3 ${bulan == i ? "bg-blue-900 text-white" : "bg-transparent text-gray-900"}`}>
                                {item}
                            </div>
                        </>
                    })
                }
            </div>
        </div>
    </>
}
export default BulanSelectedListCard