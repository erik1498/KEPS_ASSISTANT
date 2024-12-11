import Chart from "react-apexcharts"
import { KodeAkunType } from "../../../config/objectList.config"
import { getRandom } from "../../../helper/number.helper"

const PolarAreaApex = () => {
    const options = {
        labels: KodeAkunType.map(i => i.name),
        yaxis: {
            show: false
        },
        fill: {
            opacity: 1
        }
    }
    const series = KodeAkunType.map(i => getRandom(1).at(0))
    return <Chart options={options} height={"500"} series={series} type="polarArea" />
}
export default PolarAreaApex